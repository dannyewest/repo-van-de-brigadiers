import React, { useState, useEffect } from "react";
import users from "../api/user.json";
import Shell from "../components/Shell";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // als iemand ingelogd is door naar dashboard
    try {
      const stored = localStorage.getItem("user");
      if (stored) navigate("/dashboard");
    } catch {}
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard"); // direct door naar dashboard
    } else {
      setError("Onjuiste e-mail of wachtwoord");
    }
  };

  return (
    <Shell> {/* Navbar */}
      <div className="d-flex align-items-center justify-content-center mt-5">
        <div className="card shadow-sm" style={{ width: "100%", maxWidth: 420 }}>
          <div className="card-body p-4">
            <h2 className="card-title text-center mb-3">Login</h2>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-control"
                  placeholder="name@example.com"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-control"
                  placeholder="Password"
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Log in
              </button>
            </form>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default Login;
