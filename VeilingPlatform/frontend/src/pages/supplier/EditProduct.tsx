import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, FormLabel, Card } from "react-bootstrap";
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

    // Haal het product op bij het laden van de component
    useEffect(() => {
        fetch(`http://localhost:5160/api/Product/${id}`)
            .then(res => res.json())
            .then(data => {
                console.log("API data:", data); // Debugging line
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

    // Handlers voor formulier
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

            // alert bij niet succesvolle response
            if (!response.ok) throw new Error("Failed to update product");

            // bij succesvolle update, terug naar overzicht
            alert("Product successfully updated");
            navigate("/supplier/product/auction");

        } catch (error) {
            console.error(error);
            alert("something went wrong while updating the product");
        }
    };

    return (
        <Shell>
            <Container className="py-5 d-flex justify-content-center">
                <Card
                    className="p-5 shadow-sm"
                    style={{ maxWidth: "700px", width: "100%", borderRadius: "12px" }}
                    role="main"
                    aria-labelledby="edit-product-title"
                >
                    <h1 id="edit-product-title" className="mb-4 text-center">Edit Product</h1>
                    <Form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "" }}>

                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                name="name"
                                value={product.name}
                                onChange={handleChange}
                                required
                                aria-required="true"
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
                                aria-readonly="true"
                            />
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100"
                            aria-label="Save edited product"
                        >
                            Opslaan
                        </Button>
                    </Form>
                </Card>
            </Container>
        </Shell>

    );
}

export default EditProduct;
