import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, FormLabel, Card, Modal } from "react-bootstrap";
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

    const [modal, setModal] = useState<{ show: boolean; title: string; message: string, onConfirm?: () => void }>(
        { show: false, title: "", message: "" }
    );
    const showModal = (title: string, message: string, onConfirm?: () => void) => {
        setModal({ show: true, title, message, onConfirm });
    };

    // fetch product details on mount
    useEffect(() => {
        fetch(`http://localhost:5160/api/Product/${id}`)
            .then(res => res.json())
            .then(data => {
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
            .catch(err => {
                console.error("failed to fetch product", err);
                showModal("error", "error fetching product details");
            });
    }, [id]);

    // Handlers for form fields
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
            const response = await fetch(`http://localhost:5160/api/product/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productToSend)
            });


            if (!response.ok) throw new Error("Failed to update product");

            // show success modal
            showModal(
                "Product Updated",
                `Product "${product.name}" has been successfully updated.`,
                () => navigate("/supplier/product/auction")
            );

            // timer to auto-navigate after 3.5 seconds
            setTimeout(() => {
                navigate("/supplier/product/auction");
            }, 3500);

        } catch (error) {
            console.error(error);
            showModal("Error", "Failed to update product. Please try again.");
        }
    };


    return (
        <Shell>
            <Container className="py-5 d-flex justify-content-center">
                <Card
                    className="p-5 shadow-sm"
                    style={{ maxWidth: "700px", width: "100%", borderRadius: "12px" }}
                    role="main"
                    aria-labelledby="edit-product-title">

                    <Modal
                        show={modal.show}
                        onHide={() => setModal({ ...modal, show: false })}
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>{modal.title}</Modal.Title>
                        </Modal.Header>

                        <Modal.Body className="text-center">
                            <p>{modal.message}</p>
                        </Modal.Body>

                        <Modal.Footer>

                            {modal.onConfirm && (
                                <Button variant="primary" onClick={modal.onConfirm}>
                                    OK
                                </Button>
                            )}
                        </Modal.Footer>
                    </Modal>

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
                            <Form.Label>Price €</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                min={0}
                                step="0.01"
                                value={product.price !== "" ? parseFloat(product.price).toFixed(2) : ""}
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
