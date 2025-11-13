import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import Shell from "@components/Shell";

function EditProduct() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        type: "",
        potSize: "",
        length: "",
        quantity: "",
        price: "",
        supplier: "",
        auctionDate: "",
        auctionId: 1
    });


    useEffect(() => {
        fetch(`http://localhost:5160/api/ProductEntity/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct({
                    name: data.name || "",
                    type: data.type || "",
                    potSize: data.potSize || "",
                    length: data.length?.toString() || "",
                    quantity: data.quantity?.toString() || "",
                    price: data.price?.toString() || "",
                    supplier: data.supplier || "",
                    auctionDate: data.auctionDate?.split("T")[0] || "",
                    auctionId: data.auctionId || 1
                });
            })
            .catch(err => console.error("Fout bij ophalen product:", err));
    }, [id]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const productToSend = {
            Name: product.name,
            Type: product.type,
            PotSize: product.potSize,
            Length: parseInt(product.length) || 0,
            Quantity: parseInt(product.quantity) || 0,
            Price: parseFloat(product.price) || 0,
            Supplier: product.supplier,
            AuctionDate: product.auctionDate,
            AuctionId: product.auctionId
        };

        try {
            const response = await fetch(`http://localhost:5160/api/ProductEntity/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productToSend)
            });

            if (!response.ok) throw new Error("Failed to update product");

            alert("Product successfully updated");
            navigate("/supplier/product/auction");

        } catch (error) {
            console.error(error);
            alert("something went wrong while updating the product");
        }
    };

    return (
        <Shell>
            <Container className="py-5">
                <h3>Edit Product</h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Type</Form.Label>
                        <Form.Control
                            name="type"
                            value={product.type}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="auctionDate"
                            value={product.auctionDate}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">Opslaan</Button>
                </Form>
            </Container>
        </Shell>
    );
}

export default EditProduct;
