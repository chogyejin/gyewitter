import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Gyeweet from "../components/Gyeweet";
import { dbService } from "../fbase";

export interface GyeweetData {
  id: string;
  creatorId: string;
  createdAt: number;
  text: string;
}

interface HomeProps {
  userObj: User | null;
}

const Home = ({ userObj }: HomeProps) => {
  const [gyeweet, setGyeweet] = useState<string>("");
  const [gyeweets, setGyeweets] = useState<GyeweetData[]>([]);

  useEffect(() => {
    const q = query(
      collection(dbService, "gyeweets"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const result = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        creatorId: doc.data().creatorId,
        createdAt: doc.data().createdAt,
        text: doc.data().text,
      }));
      setGyeweets(result);
    });
    return () => unsubscribe();
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await addDoc(collection(dbService, "gyeweets"), {
      // collection name : gyeweets
      // field : gyeweet(state), createdAt
      text: gyeweet,
      createdAt: Date.now(),
      creatorId: userObj!.uid,
    });
    setGyeweet(""); // submit 이후엔 비워주기
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setGyeweet(value);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="새 계윗을 작성하세요"
          value={gyeweet}
          onChange={onChange}
          maxLength={120}
        />
        <input type="submit" value="gyeweet" />
      </form>
      <div>
        {gyeweets.map((gyeweet) => (
          <Gyeweet
            key={gyeweet.id}
            gyeweetObj={gyeweet}
            isOwner={userObj!.uid === gyeweet.creatorId}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
