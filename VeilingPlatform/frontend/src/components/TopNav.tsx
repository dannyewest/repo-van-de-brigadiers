import { Container, Navbar, Nav, Button } from "react-bootstrap";
import logo from "@assets/logo.png";
import { useEffect, useState } from "react";
import { User } from "src/definitions/UserDefinition";

export default function TopNav() {
  const [user, setUser] = useState<User | null>(null);

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
          </Nav>

          {!user ? (
            <div className="d-flex gap-2">
              <Button variant="outline-primary" href="/login">
                Login
              </Button>
              <Button variant="primary" href="/register">
                Register
              </Button>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted me-2">
                Logged in as <strong>{user.name}</strong>
              </span>
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}