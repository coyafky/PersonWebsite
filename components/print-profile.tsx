"use client";

export function PrintProfile() {
  return (
    <button
      type="button"
      className="button secondary print-profile"
      onClick={() => window.print()}
    >
      打印 / 保存为 PDF
    </button>
  );
}
