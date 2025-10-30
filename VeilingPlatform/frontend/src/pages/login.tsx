import React, { useState, useEffect } from "react";
import users from "../api/user.json";
import Shell from "../components/Shell";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form } from "react-bootstrap";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    try {
      const stored = localStorage.getItem("user");
      if (stored) navigate("/");
    } catch {}
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } else {
      setError("Onjuiste e-mail of wachtwoord");
    }
  };

  return (
    <Shell> {/* Navbar */}
      <div className="d-flex align-items-center justify-content-center mt-5">
        <Card className="shadow-sm" style={{ width: "100%", maxWidth: 420 }}>
          <Card.Body className="p-4">
            <Card.Title className="text-center mb-3">Login</Card.Title>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="email">E-mail</Form.Label>
                <Form.Control
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label htmlFor="password">Password</Form.Label>
                <Form.Control
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-control"
                  placeholder="Password"
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100">
                Log in
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Shell>
  );
};

export default Login;
