import { GyeweetData } from "../routes/Home";

interface GyeweetProps {
  gyeweetObj: GyeweetData;
  isOwner: boolean;
}

const Gyeweet = ({ gyeweetObj, isOwner }: GyeweetProps) => {
  return (
    <div>
      <h4>{gyeweetObj.text}</h4>
      {isOwner && (
        <>
          <div>
            <button>수정</button>
            <button>삭제</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Gyeweet;
