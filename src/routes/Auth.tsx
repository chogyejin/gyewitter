import { ChangeEvent, FormEvent, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { authService } from "../fbase";

const Auth = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isNewAccount, setIsNewAccount] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;

    // 한 개의 onChange 함수로 두 개 관리
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      let data;
      if (isNewAccount) {
        // If the new account was created, the user is signed in automatically
        data = await createUserWithEmailAndPassword(
          authService,
          email,
          password
        );
      } else {
        // log in
        data = await signInWithEmailAndPassword(authService, email, password);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const toggleAccount = () => {
    setIsNewAccount((prev) => !prev);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          placeholder="이메일"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          required
          value={password}
          onChange={onChange}
        />
        <input
          type="submit"
          value={isNewAccount ? "새 계정 만들기" : "로그인"}
        />
      </form>
      <div>{error}</div>
      <div onClick={toggleAccount}>
        {isNewAccount ? "로그인 버튼으로" : "새 계정 만들기 버튼으로"}
      </div>
      <div>
        <button>Google로 계속 하기</button>
        <button>GitHub로 계속 하기</button>
      </div>
    </div>
  );
};

export default Auth;
