import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { dbService } from "../fbase";

const Home = () => {
  const [gyeweet, setGyeweet] = useState<string>("");

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
    </div>
  );
};

export default Home;
