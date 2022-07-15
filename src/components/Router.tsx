import { User } from "firebase/auth";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Navigation from "./Navigation";

interface AppRouterProps {
  isLoggedIn: boolean;
  userObj: User | null;
  refreshUser: () => void;
}

const AppRouter = ({ isLoggedIn, userObj, refreshUser }: AppRouterProps) => {
  return (
    <Router>
      {isLoggedIn && <Navigation userObj={userObj} />}
      <Routes>
        {isLoggedIn && userObj ? (
          <>
            <Route path="/" element={<Home userObj={userObj} />} />
            <Route
              path="/profile"
              element={<Profile userObj={userObj} refreshUser={refreshUser} />}
            />
          </>
        ) : (
          <Route path="/" element={<Auth />} />
        )}
      </Routes>
    </Router>
  );
};

export default AppRouter;
