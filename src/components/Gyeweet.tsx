import { GyeweetData } from "../routes/Home";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { dbService, storageService } from "../fbase";
import React, { useState } from "react";
import { ref, deleteObject } from "firebase/storage";

interface GyeweetProps {
  gyeweetObj: GyeweetData;
  isOwner: boolean;
}

const Gyeweet = ({ gyeweetObj, isOwner }: GyeweetProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newGyeweet, setNewGyeweet] = useState<string>(gyeweetObj.text);

  const onDeleteClick = async () => {
    const isOk = window.confirm("삭제하시겠습니까?");
    if (!isOk) return;
    await deleteDoc(doc(dbService, "gyeweets", `${gyeweetObj.id}`));

    if (!gyeweetObj.imgDownloadUrl) return;
    await deleteObject(ref(storageService, gyeweetObj.imgDownloadUrl));
  };

  const toggleIsEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setNewGyeweet(value);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await updateDoc(doc(dbService, "gyeweets", `${gyeweetObj.id}`), {
      // field 이름은 일치시켜서
      text: newGyeweet,
      // createdAt: Date.now(), 수정된 거 날짜 수정하기
    });
    setIsEditing(false);
  };

  const onCancelClick = () => {
    toggleIsEditing();
    setNewGyeweet(gyeweetObj.text);
  };

  return (
    <div>
      {isEditing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="수정할 내용 입력"
              value={newGyeweet}
              onChange={onChange}
              required
            />
            <input type="submit" value="수정 완료!" />
          </form>
          <button onClick={onCancelClick}>작성 취소</button>
        </>
      ) : (
        <>
          <h4>{gyeweetObj.text}</h4>
          {gyeweetObj.imgDownloadUrl && (
            <img src={gyeweetObj.imgDownloadUrl} width={50} height={50} />
          )}
          {isOwner && (
            <>
              <div>
                <button onClick={onDeleteClick}>삭제</button>
                <button onClick={toggleIsEditing}>수정</button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Gyeweet;
