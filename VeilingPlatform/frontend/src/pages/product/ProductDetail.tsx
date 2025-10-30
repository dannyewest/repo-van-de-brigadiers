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

const ProductDetail = () => {

    // TODO Fetch products from API by ID, don't think it nescessary to have other products on this detail page. Think this can be a small popup on the overview/list page.
    const productsData = [
        {
            id: 2,
            name: "Red Roses Bouquet",
            type: "Flowers",
            potSize: "Medium",
            length: "50 cm",
            quantity: 200,
            price: 49.99,
            supplier: "Floral Delights",
            auctionDate: "2024-07-15",
            auctionId: 101,
            image: redRosesImage
        },
        {
            id: 1,
            name: "White Roses Bouquet",
            type: "Flowers",
            potSize: "Small",
            length: "38 cm",
            quantity: 80,
            price: 24.99,
            supplier: "Floral Delights",
            auctionDate: "2024-07-15",
            auctionId: 101,
            image: whiteRosesImage
        },
        {
            id: 3,
            name: "Pink Roses Bouquet",
            type: "Flowers",
            potSize: "Large",
            length: "25 cm",
            quantity: 72,
            price: 21.99,
            supplier: "Floral Delights",
            auctionDate: "2024-07-15",
            auctionId: 101,
            image: pinkRosesImage
        },
        {
            id: 4,
            name: "Orange Roses Bouquet",
            type: "Flowers",
            potSize: "Medium",
            length: "29",
            quantity: 72,
            price: 21.99,
            supplier: "Floral Delights",
            auctionDate: "2024-07-15",
            auctionId: 101,
            image: orangeRosesImage
        }
    ];
    
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

    if (!mainProduct) return <p>Product wordt geladen...</p>;

    return (
        <Shell>
            <Container>
                <Card style={{ width: '100%' }}>
                    <Card.Header style={{ fontSize: '24px' ,fontWeight: 'bold', textAlign: 'center' }}>{mainProduct.name}</Card.Header>
                        <Card.Body>
                            <Row>
                                <Col xs={12} md={6} className="text-center">
                                    <img
                                        src={mainProduct.imageUrl}
                                        alt={mainProduct.name}
                                        className=""
                                        width="320"
                                        height="360"
                                    />
                                </Col>
                                <Col xs={4} md={3} className="text-align-left mt-3">
                                    <p><strong>Supplier: </strong>{mainProduct.supplier.name}</p>
                                    <p><strong>AuctionDate: </strong>{mainProduct.auctionDate}</p>
                                    <p><strong>Pot Size: </strong>{mainProduct.potSize}</p>
                                    <p><strong>Type: </strong>{mainProduct.type.name}</p>
                                    <p><strong>Length: </strong>{mainProduct.stemLength}</p>
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
                                src={product.imageUrl}
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