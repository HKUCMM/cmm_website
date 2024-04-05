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
        <input className="email" type="text" placeholder="E-mail"></input>
        <input
          className="password"
          type="password"
          placeholder="Password"
        ></input>
        <p className="forget">Forgot Password?</p>
        <button className="loginButton">Login</button>
        <p className="signup">Don't have an account? Sign Up</p>
      </form>
    </div>
  );
};

export default Login;
