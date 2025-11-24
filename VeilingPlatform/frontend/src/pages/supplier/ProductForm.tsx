import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
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


    const [filename, setFilename] = useState("");

    // Voor tekst/nummers
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Voor file input
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;

        if (target.files && target.files[0]) {
            setFilename(target.files[0].name);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.type || !formData.supplier) {
            alert("Fill in all required fields");
            return;
        }

        // Stuur alleen de bestandsnaam, niet het bestand zelf
        const productToSend = {
            Name: formData.name.trim(),
            Type: formData.type.trim(),
            PotSize: formData.potSize.trim() || "Unknown",
            Length: parseInt(formData.length),
            Quantity: parseInt(formData.quantity),
            BasePrice: parseFloat(formData.price),
            Supplier: formData.supplier.trim(),
            Image: filename,   // alleen de bestandsnaam
            ImageAlt: formData.imageAlt.trim(),
            ImageFile: null
        };

        try {
            const response = await fetch("http://localhost:5160/api/Product", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productToSend)
            });

            if (!response.ok) throw new Error("Failed to create product");

            alert(`Product "${formData.name}" successfully created`);
            navigate("/supplier/product/auction");
        } catch (error) {
            console.error(error);
            alert("Error creating product");
        }
    };


    return (
        <Shell>
            <Container className="py-5 text-center">
                <h3 className="mb-4">Create Product</h3>
                <Form className="mx-auto" style={{ maxWidth: "400px" }} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
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
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            name="potSize"
                            placeholder="Potmaat"
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
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="number"
                            name="quantity"
                            placeholder="Quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={formData.price}
                            onChange={handleChange}
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

                        />
                        <p>Filename: {filename}</p>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Alt text (for screen readers)</Form.Label>
                        <Form.Control
                            type="text"
                            name="imageAlt"
                            value={formData.imageAlt}
                            onChange={handleChange}
                            placeholder="Describe the image"
                            aria-required="true"
                            required
                        />
                    </Form.Group>

                    <Button variant="success" type="submit" className="w-100">
                        Create
                    </Button>
                </Form>
            </Container>
        </Shell>
    );
}

export default CreateProduct;
