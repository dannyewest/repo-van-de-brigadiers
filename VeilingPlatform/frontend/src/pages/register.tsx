import React, { use, useState } from "react";
import { Card, Form, Button, Alert, Navbar, Container, Nav } from "react-bootstrap";
import Shell from "../components/Shell";
import {  data, useNavigate } from "react-router-dom";
import { User } from "src/definitions/UserDefinition";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<User>({
    id: 0,
    name: "",
    email: "",
    passwordHash: "",
  });

  const [errors, setErrors] = useState({} as Partial<Record<keyof User, string>>);
  const [success, setSuccess] = useState(false);
  const [apiMessage, setApiMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess(false);
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const newErrors: Partial<Record<keyof User, string>> = {};

  if (!formData.name.trim()) newErrors.name = "Name field is required";
  if (!formData.email.trim()) newErrors.email = "Email field is required";
  else if (!validateEmail(formData.email)) newErrors.email = "Enter a valid email address.";
  if (!formData.passwordHash.trim()) newErrors.passwordHash = "Password is required";
  else if (formData.passwordHash.length < 6)
    newErrors.passwordHash = "Password must contain at least 6 characters.";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({});
  setSuccess(false);

  try {
    const response = await fetch("http://localhost:5160/api/register/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.passwordHash,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setErrors({ email: data.message });
      return;
    }

    setApiMessage(data.message)
    setSuccess(true);
    setFormData({ id: 0, name: "", email: "", passwordHash: "" });

    setTimeout(() => navigate("/login"), 2000);
  } catch (err) {
    console.error(err);
    setErrors({ email: "Server not reachable. Try again later." });
  }
};

  return (
        <Shell>
          <Card style={{ width: "400px", margin: "0 auto", padding: "20px" }}>
            <Card.Body>
              <Card.Title className="mb-4 text-center fs-3">Registrer</Card.Title>

              {success && (
                <Alert variant="success" className="mb-3">
                <p>{apiMessage}</p>
                </Alert>
              )}

              {errors.email && !success && (
              <Alert variant="danger" className="mb-3">
              {errors.email}
              </Alert>
             )}

              <Form noValidate onSubmit={handleSubmit} className="text-start">
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="passwordHash"
                    value={formData.passwordHash}
                    onChange={handleChange}
                    isInvalid={!!errors.passwordHash}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.passwordHash}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Register
                </Button>
              </Form>
            </Card.Body>
          </Card>
    </Shell>
  );
}

function setApiMessage(message: any) {
  throw new Error("Function not implemented.");
}
