import styled from "@emotion/styled";
import { User } from "firebase/auth";
import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { BsPerson } from "react-icons/bs";

interface NavigationProps {
  userObj: User | null;
}

const Navigation = ({ userObj }: NavigationProps) => {
  return (
    <Nav>
      <Li>
        <Link to="/">
          <Container>
            <AiOutlineHome size={50} />
          </Container>
        </Link>
      </Li>
      <Li>
        <Link to="/profile">
          <Container>
            <BsPerson size={50} />
            <Span>{userObj?.displayName}</Span>
          </Container>
        </Link>
      </Li>
    </Nav>
  );
};

export default Navigation;

const Nav = styled.nav`
  width: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  top: 0;
`;

const Li = styled.li`
  width: 100px;
`;

const Span = styled.span`
  display: block;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
