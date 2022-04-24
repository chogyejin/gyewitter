import { User } from "firebase/auth";
import { Link } from "react-router-dom";
import { NavList } from "./styled/Container/Container";

interface NavigationProps {
  userObj: User | null;
}

const Navigation = ({ userObj }: NavigationProps) => {
  return (
    <nav>
      <NavList>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profile">{userObj?.displayName}의 Profile</Link>
        </li>
      </NavList>
    </nav>
  );
};

export default Navigation;
