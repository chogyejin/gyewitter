import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { authService } from "../fbase";
import styled from "@emotion/styled";

const AuthForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isNewAccount, setIsNewAccount] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    void (async () => {
      try {
        if (isNewAccount) {
          await createUserWithEmailAndPassword(authService, email, password);
        } else {
          await signInWithEmailAndPassword(authService, email, password);
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    })();
  };

  const toggleAccount = () => {
    setIsNewAccount((prev) => !prev);
  };

  return (
    <>
      <Form onSubmit={onSubmit}>
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
        <AuthButton
          type="submit"
          value={isNewAccount ? "새 계정 만들기" : "로그인"}
        />
      </Form>
      <div>{error}</div>
      <ChangeButton onClick={toggleAccount}>
        {isNewAccount ? "로그인 버튼으로" : "새 계정 만들기 버튼으로"}
      </ChangeButton>
    </>
  );
};

export default AuthForm;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const AuthButton = styled.input`
  color: white;
  border: none;
  border-radius: 10px;
  background-color: #04aaff;
  cursor: pointer;
`;

const ChangeButton = styled.button`
  width: 100%;
  color: white;
  border: none;
  border-radius: 10px;
  background-color: #04aaff;

  &:hover {
  }
`;
