import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Button from "../components/common/Button";
import ToggleRole from "../components/common/ToggleRole";
import "./HomePage.css";

export default function HomePage() {
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("Login clicked as", role);
    // navigate to login page or open modal
    navigate("/login", { state: { role } });
  };

  const handleSignup = () => {
    console.log("Signup clicked as", role);
    // navigate to signup page or open modal
    navigate("/signup", { state: { role } });
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to VidyaVichar</h1>
      <ToggleRole role={role} setRole={setRole} />
      <div className="home-actions">
        <Button onClick={handleLogin}>Login</Button>
        <Button onClick={handleSignup}>Sign Up</Button>
      </div>
    </div>
  );
}
