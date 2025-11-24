import { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import Shell from "@components/Shell";
import { useNavigate } from "react-router-dom";

function CreateProduct() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        type: "",
        potSize: "",
        length: "",
        quantity: "",
        price: "",
        supplier: "",
        auctionDate: new Date().toISOString().split("T")[0],
        image: "",
        imageAlt: ""
    });

    // For file upload
    const [filename, setFilename] = useState("");
    const [file, setFile] = useState<File | null>(null);

    // Voor tekst/nummers
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Voor file input
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;

        if (target.files && target.files[0]) {
            const f = target.files[0];
            setFile(f);
            setFilename(f.name); // voor weergave
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // eenvoudige validatie voor vereiste velden
        if (!formData.name || !formData.type || !formData.supplier) {
            alert("Fill in all required fields");
            return;
        }

        let imageFileName = "";

        // 1) Upload de file als die is gekozen
        if (file) {
            const uploadData = new FormData();
            uploadData.append("file", file);

            try {
                const uploadRes = await fetch("http://localhost:5160/api/upload/product-image", {
                    method: "POST",
                    body: uploadData,
                });

                // alert bij niet succesvolle upload
                if (!uploadRes.ok) {
                    throw new Error("Image upload failed");
                }

                const uploadJson = await uploadRes.json();
                imageFileName = uploadJson.fileName;

            } catch (err) {
                console.error(err);
                alert("Error uploading image");
                return;
            }
        }

        // 2) Stuur alleen de bestandsnaam naar de API
        const productToSend = {
            Name: formData.name.trim(),
            Type: formData.type.trim(),
            PotSize: formData.potSize.trim() || "Unknown",
            Length: parseInt(formData.length),
            Quantity: parseInt(formData.quantity),
            BasePrice: parseFloat(formData.price),
            Supplier: formData.supplier.trim(),
            Image: imageFileName, // alleen de bestandsnaam
            ImageAlt: formData.imageAlt.trim(), // alt tekst
            AuctionDate: new Date(formData.auctionDate).toISOString() // ISO formaat
        };

        try {
            const response = await fetch("http://localhost:5160/api/Product", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productToSend),
            });

            // alert bij niet succesvolle response
            if (!response.ok) throw new Error("Failed to create product");

            // bij succesvolle creatie, terug naar overzicht
            alert(`Product "${formData.name}" successfully created`);
            navigate("/supplier/product/auction");

        } catch (error) {
            console.error(error);
            alert("Error creating product");
        }
    };


    return (
        <Shell>
            <Container className="py-5 d-flex justify-content-center">
                <Card
                    className="p-5 shadow-sm"
                    style={{ maxWidth: "700px", width: "100%", borderRadius: "12px" }}
                    role="main"
                    aria-labelledby="create-product-title"
                >
                    <h3 id="create-product-title" className="mb-4 text-center">Create Product</h3>
                    <Form className="mx-auto" style={{ maxWidth: "400px" }} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                aria-required="true"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                name="type"
                                placeholder="Type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                                aria-required="true"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                name="potSize"
                                placeholder="Pot Size"
                                value={formData.potSize}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control
                                type="number"
                                name="length"
                                placeholder="Length"
                                value={formData.length}
                                onChange={handleChange}
                                min={0}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control
                                type="number"
                                name="quantity"
                                placeholder="Quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                min={0}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control
                                type="number"
                                name="price"
                                placeholder="Price"
                                min={0}
                                value={formData.price}
                                onChange={handleChange}
                                required
                                aria-required="true"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                name="supplier"
                                placeholder="Supplier"
                                value={formData.supplier}
                                onChange={handleChange}
                                required
                                aria-required="true"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control
                                type="date"
                                name="auctionDate"
                                value={formData.auctionDate}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Upload Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                aria-label="Upload product image"
                            />
                            {filename && <p className="mt-2">Filename: {filename}</p>}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Alt text (for screen readers)</Form.Label>
                            <Form.Control
                                type="text"
                                name="imageAlt"
                                value={formData.imageAlt}
                                onChange={handleChange}
                                placeholder="Describe the image"
                                required
                                aria-required="true"
                            />
                        </Form.Group>

                        <Button
                            variant="success"
                            type="submit"
                            className="w-100"
                            aria-label="Create product"
                        >
                            Create
                        </Button>
                    </Form>
                </Card>
            </Container>
        </Shell>
    );
}

export default CreateProduct;
