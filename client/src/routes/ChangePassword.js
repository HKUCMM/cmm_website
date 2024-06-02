import { useEffect, useRef, useState } from "react";
import { useFetcher, useNavigate } from "react-router-dom";

import "../css/mainpage.css";
import "../css/pw-change.css";

const ChangePassword = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/session`, {
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (!data.isLoggedIn) {
          navigate("/");
        }
      })
      .catch((err) => {});
  }, []);

  const [currentPassword, setCurrentPassword] = useState("");
  const [currentPasswordErr, setCurrentPasswordErr] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordErr, setNewPasswordErr] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordErr, setConfirmPasswordErr] = useState("");
  const [loading, setLoading] = useState("");

  const pageRendered = useRef({
    effect1: false,
    effect2: false,
    effect3: false,
  });

  useEffect(() => {
    if (pageRendered.effect1 === true) {
      if (currentPassword === "") {
        setCurrentPasswordErr("Field required.");
      } else {
        setCurrentPasswordErr("");
      }
    }
    pageRendered.effect1 = true;
  }, [currentPassword]);

  useEffect(() => {
    if (pageRendered.effect2 === true) {
      if (newPassword === "") {
        setNewPasswordErr("Field required.");
      } else {
        setNewPasswordErr("");
      }
    }
    pageRendered.effect2 = true;
  }, [newPassword]);

  useEffect(() => {
    if (pageRendered.effect3 === true) {
      if (confirmPassword === "") {
        setConfirmPasswordErr("Field required.");
      } else if (confirmPassword !== newPassword) {
        setConfirmPasswordErr("Passwords do not match.");
      } else {
        setConfirmPasswordErr("");
      }
    }
    pageRendered.effect3 = true;
  }, [confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentPasswordErr || newPasswordErr || confirmPasswordErr) {
      return;
    }
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/changepw`, {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({
        oldPassword: currentPassword,
        newPassword: confirmPassword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setLoading(false);
        if (res.status === 401) {
          alert("Incorrect Password", "Failed to change password.");
        } else {
          setIsLoggedIn(false);
          fetch(`${process.env.REACT_APP_API_URL}/logout`, {
            credentials: "include",
          })
            .then((res) => {
              if (res.status === 200) {
                localStorage.removeItem("name");
                localStorage.removeItem("isAdmin");
                navigate("/login");
              }
            })
            .catch();
          alert(
            "Success!",
            "Password successfully changed, redirecting to login page.",
            [
              {
                text: "OK",
                onPress: () => {
                  navigate("/login");
                },
              },
            ]
          );
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <div className="banner login pw-change">
      <form className="pw-change-form" onSubmit={handleSubmit}>
        <h1 className="rightHeader">Change Password</h1>
        <div className="input-box">
          <input
            type="text"
            name="currentPW"
            placeholder="Enter Current Password"
            className={
              "pw-change-input " +
              (currentPasswordErr ? "pw-change-input-error" : null)
            }
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
            }}
          />
          {currentPasswordErr ? (
            <p className="pw-change-error">{currentPasswordErr}</p>
          ) : null}
        </div>
        <div className="input-box">
          <input
            type="password"
            name="newPW"
            placeholder="Enter New Password"
            className={
              "pw-change-input " +
              (newPasswordErr ? "pw-change-input-error" : null)
            }
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
          />
          {newPasswordErr ? (
            <p className="pw-change-error">{newPasswordErr}</p>
          ) : null}
        </div>
        <div className="input-box">
          <input
            type="password"
            name="reenterNewPW"
            placeholder="Confirm New Password"
            className={
              "pw-change-input " +
              (confirmPasswordErr ? "pw-change-input-error" : null)
            }
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
          {confirmPasswordErr ? (
            <p className="pw-change-error">{confirmPasswordErr}</p>
          ) : null}
        </div>
        <button
          type="submit"
          className="pw-change-button"
          style={{ visibility: loading ? "hidden" : "visible" }}
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
