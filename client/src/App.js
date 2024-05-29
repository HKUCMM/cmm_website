import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/Home.js";
import About from "./routes/About.js";
import Login from "./routes/Login.js";
import Mynav from "./components/Navbar.js";
import "bootstrap/dist/css/bootstrap.min.css";
import MiddlePage from "./components/Mainpage.js";

function App() {
  return (
    <BrowserRouter>
      <Mynav />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
      <MiddlePage />
    </BrowserRouter>
  );
}

export default App;
