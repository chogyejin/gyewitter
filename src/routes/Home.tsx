import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import Gyeweet from "../components/Gyeweet";
import { dbService } from "../fbase";
import GyeweetForm from "../components/GyeweetForm";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { GyeweetData } from "../interfaces";

interface HomeProps {
  userObj: User;
}

const Home = ({ userObj }: HomeProps) => {
  const [gyeweets, setGyeweets] = useState<GyeweetData[]>([]);

  useEffect(() => {
    const q = query(
      collection(dbService, "gyeweets"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const result = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          creatorId: doc.data().creatorId as string,
          createdAt: doc.data().createdAt as number,
          text: doc.data().text as string,
          imgDownloadUrl: doc.data().imgDownloadUrl as string,
          creatorName: doc.data().creatorName as string,
        }));

        setGyeweets(result);
      },
      (error) => {
        console.log(error);
      }
    );
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
            isOwner={userObj.uid === gyeweet.creatorId}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
