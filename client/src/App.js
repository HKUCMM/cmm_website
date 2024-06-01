import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/Home.js";
import Login from "./routes/Login.js";
import Mynav from "./components/Navbar.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./components/Footer.js";
import Test from "./routes/Test.js";

function App() {
  return (
    <BrowserRouter>
      <Mynav />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
