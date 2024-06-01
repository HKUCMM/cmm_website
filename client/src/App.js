import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/Home.js";
import About from "./routes/About.js";
import Login from "./routes/Login.js";
import Mynav from "./components/Navbar.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./components/Footer.js";
import Notice from "./routes/notice.js";
import Post from "./routes/post.js";

function App() {
  return (
    <BrowserRouter>
      <Mynav />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/notice" element={<Notice />} />
          <Route path="/post" element={<Post />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
