import React, { Suspense, useEffect } from "react";
import api from "./api/api";
import { Route, Routes, useNavigate } from "react-router-dom";

import Login from "./components/screens/Login";
import SignUp from "./components/screens/SignUp";
const Main = React.lazy(() => import("./components/Main"));
const ErrorPage = React.lazy(() => import("./components/ErrorPage"));

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
      navigate("/login");
    }
  };

  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/main/*" element={<Main />} />
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
