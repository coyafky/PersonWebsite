import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CountdownTimer } from "@/components/tools/CountdownTimer";
import { MusicLibrary } from "@/components/tools/MusicLibrary";
import { PomodoroTimer } from "@/components/tools/PomodoroTimer";
import { buildUrl, SITE_NAME } from "@/lib/metadata";
import { getAllToolIds, getTool } from "@/lib/tools/registry";

type ToolPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * 固定清单 → 全部预生成成静态页。
 * 漏了它这个路由就会变成按需渲染（对照 app/(site)/tags/[tag]/page.tsx 的教训）。
 */
export function generateStaticParams() {
  return getAllToolIds().map((slug) => ({ slug }));
}

/** 清单之外的 slug 直接 404，不再走运行时渲染 */
export const dynamicParams = false;

/**
 * 工具本体在这里映射。
 * 三个工具都不大，所以直接 import；工具变多时应改成按 id 动态加载，
 * 否则每加一个工具都会同时进这个路由的客户端包。
 */
const TOOL_COMPONENTS: Record<string, () => React.ReactElement> = {
  pomodoro: PomodoroTimer,
  countdown: CountdownTimer,
  music: MusicLibrary,
};

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};

  const url = buildUrl(`/tools/${tool.id}`);
  const ogImage = buildUrl(`/api/og?title=${encodeURIComponent(tool.title)}`);

  return {
    title: tool.title,
    description: tool.summary,
    alternates: { canonical: url },
    openGraph: {
      title: tool.title,
      description: tool.summary,
      type: "website",
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: tool.title,
      description: tool.summary,
      images: [ogImage],
    },
  };
}

export default async function ToolDetailPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const Tool = TOOL_COMPONENTS[tool.id];

  return (
    <div className="page-shell">
      <header className="page-header">
        <Link className="button secondary" href="/tools">
          ← 所有工具
        </Link>
        <h1>{tool.title}</h1>
        <p>{tool.summary}</p>
      </header>

      {Tool ? (
        <Tool />
      ) : (
        <p className="tool-note">
          这个工具还没有对应的实现组件，检查 lib/tools/registry.ts 与
          TOOL_COMPONENTS 是否对得上。
        </p>
      )}

      {tool.id === "pomodoro" ? <PomodoroNotes /> : null}
      {tool.id === "countdown" ? <CountdownNotes /> : null}
      {tool.id === "music" ? <MusicNotes /> : null}
    </div>
  );
}

function PomodoroNotes() {
  return (
    <article className="tool-notes">
      <h2>这里为什么用 25 分钟一段</h2>
      <p>
        25 分钟专注加 5 分钟休息是番茄工作法里最常见的配比，每完成四段进一次
        15 分钟长休息。上面三个时长都可以改 —— 25 这个数字本身没什么魔力，
        重要的是「一段有明确终点的工作」和「一段真的离开屏幕的休息」。改完会
        立刻按新时长重开当前这一段，不会被当成同一轮继续跑。
      </p>

      <h2>计时为什么不用 setInterval 累加</h2>
      <p>
        大多数网页计时器的写法是每秒减一。这个写法的前提是「定时器每秒都会被
        准时叫醒一次」，而浏览器并不保证这一点：非活动标签页里的定时器会被
        降频，可能降到每秒一次甚至更低。于是你切走十分钟再回来，累加式的计时器
        已经落后了十几秒，而它自己毫无察觉。
      </p>
      <p>
        这里的做法是反过来的：开始计时时只记下一个结束时刻（当前时间加总时长），
        之后每次刷新都重新算一次「结束时刻减现在」。定时器只负责触发这次重算，
        不参与计时本身 —— 所以它被降频多少次都不影响读数。
      </p>

      <h2>刷新页面为什么不会丢进度</h2>
      <p>
        因为存进浏览器本地存储的是那个结束时刻，而不是「还剩多少秒」。重新打开
        页面时拿当前时间跟它一对账，就知道真实剩余时间 —— 中间页面关掉多久都算数。
        如果关得太久、对账下来已经过期，它会直接把这一段判定为结束并进入下一段，
        而不是停在那里显示一个负数。
      </p>

      <h2>提示音与桌面通知</h2>
      <p>
        提示音是用 Web Audio 现场合成的，页面不加载任何音频文件。浏览器要求音频
        必须在用户操作里初始化，所以第一次点「开始」时才建立音频通道；如果你
        一进页面什么都不点，到点时不会有声音，计时逻辑本身不受影响。
      </p>
      <p>
        桌面通知默认不开，需要手动点一下才会向浏览器申请权限 —— 页面加载时不会
        主动弹权限框。拒绝之后在浏览器设置里可以改回来。
      </p>

      <h2>数据存在哪里</h2>
      <p>
        只存在你这台设备的浏览器本地存储里，不会发送到任何服务器。换设备或清除
        浏览器数据后，进度和设置都会回到默认值。
      </p>
    </article>
  );
}

function CountdownNotes() {
  return (
    <article className="tool-notes">
      <h2>和其他倒计时有什么不一样</h2>
      <p>
        核心就一件事：因为它按「结束时刻」而不是「剩余秒数」来记时间，所以你
        切到别的标签页、把电脑合上一会儿、甚至刷新页面，回来看到的读数都是对的。
        网页上的倒计时大多做不到这一点，它们在你离开的时候就开始偷偷走慢。
      </p>

      <h2>时长可以填到什么精度</h2>
      <p>
        时 / 分 / 秒三个框分别可填，上限 99 小时，下限 1 秒。快捷按钮是常用的
        几个档位。改动时长会立刻按新数字重置，不会出现「改了时长但计时器还在
        按旧的跑」这种状态。
      </p>

      <h2>进度条在看什么</h2>
      <p>
        进度条按已过去的比例填充，从整段时长算起，不是从某个固定基准算起。所以
        换一个时长之后，进度条和读数是同步重新开始的。
      </p>

      <h2>提示音与桌面通知</h2>
      <p>
        提示音同样是现场合成的，不加载音频文件，并且需要你在页面上点过至少一次
        之后才会生效（浏览器的自动播放策略要求如此）。桌面通知要手动点一下才
        申请权限，不会在页面加载时弹出来。
      </p>

      <h2>数据存在哪里</h2>
      <p>
        只存在本机浏览器的本地存储里，不发送到服务器。清除浏览器数据后回到
        默认的 5 分钟。
      </p>
    </article>
  );
}

function MusicNotes() {
  return (
    <article className="tool-notes">
      <h2>为什么这个能读到你的本地音乐</h2>
      <p>
        它用的是浏览器的 File System Access API：你点一下「选择音乐文件夹」，
        浏览器会弹出系统自带的文件夹选择框，你授权之后，这个页面就拿到了那个文件夹的
        <strong>只读</strong>权限。代码里申请的是 <code>{'mode: "read"'}</code> ——
        它连写入能力都没要，更不可能改你的文件。
      </p>
      <p>
        关键点：文件<strong>从来没有离开你的机器</strong>。播放走的是浏览器给本地文件
        临时生成的地址，不产生任何网络请求。所以这个页面部署在公网上也能用，
        但你的音乐一首都不会上传。
      </p>

      <h2>为什么它只支持 Chrome / Edge</h2>
      <p>
        File System Access API 目前只有 Chromium 系实现了。Safari 和 Firefox
        没有 <code>showDirectoryPicker</code>，所以这两个浏览器上打不开 ——
        页面会直接告诉你原因，而不是给你一个坏掉的按钮。
      </p>

      <h2>要不要每次重新选文件夹</h2>
      <p>
        不用。选过一次之后，文件夹的句柄会存在浏览器的 IndexedDB 里，下次打开
        直接点「恢复」就行。但浏览器出于安全考虑，<strong>权限必须由一次真实的点击触发</strong>
        ——所以不能做到「打开就自动播」，那一步点一下是绕不过去的，这正是它能安全的原因。
      </p>

      <h2>关于重复曲目</h2>
      <p>
        扫描时会自动跳过 <code>Music_副本</code> 这类目录。本机实测那个目录里有 256 首
        与正式库字节完全相同的重复文件，同时又有 108 首正式库里没有的曲目 ——
        所以它不该被删除，但不该出现在歌单里。
      </p>

      <h2>数据存在哪里</h2>
      <p>
        只有「你选过哪个文件夹」这一个句柄存在浏览器本地。曲目列表每次都是现场扫描的，
        不落盘、不上传。清除浏览器数据后重新选一次即可。
      </p>
    </article>
  );
}
