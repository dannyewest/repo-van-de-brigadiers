import { Container, Card, Row, Col } from "react-bootstrap";
import soldProducts from "../../api/soldProducts.json";

function VerkochteProducten() {
    return (
        <Container className="py-5 text-center">
            <h3 className="mb-4">Overview of Sold Products</h3>

            <Row className="justify-content-center">
                {soldProducts.map((product) => (
                    <Col md={5} className="mb-4" key={product.id}>
                        <Card className="p-3 text-start shadow-sm" border="info">
                            <div className="d-flex align-items-center">
                                {/* <div
                                    style={{
                                        width: "120px",
                                        height: "80px",
                                        backgroundImage: `url(${product.image})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        borderRadius: "6px",
                                        marginRight: "20px",
                                    }}
                                ></div> */}

                                <div>
                                    <h5 className="mb-2">{product.name}</h5>
                                    <p className="mb-1"><strong>Buyer:</strong> {product.buyer}</p>
                                    <p className="mb-1"><strong>Selling Price:</strong> €{product.sellingPrice}</p>
                                    <p className="mb-0"><strong>Amount:</strong> {product.amount}</p>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default VerkochteProducten;
