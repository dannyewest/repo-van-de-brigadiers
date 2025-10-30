import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Shell from "../../components/Shell";

export default function AanvoerderDashboard() {
    return (
        <Shell>
            <Container className="py-5 text-center">
                <h2 className="mb-4">Seller dashboard</h2>
                <p className="mb-4 text-muted">Choose action to start</p>

                <div className="d-flex flex-column align-items-center gap-2" style={{ maxWidth: 360, margin: "0 auto" }}>
                    <Button as={Link} to="/product/new" variant="success" className="w-100">
                        Make Product
                    </Button>
                    <Button as={Link} to="/product/auction" variant="primary" className="w-100">
                        Producten On Auction
                    </Button>
                    <Button as={Link} to="/product/sold" variant="primary" className="w-100">
                        Products Sold
                    </Button>
                </div>
            </Container>
        </Shell>
    );
}
