import ErrorPage from "./components/ErrorPage";
import React, { useEffect } from "react";
import api from "./api/api";
import { Route, Routes, useNavigate } from "react-router-dom";

import Login from "./components/Login";
import Main from "./components/Main";
import SignUp from "./components/SignUp";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("sessionId");
    token ? userLoginByToken(token) : navigate("/login");
  }, []);

  const userLoginByToken = async (token) => {
    try {
      const userToken = await api.userLogin({ token });
      localStorage.setItem("sessionId", userToken);
      navigate("/main");
    } catch (error) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/main/*" element={<Main />} />
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
