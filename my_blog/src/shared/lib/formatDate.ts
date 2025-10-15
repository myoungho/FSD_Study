// shared/lib/formatDate.ts

/**
 * 날짜를 읽기 쉬운 형식으로 포맷팅합니다.
 * @param date - Date 객체 또는 날짜 문자열
 * @param locale - 로케일 (기본값: 'ko-KR')
 * @returns 포맷팅된 날짜 문자열
 *
 * @example
 * formatDate(new Date()) // "2024년 1월 15일"
 * formatDate("2024-01-15") // "2024년 1월 15일"
 * formatDate(new Date(), "en-US") // "January 15, 2024"
 */
export function formatDate(
  date: Date | string,
  locale: string = "ko-KR"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // 유효한 날짜인지 확인
  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}

/**
 * 날짜를 상대적인 시간으로 표시합니다 (예: "3일 전")
 * @param date - Date 객체 또는 날짜 문자열
 * @returns 상대적 시간 문자열
 *
 * @example
 * formatRelativeDate(new Date()) // "방금 전"
 * formatRelativeDate("2024-01-01") // "14일 전"
 */
export function formatRelativeDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) return "방금 전";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 604800)}주 전`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)}개월 전`;

  return `${Math.floor(diffInSeconds / 31536000)}년 전`;
}

/**
 * 날짜를 ISO 8601 형식으로 포맷팅합니다.
 * @param date - Date 객체 또는 날짜 문자열
 * @returns ISO 8601 형식 문자열 (YYYY-MM-DD)
 *
 * @example
 * formatDateISO(new Date()) // "2024-01-15"
 */
export function formatDateISO(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toISOString().split("T")[0];
}
