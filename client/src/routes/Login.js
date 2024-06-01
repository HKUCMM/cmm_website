import React, { useState } from "react";
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import "../css/login.css";
import "../css/mainpage.css"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    emailEmpty: "",
    emailInvalid: "",
    password: ""
  });
  const [cookies, setCookies] = useCookies(["name", "isAdmin"]);

  const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const navigate = useNavigate();

  const validateValues = () => {
    let errorPresent = false;
    if (email.length === 0) {
      console.log("HI");
      setErrors((prevState) => {
        return { ...prevState, email: "Required field", emailEmpty: "Required field", emailInvalid: "" };
      })
      errorPresent = true;
    } else if (!email.match(isValidEmail)) {
      setErrors((prevState) => {
        return { ...prevState, email: "Invalid email address!", emailEmpty: "", emailInvalid: "Invalid email address!" };
      })
      errorPresent = true;
    }

    if (password.length === 0) {
      setErrors((prevState) => {
        return { ...prevState, password: "Required field" };
      })
      errorPresent = true;
    }

    return !errorPresent;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validValues = validateValues();
    if (!validValues) {
      return console.log(errors);
    } else {
      return handleAPI();
    }
  };

  const handleAPI = () => {
    fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: "POST",
      body: JSON.stringify({
        loginEmail: email,
        loginPassword: password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (!res.ok) {
        throw new Error("Login Info Invalid");
      }
      return res.json();
    }).then((data) => {
      const firstName = data.firstName;
      const isAdmin = data.isAdmin;
      let expires = new Date();
      expires.setTime(expires.getTime() + 30 * 60 * 1000);
      setCookies("name", firstName, { path: "/", expires });
      setCookies("isAdmin", isAdmin, { path: "/", expires });
      navigate("/");
    }).catch((err) => {
      console.log(err)
      return err;
    });
  }

  return (
    <div className="banner login">
      <div className="leftBox">
        <span className="leftHeader">LOG IN</span>
        <span className="leftWelcome">Welcome to CMM!</span>
      </div>
      <form className="right" onSubmit={handleSubmit}>
        <h1 className="rightHeader">Welcome Back!</h1>
        <input
          className={errors.email ? "falseInput" : "input"}
          type="text"
          name="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => { setEmail(e.target.value) }}
        ></input>
        {errors.emailEmpty ? (
          <p className="errorEmail">Required field</p>
        ) : null}
        {errors.emailInvalid ? (
          <p className="errorEmail">Invalid email address!</p>
        ) : null}
        <input
          className={errors.password ? "falseInput" : "input"}
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => { setPassword(e.target.value) }}
        ></input>
        {errors.password ? (
          <p className="errorPassword">Required field</p>
        ) : null}
        {/* <p className="forget">Forgot Password?</p> 링크로 바꿔야 함 */}
        <button type="submit" className="loginButton">Login</button>
        <p className="signup">Don't have an account? Sign Up</p>{" "}
      </form>
    </div>
  );
};

export default Login;
