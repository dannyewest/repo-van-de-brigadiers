import { useEffect, useState } from "react";
import { Card, Col, Container, Row, Button, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import { Product } from "src/definitions/ProductDefinition";
import LoadingSpinner from "@components/LoadingSpinner";
import Shell from "@components/Shell";
import "@style/productDetail.scss";

const ProductDetail = () => {
    
    const { id } = useParams();
    const navigate = useNavigate();

    const [mainProduct, setMainProduct] = useState<Product | null>(null);
    const [otherProducts, setOtherProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let mainAlt = mainProduct 
        ? `Image of ${mainProduct.name}` 
        : 'No product image available';

    // set next products for thumbnail-banner 
    const nextProducts = otherProducts.slice(0, 3);
    const getProductAlt = (product : Product) => `Thumbnail image of product ${product.id}, ${product.name}`;

    // TODO: Implement actual bidding logic
    const handleConfirm = () => {
        setMainProduct(otherProducts[0] ?? null);
        setOtherProducts(otherProducts.slice(1));
        handleClose();
    };

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5160/api/Auctionproducts/' + id);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data: Product[] = await response.json();

                // Set main product and other products
                if (!cancelled) {
                    setMainProduct(data[0] ?? null);
                    setOtherProducts(data.slice(1));
                }
            } catch (err) {
                console.error("Error with fetching data: ", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchData();

        return () => {
            cancelled = true;
        };
    }, [id]);

    if (loading) return (<Shell><LoadingSpinner /></Shell>);
    
    // 
    if (!mainProduct) {
        return (
            <Shell>
                <div>
                    <Card className="noAPCard">
                        <h2 className='apNone'>No products left on auction {id}. </h2>
                        <div>
                            <Button variant='outline-primary' className='apReturnB' onClick={() => navigate(-1)}>Go Back</Button>
                            <Button variant='outline-primary' className='apReturnB' onClick={() => navigate(0)}> Refresh</Button>
                        </div>
                    </Card>
                </div>
            </Shell>
    )};

    return (
        <Shell>
            <Container className='productDetailContainer'>
                <h1 className='AuctionProductsH'>Product overview of auction {id}</h1>
                <Card className='productCard'>
                    <Card.Header className='productCardHeader'>
                        <h2 id='nextProductsHeader'>
                            {otherProducts.length > 0 ? (otherProducts.length == 1 ? '1 product left to be auctioned.' : otherProducts.length  + ' coming products to be auctioned:') : "There are no products left."}
                        </h2>
                    </Card.Header>
                    <Card.Body className='productBannerBody'>
                        <Row>
                            {nextProducts.map((product) => (
                            <Col key={product.id} className="d-inline-block text-center">
                                <img
                                    src={new URL(`/public/flowers/red_roses_bouquet.jpg`, import.meta.url).href}
                                    alt={getProductAlt(product)}
                                    className="img-thumbnail"
                                />
                            </Col>
                            ))}
                        </Row>
                    </Card.Body>
                </Card>
                <Card className='productCard'>
                    <Card.Header className='productCardHeader'><h2 id='productH2'>Product {mainProduct.id}, {mainProduct.name}</h2></Card.Header>
                        <Card.Body className='productBody'>
                            <Row>
                                <Col className='productCol1' xs={12} md={6}>
                                    <img
                                        src={new URL(`/public/flowers/orange_roses_bouquet.jpg`, import.meta.url).href}
                                        alt= {mainAlt}
                                        className="CurrentProductImage"
                                    />
                                </Col>
                                <Col className='productCol2' xs={12} md={6}>
                                    <h3 id='productDetails'>Product Details:</h3>
                                    <ul>
                                        <li className='pd-list'><strong>Supplier:</strong> {mainProduct.supplier}</li>
                                        <li className='pd-list'><strong>AuctionDate:</strong> {mainProduct.auctionDate}</li>
                                        <li className='pd-list'><strong>Pot Size:</strong> {mainProduct.potSize}</li>
                                        <li className='pd-list'><strong>Type:</strong> {mainProduct.type}</li>
                                        <li className='pd-list'><strong>Stem Length:</strong> {mainProduct.length} cm</li>
                                        <li className='pd-list'><strong>Quantity:</strong> {mainProduct.quantity}</li>
                                        <li className='pd-list'><strong>Price:</strong> ${mainProduct.price}</li>
                                    </ul>
                                </Col>
                            </Row>
                        </Card.Body>
                    <Button type='button' variant='success' onClick={handleShow}>Place Bid on {mainProduct.name}</Button>
                </Card>
            </Container>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                <Modal.Title style={{fontWeight:'bold', }}>Bid on {mainProduct.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to place <br/> a bid on this product for ${mainProduct.price}?</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    No
                </Button>
                <Button variant="primary" onClick={handleConfirm}>
                    Yes
                </Button>
                </Modal.Footer>
            </Modal>
        </Shell>
    )
}

export default ProductDetail;