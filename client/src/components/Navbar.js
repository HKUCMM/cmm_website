import { useEffect, useState } from "react";
import {
  Navbar as NavbarBS,
  Container as ContainerBS,
  Nav as NavBS,
  NavDropdown as NavDropdownBS,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function NavBar({ isLoggedIn, setIsLoggedIn }) {
  const navBarItems = [
    ["PROJECTS", "projects"],
    ["NOTICE", "notice"],
    ["CONTACT US", "contacts"],
  ]; // navBarItems[0]: name, navBarItems[1]: link
  const navigate = useNavigate();

  const handleNavClick = (path) => {
    navigate(`${path}`);
  };

  const handleLogout = () => {
    fetch(`${process.env.REACT_APP_API_URL}/logout`, {
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 200) {
          setIsLoggedIn(false);
          localStorage.removeItem("name");
          localStorage.removeItem("isAdmin");
          navigate("/");
        }
      })
      .catch();
  };

  return (
    <>
      <NavbarBS style={{ background: "#1D2528" }} data-bs-theme="dark">
        <ContainerBS fluid style={{ marginLeft: "60px", marginRight: "60px" }}>
          <NavbarBS.Brand onClick={() => handleNavClick("")} type="button">
            <img
              src={process.env.PUBLIC_URL + "/CMM_LOGO.png"}
              alt="CMM Logo"
              width="80px"
            />
          </NavbarBS.Brand>
          <NavBS variant="underline" className="ms-auto">
            {navBarItems.map((navBarItem) => {
              const itemName = navBarItem[0];
              const itemLink = navBarItem[1];
              return (
                <NavBS.Link
                  onClick={() => handleNavClick(itemLink)}
                  style={{
                    margin: "0px 10px",
                    fontSize: "20px",
                  }}
                >
                  <span>{itemName}</span>
                </NavBS.Link>
              );
            })}
            {isLoggedIn ? (
              <NavDropdownBS
                title={`Hi ${localStorage.getItem("name")}`}
                style={{ margin: "0px 10px", fontSize: "20px" }}
              >
                <NavDropdownBS.Item href="">PROFILE</NavDropdownBS.Item>
                <NavDropdownBS.Item onClick={handleLogout}>
                  LOGOUT
                </NavDropdownBS.Item>
              </NavDropdownBS>
            ) : (
              <NavBS.Link
                onClick={() => handleNavClick("login")}
                style={{ margin: "0px 10px", fontSize: "20px" }}
              >
                LOGIN
              </NavBS.Link>
            )}
          </NavBS>
        </ContainerBS>
      </NavbarBS>
    </>
  );
}

export default NavBar;
