import { useEffect, useState } from "react";

import { Card, Col, Container, Row, Button } from "react-bootstrap";
import Shell from "@components/Shell";
import { useNavigate, useParams } from "react-router-dom";
import { Product } from "src/definitions/ProductDefinition";
import { getProduct, getProducts } from "@api/ApiProvider";
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
        (async () => {
        try {
            const data = await getProduct(id ? Number(id) : 0);
            const otherProducts = (await getProducts()).filter((p) => data?.id !== p.id && Number(data?.id) < p.id).slice(0, 3);
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

    // Handle product bidding with confirm use-case and continueing to next product
    const handleProductClick = () => {
        if(confirm("Are you sure you want to place a bid on this product?")) {
            alert("Bid placed successfully for: $" + mainProduct?.basePrice);
            let nextProductId = id ? Number(id) + 1 : 1;
            navigate("/product/" +  nextProductId);
        } else {
            alert("Bid cancelled.");
        }
    }

    if (loading) return (<Shell><LoadingSpinner /></Shell>);
    if (!mainProduct) return <Shell><Card className="w-50 mx-auto"><Card.Body>No product Found</Card.Body></Card></Shell>;

    return (
        <Shell>
            <Container className='productDetailContainer'>
                <Card className='productCard'>
                    <Card.Header id='nextProductsHeader' className='productCardHeader'>
                        {otherProducts.length > 0 ? (otherProducts.length == 1 ? '1 product left to be auctioned.' : otherProducts.length  + ' coming products to be auctioned:') : "There are no products left."}
                    </Card.Header>
                    <Card.Body className='productBannerBody'>
                        <Row>
                            {otherProducts.map((product) => (
                            <Col key={product.id} className="d-inline-block text-center">
                                <img
                                    src={new URL(`/public/flowers/${product.imageUrl}`, import.meta.url).href}
                                    alt={product.name}
                                    className="img-thumbnail"
                                />
                            </Col>
                            ))}
                        </Row>
                    </Card.Body>
                </Card>
                <Card className='productCard'>
                    <Card.Header id='productDetailHeader' className='productCardHeader'>{mainProduct.name}</Card.Header>
                        <Card.Body className='productBody'>
                            <Row>
                                <Col className='productCol1' xs={12} md={6}>
                                    <img
                                        src={new URL(`/public/flowers/${mainProduct.imageUrl}`, import.meta.url).href}
                                        alt={mainProduct.name}
                                        className="CurrentProductImage"
                                    />
                                </Col>
                                <Col className='productCol2' xs={12} md={6}>
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
                    <Button type='button' variant='success' onClick={handleProductClick}>Place Bid</Button>
                </Card>            
            </Container>
        </Shell>
    )
}

export default ProductDetail;