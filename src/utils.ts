// 이미지의 경로를 만들어주는 함수

// format은 안 넘어올수도 있어서 ?를 써줌
export function makeImagePath(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}
