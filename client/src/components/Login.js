import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; 
import { useNavigate } from "react-router-dom"; 
import './Login.css'; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      const response = await axios.post("https://voteguard-backend.onrender.com/api/users/login", {
        email,
        password,
      });

      const { token, user } = response.data;
      login(user, token); 

    
      if (user.role === "candidate") {
        navigate("/candidate-panel"); 
      } else if (user.role === "admin") {
        navigate("/admin-panel"); 
      } else if (user.role === "voter") {
        navigate("/voter-dashboard"); 
      } else {
        navigate("/dashboard"); 
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
