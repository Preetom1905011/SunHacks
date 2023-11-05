import React from "react";
import "../styles/login.scss";

export default function Login() {

  const handleOAuth = async () => {
    console.log("Sent request")
    window.location.href = 'http://learngit.courses/auth/github';
  }

  return (
    <div className="login">
      <header className="header">
        <button className="login-button top-right" onClick={handleOAuth}>Login</button>
      </header>
      <h1>Welcome to GitLearning</h1>
      <main className="main-content">
        <button className="login-button login-button-bottom" onClick={handleOAuth}>Login</button>
      </main>
    </div>
  );
}
