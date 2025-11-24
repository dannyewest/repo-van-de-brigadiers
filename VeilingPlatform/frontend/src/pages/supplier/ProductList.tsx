import { useState, useEffect } from "react";
import { Container, Button, Form, Table, Card } from "react-bootstrap";
import Shell from "@components/Shell";
import { Link } from "react-router-dom";
import { Product } from "src/definitions/ProductDefinition";



function ProductAuctionOverview() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filterName, setFilterName] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterMaxPrice, setFilterMaxPrice] = useState("");

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

    const filteredProducts = products.filter(product => {
        const matchesName = product.name.toLowerCase().includes(filterName.toLowerCase());
        const matchesType = product.type.toLowerCase().includes(filterType.toLowerCase());
        const matchesPrice = filterMaxPrice ? product.basePrice <= parseFloat(filterMaxPrice) : true;
        return matchesName && matchesType && matchesPrice;
    });



    return (
        <Shell>
            <Container className="py-5 d-flex justify-content-center">
                <Card className="p-5 shadow-sm" style={{ maxWidth: "900px", width: "100%", borderRadius: "12px" }}>
                    <h1 className="mb-4 text-center">Overview of Products on Auction</h1>

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
                            placeholder="Max price"
                            value={filterMaxPrice}
                            onChange={(e) => setFilterMaxPrice(e.target.value)}
                            style={{ maxWidth: "120px" }}
                        />
                    </div>

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
                                                <Button variant="warning" size="sm" aria-label={`Edit product ${product.name}`}>Edit</Button>
                                            </Link>
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)} aria-label={`Remove product ${product.name}`}>Remove</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card>
            </Container>
        </Shell>

    );
}

export default ProductAuctionOverview;
