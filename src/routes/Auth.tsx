import React from "react";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { authService } from "../fbase";
import AuthForm from "../components/AuthForm";

const Auth = () => {
  const onSocialClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const name = (event.target as HTMLButtonElement).name;

    void (async () => {
      let provider;
      try {
        if (name === "google") {
          provider = new GoogleAuthProvider();
        } else if (name === "github") {
          provider = new GithubAuthProvider();
        }

        if (provider === undefined) return;
        await signInWithPopup(authService, provider);
      } catch (error) {
        console.log(error);
      }
    })();
  };

  return (
    <div>
      <AuthForm />
      <div>
        <button name="google" onClick={onSocialClick}>
          Google로 계속 하기
        </button>
        <button name="github" onClick={onSocialClick}>
          GitHub로 계속 하기
        </button>
      </div>
    </div>
  );
};

export default Auth;
