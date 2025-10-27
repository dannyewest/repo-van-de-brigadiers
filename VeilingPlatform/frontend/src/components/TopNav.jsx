import { Container, Navbar, Nav, Button, Spinner, NavbarToggle, NavDropdown } from "react-bootstrap";
import logo from "../assets/logo.png";
import { MenuIcon } from "lucide-react";

export default function TopNav() {
  return (
    <Navbar bg="lightgray" variant="dark" expand="lg">
        <Container>
          <img
            src={logo}
            alt="bloemenveiling logo"
            height="125"
            className="d-inline-block align-top"
            href="#"
          />
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#auction">Home</Nav.Link>
              <Nav.Link href="#home">Home</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
}