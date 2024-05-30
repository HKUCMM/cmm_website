import React, { useEffect, useState } from "react";
import "../style/login.css";
import axios from "axios";

const Login = () => {
  const [inputFields, setInputFields] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  const validateValues = (inputValues) => {
    let errors = {};
    if (inputValues.email.length <= 0) {
      errors.email = "Required field";
      errors.emailEmpty = "Required field";
    } else if (!inputValues.email.match(isValidEmail)) {
      errors.email = "Invalid email address!";
      errors.emailInvalid = "Invalid email address!";
    }
    if (inputValues.password.length <= 0) {
      errors.password = "Required field";
    }
    return errors;
  };

  const handleChange = (e) => {
    setInputFields({ ...inputFields, [e.target.name]: e.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(validateValues(inputFields));
    if (Object.keys(errors).length === 0) {
      setErrors(handleAPI());
    }
    setSubmitting(true);
  };

  const handleAPI = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}`)
      .then((result) => {
        result.data.map((user) => {
          let errors = {};
          if (user.loginEmail === inputFields.email) {
            if (user.loginPW === inputFields.password) {
              console.log("Login successfully");
            } else {
              errors.password = "Wrong Password";
            }
          } else if (inputFields.email !== "") {
            errors.email = "Wrong email";
          }
        });
        return errors;
      })
      .catch((err) => console.log(err));
  };

  const finishSubmit = () => {
    console.log(inputFields);
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && submitting) {
      finishSubmit();
    }
  }, [errors]);

  return (
    <div className="login">
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
          value={inputFields.email}
          onChange={handleChange}
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
          value={inputFields.password}
          onChange={handleChange}
        ></input>
        {errors.password ? (
          <p className="errorPassword">Required field</p>
        ) : null}
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
