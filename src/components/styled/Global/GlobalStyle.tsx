import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const theme = {
  dark: {
    primary: "#000",
    text: "#fff",
  },
  light: {
    primary: "#fff",
    text: "#000",
  },
  fontFamily: "Segoe UI",
};

// type ThemeType = typeof theme;

// const GlobalStyle = createGlobalStyle<{ theme: ThemeType }>`
//   button {
//     font-family: ${(props) =>
//       props.theme.fontFamily}; // 직접 주려면 font-family: cursive;
//   }
// `;

const GlobalStyle = createGlobalStyle` 
    ${reset}
    a {
        text-decoration: none;
        color: blue;
        font-weight: 700;
    }
    * {
        box-sizing: border-box;
    }
`;

export default GlobalStyle;
