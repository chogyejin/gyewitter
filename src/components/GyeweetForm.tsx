import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useRef, useState } from "react";
import { dbService, storageService } from "../fbase";
import { v4 as uuidv4 } from "uuid";
import { User } from "firebase/auth";

interface GyeweetFormProps {
  userObj: User | null;
}

const GyeweetForm = ({ userObj }: GyeweetFormProps) => {
  const [gyeweet, setGyeweet] = useState<string>("");
  const [imgUrl, setImgUrl] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let imgDownloadUrl = "";

    // image exist
    if (imgUrl !== "") {
      const imgRef = ref(storageService, `${userObj!.uid}/${uuidv4()}`); // make ref
      const response = await uploadString(imgRef, imgUrl, "data_url"); // upload image on storage
      imgDownloadUrl = await getDownloadURL(imgRef); // get url after upload
    }

    const gyeweetInstance = {
      // fields
      text: gyeweet,
      createdAt: Date.now(),
      creatorId: userObj!.uid,
      imgDownloadUrl,
    };
    await addDoc(collection(dbService, "gyeweets"), gyeweetInstance); // add doc

    setGyeweet(""); // submit 이후엔 비워주기
    onFileClear();
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
  );
};
export default GyeweetForm;
