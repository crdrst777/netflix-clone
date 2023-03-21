// (참고: d.ts 는 declaration file 이라는 뜻이다.)
// 타입스크립트 declaration(선언) file은 타입스크립트를 위한 일종의 설명이다.

import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    red: string;
    black: {
      veryDark: string;
      darker: string;
      lighter: string;
    };
    white: {
      lighter: string;
      darker: string;
    };
  }
}
