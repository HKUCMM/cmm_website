import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/Home.js";
import Login from "./routes/Login.js";
import Mynav from "./components/Navbar.js";
import Footer from "./components/Footer.js";
import Notice from "./routes/notice.js";
import Post from "./routes/post.js";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("name"));

  return (
    <BrowserRouter>
      <Mynav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/notice" element={<Notice />} />
          <Route path="/post" element={<Post />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
