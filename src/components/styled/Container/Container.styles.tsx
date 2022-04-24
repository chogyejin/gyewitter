import styled from "styled-components";

interface IAppContainer {}

export const AppContainer = styled.div`
  max-width: 890px;
  margin: 0 auto;
  margin-top: 80px;
`;

export const GyeweetContainer = styled.div`
  height: 100px;
  border: 1px solid black;
  border-radius: 10px;
  margin-top: 10px;
  font-size: 15px;
`;

export const NavList = styled.ul`
  display: flex;
  justify-content: space-around;
  margin-bottom: 50px;
`;
