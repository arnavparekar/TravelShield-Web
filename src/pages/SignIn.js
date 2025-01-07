import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import "./SignIn.css";

function SignIn() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // For registration
  const [error, setError] = useState("");
  const auth = getAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError("Invalid email or password. Please try again.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert(`Welcome, ${name}! Your account has been created.`);
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="signin-container">
      <h1>{isRegistering ? "Register" : "Sign In"}</h1>
      <form onSubmit={isRegistering ? handleRegister : handleSignIn}>
        {isRegistering && (
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="auth-btn">
          {isRegistering ? "Register" : "Sign In"}
        </button>
      </form>
      <p>
        {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
        <span
          onClick={() => setIsRegistering(!isRegistering)}
          className="toggle-link"
        >
          {isRegistering ? "Sign In" : "Register"}
        </span>
      </p>
    </div>
  );
}

export default SignIn;
