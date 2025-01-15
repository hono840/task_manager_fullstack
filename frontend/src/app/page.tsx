"use client";

import React, { useEffect, useState } from "react";

const Page = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/hello")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("フェッチ失敗", error));
  }, []);

  return (
    <>
      <h1>タスク管理</h1>
      <p>{message}</p>
    </>
  );
};

export default Page;
