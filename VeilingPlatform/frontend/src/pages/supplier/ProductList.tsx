import { useState, useEffect } from "react";
import { Container, Button, Form, Table } from "react-bootstrap";
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
            <Container className="py-5 text-center">
                <h3 className="mb-4">Overview of products that are on auction</h3>

                <div className="mb-3" style={{ maxWidth: "200px", margin: "0 auto" }}>
                    <Form.Select>
                        <option>Sort by...</option>
                        <option>Type</option>
                        <option>Date</option>
                        <option>Name</option>
                        <option>Price</option>
                    </Form.Select>
                </div>

                <div className="mx-auto" style={{ maxWidth: "800px" }}>
                    <Table striped bordered hover responsive>
                        <thead>
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
                                    <td>{product.type.name}</td>
                                    <td>€{product.price}</td>
                                    <td className="d-flex gap-2 justify-content-center">
                                        <Link to={`/supplier/product/edit/${product.id}`}>
                                            <Button variant="warning" size="sm">
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>
                                            Remove
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

                <div className="mt-4">
                    <Link to="/product/new" className="btn btn-success">Add new product</Link>
                </div>
            </Container>
        </Shell>
    );
}

export default ProductAuctionOverview;
