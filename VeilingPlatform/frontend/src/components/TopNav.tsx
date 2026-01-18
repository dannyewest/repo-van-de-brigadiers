import { Container, Navbar, Nav, Button } from "react-bootstrap";
import logo from "@assets/logo.png";
import { useEffect, useState } from "react";
import { User } from "src/definitions/UserDefinition";
import { logout } from "@api/ApiProvider";

export default function TopNav() {
  const [user, setUser] = useState<User | null>(null);
  const userText = user ? `Logged in as ${user.name}` : "";

  // Check login state of user
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) { 
        await logout(token);
      }
    } catch (err) {
      console.error("Logout API call failed:", err);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      window.location.href = "/login";
    }
  };

  return (
    <Navbar expand="lg" className="mb-4 shadow-sm bg-light">
      <Container>
       <Nav.Link
        href={
          user
            ? user.role === "Customer"
              ? "/customer/auctions/dashboard"
              : user.role === "Auctioneer"
              ? "/auctions"
              : user.role === "Supplier"
              ? "/supplier"
              : "/"
            : "/"
        }
        title="Go to homepage"
      >
        <img
          src={logo}
          alt="Bloemen De Brigadier Logo"
          height="125"
          className="d-inline-block align-top"
        />
      </Nav.Link>

        <Navbar.Toggle aria-controls="basic-navbar-nav" title="Toggle navigation" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Alleen tonen per rol */}
            {user?.role === "Auctioneer" && (
              <Nav.Link href="/auctions"
                aria-label="Go to the auctioneer dashboard"
                title="Go to the auctioneer dashboard">
                Auctions</Nav.Link>
            )}
            {user?.role === "Supplier" && (
              <Nav.Link href="/supplier"
                aria-label="Go to supplier dashboard"
                title="Go to supplier dashboard"
                >Supplier</Nav.Link>
            )}
            </Nav>

          {!user ? (
            <div className="d-flex gap-2">
              <Button variant="outline-primary" 
                href="/login"
                title="Login to your account">
                Login
              </Button>
              <Button variant="primary" 
              href="/register" 
              title="Create an account">
                Register
              </Button>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted me-2">
                {userText}
              </span>
              <Button variant="danger"
                onClick={handleLogout}
                title="Logout from your account">
                Logout
              </Button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}