import { Container, Navbar, Nav, Button, Spinner, NavbarToggle, NavDropdown } from "react-bootstrap";
import logo from "../assets/logo.png";

export default function TopNav() {
  return (
    <Navbar expand="lg" className="mb-4 shadow-sm">
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
            <Nav.Link href="/supllier">Supplier</Nav.Link>
            <Nav.Link href="/product">Product</Nav.Link>
          </Nav>

          <div className="d-flex gap-2">
            <Button variant="outline-dark" href="/login">
              Login
            </Button>
            <Button variant="dark" href="/register">
              Register
            </Button>
          </div>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}