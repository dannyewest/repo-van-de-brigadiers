import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Container, Navbar } from "react-bootstrap";
import VeilingDashboard from "./pages/VeilingDashboard.jsx";
import logo from "./assets/logo.png";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";

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
    <BrowserRouter>
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
              <Button as={Link} to="/login" variant="outline-dark">
                Login
              </Button>
              <Button variant="outline-dark">Register</Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Routes / Body */}
      <Routes>
        <Route path="/" element={<Home message={message} loading={loading} />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
