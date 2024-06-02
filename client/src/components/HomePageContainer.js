import React from "react";
import "../css/mainpage.css";

const HomePageContainer = () => {
  return (
    <div>
      <div className="banner" id="mainpage-title">
        <div className="banner-content">
          <h1>CMM</h1>
          <h2>THE UNIVERSITY OF HONG KONG</h2>
          <h2>KOREAN CODING SOCIETY</h2>
        </div>
      </div>
      <div className="banner darker-banner" id="mainpage-about">
        <div className="banner-content about-content">
          <h1>About Us</h1>
          <span>
            <p>
              Our coding society is a community of passionate programmers,
              developers, and technology enthusiasts. We come together to learn,
              share knowledge, and collaborate on projects that push the
              boundaries of what's possible with code.
            </p>
            <p>
              The society aims to gather passionate software engineering and
              programming students to participate in coding projects, join
              educational sessions, and connect with various mentors.
            </p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomePageContainer;
