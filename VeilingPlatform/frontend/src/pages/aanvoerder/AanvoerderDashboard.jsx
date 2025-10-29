import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function AanvoerderDashboard() {
    return (
        <Container className="py-5 text-center">
            <h2 className="mb-4">Seller dashboard</h2>
            <p className="mb-4 text-muted">Choose action to start</p>

            <div className="d-flex flex-column align-items-center gap-2" style={{ maxWidth: 360, margin: "0 auto" }}>
                <Button as={Link} to="/aanmaken" variant="success" className="w-100">
                    Make Product
                </Button>
                <Button as={Link} to="/opveiling" variant="primary" className="w-100">
                    Producten On Auction
                </Button>
                <Button as={Link} to="/verkocht" variant="primary" className="w-100">
                    Products Sold
                </Button>
            </div>
        </Container>
    );
}
