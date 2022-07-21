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
        <Input
          name="email"
          type="email"
          placeholder="이메일"
          required
          value={email}
          onChange={onChange}
        />
        <Input
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
      <ErrorMessage>{error}</ErrorMessage>
      <ChangeButton onClick={toggleAccount}>
        {isNewAccount ? "로그인 버튼으로" : "새 계정 만들기 버튼으로"}
      </ChangeButton>
    </>
  );
};

export default AuthForm;

const Form = styled.form`
  width: 100%;
  max-width: 240px;
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  height: 30px;
  border: 1px solid #04aaff;
  border-radius: 10px;
  margin-bottom: 12px;
  padding-left: 5px;
`;

const AuthButton = styled.input`
  height: 30px;
  color: white;
  border: none;
  border-radius: 10px;
  background-color: #04aaff;
  margin-bottom: 12px;
  cursor: pointer;
`;

const ChangeButton = styled.button`
  width: 100%;
  max-width: 240px;
  height: 30px;
  color: #04aaff;
  border: none;
  background-color: white;
`;

const ErrorMessage = styled.span`
  color: red;
`;
