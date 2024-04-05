import React, { useEffect, useState } from "react";
import "../style/login.css";

const Login = () => {
  return (
    <div className="login">
      <div className="leftBox">
        <span className="leftHeader">LOG IN</span>
        <span className="leftWelcome">Welcome to CMM!</span>
      </div>
      <form className="right">
        <h1 className="rightHeader">Welcome Back!</h1>
        <input className="input" type="text" placeholder="E-mail"></input>
        <input className="input" type="password" placeholder="Password"></input>
        <p className="forget">Forgot Password?</p> {/* 링크로 바꿔야 함 */}
        <button className="loginButton">Login</button>{" "}
        {/* 누르면 sign up 페이지로 */}
        <p className="signup">Don't have an account? Sign Up</p>{" "}
        {/* 링크로 바꿔야 함 */}
      </form>
    </div>
  );
};

export default Login;
