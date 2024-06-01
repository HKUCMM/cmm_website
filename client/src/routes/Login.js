import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";
import "../css/mainpage.css";

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("name") !== null) {
      navigate("/");
    }
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    emailEmpty: "",
    emailInvalid: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  const validateValues = () => {
    let errorPresent = false;
    if (email.length === 0) {
      setErrors((prevState) => {
        return {
          ...prevState,
          email: "Required field",
          emailEmpty: "Required field",
          emailInvalid: "",
        };
      });
      errorPresent = true;
    } else if (!email.match(isValidEmail)) {
      setErrors((prevState) => {
        return {
          ...prevState,
          email: "Invalid email address!",
          emailEmpty: "",
          emailInvalid: "Invalid email address!",
        };
      });
      errorPresent = true;
    } else {
      setErrors((prevState) => {
        return {
          ...prevState,
          email: "",
          emailEmpty: "",
          emailInvalid: "",
        };
      });
    }

    if (password.length === 0) {
      setErrors((prevState) => {
        return { ...prevState, password: "Required field" };
      });
      errorPresent = true;
    } else {
      setErrors((prevState) => {
        return { ...prevState, password: "" };
      });
    }

    return !errorPresent;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    const validValues = validateValues();
    if (!validValues) {
      setSubmitting(false);
    } else {
      handleAPI();
      setSubmitting(false);
    }
  };

  const handleAPI = () => {
    fetch(`${process.env.REACT_APP_API_URL}/login`, {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({
        loginEmail: email,
        loginPassword: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((data) => {
        const firstName = data.firstName;
        const isAdmin = data.isAdmin;
        localStorage.setItem("name", firstName);
        localStorage.setItem("isAdmin", isAdmin);
        setIsLoggedIn(true);
        navigate("/");
      })
      .catch((err) => {
        setErrors((prevState) => {
          return { ...prevState, password: "Login Info Invalid." };
        });
      });
  };

  return (
    <div className="banner login">
      <div className="leftBox">
        <span className="leftHeader">LOG IN</span>
        <span className="leftWelcome">Welcome to CMM!</span>
      </div>
      <form className="right" onSubmit={handleSubmit}>
        <h1 className="rightHeader">Welcome Back!</h1>
        <input
          className={errors.email === "" || submitting ? "input" : "falseInput"}
          type="text"
          name="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        ></input>
        {errors.emailEmpty === "" || submitting ? null : (
          <p className="errorEmail">Required field</p>
        )}
        {errors.emailInvalid === "" || submitting ? null : (
          <p className="errorEmail">Invalid email address!</p>
        )}
        <input
          className={
            errors.password === "" || submitting ? "input" : "falseInput"
          }
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></input>
        {errors.password === "" || submitting ? null : (
          <p className="errorPassword">{errors.password}</p>
        )}
        {/* <p className="forget">Forgot Password?</p> 링크로 바꿔야 함 */}
        <button type="submit" className="loginButton">
          Login
        </button>
        <p className="signup">Don't have an account? Sign Up</p>{" "}
      </form>
    </div>
  );
};

export default Login;
