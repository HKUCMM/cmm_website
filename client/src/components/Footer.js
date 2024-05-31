import "../css/footer.css";

const Footer = () => {
  return (
    <div className="footer-box">
      <div className="top-box">
        <div className="list-box">
          <span className="list-title">CONTACTS</span>
          <div className="contact-box">
            <dl className="list-item" style={{ color: "#bdbdbd" }}>
              <li>ADDRESS</li>
              <li>E-MAIL</li>
              <li>WEBSITE</li>
            </dl>
            <dl className="list-item">
              <li>Pok Fu Lam, Hong Kong</li>
              <li>hkucmm@gmail.com</li>
              <li>www.cmm.com</li>
            </dl>
          </div>
        </div>
        <div className="list-box">
          <span className="list-title">SOCIALS</span>
          <dl className="list-item">
            <li>
              <a
                className="styled-link"
                href="https://www.linkedin.com/company/cmmhku/"
                target="_blank"
              >
                LINKEDIN
              </a>
            </li>
            <li>
              <a
                className="styled-link"
                href="https://www.instagram.com/hku.cmm/"
                target="_blank"
              >
                INSTAGRAM
              </a>
            </li>
          </dl>
        </div>
      </div>
      <div className="copyright">Copyright © 2024 CMM All rights reserved.</div>
    </div>
  );
};

export default Footer;
