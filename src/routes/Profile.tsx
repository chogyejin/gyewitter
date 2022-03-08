import { authService } from "../fbase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const onLogOut = () => {
    signOut(authService);
    navigate("/");
  };
  return (
    <>
      <button onClick={onLogOut}>로그아웃</button>
    </>
  );
};

export default Profile;
