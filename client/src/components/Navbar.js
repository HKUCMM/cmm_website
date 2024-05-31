import { Navbar as NavbarBS, Container as ContainerBS, Nav as NavBS } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navBarItems = [["PROJECTS", "projects"], ["NOTICE", "notice"], ["CONTACT US", "contacts"], ["LOG IN", "login"]]; // navBarItems[0]: name, navBarItems[1]: link

  const navigate = useNavigate();
  const handleNavClick = (path) => {
    navigate(`${path}`);
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
          </NavBS>
        </ContainerBS>
      </NavbarBS>
    </>
  );
}

export default NavBar;
