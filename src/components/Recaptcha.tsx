import ReCAPTCHA from "react-google-recaptcha";

const Recaptcha = () => {
  const onCheckboxClick = (token: string | null) => {
    console.log(token);
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
