import ReCAPTCHA from "react-google-recaptcha";

interface RecaptchaProps {
  setIsVerified: (isVerified: boolean) => void;
}

const Recaptcha = ({ setIsVerified }: RecaptchaProps) => {
  const onCheckboxClick = (token: string | null) => {
    if (!token) return;
    console.log(token);
    setIsVerified(true);
  };

  return (
    <>
      <ReCAPTCHA
        theme="dark"
        sitekey={process.env.REACT_APP_SITE_KEY!}
        onChange={onCheckboxClick}
      />
    </>
  );
};
export default Recaptcha;
