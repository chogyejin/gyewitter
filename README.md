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
