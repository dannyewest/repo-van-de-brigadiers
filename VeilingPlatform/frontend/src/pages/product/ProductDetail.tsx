import { useEffect, useState } from "react";

import { Card, Col, Container, Row, Button } from "react-bootstrap";
import Shell from "@components/Shell";
import { useNavigate, useParams } from "react-router-dom";
import { Product } from "src/definitions/ProductDefinition";
import LoadingSpinner from "@components/LoadingSpinner";
import "@style/productDetail.scss";

const ProductDetail = () => {
    
    const { id } = useParams();
    const navigate = useNavigate();

    const [mainProduct, setMainProduct] = useState<Product | null>(null);
    const [otherProducts, setOtherProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5160/api/Auctionproducts/' + id);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data: Product[] = await response.json();

                // Assign temp ids to the products for frontend use
                for(let i = 0; i < data.length; i++) {
                    data[i].id = i + 1;
                }

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

    // Handle product bidding with confirm use-case and continueing to next product
    // price handling & global product update to be implemented later
    const handleProductClick = () => {
        if(confirm("Are you sure you want to place a bid on this product?")) {
            alert("Bid placed successfully for: $" + mainProduct?.price);

            setMainProduct(otherProducts[0] ?? null);
            setOtherProducts(otherProducts.slice(1));
        } else {
            alert("Bid cancelled.");
        }
    }

    // Map maximum of 3 next products in the banner
    const nextProducts = otherProducts.slice(0, 3);

    if (loading) return (<Shell><LoadingSpinner /></Shell>);
    if (!mainProduct) return <Shell><Card className="w-50 mx-auto"><Card.Body>No product Found</Card.Body></Card></Shell>;

    let mainAlt = mainProduct ? `Image of ${mainProduct.name}` : 'No product image available';

    const getProductAlt = (product : Product) => {
        return `Thumbnail image of next product ${setOtherProductId(product.id)} , ${product.name}`;
    }

    const setOtherProductId = (id : number) => {
        return id - mainProduct.id;
    }

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
                    <Card.Header className='productCardHeader'><h2 id='productH2'>Product name: {mainProduct.name}</h2></Card.Header>
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
                    <Button type='button' variant='success' onClick={handleProductClick}>Place Bid on {mainProduct.name}</Button>
                </Card>            
            </Container>
        </Shell>
    )
}

export default ProductDetail;