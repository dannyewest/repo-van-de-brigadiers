import { useEffect, useState } from "react";
import { Container, Navbar, Nav, Button, Spinner } from "react-bootstrap";
import { getMessage } from "./api/HelloWorldApi";
import logo from "./assets/logo.png";

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

  return (
    <>
      {/* Header */}
      <Navbar bg="lightgray" variant="dark" expand="lg">
        <Container>
          <img
            src={logo}
            alt="bloemenveiling logo"
            height="125"
            className="d-inline-block align-top"
            href="#"
          />
          {/* <Navbar.Brand href="#">Veiling Platform</Navbar.Brand> */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto"></Nav>
            <div className="d-flex gap-2">
              <Button variant="outline-dark">Login</Button>
              <Button variant="outline-dark">Register</Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Body */}
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
    </>
  );
}

export default App;
