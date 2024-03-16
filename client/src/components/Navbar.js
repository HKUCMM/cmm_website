import { Navbar, Container, Nav } from "react-bootstrap";

function Mynav() {
  let navItem = ["ABOUT", "PROJECT", "NOTICE", "CONTACT US", "LOG IN"];

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">
            <img src="/CMM_LOGO.png" alt="CMM Logo" width="80px" />
          </Navbar.Brand>
          <Nav className="ms-auto">
            {navItem.map(function (a) {
              return (
                <Nav.Link
                  href={`#${a}`}
                  className="nav-item"
                  style={{
                    paddingRight: "30px",
                    fontSize: "20px",
                  }}
                >
                  {`${a}`}
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
