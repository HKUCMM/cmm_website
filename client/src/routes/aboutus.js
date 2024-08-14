import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/aboutus.css";

function AboutUs() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/session`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.isLoggedIn) {
          navigate("/");
        } else {
          setLoading(false);
        }
      })
      .catch((err) => console.error(err));
  }, [navigate]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const teams = [
    { 
      name: "Mobile App Development", 
      streams: ["Frontend", "Backend", "Fullstack"],
      description: "Focuses on creating innovative mobile applications for iOS and Android platforms, covering the entire development process from UI/UX design to backend integration."
    },
    { 
      name: "Web App Development", 
      streams: ["Frontend", "Backend", "Fullstack"],
      description: "Develops responsive and dynamic web applications using modern frameworks and technologies, ensuring seamless user experiences across devices."
    },
    { 
      name: "Machine Learning / Deep Learning",
      description: "Explores cutting-edge ML and DL techniques to solve complex problems, from data analysis to predictive modeling and computer vision."
    },
    { 
      name: "Infra",
      description: "Manages and optimizes the underlying systems and networks that support our projects, ensuring scalability, security, and reliability."
    },
    { 
      name: "AI",
      description: "Investigates and implements artificial intelligence solutions, including natural language processing, expert systems, and autonomous agents."
    }
  ];

  return (
    <div className="aboutUsBackground">
      <div className="about-us-container">
        <section className="about-us-section">
          <h1 className="section-title">CMM</h1>
          <div className="section-content">
            <p>
              CMM is a student-led software development group composed of Korean students at the University of Hong Kong. 
              Our approach is project-based, with teams either collaborating or leading their own projects on a yearly or semesterly basis. 
              At the end of each period, teams showcase their accomplishments through presentations and demonstrations.
            </p>
            <p>
              Our members are involved in all aspects of the software development life cycle, including design, development, 
              building, testing, deployment, and maintenance. This hands-on experience provides invaluable real-world skills 
              and prepares our members for successful careers in the tech industry.
            </p>
          </div>
        </section>

        <section className="about-us-section">
          <h2 className="section-title">Our Teams</h2>
          <div className="team-grid">
            {teams.map((team, index) => (
              <div key={index} className="team-card">
                <h3 className="team-name">{team.name}</h3>
                <p className="team-description">{team.description}</p>
                {team.streams && (
                  <div className="team-streams">
                    <h4>Streams:</h4>
                    <ul>
                      {team.streams.map((stream, streamIndex) => (
                        <li key={streamIndex}>{stream}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="about-us-section">
          <h2 className="section-title">Our Process</h2>
          <div className="process-structure">
            <ul>
              <li>Project Initiation
                <ul>
                  <li>Team Formation</li>
                  <li>Project Planning</li>
                </ul>
              </li>
              <li>Development Cycle
                <ul>
                  <li>Design</li>
                  <li>Development</li>
                  <li>Testing</li>
                  <li>Deployment</li>
                </ul>
              </li>
              <li>Project Conclusion
                <ul>
                  <li>Maintenance</li>
                  <li>Final Presentation</li>
                </ul>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutUs;