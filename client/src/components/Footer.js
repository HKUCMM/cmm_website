import styled from "styled-components";

//배경색 그레이20 (임의)
const FooterBox = styled.div`
  background: #747474;
`;

const TopBox = styled.div`
  height: 312px;
  top: 832px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const ListBox = styled.div`
  font-size: 18px;
  margin-top: 53px;
  margin-bottom: 54px;
  display: flex;
  flex-direction: column;
  height: 205px;
`;

const ContactBox = styled.div`
  width: 325px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

//grey 임의
const ListTitle = styled.span`
  color: #bdbdbd;
  padding-bottom: 85px;
`;

const ListItem = styled.dl`
  list-style-type: none;
  color: white;
  line-height: 30px;
`;

const StyledLink = styled.a`
  text-decoration: none;
  color: inherit;
`;

const Copyright = styled.div`
  height: 81px;
  color: #ffffff;
  font-family: Titillium Web;
  font-size: 16px;
  font-weight: 275;
  line-height: 24px;
  letter-spacing: 0em;
  text-align: center;
  border-top: 1px solid silver;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Footer = () => {
  return (
    <FooterBox>
      <TopBox>
        <ListBox>
          <ListTitle>CONTACT</ListTitle>
          <ContactBox>
            <ListItem style={{ color: "#bdbdbd" }}>
              <li>ADDRESS</li>
              <li>E-MAIL</li>
              <li>WEBSITE</li>
            </ListItem>
            <ListItem>
              <li>Pok Fu Lam, Hong Kong</li>
              <li>hkucmm@gmail.com</li>
              <li>www.cmm.com</li>
            </ListItem>
          </ContactBox>
        </ListBox>
        <ListBox>
          <ListTitle>SOCIAL</ListTitle>
          <ListItem>
            <li>
              <StyledLink
                href="https://www.linkedin.com/company/cmmhku/"
                target="_blank"
              >
                LINKEDIN
              </StyledLink>
            </li>
            <li>
              <StyledLink
                href="https://www.instagram.com/hku.cmm/"
                target="_blank"
              >
                INSTAGRAM
              </StyledLink>
            </li>
          </ListItem>
        </ListBox>
      </TopBox>
      <Copyright>Copyright © 2024 CMM All rights reserved.</Copyright>
    </FooterBox>
  );
};

export default Footer;
