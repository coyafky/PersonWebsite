/**
 * scripts/content-images.mjs 的类型声明。
 *
 * 该脚本本身是普通 JS（不进 TS 编译），这里只为被单元测试
 * （lib/content/cover.test.ts）导入的纯函数提供类型。
 * TS 的模块解析会把 `./content-images.mjs` 映射到本文件。
 */

export type CoverReferenceValidation = {
  /** 形态合法时返回归一化的根相对路径；否则为 null。 */
  publicUrl: string | null;
  errors: string[];
  warnings: string[];
};

export function validateCoverReference(input: {
  cover: unknown;
  coverAlt: unknown;
  expectedPrefix: string;
  location: string;
}): CoverReferenceValidation;
