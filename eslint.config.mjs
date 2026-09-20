import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".superpowers/**",
    // 第三方 skill 代码（impeccable 等）不是本站源码，不该被本站规则扫。
    // 加了 impeccable 后这目录自带 CLI 脚本，会一次带进 94 条无关 warning。
    ".claude/skills/**"
  ])
]);
