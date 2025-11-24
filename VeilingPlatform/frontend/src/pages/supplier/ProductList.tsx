import { useState, useEffect } from "react";
import { Container, Button, Form, Table, Card } from "react-bootstrap";
import Shell from "@components/Shell";
import { Link } from "react-router-dom";
import { Product } from "src/definitions/ProductDefinition";



function ProductAuctionOverview() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch("http://localhost:5160/api/Product")
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("Fout bij ophalen producten:", err));
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("are you sure you want to delete this product")) return;

        try {
            const response = await fetch(`http://localhost:5160/api/Product/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error("Failed to delete product");

            setProducts(products.filter(p => p.id !== id));
            alert("product successfully deleted");
        } catch (error) {
            console.error(error);
            alert("something went wrong while deleting the product");
        }
    };


    return (
        <Shell>
            <Container className="py-5 d-flex justify-content-center">
                <Card className="p-5 shadow-sm" style={{ maxWidth: "900px", width: "100%", borderRadius: "12px" }}>
                    <h1 className="mb-4 text-center">Overview of Products on Auction</h1>

                    {/* Sort dropdown */}
                    <div className="mb-4 d-flex justify-content-center" style={{ maxWidth: "250px", margin: "0 auto" }}>
                        <Form.Select aria-label="Sort products" className="text-center">
                            <option>Sort by...</option>
                            <option value="type">Type</option>
                            <option value="date">Date</option>
                            <option value="name">Name</option>
                            <option value="price">Price</option>
                        </Form.Select>
                    </div>

                    {/* Table */}
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
                                {products.map((product) => (
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
                                                onClick={() => handleDelete(product.id)}
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

                    {/* Add new product */}
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
