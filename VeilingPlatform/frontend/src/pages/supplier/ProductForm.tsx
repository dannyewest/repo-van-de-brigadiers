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
        length: "0",
        quantity: "0",
        price: "0",
        supplier: "",
        auctionDate: new Date().toISOString().split("T")[0], // vandaag
        auctionId: "3" // tijdelijk hardcoded
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validatie
        if (!formData.name || !formData.type || !formData.supplier) {
            alert("fill in all vields");
            return;
        }


        const productToSend = {
            Name: formData.name.trim(),
            Type: formData.type.trim(),
            PotSize: formData.potSize.trim() || "Unknown",
            Length: parseInt(formData.length),
            Quantity: parseInt(formData.quantity),
            Price: parseFloat(formData.price),
            Supplier: formData.supplier.trim(),
            AuctionDate: new Date(formData.auctionDate).toISOString(),
            AuctionId: parseInt(formData.auctionId) // tijdelijk hardcoded
        };


        try {
            const response = await fetch("http://localhost:5160/api/ProductEntity", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productToSend)
            });


            if (!response.ok) throw new Error("Failed to create product");

            alert(`Product "${formData.name}" successfully created`);

            // Reset form
            setFormData({
                name: "",
                type: "",
                potSize: "",
                length: "0",
                quantity: "0",
                price: "0",
                supplier: "",
                auctionDate: new Date().toISOString().split("T")[0],
                auctionId: "3"
            });

            // Redirect naar productlijst
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
                            placeholder="quantity"
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
                            placeholder="supplier"
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

                    {/* Hidden field voor AuctionId */}
                    <Form.Control type="hidden" name="auctionId" value={formData.auctionId} />

                    <Button variant="success" type="submit" className="w-100">
                        Create
                    </Button>
                </Form>
            </Container>
        </Shell>
    );
}

export default CreateProduct;
