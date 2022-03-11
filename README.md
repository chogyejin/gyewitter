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
