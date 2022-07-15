import { useState } from "react";
import AppRouter from "./Router";
import { authService } from "../fbase";
import { useEffect } from "react";
import { onAuthStateChanged, User, updateProfile } from "firebase/auth";

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
    <>
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
    </>
  );
}

export default App;
