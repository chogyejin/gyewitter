import { useState } from "react";
import AppRouter from "./Router";
import { authService } from "../fbase";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [init, setInit] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      console.log(user);
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
    <div>
      {init ? <AppRouter isLoggedIn={isLoggedIn} /> : "초기화 중..."}
      <footer>&copy; {new Date().getFullYear()} gyewitter</footer>
    </div>
  );
}

export default App;
