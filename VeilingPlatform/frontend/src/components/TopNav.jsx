import { Container, Navbar, Nav, Button, Spinner, NavbarToggle, NavDropdown } from "react-bootstrap";
import logo from "../assets/logo.png";

export default function TopNav() {
  return (
    <Navbar expand="lg">
      <Container>
          <Nav.Link href="/">
            <img
              src={logo}
              alt="bloemenveiling logo"
              height="125"
              className="d-inline-block align-top"
            />
          </Nav.Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/auctions">Auctions</Nav.Link>
              <Nav.Link href="#home">Home</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
}