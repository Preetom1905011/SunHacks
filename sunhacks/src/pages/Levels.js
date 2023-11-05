import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/levels.scss";

export default function Levels() {
  const [userName, setUserName] = useState(null);

  // State to manage the expansion of sections
  const [easyExpanded, setEasyExpanded] = useState(false);
  const [intermediateExpanded, setIntermediateExpanded] = useState(false);
  const [hardExpanded, setHardExpanded] = useState(false);
  const [levels, setLevels] = useState([1,2,3]);

  useEffect(() => {
    // Fetch the userName from the session
    const urlParams = new URLSearchParams(window.location.search);
    setUserName(urlParams.get('username'))

    const fetchLevels = async () => {
      await fetch('https://learngit.courses/levels/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        console.log("==>", response); // You may need to use .text() or another method depending on the response content.
      })
      .then(data => {
        // Handle the data from the response here
        console.log("=========>",data);
      })
      .catch(error => {
        // Handle errors here
        console.error('Fetch error:', error);
      });
    }
    fetchLevels();
  }, []);

  // Function to handle expanding/collapsing a section
  const toggleExpansion = (section) => {
    switch (section) {
      case "easy":
        setEasyExpanded(!easyExpanded);
        setIntermediateExpanded(false);
        setHardExpanded(false);
        break;
      case "intermediate":
        setEasyExpanded(false);
        setIntermediateExpanded(!intermediateExpanded);
        setHardExpanded(false);
        break;
      case "hard":
        setEasyExpanded(false);
        setIntermediateExpanded(false);
        setHardExpanded(!hardExpanded);
        break;
      default:
        break;
    }
  };
  return (
    ( userName?
    <div className="levels">
      <header className="header">
        <Link className="login-button top-right links" to="/">
        {userName} Log out
        </Link>
      </header>
      <h1>Welcome to GitLearning</h1>
      <main className="main-content">
        <button
          className={`level-button ${easyExpanded ? "expanded" : ""}`}
          onClick={() => toggleExpansion("easy")}
        >
          Easy
          <i className="arrow-icon">▼</i>
        </button>
        {easyExpanded && (
          <div className="level-list">
            {levels.map((level) => (
              <Link
                key={level}
                to={"/codespace"}
                state={{ id: level, diff: "Easy", userName: userName}}
                className="level links"
              >
                Level {level}
              </Link>
            ))}
          </div>
        )}

        <button
          className={`level-button ${intermediateExpanded ? "expanded" : ""}`}
          onClick={() => toggleExpansion("intermediate")}
        >
          Intermediate
          <i className="arrow-icon">▼</i>
        </button>
        {intermediateExpanded && (
          <div className="level-list">
            {levels.map((level) => (
              <Link
                key={level}
                to={"/codespace"}
                state={{ id: level, diff: "Intermediate", userName: userName }}
                className="level links"
              >
                Level {level}
              </Link>
            ))}
          </div>
        )}

        <button
          className={`level-button ${hardExpanded ? "expanded" : ""}`}
          onClick={() => toggleExpansion("hard")}
        >
          Hard
          <i className="arrow-icon">▼</i>
        </button>
        {hardExpanded && (
          <div className="level-list">
            {levels.map((level) => (
              <Link
                key={level}
                to={"/codespace"}
                state={{ id: level, diff: "Hard", userName: userName}}
                className="level links"
              >
                Level {level}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
    : <div className="error">Session Expired</div>
    )
  );
}
