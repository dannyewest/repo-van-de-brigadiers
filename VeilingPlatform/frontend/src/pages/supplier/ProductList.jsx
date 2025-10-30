import { Container, Button, Form } from "react-bootstrap";
import products from "../../api/product.json";
import Shell from "../../components/Shell";
import { Link } from "react-router-dom";


function ProductenOpVeiling() {
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
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="d-flex justify-content-between align-items-center border mb-2 p-2 rounded"
                        >
                            <div className="d-flex align-items-center text-start flex-grow-1 mx-2">
                                {/* <div
                                style={{
                                    width: "80px",
                                    height: "60px",
                                    backgroundImage: `url(${product.image})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    borderRadius: "4px",
                                    marginRight: "15px"
                                }}
                            ></div> */}
                                <div>
                                    <strong>{product.name}</strong> <br />
                                    Type: {product.type} <br />
                                    Location: {product.location} <br />
                                    Auction Date: {product.auctionDate} <br />
                                    Minimum Price: €{product.minPrice}
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <Button variant="warning" size="sm">
                                    Edit
                                </Button>
                                <Button variant="danger" size="sm">
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4">
                    <Link to="/product/new" className="btn btn-success">Add new product</Link>
                </div>
            </Container>
        </Shell>
    );
}

export default ProductenOpVeiling;
