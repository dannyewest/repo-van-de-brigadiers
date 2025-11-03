import { useEffect, useState } from "react";

import redRosesImage from "@assets/flowers/red_roses_bouquet.jpg";
import whiteRosesImage from "@assets/flowers/white_roses_bouquet.jpg";
import pinkRosesImage from "@assets/flowers/pink_roses_bouquet.jpg";
import orangeRosesImage from "@assets/flowers/orange_roses_bouquet.jpg"
import Card from "react-bootstrap/Card";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Shell from "@components/Shell";
import { useNavigate, useParams } from "react-router-dom";
import { Product } from "src/definitions/ProductDefinition";
import { getProduct, getProducts } from "@api/ApiProvider";
import LoadingSpinner from "@components/LoadingSpinner";

const ProductDetail = () => {
    
    const { id } = useParams();
    const navigate = useNavigate();

    const [mainProduct, setMainProduct] = useState<Product | null>(null);
    const [otherProducts, setOtherProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
        try {
            const data = await getProduct(id ? Number(id) : 0);
            const otherProducts = (await getProducts()).filter((p) => data?.id !== p.id).slice(0, 3);
            if (!cancelled) {
                setMainProduct(data ?? null);
                setOtherProducts(otherProducts ?? []);
            }
        } finally {
            if (!cancelled) setLoading(false);
        }
        })();
        return () => { cancelled = true; };
    }, [id]);

    if (loading) return (<Shell><LoadingSpinner /></Shell>);
    if (!mainProduct) return <Shell><Card className="w-50 mx-auto"><Card.Body>No product Found</Card.Body></Card></Shell>;

    return (
        <Shell>
            <Container>
                <Card style={{ width: '100%' }}>
                    <Card.Header style={{ fontSize: '24px' ,fontWeight: 'bold', textAlign: 'center' }}>{mainProduct.name}</Card.Header>
                        <Card.Body>
                            <Row>
                                <Col xs={12} md={6} className="text-center">
                                    <img
                                        src={new URL(`../../assets/flowers/${mainProduct.imageUrl}`, import.meta.url).href}
                                        alt={mainProduct.name}
                                        className=""
                                        width="320"
                                        height="360"
                                    />
                                </Col>
                                <Col xs={4} md={3} className="text-align-left mt-3">
                                    <p><strong>Supplier: </strong>{mainProduct.supplier?.name ?? "Unknown"}</p>
                                    <p><strong>AuctionDate: </strong>{mainProduct.auctionDate}</p>
                                    <p><strong>Pot Size: </strong>{mainProduct.potSize}</p>
                                    <p><strong>Type: </strong>{mainProduct.type?.name ?? "Unknown"}</p>
                                    <p><strong>Stem Length: </strong>{mainProduct.stemLength} cm</p>
                                    <p><strong>Quantity: </strong>{mainProduct.quantity}</p>
                                    <p><strong>Price: </strong>{mainProduct.basePrice}</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    <button className="btn btn-success">Place Bid</button>
                </Card> 
                <Card style={{ width: '100%', marginTop: '32px', marginBottom: '20px'}}>
                    <Card.Header style={{ fontSize: '14px'}}>Products to be auctioned</Card.Header>
                    <Card.Body>
                        <Row>
                            {otherProducts.map((product) => (
                            <Col
                                key={product.id}
                                className="d-inline-block text-center"
                                onClick={() => setMainProduct(product)}
                                style={{ cursor: "pointer" }}
                                
                            >
                                <img
                                    src={new URL(`../../assets/flowers/${product.imageUrl}`, import.meta.url).href}
                                    alt={product.name}
                                    className="img-thumbnail"
                                    width="120"
                                    height="120"
                                />
                                <p className="small">{product.name}</p>
                            </Col>
                            ))}
                        </Row>
                    </Card.Body>
                </Card>           
            </Container>
        </Shell>
    )
}

export default ProductDetail;