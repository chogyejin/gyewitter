import { useState } from "react";
import AppRouter from "./Router";
import { authService } from "../fbase";
import { useEffect } from "react";
import { onAuthStateChanged, User, updateProfile } from "firebase/auth";
import styled from "@emotion/styled";

function App() {
  const [init, setInit] = useState<boolean>(false);
  const [userObj, setUserObj] = useState<User | null>(null);
  const [, setIsChanged] = useState<boolean>(false);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      void (async () => {
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
      })();
    });
  }, []);

  const refreshUser = () => {
    setIsChanged((prev) => !prev);
  };

  return (
    <AppContainer>
      {init ? (
        <AppRouter
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
          refreshUser={refreshUser}
        />
      ) : (
        "초기화 중..."
      )}
      <Footer>&copy; {new Date().getFullYear()} gyewitter</Footer>
    </AppContainer>
  );
}

export default App;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh; // 높이가 있어야 justify-content 먹음
  justify-content: center; // 세로축 가운데 정렬
  align-items: center; // 가로축 가운데 정렬
`;

const Footer = styled.footer`
  position: absolute;
  bottom: 0;
`;
