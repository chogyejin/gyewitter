import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
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
  const [imgUrl, setImgUrl] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

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

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    const uploadedFile = files![0]; // non-null assertion operator
    const reader = new FileReader(); // constructor

    // event handler
    reader.onloadend = () => {
      setImgUrl(reader.result as string);
    };

    if (uploadedFile) {
      reader.readAsDataURL(uploadedFile); // read file
    }
  };

  const onFileClear = () => {
    setImgUrl("");
    inputRef.current!.value = "";
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
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
        />
        <input type="submit" value="gyeweet" />
        {imgUrl && (
          <div>
            <img src={imgUrl} width={100} height={100} />
            <button type="button" onClick={onFileClear}>
              사진 삭제
            </button>
          </div>
        )}
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
