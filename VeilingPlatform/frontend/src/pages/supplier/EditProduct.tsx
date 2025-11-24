import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, FormLabel } from "react-bootstrap";
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
        image: "",
        imageAlt: ""
    });


    useEffect(() => {
        fetch(`http://localhost:5160/api/Product/${id}`)
            .then(res => res.json())
            .then(data => {
                console.log("API data:", data);
                setProduct({
                    name: data.name || "",
                    type: data.type || "",
                    potSize: data.potSize || "",
                    length: data.length?.toString() || "",
                    quantity: data.quantity?.toString() || "",
                    price: (data.basePrice ?? data.BasePrice ?? "").toString(),
                    supplier: data.supplier || "",
                    auctionDate: data.auctionDate?.split("T")[0] || "",
                    image: data.imageUrl || "",
                    imageAlt: data.imageAlt || ""
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
            Length: parseInt(product.length),
            Quantity: parseInt(product.quantity),
            BasePrice: parseFloat(product.price),
            Supplier: product.supplier,
            AuctionDate: product.auctionDate,
            Image: product.image,
            ImageAlt: product.imageAlt
        };

        try {
            const response = await fetch(`http://localhost:5160/api/Product/${id}`, {
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
                <h1>Edit Product</h1>
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
                            min={0}
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

                    <Form.Group className="mb-3">
                        <Form.Label>Image Description (Alt text)</Form.Label>
                        <Form.Control
                            type="text"
                            value={product.imageAlt || "No description provided"}
                            disabled
                            readOnly
                        />
                    </Form.Group>






                    <Button variant="primary" type="submit">Opslaan</Button>
                </Form>
            </Container>
        </Shell>
    );
}

export default EditProduct;
