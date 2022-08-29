import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { dbService, storageService } from "../fbase";
import React, { useState } from "react";
import { ref, deleteObject } from "firebase/storage";
import displayDate from "../utils/displayDate";
import { GyeweetData } from "../interfaces";
import styled from "@emotion/styled";
import { Button } from "./base/Button";
import { MdDeleteOutline, MdOutlineModeEditOutline } from "react-icons/md";

interface GyeweetProps {
  gyeweetObj: GyeweetData;
  isOwner: boolean;
}

const Gyeweet = ({ gyeweetObj, isOwner }: GyeweetProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newGyeweet, setNewGyeweet] = useState<string>(gyeweetObj.text);
  const date = displayDate(gyeweetObj.createdAt);

  const onDeleteClick = () => {
    void (async () => {
      const isOk = confirm("삭제하시겠습니까?");
      if (!isOk) return;
      await deleteDoc(doc(dbService, "gyeweets", `${gyeweetObj.id}`));

      if (!gyeweetObj.imgDownloadUrl) return;
      await deleteObject(ref(storageService, gyeweetObj.imgDownloadUrl));
    })();
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

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    void (async () => {
      await updateDoc(doc(dbService, "gyeweets", `${gyeweetObj.id}`), {
        // field 이름은 일치시켜서
        text: newGyeweet,
        // createdAt: Date.now(), 수정된 거 날짜 수정하기
      });
      setIsEditing(false);
    })();
  };

  const onCancelClick = () => {
    toggleIsEditing();
    setNewGyeweet(gyeweetObj.text);
  };

  return (
    <Container>
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
            <Button type="submit" value="수정 완료!" />
          </form>
          <button onClick={onCancelClick}>작성 취소</button>
        </>
      ) : (
        <>
          <div>
            <div>
              {gyeweetObj.imgDownloadUrl && (
                <img src={gyeweetObj.imgDownloadUrl} width={50} height={50} />
              )}
            </div>
            <h4>{gyeweetObj.text}</h4>
            <div>작성자 : {gyeweetObj.creatorName}</div>

            <div>{date}</div>
          </div>

          {isOwner && (
            <>
              <div>
                <DeleteButton onClick={onDeleteClick} />
                <EditButton onClick={toggleIsEditing} />
              </div>
            </>
          )}
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  border-bottom: 1px solid gray;
`;

const DeleteButton = styled(MdDeleteOutline)`
  cursor: pointer;
`;

const EditButton = styled(MdOutlineModeEditOutline)``;

export default Gyeweet;
