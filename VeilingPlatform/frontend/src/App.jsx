import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Container, Navbar } from "react-bootstrap";
import VeilingDashboard from "./pages/VeilingDashboard.jsx";
import logo from "./assets/logo.png";

function App() {
  return (
    <BrowserRouter>
      <Navbar style={{ backgroundColor: "#f2f2f2" }} variant="light" expand="lg">
        <Container>
          <Navbar.Brand href="/dashboard" className="d-flex align-items-center">
            <img
              src={logo}
              alt="bloemenveiling logo"
              height="60"
              className="me-2"
            />
            <span className="fw-bold">Bloemenveiling Dashboard</span>
          </Navbar.Brand>
        </Container>  
      </Navbar>

      {/* dashboard route */}
      <Routes>
        {/* Redirect to dashboard" */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<VeilingDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
