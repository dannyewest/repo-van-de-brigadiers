import React, { use, useState } from "react";
import { Card, Form, Button, Alert, Navbar, Container, Nav } from "react-bootstrap";
import Shell from "../components/Shell";
import {  useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess(false);
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name field is required";
    if (!formData.email.trim()) newErrors.email = "Email field is required";
    else if (!validateEmail(formData.email)) newErrors.email = "Enter a valid email address.";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must contain at least 6 characters.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    console.log("✅ Registration submitted:", formData);
    //TODO stuur de formData de backend toe, hier komt de link naar DB
    setSuccess(true);
    setFormData({ name: "", email: "", password: "" });

    setTimeout(() => {
    navigate("/login");
    }, 2000);
  };

  return (
        <Shell> {/* navbar */}
      <section   className="bg-light d-flex align-items-center justify-content-center"
      style={{ minHeight: "calc(100vh - 125px)", }}>
        <Container>
          <Card style={{ width: "400px", margin: "0 auto", padding: "20px" }}>
            <Card.Body>
              <Card.Title className="mb-4 text-center fs-3">Registreren</Card.Title>

              {success && (
                <Alert variant="success" className="mb-3">
                  <p>You have successfully signed up!</p>
                  <p>(You are getting redirect to the login page)</p>
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button variant="dark" type="submit" className="w-100">
                  Register
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </section>
    </Shell>
  );
}