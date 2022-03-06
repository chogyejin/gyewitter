import { ChangeEvent, FormEvent, useState } from "react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="text"
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
        <input type="submit" value="로그인" />
      </form>
      <div>
        <button>Google로 계속 하기</button>
        <button>GitHub로 계속 하기</button>
      </div>
    </div>
  );
};

export default Auth;
