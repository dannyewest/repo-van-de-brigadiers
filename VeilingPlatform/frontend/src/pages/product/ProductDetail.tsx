import { useEffect, useState } from "react";
import { Card, Col, Container, Row, Button, Modal, Toast, ToastContainer, Form, ProgressBar, Table } from "react-bootstrap";
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

    // Helpers
    const nextProducts = otherProducts.slice(0, 3);
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user ? Number(user.id) : null;

    // TEMP MOCK DATA##################
    const mockHistorySupplier = [
        { date: '21 oktober 2025', price: 2.10 },
        { date: '16 september 2025', price: 1.15 },
        { date: '3 september 2025', price: 2.19 },
        { date: '18 augustus 2025', price: 1.25 },
    ];

    const mockHistoryAll = [
        { supplier: 'Firma Jansen', date: '21 november 2025', price: 2.10 },
        { supplier: 'Firma de Boer', date: '21 november 2025', price: 3.11 },
        { supplier: 'BloemenCorp', date: '20 november 2025', price: 1.21 },
        { supplier: 'GoFlowerGo', date: '19 november 2025', price: 0.12 },
    ];

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
            setCurrentPrice(mainProduct.basePrice * 1.25); //update start price to 120% of base price
            setBidAmount(0); // reset bid amount
        }
    }, [mainProduct]);

    // Ticking Clock Effect
    useEffect(() => {
        if (!mainProduct || currentPrice <= mainProduct.basePrice) return;

        const tickRate = 100; // update every 100ms for animation
        const duration = 60000;
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
    }, [mainProduct, currentPrice]);

    // Modal Handlers
    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Buying Logic
    const handleConfirmBuy = async () => {

        if (bidAmount <= 0) {
            setToastFailText(`Please enter a valid quantity to bid.`);
            setShowToastFail(true);
            return;
        }

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
            }

        } catch (error) {
            console.error("Error placing bid: ", error);
            setToastFailText("Error processing transaction.");
            setShowToastFail(true);
        }
    };

    //Quantity Input Handler
    const handleQuickAdd = (amount: number) => {
        setBidAmount((prev) => {
            const newValue = (prev || 0) + amount;
            if (newValue > mainProduct!.quantity) return mainProduct!.quantity;
            return newValue;
        });
    };

    const handleSetAmount = (type: string) => {
        if (type === 'max') setBidAmount(mainProduct!.quantity);
        if (type === 'reset') setBidAmount(1);
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
                            {/* Product Image Column */}
                            <Col className='productCol1' xs={12} md={6} lg={4}>
                                <img
                                    src={getProductImage(mainProduct.imageUrl)}
                                    alt={mainProduct.imageAlt}
                                    className="CurrentProductImage"
                                />
                            </Col>
                            {/* Product Details Column */}
                            <Col className='productCol2' xs={12} md={6} lg={4}>
                                <h3 id='productDetails fs-5'>Product Details:</h3>
                                <ul>
                                    <li className='pd-list'><strong>Supplier:</strong> {mainProduct.supplier}</li>
                                    <li className='pd-list'><strong>AuctionDate:</strong> {mainProduct.auctionDate}</li>
                                    <li className='pd-list'><strong>Pot Size:</strong> {mainProduct.potSize}</li>
                                    <li className='pd-list'><strong>Type:</strong> {mainProduct.type}</li>
                                    <li className='pd-list'><strong>Stem Length:</strong> {mainProduct.length} cm</li>
                                    <li className='pd-list'><strong>Base Price:</strong> € {mainProduct.basePrice.toFixed(2)}</li>
                                </ul>
                            </Col>
                            {/* Bidding Column */}
                            <Col className="pt-3 ps-3 border-top" md={12} lg={4}>
                                {/* View Price History Button */}
                                <div className="d-grid mb-3">
                                    <Button variant="outline-primary qButtonGroup fw-bold" onClick={handleOpenModal}>
                                        View Product Price History
                                    </Button>
                                </div>
                                {/* CurrentPrice & ProgressBar */}
                                <Col className="mx-auto d-grid mt-3 pt-3 border-top">
                                    <p className='currentPrice'>Current Price: € {currentPrice.toFixed(2)}</p>
                                    <ProgressBar
                                        label={`${clockProgress ? Math.floor(clockProgress) : 0}%`}
                                        animated={true}
                                        variant={clockProgress < 20 ? "danger" : clockProgress < 50 ? "warning" : "success"}
                                        now={clockProgress}
                                        style={{height: '32px', borderRadius: '8px', margin: '2px', maxWidth: '400px'}}
                                    />
                                </Col>
                                {/* Buy Form Group*/}
                                <Col className="mx-auto border-top pt-3 mt-3">
                                    <div className="d-flex flex-column align-items-left mb-3 quantityBidSection">
                                        <Form>
                                            <Form.Label className="fw-bold">
                                                Select a quantity <span className="badge bg-success"> Max: {mainProduct.quantity}</span>
                                            </Form.Label>                          
                                            <div className="input-group mb-3">
                                                {/* Quantity Input Field */}
                                                <Form.Control 
                                                    type="number" 
                                                    min="1"
                                                    max={mainProduct?.quantity}
                                                    value={bidAmount === 0 ? '' : bidAmount}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value);
                                                        if(val > mainProduct.quantity) setBidAmount(mainProduct.quantity);
                                                        else setBidAmount(val || 0);
                                                    }}
                                                    style={{ minWidth: '60px', maxWidth: '120px' }}
                                                />      
                                                {/* Total Price */}
                                                <span className="input-group-text bg-light fw-bold buyTotalPrice">
                                                    € {(currentPrice * bidAmount).toFixed(2)}
                                                </span>
                                                {/* Buy Button */}
                                                <Button variant="outline-success buyButton" onClick={handleConfirmBuy}>
                                                    <strong>Buy {mainProduct.name}</strong>
                                                </Button>
                                            </div>
                                        </Form>
                                        {/* Quick Add Buttons */}
                                        <div className="btn-group qButtonGroup" role="group">         
                                            <Button className='quantityButtons' variant="outline-danger" size="sm" onClick={() => handleSetAmount('reset')}>Reset</Button>
                                            <Button className='quantityButtons' variant="outline-dark" size="sm" onClick={() => handleQuickAdd(1)}>+1</Button>
                                            <Button className='quantityButtons' variant="outline-dark" size="sm" onClick={() => handleQuickAdd(10)}>+10</Button>
                                            {mainProduct.quantity > 100 && (
                                                <Button className='quantityButtons' variant="outline-dark" size="sm" onClick={() => handleQuickAdd(100)}>+100</Button>
                                            )}
                                            <Button className='quantityButtons' variant="outline-primary" size="sm" onClick={() => handleSetAmount('max')}>Max</Button>
                                        </div>
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>

            {/* TOASTS */}
            <ToastContainer position="bottom-center" className="p-3">
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

            {/* Price History Modal */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                <Modal.Header className="fw-bold" style={{ backgroundColor: "#ecfce6ff", padding: "8px"}} closeButton>
                    <Modal.Title>
                        Price history: {mainProduct?.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* From this suppliers */}
                    <p className="fw-bold">Historic prices from this supplier (last 10):</p>
                    <p className="text-muted mb-2">Supplier: {mainProduct?.supplier}</p>
                    
                    <Table striped bordered hover size="sm" className="mb-4">
                        <thead>
                            <tr>
                                <th className="headerStyle">Date</th>
                                <th className="headerStyle">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockHistorySupplier.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.date}</td>
                                    <td>€ {item.price.toFixed(2)} per {mainProduct?.type}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <p className="small fst-italic">Average price all historical orders of {mainProduct?.supplier}: <strong>1,07 euro per flower</strong></p>

                    <hr />

                    {/* All suppliers */}
                    <p className="fw-bold mt-3">Historic prices from all suppliers (last 10):</p>
                    
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th className="headerStyle">Supplier</th>
                                <th className="headerStyle">Date</th>
                                <th className="headerStyle">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockHistoryAll.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.supplier}</td>
                                    <td>{item.date}</td>
                                    <td>€ {item.price.toFixed(2)} per {mainProduct?.type}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <p className="small fst-italic">Average price all historical orders: <strong>2,34 euro per flower</strong></p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Shell>
    )
}

export default ProductDetail;