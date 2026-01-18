import { Container, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Shell from "@components/Shell";

export default function SupplierDashboard() {
    return (
        <Shell>
            <Container className="py-5 d-flex justify-content-center">
                <Card
                    className="p-5 text-center shadow-sm"
                    style={{ maxWidth: "600px", width: "100%", borderRadius: "12px" }}
                    role="main"
                    aria-labelledby="dashboard-title"
                >
                    <h1 id="dashboard-title" className="mb-3">Supplier Dashboard</h1>
                    <p className="mb-4 text-muted">Choose an action to start</p>

                    <div className="d-flex flex-column gap-3" style={{ maxWidth: "360px", margin: "0 auto" }}>
                        <Link
                            to="/product/new"
                            className="btn btn-success btn-lg"
                            aria-label="Create a new product"
                            title="Create a new product"
                        >
                            Make Product
                        </Link>
                        <Link
                            to="/supplier/product/auction"
                            className="btn btn-primary btn-lg"
                            aria-label="View products currently on auction"
                            title="View products currently on auction"
                        >
                            Products On Auction
                        </Link>
                        <Link
                            to="/supplier/product/sold"
                            className="btn btn-primary btn-lg"
                            aria-label="View products that have been sold"
                            title="View products that have been sold"
                        >
                            Products Sold
                        </Link>
                    </div>
                </Card>
            </Container>
        </Shell>
    );
}
