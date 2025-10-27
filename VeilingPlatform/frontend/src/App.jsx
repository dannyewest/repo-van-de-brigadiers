import { useEffect, useState } from "react";
import { Container, Navbar, Nav, Button, Spinner } from "react-bootstrap";
import { getMessage } from "./api/HelloWorldApi";
import logo from "./assets/logo.png";
import product from "./pages/product.jsx";

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

      {product()} 
    </>
  );
}

export default App;
