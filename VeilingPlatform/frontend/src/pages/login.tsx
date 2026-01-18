import React, { useState, useEffect } from "react";
import Shell from "../components/Shell";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, Alert } from "react-bootstrap";
import { login } from "@api/ApiProvider";


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
      const response = await login(email, password);

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
    <h1 className=" text-center">Login-page</h1>
      <div className="d-flex align-items-center justify-content-center mt-5">
        <Card className="shadow-sm" style={{ width: "100%", maxWidth: 420 }}>
          <Card.Body className="p-4">

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
                  title="Enter your email-address"
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
                  title="Enter your password"
                />
              </Form.Group>

              <Button type="submit" 
                variant="primary" 
                className="w-100"
                title="Log in to your account">
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
