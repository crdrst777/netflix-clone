import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "styled-components";
import { createGlobalStyle } from "styled-components";
import { theme } from "./theme";
import reset from "styled-reset";
import { QueryClient, QueryClientProvider } from "react-query";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const GlobalStyle = createGlobalStyle`
${reset}
* {
  box-sizing: border-box;
}
body {
  font-weight: 300;
  font-family: "Pretendard", serif;
  color: ${(props) => props.theme.white.darker};
  line-height: 1.2;
  background-color: black;
}
a {
  text-decoration: none;
  color: inherit;
  &:link,&:visited{
  color: inherit;
  }
}
button{
  cursor: pointer;
  /* border: none; */
  /* padding: 0; 
  margin: 0; */
  /* background-color: transparent; */
}
li {
  list-style: none;
}
`;

const client = new QueryClient();

root.render(
  <React.StrictMode>
    <RecoilRoot>
      <QueryClientProvider client={client}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </RecoilRoot>
  </React.StrictMode>
);
