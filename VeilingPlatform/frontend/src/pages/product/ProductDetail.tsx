import { useEffect, useState } from "react";
import { Card, Col, Container, Row, Button, Modal, Toast, ToastContainer, Form, ProgressBar } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { AuctionProduct } from "src/definitions/AuctionProductDefinition";
import LoadingSpinner from "@components/LoadingSpinner";
import Shell from "@components/Shell";
import "@style/productDetail.scss";
import { fetchWithToken, getProductImage, createProductSold } from "@api/ApiProvider";

const ProductDetail = () => {
    
    const { id } = useParams();
    const navigate = useNavigate();

    // Data State
    const [mainProduct, setMainProduct] = useState<AuctionProduct | null>(null);
    const [otherProducts, setOtherProducts] = useState<AuctionProduct[]>([]);

    // UI State
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Toast State
    const [showToastSuccess, setShowToastSuccess] = useState(false);
    const [showToastFail, setShowToastFail] = useState(false);
    const [toastFailText, setToastFailText] = useState('');

    // Bid State
    const [bidAmount, setBidAmount] = useState(1)

    // AuctionClock Logic
    const [currentPrice, setCurrentPrice] = useState(0);
    const [clockProgress, setClockProgress] = useState(100); // 100% to 0%
    const [isPaused, setIsPaused] = useState(false);

    // Helpers
    const nextProducts = otherProducts.slice(0, 3);
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? Number(user.id) : null;

    // Initial Data Fetch
    useEffect(() => {
        let cancelled = false;
        const fetchData = async () => {
            try {
                
                const response = await fetchWithToken('http://localhost:5001/api/AuctionProducts/' + id);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data: AuctionProduct[] = await response.json();

                if (!cancelled && data.length > 0) {
                    setMainProduct(data[0]!);
                    setOtherProducts(data.slice(1));
                    
                    // initalize clock price
                    setCurrentPrice(data[0]!.basePrice * 2); // start at 2x of base price
                }
            } catch (err) {
                console.error("Error with fetching data: ", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchData();
        return () => { cancelled = true; };
    }, [id]);

    // Reset Clock when Main Product Changes
    useEffect(() => {
        if (mainProduct) {
            // Reset Clock and Price
            setClockProgress(100);
            setCurrentPrice(mainProduct.basePrice * 1.2); //update start price to 120% of base price
            setBidAmount(1);
            setIsPaused(false);
        }
    }, [mainProduct]);

    // Ticking Clock Effect
    useEffect(() => {
        if (!mainProduct || isPaused || currentPrice <= mainProduct.basePrice) return;

        const tickRate = 100; // update every 100ms for animation
        const duration = 30000;
        const decrement = 100 / (duration / tickRate); 
        const priceDecrement = (mainProduct.basePrice * 0.2) / (duration / tickRate);

        const timer = setInterval(() => {
            setClockProgress((prev) => {
                if (prev <= 0) return 0;
                return prev - decrement;
            });

            setCurrentPrice((prev) => {
                // Stop at minimum base price
                if (prev <= mainProduct.basePrice) return mainProduct.basePrice;
                return prev - priceDecrement;
            });
        }, tickRate);

        return () => clearInterval(timer);
    }, [mainProduct, isPaused, currentPrice]);

    // Modal Handlers
    const handleOpenModal = () => {
        setIsPaused(true);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setIsPaused(false);
        setShowModal(false);
    };

    // Buying Logic
    const handleConfirmBuy = async () => {
        if (!userId) {
            setToastFailText(`You need to log in.`);
            setShowToastFail(true);
            return;
        }

        try {
            
            // API Call to create ProductSold
            await createProductSold(mainProduct!.id, currentPrice, userId, bidAmount);

            // Success logic
            setShowModal(false);
            setShowToastSuccess(true);
            
            // Flow Logic
            const remainingQuantity = mainProduct!.quantity - bidAmount;

            if (remainingQuantity <= 0) {
                // Product is fully bought -> Move to next product
                if (otherProducts.length > 0) {
                    setMainProduct(otherProducts[0]!);
                    setOtherProducts(prev => prev.slice(1));
                } else {
                    // No more products left
                    setMainProduct(null); 
                }
            } else {
                // Update quantity of current product
                setMainProduct(prev => prev ? { ...prev, quantity: remainingQuantity } : null);
                // reset or continue clock
                setIsPaused(false); 
            }

        } catch (error) {
            console.error("Error placing bid: ", error);
            setToastFailText("Error processing transaction.");
            setShowToastFail(true);
            setIsPaused(false); 
        }
    };

    if (loading) return (<Shell><LoadingSpinner /></Shell>);
    
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
                <h1 className='AuctionProductsH'>Products on Auction {id}</h1>

                {/* preview next products */}
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
                                    src={getProductImage(product.imageUrl)}
                                    alt={product.imageAlt}
                                    className="img-thumbnail"
                                />
                            </Col>
                            ))}
                        </Row>
                    </Card.Body>
                </Card>

                {/* Main Product Display */}
                <Card className='productCard'>
                    <Card.Header className='productCardHeader'><h2 id='productH2'>Product, {mainProduct.name}</h2></Card.Header>
                        <Card.Body className='productBody'>
                            <Row>
                                <Col className='productCol1' xs={12} md={6}>
                                    <img
                                        src={getProductImage(mainProduct.imageUrl)}
                                        alt={mainProduct.imageAlt}
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
                                        <li className='pd-list'><strong>Base Price:</strong> € {mainProduct.basePrice.toFixed(2)}</li>
                                        <li className="list-group-item fs-5">
                                            <strong>Available Quantity: </strong> <span className="badge bg-success">{mainProduct.quantity}</span>
                                        </li>
                                        <li className="list-group-item fw- fs-5">
                                            <strong>Current Price:</strong> € {currentPrice.toFixed(2)}
                                        </li>
                                    </ul>
                                    <ProgressBar 
                                        animated={!isPaused} 
                                        variant={clockProgress < 20 ? "danger" : clockProgress < 50 ? "warning" : "success"}
                                        now={clockProgress} 
                                        style={{height: '20px', borderRadius: 0}}
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    <Button type='button' variant='success' onClick={handleOpenModal}>Place Bid on {mainProduct.name}</Button>
                </Card>
            </Container>

            {/* Modal for Bidding */}
            <Modal show={showModal} onHide={handleCloseModal} animation={true}>
                <Modal.Header closeButton>
                    <Modal.Title style={{fontWeight:'bold', }}>Bid on product, {mainProduct.name}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="alert alert-info">
                        <strong>The clock has paused!</strong><br/>
                        Current price is: <strong>€ {currentPrice.toFixed(2)}</strong> each.
                    </div>
                    <Form>
                        <Form.Group className="mb-3" controlId="bidAmount">
                            <Form.Label className="fw-bold">
                                Enter a quantity (Available: {mainProduct?.quantity})
                            </Form.Label>
                            <Form.Control 
                                type="number" 
                                min="1"
                                max={mainProduct?.quantity}
                                value={bidAmount}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if(val > mainProduct.quantity) setBidAmount(mainProduct.quantity);
                                    else setBidAmount(val || 1);
                                }}
                            />
                        </Form.Group>
                    </Form>
                    <div className="d-flex justify-content-between border-top pt-3">
                        <span className="fw-bold fs-5">Total price:</span>
                        <span className="fw-bold fs-5">€ {(currentPrice * bidAmount).toFixed(2)}</span>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <p className='me-auto fw-bold fs-5'>Are you sure?</p>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        No
                    </Button>
                    <Button variant="primary" onClick={handleConfirmBuy}>
                        Yes (Buy {bidAmount})
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* TOASTS */}
            <ToastContainer position="middle-center" className="p-3">
                <Toast
                    bg="success"
                    onClose={() => setShowToastSuccess(false)}
                    show={showToastSuccess}
                    delay={6000}
                    autohide
                >
                    <Toast.Header>
                        <strong className="me-auto">Bid placed for on {mainProduct?.name}</strong>
                        <small>Just now</small>
                    </Toast.Header>
                    <Toast.Body style={{ color: "white" }}>
                        Your bid on {mainProduct?.name} was successful!
                    </Toast.Body>
                </Toast>
                <Toast
                    bg="danger"
                    onClose={() => setShowToastFail(false)}
                    show={showToastFail}
                    delay={10000}
                    autohide
                >
                    <Toast.Header>
                        <strong className="me-auto">Failed to place bid.</strong>
                        <small>Just now</small>
                    </Toast.Header>
                    <Toast.Body style={{ color: "white" }}>
                        {toastFailText}
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </Shell>
    )
}

export default ProductDetail;