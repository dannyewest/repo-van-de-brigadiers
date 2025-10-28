import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function AanvoerderDashboard() {
  return (
    <Container className="py-5 text-center">
      <h2 className="mb-4">Aanvoerder dashboard</h2>
      <p className="mb-4 text-muted">Kies een actie om te starten</p>

      <div className="d-flex flex-column align-items-center gap-2" style={{ maxWidth: 360, margin: "0 auto" }}>
        <Button as={Link} to="/aanmaken" variant="dark" className="w-100">
          Product aanmaken
        </Button>
        <Button as={Link} to="/opveiling" variant="outline-dark" className="w-100">
          Producten op veiling
        </Button>
        <Button as={Link} to="/verkocht" variant="outline-secondary" className="w-100">
          Verkoop overzicht
        </Button>
      </div>
    </Container>
  );
}
