import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import Gyeweet from "../components/Gyeweet";
import { dbService } from "../fbase";
import GyeweetForm from "../components/GyeweetForm";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

export interface GyeweetData {
  id: string;
  creatorId: string;
  createdAt: number;
  text: string;
  imgDownloadUrl: string;
}

interface HomeProps {
  userObj: User | null;
}

const Home = ({ userObj }: HomeProps) => {
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
        imgDownloadUrl: doc.data().imgDownloadUrl,
      }));
      setGyeweets(result);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <GyeweetForm userObj={userObj} />
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
