import { useState } from "react";
import AppRouter from "./Router";
import { authService } from "../fbase";
import { useEffect } from "react";
import { onAuthStateChanged, User, updateProfile } from "firebase/auth";
// import StyledButton, {
//   FancyButton,
//   SubmitButton,
//   AnimatedLogo,
//   DarkButton,
// } from "./styled/Button/Button";
// import { ThemeProvider } from "styled-components";
import AppContainer from "./styled/Container/Container";
import GlobalStyle, { theme } from "./styled/Global/GlobalStyle";

function App() {
  const [init, setInit] = useState<boolean>(false);
  const [userObj, setUserObj] = useState<User | null>(null);
  const [isChanged, setIsChanged] = useState<boolean>(false);

  useEffect(() => {
    onAuthStateChanged(authService, async (user) => {
      if (user) {
        setUserObj(user);
        if (user.displayName === null) {
          await updateProfile(user, { displayName: "사용자" });
          refreshUser();
        }
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    setIsChanged((prev) => !prev);
  };

  return (
    <AppContainer>
      <GlobalStyle />
      {/* <ThemeProvider theme={theme}>
        <StyledButton>버튼</StyledButton>
        <StyledButton variant="outline">버튼</StyledButton>
        <FancyButton as="div">팬시 버튼</FancyButton>
        <SubmitButton>제출버튼</SubmitButton>
        <SubmitButton type="submit">그냥버튼</SubmitButton>
        <AnimatedLogo
          src={process.env.PUBLIC_URL + "/gyewitterLogo.ico"}
          alt="로고"
        />
        <DarkButton>Black</DarkButton>
      </ThemeProvider> */}
      {init ? (
        <AppRouter
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
          refreshUser={refreshUser}
        />
      ) : (
        "초기화 중..."
      )}
      <footer>&copy; {new Date().getFullYear()} gyewitter</footer>
    </AppContainer>
  );
}

export default App;
