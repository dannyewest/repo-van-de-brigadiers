import React, { useState } from "react";

import redRosesImage from "../assets/red_roses_bouquet.jpg";
import whiteRosesImage from "../assets/white_roses_bouquet.jpg";
import pinkRosesImage from "../assets/pink_roses_bouquet.jpg";
import Card from "react-bootstrap/Card";
import { CardText } from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';

const Product = () => {

    // Dummy data voor producten
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
        name: "Pink Roses",
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
        name: "Pink Roses",
        type: "Flowers",
        potSize: "Large",
        length: "25 cm",
        quantity: 72,
        price: 21.99,
        supplier: "Floral Delights",
        auctionDate: "2024-07-15",
        auctionId: 101,
        image: pinkRosesImage
    }
];

    // hoofdproduct en andere producten in aparte staten houden
    const [mainProduct, setMainProduct] = useState(productsData[0]);
    const otherProducts = productsData.filter((p) => p.id !== mainProduct.id).slice(0, 3);

    if (!mainProduct) return <p>Product wordt geladen...</p>;

    return (
        <Container>
            <Card border="info" style={{ width: '100%' }}>
                <Card.Header style={{ fontSize: '24px' ,fontWeight: 'bold', textAlign: 'center' }}>{mainProduct.name}</Card.Header>
                    <Card.Body>
                        <Row>
                            <Col xs={12} md={6} className="text-center">
                                <img
                                    src={mainProduct.image}
                                    alt={mainProduct.name}
                                    className=""
                                    width="320"
                                    height="360"
                                />
                            </Col>
                            <Col xs={4} md={3} className="text-align-left mt-3">
                                <p><strong>Supplier: </strong>{mainProduct.supplier}</p>
                                <p><strong>AuctionDate: </strong>{mainProduct.auctionDate}</p>
                                <p><strong>Pot Size: </strong>{mainProduct.potSize}</p>
                                <p><strong>Type: </strong>{mainProduct.type}</p>
                                <p><strong>Length: </strong>{mainProduct.length}</p>
                                <p><strong>Quantity: </strong>{mainProduct.quantity}</p>
                                <p><strong>Price: </strong>{mainProduct.price}</p>
                            </Col>
                        </Row>
                    </Card.Body>
                <button className="btn btn-success">Place Bid</button>
            </Card> 
            <Card border="info" style={{ width: '100%', marginTop: '32px', marginBottom: '20px'}}>
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
                            src={product.image}
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
    )
}

export default Product;