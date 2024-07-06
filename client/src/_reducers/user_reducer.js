import { LOGIN_USER, REGISTER_USER } from "../_actions/types";

// (이전 상태, 액션) 받아서 (새로운 상태) 반환
const reducer = (state = {}, action) => {
  switch (action.type) {
    case LOGIN_USER:
      //새로운 상태 객체 생성
      return { ...state, loginSuccess: action.payload }; //이전 상태의 모든 속성 복사하고, loginSuccess 속성에 action.payload(id) 할당
      break;
    case REGISTER_USER:
      return { ...state, register: action.payload };
      break;
    default:
      return state;
  }
};

export default reducer;
