import { useState } from "react";
import AppRouter from "./Router";
import { authService } from "../fbase";
import { User } from "firebase/auth";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<User | null>(
    authService.currentUser
  );
  console.log(authService);
  return (
    <div>
      <AppRouter isLoggedIn={isLoggedIn} />
      <footer>&copy; {new Date().getFullYear()} gyewitter</footer>
    </div>
  );
}

export default App;
