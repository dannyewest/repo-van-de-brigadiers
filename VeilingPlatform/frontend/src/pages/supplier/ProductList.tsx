import { useState, useEffect } from "react";
import { Container, Button, Form, Table, Card, Row, Col, Modal } from "react-bootstrap";
import Shell from "@components/Shell";
import { Link } from "react-router-dom";
import { Product } from "src/definitions/ProductDefinition";
import { fetchWithToken } from "@pages/login";



function ProductAuctionOverview() {
    const [products, setProducts] = useState<Product[]>([]);

    // Filter states
    const [filterName, setFilterName] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterMinPrice, setFilterMinPrice] = useState("");

    // Alert state and function
    const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);
    const showAlert = (type: 'success' | 'danger', message: string, duration = 5000) => {
        setAlert({ type, message });
        setTimeout(() => setAlert(null), duration);
    };

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);


    useEffect(() => {
        fetchWithToken("http://localhost:5160/api/Products")
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => {
                console.error("Fout bij ophalen producten:", err);
                showAlert("danger", "Fout bij ophalen producten");
            });
    }, []);

    const handleDeleteConfirmed = async () => {
        if (!productToDelete) return;

        try {
            const response = await fetch(`http://localhost:5160/api/product/${productToDelete.id}/delete`,
                { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete product");

            // deletes product from state
            setProducts(products.filter(p => p.id !== productToDelete.id));

            // close modal an show sucsess alert
            setShowModal(false);
            setProductToDelete(null);
            showAlert("success", "Product successfully deleted");
        } catch (error) {
            console.error(error);
            showAlert("danger", "Something went wrong while deleting the product");
        }
    };
    const filteredProducts = products.filter(product => {
        const matchesName = product.name.toLowerCase().includes(filterName.toLowerCase());
        const matchesType = product.type.toLowerCase().includes(filterType.toLowerCase());
        const matchesPrice = filterMinPrice ? product.basePrice >= parseFloat(filterMinPrice) : true;
        return matchesName && matchesType && matchesPrice;
    });



    return (
        <Shell>
            <Container className="py-5 d-flex justify-content-center">
                <Card className="p-5 shadow-sm" style={{ maxWidth: "900px", width: "100%", borderRadius: "12px" }}>
                    <h1 className="mb-4 text-center">Overview of Products on Auction</h1>
                    {alert && (
                        <div
                            className={`alert alert-${alert.type} text-center`}
                            role="alert"
                            aria-live="assertive"
                        >
                            {alert.message}
                        </div>
                    )}

                    {/* Filters */}
                    <div className="mb-4 d-flex gap-2 justify-content-center flex-wrap">
                        <Form.Control
                            type="text"
                            placeholder="Filter by name"
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                            style={{ maxWidth: "200px" }}
                        />
                        <Form.Control
                            type="text"
                            placeholder="Filter by type"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            style={{ maxWidth: "200px" }}
                        />
                        <Form.Control
                            type="number"
                            placeholder="Min price"
                            value={filterMinPrice}
                            onChange={(e) => setFilterMinPrice(e.target.value)}
                            style={{ maxWidth: "120px" }}
                        />
                    </div>

                    {/* Product tabel */}
                    <div className="table-responsive">
                        <Table striped bordered hover>
                            <thead className="table-dark">
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Minimum Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(product => (
                                    <tr key={product.id}>
                                        <td><strong>{product.name}</strong></td>
                                        <td>{product.type}</td>
                                        <td>{new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(product.basePrice)}</td>
                                        <td className="d-flex gap-2 justify-content-center">
                                            <Link to={`/supplier/product/edit/${product.id}`}>
                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    aria-label={`Edit product ${product.name}`}
                                                >
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => {
                                                    setProductToDelete(product);
                                                    setShowModal(true);
                                                }}
                                                aria-label={`Remove product ${product.name}`}
                                            >
                                                Remove
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Deletion</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {productToDelete && (
                                <p>Are you sure you want to delete "<strong>{productToDelete.name}</strong>"?</p>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={handleDeleteConfirmed}>
                                Yes, Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Add new product button */}
                    <div className="mt-4 d-flex justify-content-center">
                        <Link
                            to="/product/new"
                            className="btn btn-success btn-lg"
                            aria-label="Add new product"
                        >
                            Add New Product
                        </Link>
                    </div>
                </Card>
            </Container>
        </Shell>

    );
}

export default ProductAuctionOverview;
