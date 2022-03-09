import { addDoc, collection, DocumentData, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";

interface GyeweetData {
  data: DocumentData;
  id: string;
}

const Home = () => {
  const [gyeweet, setGyeweet] = useState<string>("");
  const [gyeweets, setGyeweets] = useState<GyeweetData[]>([]);

  const getGyeweets = async () => {
    const querySnapshot = await getDocs(collection(dbService, "gyeweets"));
    querySnapshot.forEach((doc) => {
      // console.log(doc.data());
      const newDoc = {
        data: doc.data(),
        id: doc.id, // 기존 field에 id도 추가
      };
      setGyeweets((prev) => {
        return [newDoc, ...prev];
      });
    });
  };

  useEffect(() => {
    getGyeweets();
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const docRef = await addDoc(collection(dbService, "gyeweets"), {
      // collection name : gyeweets
      // field : gyeweet(state), createdAt
      gyeweet,
      createdAt: Date.now(),
    });
    console.log("Document written with ID: ", docRef.id);
    setGyeweet(""); // submit 이후엔 비워주기
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setGyeweet(value);
  };
  console.log(gyeweets);
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
          <div key={gyeweet.id}>
            <h4>{gyeweet.data.gyeweet}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
