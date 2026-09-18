#!/usr/bin/env bash
#
# webp-batch.sh — 用 Google 的 cwebp 批量把图片转成 WebP
#
# 设计要点（都是实测踩出来的）：
#   1. cwebp 默认 -metadata none —— 会把 EXIF 方向一起剥掉，手机竖拍照片转完会横过来。
#      所以默认先归正方向（把旋转烤进像素）再转，而不是靠保留 EXIF。
#   2. 图形类（截图/图标/图表）用 -lossless 比 -q 82 更小且像素级无损；
#      照片类用 -lossless 反而几乎压不动。所以按图选档，不是一个档位吃天下。
#   3. 转完若比原图更大就跳过（已优化过的 JPEG 偶尔会这样）。
#
# 用法：
#   scripts/webp-batch.sh <目录或文件...> [选项]
#
# 选项：
#   -m, --mode auto|lossy|lossless   转换模式（默认 auto：按颜色数判定）
#   -q, --quality N                  有损质量（默认 82）
#   -o, --out DIR                    输出到指定目录（默认与源同目录）
#   -j, --jobs N                     并行数（默认 CPU 核数）
#       --keep-metadata              保留元数据（会带上相机/GPS 信息，慎用）
#       --no-orient                  跳过方向归正（源图已归正时省一步）
#       --force                      即使产物更大也写出
#       --dry-run                    只打印计划，不实际转换
#   -h, --help                       帮助
#
# 依赖：cwebp（必须）；magick（方向归正 + 颜色数判定，缺失则退化为直接转）
# 安装：brew install webp imagemagick

set -euo pipefail

MODE="auto"
QUALITY=82
OUTDIR=""
JOBS=""
KEEP_META=0
NO_ORIENT=0
FORCE=0
DRY_RUN=0
TARGETS=()

# ---------- 参数解析 ----------
while [[ $# -gt 0 ]]; do
  case "$1" in
    -m|--mode)        MODE="${2:?}"; shift 2 ;;
    -q|--quality)     QUALITY="${2:?}"; shift 2 ;;
    -o|--out)         OUTDIR="${2:?}"; shift 2 ;;
    -j|--jobs)        JOBS="${2:?}"; shift 2 ;;
    --keep-metadata)  KEEP_META=1; shift ;;
    --no-orient)      NO_ORIENT=1; shift ;;
    --force)          FORCE=1; shift ;;
    --dry-run)        DRY_RUN=1; shift ;;
    -h|--help)        sed -n '2,30p' "$0"; exit 0 ;;
    -*)               echo "未知选项：$1" >&2; exit 2 ;;
    *)                TARGETS+=("$1"); shift ;;
  esac
done

if [[ ${#TARGETS[@]} -eq 0 ]]; then
  echo "用法：$0 <目录或文件...> [-m auto|lossy|lossless] [-q 82] [-o OUTDIR]" >&2
  exit 2
fi

command -v cwebp >/dev/null 2>&1 || { echo "❌ 找不到 cwebp。安装：brew install webp" >&2; exit 1; }
HAVE_MAGICK=0
command -v magick >/dev/null 2>&1 && HAVE_MAGICK=1

[[ -n "$JOBS" ]] || JOBS=$(sysctl -n hw.ncpu 2>/dev/null || echo 4)

case "$MODE" in auto|lossy|lossless) ;; *) echo "❌ --mode 只能是 auto/lossy/lossless" >&2; exit 2 ;; esac
if [[ "$MODE" != "lossy" && -n "$QUALITY" && "$QUALITY" != "82" ]]; then
  echo "⚠️  -q 只对有损模式有意义，当前模式 $MODE → 忽略质量值" >&2
fi

# ---------- 收集源文件 ----------
SOURCE_EXTS=(png jpg jpeg tif tiff bmp ppm pgm)
FOUND_LIST=$(mktemp -t webp-src-XXXXXX)
trap 'rm -f "$FOUND_LIST"' EXIT

for t in "${TARGETS[@]}"; do
  if [[ -d "$t" ]]; then
    for ext in "${SOURCE_EXTS[@]}"; do
      find "$t" -type f -iname "*.${ext}" -print0 2>/dev/null >> "$FOUND_LIST" || true
    done
  elif [[ -f "$t" ]]; then
    printf '%s\0' "$t" >> "$FOUND_LIST"
  else
    echo "⚠️  跳过（不存在）：$t" >&2
  fi
done

# 去重（同一文件被多个 glob 命中时）
SNUM=$(tr '\0' '\n' < "$FOUND_LIST" | grep -c . || true)
[[ "$SNUM" -eq 0 ]] && { echo "没有找到可转换的图片。"; exit 0; }

echo "════════════════════════════════════════════════════════"
echo " cwebp 批量转 WebP"
echo " 模式 $MODE ｜ 质量 $QUALITY ｜ 并行 $JOBS ｜ 源文件 $SNUM"
[[ "$HAVE_MAGICK" -eq 1 ]] && echo " magick 已就绪（方向归正 + 颜色数判定）" || echo " ⚠️  无 magick：不做方向归正，图形类判定退化为有损"
if [[ "$KEEP_META" -eq 1 ]]; then
  echo " ⚠️  保留元数据（可能含相机/GPS 信息）"
else
  echo " 剥离元数据（隐私友好）"
fi
[[ "$DRY_RUN" -eq 1 ]] && echo " [试运行：不写任何文件]"
echo "════════════════════════════════════════════════════════"

# ---------- 单文件转换（供 xargs 并行调用） ----------
convert_one() {
  local src="$1" mode="$2" q="$3" outdir="$4" keep="$5" noorient="$6" force="$7" dry="$8"

  local dir base target
  dir=$(dirname "$src")
  base=$(basename "$src")
  base="${base%.*}"
  if [[ -n "$outdir" ]]; then
    mkdir -p "$outdir"
    target="$outdir/$base.webp"
  else
    target="$dir/$base.webp"
  fi

  # 已经是 webp 的来源不重复处理（本脚本的 glob 已排除，双保险）
  [[ "$src" == "$target" ]] && return 0

  local osize
  osize=$(stat -f%z "$src" 2>/dev/null || stat -c%s "$src")

  # 断点续跑：产物已存在且比源新 → 跳过（几百张的批处理中断后重跑不用从头来）
  # --force 可覆盖此行为
  if [[ "$force" -ne 1 && -f "$target" && "$target" -nt "$src" ]]; then
    printf '  %-58s  跳过（已是最新）\n' "$(echo "$src" | sed "s|$PWD/||")"
    return 0
  fi

  # --- 决定实际模式 ---
  local use_mode="$mode"
  if [[ "$use_mode" == "auto" ]]; then
    local ext="${src##*.}"
    ext=$(echo "$ext" | tr 'A-Z' 'a-z')
    if [[ "$ext" == "jpg" || "$ext" == "jpeg" ]]; then
      # JPEG 源一律走有损：它本身已是 DCT 压缩产物，带伪影，
      # 无损 WebP 既压不动（实测反而变大）又在"无损"地保存伪影，没意义。
      use_mode="lossy"
    else
      # 用「每像素字节数」判定图形 / 照片：
      #   扁平图形（截图/图标/图表/线稿）压得极狠 → 实测 0.011 B/px
      #   照片类                          → 实测 1.35–1.95 B/px
      # 差约 100 倍，阈值取 0.3 落在空档里，且只读文件头，耗时 ~0（不需要解码整张图）。
      # 判错的方向性也要考虑：把照片误判成图形→无损→文件巨大（更糟）；
      # 把图形误判成照片→有损→文字边缘略糊。所以阈值宁低勿高，偏保守。
      local dims w h bpp
      if [[ "$HAVE_MAGICK" -eq 1 ]]; then
        dims=$(magick identify -format "%w %h" "$src[0]" 2>/dev/null | head -1)
      else
        dims=$(sips -g pixelWidth -g pixelHeight "$src" 2>/dev/null \
               | awk '/pixelWidth/{w=$2}/pixelHeight/{h=$2}END{if(w&&h)print w" "h}')
      fi
      w=${dims%% *}; h=${dims##* }
      if [[ "$w" =~ ^[0-9]+$ && "$h" =~ ^[0-9]+$ && "$w" -gt 0 && "$h" -gt 0 ]]; then
        bpp=$(awk -v s="$osize" -v w="$w" -v h="$h" 'BEGIN{printf "%.4f", s/(w*h)}')
        if awk -v b="$bpp" 'BEGIN{exit !(b < 0.3)}'; then
          use_mode="lossless"
        else
          use_mode="lossy"
        fi
      else
        use_mode="lossy"   # 拿不到尺寸就保守走有损
      fi
    fi
  fi

  # --- 组装 cwebp 参数 ---
  local args=(-quiet)
  if [[ "$use_mode" == "lossless" ]]; then
    args+=(-lossless -z 6)      # z6 是速度/压缩的平衡点；z9 慢几十倍只多压一点点
  else
    args+=(-q "$q" -m 4)  # m4 是默认；m6 慢约 40% 只少约 4%
                          # ⚠️ 必须用局部变量 $q：函数经 export -f 后在子进程里跑，
                          #    全局 QUALITY 不会跟着传过去（踩过：展开成空串 → cwebp 报错）
  fi
  if [[ "$keep" -eq 1 ]]; then
    args+=(-metadata all)
  else
    args+=(-metadata none)
  fi

  # --- 方向归正：把 EXIF 旋转烤进像素，之后剥离元数据也不会转歪 ---
  # 只在图真的带方向信息时才做：magick 归正比 cwebp 本身慢约 6 倍
  # （实测 3.53s vs 0.55s），对本来就没方向的 PNG 做这一步纯属浪费。
  local tmpnorm=""
  local input="$src"
  if [[ "$noorient" -eq 0 && "$HAVE_MAGICK" -eq 1 ]]; then
    local orient
    orient=$(magick identify -format '%[orientation]' "$src[0]" 2>/dev/null | head -1)
    if [[ -n "$orient" && "$orient" != "Undefined" && "$orient" != "TopLeft" ]]; then
      tmpnorm=$(mktemp -t webp-norm-XXXXXX).png
      if magick "$src" -auto-orient "$tmpnorm" 2>/dev/null; then
        input="$tmpnorm"
      else
        input="$src"; rm -f "$tmpnorm"; tmpnorm=""
      fi
    fi
  fi

  if [[ "$dry" -eq 1 ]]; then
    printf '  %-58s → %-6s %s\n' "$(echo "$src" | sed "s|$PWD/||")" "$use_mode" "$target"
    [[ -n "$tmpnorm" ]] && rm -f "$tmpnorm"
    return 0
  fi

  local errfile ok=0
  errfile=$(mktemp -t webp-err-XXXXXX)
  if cwebp "${args[@]}" "$input" -o "$target" >/dev/null 2>"$errfile"; then ok=1; fi
  [[ -n "$tmpnorm" ]] && rm -f "$tmpnorm"

  if [[ "$ok" -ne 1 ]]; then
    # 不静默失败：把 cwebp 的真实报错带出来，否则这种问题极难定位
    echo "  ❌ 失败：$src" >&2
    echo "     cwebp ${args[*]} → $target" >&2
    sed 's/^/     /' "$errfile" | head -4 >&2
    rm -f "$errfile"
    return 1
  fi
  rm -f "$errfile"

  local nsize
  nsize=$(stat -f%z "$target" 2>/dev/null || stat -c%s "$target")

  # 产物更大 → 回退（已优化过的源偶尔如此）
  if [[ "$nsize" -ge "$osize" && "$force" -ne 1 ]]; then
    rm -f "$target"
    printf '  %-58s  跳过（WebP 更大：%sK→%sK）\n' "$(echo "$src" | sed "s|$PWD/||")" \
      "$((osize/1024))" "$((nsize/1024))" >&2
    return 0
  fi

  printf '  %-58s %5sK → %5sK  %5s%%  [%s]\n' "$(echo "$src" | sed "s|$PWD/||")" \
    "$((osize/1024))" "$((nsize/1024))" "$((nsize*100/osize))" "$use_mode"
}
export -f convert_one
export HAVE_MAGICK

# ---------- 并行执行 ----------
START=$(date +%s)
tr '\0' '\n' < "$FOUND_LIST" | grep . | \
  xargs -P "$JOBS" -I{} bash -c \
  'convert_one "$@"' _ {} "$MODE" "$QUALITY" "$OUTDIR" "$KEEP_META" "$NO_ORIENT" "$FORCE" "$DRY_RUN" || true
END=$(date +%s)

if [[ "$DRY_RUN" -eq 1 ]]; then
  echo
  echo "试运行结束（未写文件）。去掉 --dry-run 实际转换。"
  exit 0
fi

# ---------- 汇总 ----------
python3 - "$FOUND_LIST" "$OUTDIR" <<'PY'
import os, sys
lst, outdir = sys.argv[1], sys.argv[2]
srcs = [l for l in open(lst, 'rb').read().decode('utf-8', 'replace').split('\0') if l.strip()]
o = n = 0; made = 0
for s in srcs:
    d, b = os.path.dirname(s), os.path.splitext(os.path.basename(s))[0]
    t = os.path.join(outdir, b + '.webp') if outdir else os.path.join(d, b + '.webp')
    if not os.path.exists(t):
        continue
    try:
        os_, ns = os.path.getsize(s), os.path.getsize(t)
    except OSError:
        continue
    o += os_; n += ns; made += 1
if made:
    print(f"\n完成 {made} 个文件：{o/1048576:.1f} MB → {n/1048576:.1f} MB"
          f"（{n*100/o:.1f}%，省 {(o-n)/1048576:.1f} MB）")
else:
    print("\n没有产出新文件（可能全部已存在或全部跳过）。")
PY
echo "耗时 $((END-START))s"
