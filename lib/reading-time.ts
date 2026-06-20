const WORDS_PER_MINUTE = 200;

function countChineseChars(text: string): number {
  return (text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) ?? []).length;
}

function countEnglishWords(text: string): number {
  const withoutChinese = text.replace(/[\u4e00-\u9fff\u3400-\u4dbf]/g, "");
  return (withoutChinese.match(/[a-zA-Z0-9]+/g) ?? []).length;
}

export function readingTime(text: string): number {
  const chinese = countChineseChars(text);
  const english = countEnglishWords(text);
  const minutes = Math.ceil((chinese + english) / WORDS_PER_MINUTE);
  return Math.max(1, minutes);
}

export function readingTimeLabel(text: string): string {
  const mins = readingTime(text);
  return `${mins} min read`;
}
