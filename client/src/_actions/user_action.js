import axios from "axios";
import { LOGIN_USER } from "./types";

export function loginUser(dataToSubmit) {
  //서버에 로그인 정보 전송
  const request = axios.post("/api/users/login", dataToSubmit).then(
    (response) => response.data // 서버에서 받은 data를 request 변수에 저장
  );

  //user_reducer에 data를 반환 (action -> reducer -> store)
  return {
    type: LOGIN_USER,
    payload: request,
  };
}
