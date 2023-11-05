import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/levels.scss";

export default function Levels() {
  const [userName, setUserName] = useState(null);

  // State to manage the expansion of sections
  const [easyExpanded, setEasyExpanded] = useState(false);
  const [intermediateExpanded, setIntermediateExpanded] = useState(false);
  const [hardExpanded, setHardExpanded] = useState(false);
  const levels = [1, 2, 3];

  // useEffect(() => {
  //   // Fetch the userName from the session
  //   console.log("Test")
  //   const fetchUserName = async () => {
  //     await fetch("/get-user-name", { credentials: "include" })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         setUserName(data.userName);
  //       })
  //       .catch((error) => {
  //         setUserName(null);
  //         console.error(error);
  //       });
  //   };
  //   fetchUserName();
  // }, []);

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
    <div className="levels">
      <header className="header">
        <Link className="login-button top-right links" to="/login">
          Log out
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
                state={{ id: level, diff: "Easy" }}
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
                state={{ id: level, diff: "Intermediate" }}
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
                state={{ id: level, diff: "Hard" }}
                className="level links"
              >
                Level {level}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
