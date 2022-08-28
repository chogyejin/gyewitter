import { useRef } from "react";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { authService } from "../fbase";
import AuthForm from "../components/AuthForm";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import styled from "@emotion/styled";
import logo from "../images/gyewitterLogo.jpg";

const Auth = () => {
  const googleButtonRef = useRef<HTMLButtonElement>(null);
  const githubButtonRef = useRef<HTMLButtonElement>(null);

  const onSocialClick = () => {
    if (googleButtonRef.current === null || githubButtonRef.current === null)
      return;
    const { name } = googleButtonRef.current;

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
    <>
      <Image src={logo} />
      <AuthForm />
      <Container>
        <SocialButton
          ref={googleButtonRef}
          name="google"
          onClick={onSocialClick}
        >
          <FcGoogle size={50} />
        </SocialButton>
        <SocialButton
          ref={githubButtonRef}
          name="github"
          onClick={onSocialClick}
        >
          <FaGithub size={50} />
        </SocialButton>
      </Container>
    </>
  );
};

export default Auth;

const Image = styled.img`
  width: 100px;
  height: 100px;
`;

const Container = styled.div`
  width: 100%;
  max-width: 240px;
  display: flex;
  justify-content: space-around;

  & > svg {
    cursor: pointer;
  }
`;

const SocialButton = styled.button`
  justify-content: center;
  border: none;
  background-color: white;
`;
