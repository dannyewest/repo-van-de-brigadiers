import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import Shell from "../components/Shell";
import { useNavigate } from "react-router-dom";
import { register } from "@api/ApiProvider";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterForm, string>>>({});
  const [success, setSuccess] = useState(false);
  const [apiMessage, setApiMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess(false);
    setApiMessage(""); // oude messages resetten
  };

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: Partial<Record<keyof RegisterForm, string>> = {};

    // Front-end validatie
    if (!formData.name.trim()) newErrors.name = "Name field is required";
    if (!formData.email.trim()) newErrors.email = "Email field is required";
    else if (!validateEmail(formData.email))
      newErrors.email = "Enter a valid email address.";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must contain at least 6 characters.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSuccess(false);

    try {
      const response = await register(formData);

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
      if (Array.isArray(data)) {
        const messages = data.map((err: any) => err.description).join(" | ");
        setApiMessage(messages);
      } else {
        setApiMessage(data.message || "Registration failed");
      }
      return;
    }

      setApiMessage(data.message || "Registration successful!");
      setSuccess(true);

    
      setFormData({ name: "", email: "", password: "" });
      
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      setApiMessage("Server not reachable. Try again later.");
    }
  };

  return (
    <Shell>
      <Card style={{ width: "400px", margin: "50px auto", padding: "20px" }}>
        <Card.Body>
          <Card.Title className="mb-4 text-center fs-3">Register</Card.Title>

          {/* Success Alert */}
          {success && (
            <Alert variant="success" className="mb-3">
              {apiMessage}
            </Alert>
          )}

          {/* General API error Alert */}
          {!success && apiMessage && (
            <Alert variant="danger" className="mb-3">
              {apiMessage}
            </Alert>
          )}

          <Form noValidate onSubmit={handleSubmit}>
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
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