import React, { useState, useEffect } from "react";
import users from "../api/user.json";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setLoggedInUser(JSON.parse(stored));
    } catch { }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      setLoggedInUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    } else setError("Onjuiste e-mail of wachtwoord");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLoggedInUser(null);
  };

  if (loggedInUser)
    return (
      <div className="d-flex align-items-center justify-content-center pt-5">
        <div className="card shadow-sm" style={{ width: "100%", maxWidth: 420 }}>
          <div className="card-body text-center">
            <h2 className="card-title">Welkom, {loggedInUser.name}!</h2>
            <p className="text-muted">Ingelogd als {loggedInUser.email}</p>
            <button className="btn btn-outline-danger mt-3" onClick={handleLogout}>
              Uitloggen
            </button>
          </div>
        </div>
      </div>
    );

  return (
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
                placeholder="naam@voorbeeld.com"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Wachtwoord
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control"
                placeholder="Wachtwoord"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Inloggen
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;