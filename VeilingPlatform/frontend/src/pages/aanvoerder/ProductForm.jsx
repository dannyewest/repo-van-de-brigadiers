import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import Shell from "../../components/Shell";


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

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0].name : value
        });
    };

    const handleSubmit = (e) => {
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
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            name="type"
                            placeholder="Product type"
                            value={formData.type}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="number"
                            name="minPrice"
                            placeholder="Minimum price"
                            value={formData.minPrice}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={formData.location}
                            onChange={handleChange}
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
                        <Form.Control
                            type="text"
                            name="potSize"
                            placeholder="Pot size"
                            value={formData.potSize}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            name="length"
                            placeholder="Length"
                            value={formData.length}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="number"
                            name="amount"
                            placeholder="Amount"
                            value={formData.amount}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control type="file" name="image" onChange={handleChange} />
                    </Form.Group>

                    <Button variant="dark" type="submit" className="w-100">
                        Create
                    </Button>
                </Form>
            </Container>
        </Shell>
    );
}

export default CreateProduct;
