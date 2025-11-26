import React, { useState, useEffect } from "react";
import Shell from "../components/Shell";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, Alert } from "react-bootstrap";


export async function fetchWithToken(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token"); 
  }

  const res = await fetch(url, {
    ...options,
    headers: { 
      ...(options.headers || {}),
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    }
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error("Unauthorized");
  }

  return res;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) navigate("/");
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:5160/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

     const userWithRole = {
     ...data.user,
    role: data.user.role ?? data.user.discriminator ?? "Customer"
    };


  localStorage.setItem("user", JSON.stringify(userWithRole));


  localStorage.setItem("role", userWithRole.role);


  localStorage.setItem("token", data.accessToken);

      setApiMessage(data.message);
      setSuccess(true);
      

      setTimeout(() => {
      switch (userWithRole.role) {
        case "Customer":
          navigate("/customer/auctions/dashboard");
          break;
        case "Auctioneer":
          navigate("/auctions");
          break;
        case "Supplier":
          navigate("/supplier");
          break;
        default:
          navigate("/"); // fallback
      }
    }, 1500);
    } catch (err) {
      console.error(err);
      setError("Server not available, try another moment.");
    }
  };

  return (
    <Shell> {/* Navbar */}
      <div className="d-flex align-items-center justify-content-center mt-5">
        <Card className="shadow-sm" style={{ width: "100%", maxWidth: 420 }}>
          <Card.Body className="p-4">
            <Card.Title className="text-center mb-3">Login</Card.Title>

            {success && (
              <Alert variant="success" className="mb-3">
                {apiMessage}
              </Alert>
            )}

            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
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
