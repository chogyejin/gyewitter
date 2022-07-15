import { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface RecaptchaProps {
  setIsVerified: (isVerified: boolean) => void;
}

const Recaptcha = ({ setIsVerified }: RecaptchaProps) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const onCheckboxClick = (token: string | null) => {
    if (!token) return;
    setIsVerified(true);
    removeToken();
  };

  const removeToken = () => {
    setTimeout(() => {
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setIsVerified(false);
    }, 120 * 1000);
  };

  return (
    <>
      <ReCAPTCHA
        ref={recaptchaRef}
        theme="dark"
        sitekey={
          process.env.REACT_APP_SITE_KEY ? process.env.REACT_APP_SITE_KEY : ""
        }
        onChange={onCheckboxClick}
      />
    </>
  );
};
export default Recaptcha;
