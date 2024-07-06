import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_action";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPW, setConfirmPW] = useState("");

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onNameHandler = (event) => {
    setName(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onConfirmdPWHandler = (event) => {
    setConfirmPW(event.currentTarget.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (password !== confirmPW) {
      return alert("비밀번호와 비밀번호 확인이 일치하지 않습니다");
    }

    let body = {
      email: email,
      name: name,
      password: password,
    };

    dispatch(registerUser(body)).then((response) => {
      // 로그인에 성공하면, 처음 페이지로 이동
      if (response.payload.status === 200 && response.data.success) {
        navigate("/login");
      } else if (response.payload.status === 400) {
        alert("이미 등록된 이메일입니다.");
      } else {
        alert("회원가입에 오류가 발생했습니다");
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type="email" value={email} onChange={onEmailHandler} />

        <label>Name</label>
        <input type="text" value={name} onChange={onNameHandler} />

        <label>Password</label>
        <input type="password" value={password} onChange={onPasswordHandler} />

        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPW}
          onChange={onConfirmdPWHandler}
        />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default RegisterPage;
