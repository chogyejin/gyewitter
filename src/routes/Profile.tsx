import { authService, dbService } from "../fbase";
import { signOut, User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { GyeweetData } from "./Home";

interface ProfileProps {
  userObj: User | null;
}

interface MyGyeweetData {
  id: string;
  text: string;
  imgDownloadUrl: string;
}

const Profile = ({ userObj }: ProfileProps) => {
  const [myGyeweets, setMyGyeweets] = useState<MyGyeweetData[]>([]);
  const navigate = useNavigate();
  const onLogOut = () => {
    signOut(authService);
    navigate("/");
  };

  const getMyGyeweets = async () => {
    const q = query(
      collection(dbService, "gyeweets"),
      where("creatorId", "==", userObj!.uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const result = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      text: doc.data().text,
      imgDownloadUrl: doc.data().imgDownloadUrl,
    }));
    setMyGyeweets(result);
  };

  useEffect(() => {
    getMyGyeweets();
  }, []);

  return (
    <>
      <button onClick={onLogOut}>로그아웃</button>
      <div>
        {myGyeweets.map((myGyeweet) => (
          <div key={myGyeweet.id}>{myGyeweet.text}</div>
        ))}
      </div>
    </>
  );
};

export default Profile;
