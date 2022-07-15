import { User } from "firebase/auth";
import { Link } from "react-router-dom";

interface NavigationProps {
  userObj: User | null;
}

const Navigation = ({ userObj }: NavigationProps) => {
  return (
    <nav>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/profile">{userObj?.displayName}의 Profile</Link>
      </li>
    </nav>
  );
};

export default Navigation;
