import { authService, dbService } from "../fbase";
import { signOut, User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

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
  const displayNamePlaceholder = `바꿀 이름을 입력하세요. 현재 : ${
    userObj!.displayName
  }`;
  const [newDisplayName, setNewDisplayName] = useState<string>("");

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

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (userObj?.displayName === newDisplayName) {
      return;
    }
    await updateProfile(userObj!, {
      displayName: newDisplayName,
    });
  };

  return (
    <>
      <div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder={displayNamePlaceholder}
            style={{ width: 200 }}
            onChange={onChange}
            value={newDisplayName}
          />
          <input type="submit" value="변경" />
        </form>
      </div>
      <div>
        {myGyeweets.map((myGyeweet) => (
          <div key={myGyeweet.id}>{myGyeweet.text}</div>
        ))}
      </div>
      <button onClick={onLogOut}>로그아웃</button>
    </>
  );
};

export default Profile;
