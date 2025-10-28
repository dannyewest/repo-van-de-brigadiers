import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";

export default function Register() {
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

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Naam is verplicht";
    if (!formData.email.trim()) newErrors.email = "E-mailadres is verplicht";
    else if (!validateEmail(formData.email)) newErrors.email = "Voer een geldig e-mailadres in";
    if (!formData.password.trim()) newErrors.password = "Wachtwoord is verplicht";
    else if (formData.password.length < 6) newErrors.password = "Wachtwoord moet minimaal 6 tekens bevatten";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    console.log("✅ Formulier verzonden:", formData);
    setSuccess(true);
    setFormData({ name: "", email: "", password: "" });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      if (index + 1 < form.elements.length) {
        form.elements[index + 1].focus();
      } else {
        form.elements[index].form.requestSubmit();
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card style={{ width: "400px", padding: "20px" }}>
        <Card.Body>
          <Card.Title className="mb-4 text-center">Registreer jezelf</Card.Title>
          {success && (
            <Alert variant="success" className="mb-3">
              <p>Je bent succesvol geregistreerd!</p>
              <p>(Later voegen we een redirect naar de login pagina toe)</p>
            </Alert>
          )}
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Naam</Form.Label>
              <Form.Control
                type="text"
                placeholder="Naam"
                name="name"
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
                onKeyDown={handleKeyDown}
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
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
                onKeyDown={handleKeyDown}
              />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="password">
              <Form.Label>Wachtwoord</Form.Label>
              <Form.Control
                type="password"
                placeholder="Wachtwoord"
                name="password"
                value={formData.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
                onKeyDown={handleKeyDown}
              />
              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
            </Form.Group>

            <Button variant="dark" type="submit" className="w-100">Registreren</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}