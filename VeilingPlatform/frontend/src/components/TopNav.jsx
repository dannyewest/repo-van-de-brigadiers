import { Container, Navbar, Nav, Button, Spinner, NavbarToggle, NavDropdown } from "react-bootstrap";
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";

export default function TopNav() {
  const [user, setUser] = useState(null);

  // Check login state of user
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <Navbar expand="lg" className="mb-4 shadow-sm bg-light">
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
            <Nav.Link href="/supplier">Supplier</Nav.Link>
            <Nav.Link href="/product/1">Product</Nav.Link>
          </Nav>

          {!user ? (
            <div className="d-flex gap-2">
              <Button variant="outline-dark" href="/login">
                Login
              </Button>
              <Button variant="dark" href="/register">
                Register
              </Button>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted me-2">
                Ingelogd als <strong>{user.name}</strong>
              </span>
              <Button variant="outline-danger" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}