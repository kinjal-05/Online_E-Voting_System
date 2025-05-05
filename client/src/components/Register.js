import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import './Register.css'; 

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("voter"); 
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://voteguard-backend.onrender.com/api/users/register", {
        email,
        password,
        role,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
   
      <div className="register-form-container">
        <h2 className="register-title">Register</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="input-field"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="input-field"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            className="input-field"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="voter">Voter</option>
            <option value="candidate">Candidate</option>
            
          </select>
          <button type="submit" className="submit-button">Register</button>
        </form>

      </div>
   
  );
};

export default Register;
