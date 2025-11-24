import { Container, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Shell from "@components/Shell";

export default function SupplierDashboard() {
    return (
        <Shell>
            <Container className="py-5 text-center">
                <Card className="mb-4 p-5 mx-auto" style={{ maxWidth: "600px" }}>
                    <h1 className="mb-4">Supplier dashboard</h1>
                    <p className="mb-4 text-muted">Choose action to start</p>

                    <div className="d-flex flex-column align-items-center gap-2" style={{ maxWidth: 360, margin: "0 auto" }}>
                        <Link to="/product/new" className="btn btn-success w-100">
                            Make Product
                        </Link>
                        <Link to="/supplier/product/auction" className="btn btn-primary w-100">
                            Producten On Auction
                        </Link>
                        <Link to="/supplier/product/sold" className="btn btn-primary w-100">
                            Products Sold
                        </Link>
                    </div>
                </Card>
            </Container>
        </Shell>
    );
}
