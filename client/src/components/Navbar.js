import { Navbar, Container, Nav } from "react-bootstrap";
import "./Navbar.css";

function Mynav() {
  let navItem = ["ABOUT", "PROJECT", "NOTICE", "CONTACT US", "LOG IN"];

  return (
    <>
      <Navbar style={{ backgroundColor: "#1D2528" }} data-bs-theme="dark">
        <Container fluid style={{ marginLeft: "60px", marginRight: "60px" }}>
          <Navbar.Brand href="#home">
            <img
              src={process.env.PUBLIC_URL + "/CMM_LOGO.png"}
              alt="CMM Logo"
              width="80px"
            />
          </Navbar.Brand>
          <Nav>
            {navItem.map(function (a) {
              return (
                <Nav.Link
                  href={`#${a}`}
                  style={{
                    paddingRight: "30px",
                    fontSize: "20px",
                  }}
                >
                  <span className="navigation-link">{`${a}`}</span>
                </Nav.Link>
              );
            })}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Mynav;