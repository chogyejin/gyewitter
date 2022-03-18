# Gyewitter

## 초기 세팅

- Cloning Twitter with React(Typescript) and Firebase
- 프로젝트 생성 : npx create-react-app gyewitter --template typescript
- github repository : README.md, .gitignore 추가 X
- git remote add origin 하고 브랜치명 master -> main으로 변경
- 필요없는 파일 제거
- Firebase 설정 : [Firebase docs](https://firebase.google.com/docs/web/setup?hl=ko&authuser=0)
- 환경 변수 : .env 파일에 REACT_APP\_ 형식으로 작성, git에서 감춰질 뿐 브라우저에선 노출됨(추후 보완 필요)

## react-router-dom

- react-router-dom v6 사용
- Router.tsx
  - Router 안에 Routes(~v5 Switch), Routes 안에 Route
- 로그인 여부(isLoggedIn)에 따라 현재는 Home이나 Auth component 보여줌

## Authentication

- fbase.js에 getAuth() 함수로 authService를 export 함
- Firebase console에서 Authentication의 Sign-in method에서 로그인 제공 업체 추가
  - GitHub은 OAuth를 추가해줘야함
- Auth.tsx에 로그인 폼 추가
- 로그인 기능 추가 : createUserWithEmailAndPassword(), signInWithEmailAndPassword()
  - 어플리케이션이 시작되면 Firebase가 초기화될 시간이 없어 user가 null로 나옴
  - App.tsx에 signed-in한 사용자를 관찰하는 onAuthStateChanged()를 useEffect로 추가
  - 정보는 개발자도구 > Application > IndexedDB에 저장됨(기본값)
- 가입한 user는 Firebase console의 Users 탭에서 확인 가능
- 새 계정 가입 or 로그인 버튼 바꾸는 토글 추가
- 소셜 로그인
  - Provider(Google, GitHub ...)에 따라 provider 변수 만듦
  - provider undefined 예외 처리
  - popup or redirection 중 방법을 골라 실행
- 로그아웃

  - Router에 Route로 Profile 추가하고 Navigation component에 Link 추가
  - 로그아웃 후에는 Profile 페이지에서 다른 페이지로 redirect

    1. Profile 페이지에서 useNavigate hook

    ```
    // Profile.tsx
    const navigate = useNavigate();
    const onLogOut = () => {
      signOut(authService);
      navigate("/");
    };
    ```

    2. Router.tsx에서 \<Navigate /> component 사용

    ```
    // Router.tsx NOT isLoggedIn
    <Route path="*" element={<Navigate to="/" replace />} />
    ```

## Tweet(gyeweet)

- 트윗 form 작성
- Firestore Database(NoSQL) test mode로 생성
  - Document : 문서
  - Collection : 폴더, Document의 모임
- addDoc() 함수로 특정 collection에 document 추가할 수 있음
- getDocs() 함수로 모든 doc 불러와서 id를 추가한 object state를 setGyeweets
  - doc은 DocumentData type(gyeweet, createdAt), gyeweets 배열은 GyeweetData[] type
  - doc.data()에 doc.id 추가
  - setState에 함수를 넣으면 이전 값 사용 가능
  ```
  querySnapshot.forEach((doc) => {
    const newDoc = {
      data: doc.data(),
      id: doc.id,
    };
    setGyeweets((prev) => {
      return [newDoc, ...prev];
    });
  });
  ```
  - 값을 뿌릴 때는 gyeweets.map() 이용
- 작성자 uid 추가
  - App.tsx > Router.tsx > Home.tsx로 user object props 전달
  - gyeweets collection에 creatorID field 추가
  - Gyeweet component 만들고 isOwner props가 true 일 때만 수정이나 삭제 버튼 보이게 함
  - `userObj!.uid === gyeweet.creatorId`
- DB 실시간 반영
  - user 상태를 확인했던 onAuthStateChanged() 처럼 Firestore 상태를 리스닝하는 onSnapshot() 추가
  - query()에 orderBy()로 시간순으로 보이게 함
  - useEffect cleanup
    - unsubscribe = () => { ... }
    - `return unsubscribe;`, `return () => unsubscribe();`
- 삭제
  - 특정 collection의 특정 document를 지워야함.
  - deleteDoc(ref), ref는 doc(Firestore, path)로 작성
- 수정
  - updateDoc(ref, data)로 작성, data는 수정할 field 이름을 가지며 전달하는 object
  - 수정 중임을 뜻하는 isEditing state와 form을 보여주는 toggle 함수 추가

## File Upload

- Upload input

  - `<input type="file" accept="image/*" />`
  - onChange에서 FileReader API 이용
    - 파일이 골라진 상태에서 선택을 하려다가 취소하면 Failed to execute 'readAsDataURL' on 'FileReader': parameter 1 is not of type 'Blob' 에러가 나오는데, 파일이 있을 때만 readAsDataURL()하게 함
    - reader.onloadend는 이벤트 리스너
  - reader.result 값을 imgUrl에 set
  - 사진을 올리는 것을 삭제하고 싶다면 imgUrl과 input tag의 value를 빈 문자열로 대체

- Upload with Firebase Storage
  - fbase.js에서 storageService export
  - Home.tsx에서 gyeweet을 보내기 전에 사진을 먼저 업로드하고, 그 사진의 url을 gyeweet에 추가
    - ref 생성
      - 사진 id를 정해줄 패키지 설치 `npm install @types/uuid`
      - bucket 경로는 user-uid/image-uuid
    - uploadString(ref, value, format?)으로 업로드
  - 여기서 POST를 했을 때 "User does not have permission to access" 에러 발생 시
    - Storage의 Security Rules(보안 규칙)를 수정해야한다.
    ```
    service cloud.firestore {
      match /databases/{database}/documents {
        match /{document=**} {
          allow read, write: if request.auth != null;
        }
      }
    }
    ```
  - getDownloadUrl()로 파일의 다운로드 url을 얻고, gyeweet object에 추가한다.
  - gyeweet을 삭제할 때, document와 함께 업로드한 파일도 삭제해야 한다.
    - Gyeweet.tsx에서 삭제할 때 deleteObject(ref) 이용

## Profile

- 내 프로필 페이지에서 내 gyeweet들을 볼 수 있음
  - Profile.tsx로 user object 전달
  - query에서 index를 필요로 하기 때문에 Firestore console에서 만들어줌
  - Firestore로부터 getDocs(query)로 documents를 불러옴
  - query에서는 조건(where), 정렬(orderBy)을 정할 수 있다.
- Profile Link

  - Router component에서 Navigation component로 user object 보냄
  - 네비게이션의 프로필 Link 이름 displayName으로 변경

- Profile 페이지 정보 업데이트
  - 새로 입력한 displayName과 현재 displayName이 같지 않으면 updateProfile(user,{}) 실행
  - Navigation의 userObj.displayName은 바로 업데이트 되지 않는 문제 발생
- 업데이트 바로 반영(Navigation)
  - App.tsx에서 refreshUser() 함수를 내려주어 Profile 페이지에서 이름 변경 시 isChanged state를 변경하여 리렌더링 시킨다.
  - App > Router > Profile
- 새 계정 생성, GitHub 로그인 시 displayName null 문제
  - App.tsx에서 onAuthStateChanged() 안에 로그인한 user의 displayName이 null일 경우 기본값 "사용자"를 주고 refreshUser() 수행

## Refactoring

- 하나의 component에서 한 가지 일을 수행하게끔 코드 리팩토링
  - Home.tsx의 gyeweet form을 분리
  - Auth.tsx의 sign in form 분리
- [Airbnb Style Guild GitHub](https://github.com/airbnb/javascript/tree/master/react)
- 파일이 없는 gyeweet을 삭제할 때 deleteObject()의 에러 : Storage에 url이 있을 때만 수행

## Deployment

- GitHub pages를 통해 배포
  - package.json "homepage" 추가
  - package.json "scripts"에 "prebuild", "deploy" 추가
  - `npm run deploy`
- The current domain is not authorized for OAuth operations 에러

  - 특정 도메인에서 Auth를 사용하도록 Firebase console에 추가
  - Add domain to the OAuth redirect domains list

- Environment
  - `npm start` : Development mode
  - `npm run build`, `npx serve -s build` : Production mode, package.json에서 "homepage" 지워져있어야함

## Security

- 로그인 된 사람들만 gyeweet 할 수 있도록 Firestore 보안 규칙 수정
  - `allow read, write: if request.auth != null;`
- Google Cloud Platform
  - credentials(사용자 인증 정보)에서 API Key 수정
  - 애플리케이션 제한사항 > HTTP 리퍼러, 웹사이트 제한사항에 도메인 추가

## ReCAPTCHA v2

- `npm i react-google-recaptcha`, `npm i @types/react-google-recaptcha`
- Site key와 Secret key 환경변수로 저장
- axios 설치 : `npm i axios`
- fetch로 response를 받아올 때 'no-cors' mode 이용

## Date

- Firestore document createdAt field에 Date.now()로 작성 시간을 전달
- displayDate(createdAt)
  - DB의 timestamp를 전달받아 피드에 적힐 날짜 문자열을 반환하는 함수
  - Date 객체 메서드 이용(getFullYear(), getMonth(), getDate(), getHours(), getMinutes())
