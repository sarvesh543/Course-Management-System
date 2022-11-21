import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
//pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Welcome from "./pages/Welcome";
import Error from "./pages/Error";
import AddDrop from "./pages/AddDrop";
//redux
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./redux/userActions";

function App() {
  const authenticated = useSelector((state) => state.user.authenticated);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUser(localStorage.getItem("token")));
  }, [dispatch]);

  let home = authenticated ? <Navigate to="/dashboard" /> : <Welcome />;
  let login = authenticated ? <Navigate to="/dashboard" /> : <Login />;
  let signup = authenticated ? <Navigate to="/dashboard" /> : <SignUp />;
  let dashboard = authenticated ? <Home /> : <Navigate to="/" />;
  let addDrop = authenticated ? <AddDrop /> : <Navigate to="/" />;

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={home} />
          <Route exact path="/dashboard" element={dashboard} />
          <Route exact path="/adddrop" element={addDrop} />
          <Route exact path="/login" element={login} />
          <Route exact path="/signup" element={signup} />
          <Route exact path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
