import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import logo from "./assets/logo.png";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/login";
import { useEffect, useState } from "react";
import { Container, Navbar, Nav, Button, Spinner } from "react-bootstrap";
import { getMessage } from "./api/HelloWorldApi";

function App() {
  const [message, setMessage] = useState("Loading...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMessage()
      .then((data) => {
        setMessage(data.message);
        setLoading(false);
      })
      .catch(() => {
        setMessage("Error connecting to backend");
        setLoading(false);
      });
  }, []);

  const Home = ({ message, loading }) => (
    <section className="bg-light py-5 text-center">
      <Container>
        <h1 className="display-5 fw-bold mb-3">Backend Connection Test</h1>
        <div className="text-center">
          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <p className="fs-4">{message}</p>
          )}
        </div>
      </Container>
    </section>
  );

  return (
    <span></span>
  )
}

export default App;
