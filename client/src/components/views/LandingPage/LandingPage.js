import React, { useEffect } from "react";
import axios from "axios";

function LandingPage() {
  useEffect(() => {
    // get 요청을 서버에 보내고, 돌아오는 response를 console에 출력
    axios
      .get("/api/hello")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

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
      <h2>시작 페이지</h2>
    </div>
  );
}

export default LandingPage;
