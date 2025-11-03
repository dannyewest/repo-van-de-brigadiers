import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import Shell from "@components/Shell";


function CreateProduct() {
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        minPrice: "",
        location: "",
        auctionDate: "",
        potSize: "",
        length: "",
        amount: "",
        image: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log("New product added:", formData);

        alert(`Product "${formData.name}" has been registered for auction!`);

        setFormData({
            name: "",
            type: "",
            minPrice: "",
            location: "",
            auctionDate: "",
            potSize: "",
            length: "",
            amount: "",
            image: ""
        });
    };

    // TODO Add form validation and actual submission logic
    // TODO Add error handling and success messages

    return (
        <Shell>
            <Container className="py-5 text-center">
                <h3 className="mb-4">Create Product</h3>

                <Form
                    className="mx-auto"
                    style={{ maxWidth: "400px" }}
                    onSubmit={handleSubmit}
                >
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="Product name"
                            value={formData.name}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            name="type"
                            placeholder="Product type"
                            value={formData.type}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="number"
                            name="minPrice"
                            placeholder="Minimum price"
                            value={formData.minPrice}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={formData.location}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="date"
                            name="auctionDate"
                            value={formData.auctionDate}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            name="potSize"
                            placeholder="Pot size"
                            value={formData.potSize}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            name="length"
                            placeholder="Length"
                            value={formData.length}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="number"
                            name="amount"
                            placeholder="Amount"
                            value={formData.amount}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="file"
                            name="image"
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
