import React, { useState, useEffect } from "react";
import "./Login.css";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";  
import { auth } from "../../firebase";  
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setError(true);
    }
  };


  return (
    <div className="login-container">
      <h1 className="login-title">
        <img src="/logo.jpg" alt="Logo" className="login-logo" /> Nidi Rentals
      </h1>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          className="login-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="login-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button">Login</button>
        {error && <span className="login-error">Wrong email or password!</span>}
      </form>
    </div>
  );
};

export default Login;
