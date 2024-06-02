import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/Home.js";
import Login from "./routes/Login.js";
import Mynav from "./components/Navbar.js";
import Footer from "./components/Footer.js";
import Notice from "./routes/notice.js";
import Post from "./routes/post.js";
import PageNotFound from "./routes/PageNotFound.js";
import ChangePassword from "./routes/ChangePassword.js";
import ContactUs from "./routes/ContactUs.js";
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
          <Route path="/posts" element={<Notice />} />
          <Route path="/posts/:postId" element={<Post />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route
            path="/change-password"
            element={<ChangePassword setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
