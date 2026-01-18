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
    const [bidAmount, setBidAmount] = useState(1);

    // AuctionClock Logic
    const [currentPrice, setCurrentPrice] = useState(0);
    const [clockProgress, setClockProgress] = useState(100);

    // Product History State (NEW)
    const [supplierHistory, setSupplierHistory] = useState<{ date: string; price: number }[]>([]);
    const [allHistory, setAllHistory] = useState<{ supplier: string; date: string; price: number }[]>([]);
    const [avgSupplierPrice, setAvgSupplierPrice] = useState<number>(0);
    const [avgAllPrice, setAvgAllPrice] = useState<number>(0);

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
                const response = await fetchWithToken(
                    'http://localhost:5001/api/AuctionProducts/' + id
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: AuctionProduct[] = await response.json();

                if (!cancelled && data.length > 0) {
                    setMainProduct(data[0]!);
                    setOtherProducts(data.slice(1));

                    // initialize clock price
                    setCurrentPrice(data[0]!.basePrice * 2);
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
            setClockProgress(100);
            setCurrentPrice(mainProduct.basePrice * 1.25);
            setBidAmount(0);
        }
    }, [mainProduct]);

    // Ticking Clock Effect
    useEffect(() => {
        if (!mainProduct || currentPrice <= mainProduct.basePrice) return;

        const tickRate = 100;
        const duration = 60000;
        const decrement = 100 / (duration / tickRate);
        const priceDecrement = (mainProduct.basePrice * 0.2) / (duration / tickRate);

        const timer = setInterval(() => {
            setClockProgress(prev => prev <= 0 ? 0 : prev - decrement);
            setCurrentPrice(prev =>
                prev <= mainProduct.basePrice
                    ? mainProduct.basePrice
                    : prev - priceDecrement
            );
        }, tickRate);

        return () => clearInterval(timer);
    }, [mainProduct, currentPrice]);

    // Modal Handlers (MERGED PRODUCT HISTORY LOGIC)
    const handleOpenModal = async () => {
        if (!mainProduct) return;

        try {
            const response = await fetchWithToken(
                `http://localhost:5001/api/product-history/${mainProduct.id}?supplier=${mainProduct.supplier}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setSupplierHistory(
                data.supplierHistory.map((h: any) => ({
                    date: new Date(h.date).toLocaleDateString("nl-NL", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    }),
                    price: h.price,
                }))
            );

            setAllHistory(
                data.allHistory.map((h: any) => ({
                    supplier: h.supplier,
                    date: new Date(h.date).toLocaleDateString("nl-NL", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    }),
                    price: h.price,
                }))
            );

            setAvgSupplierPrice(data.averageSupplierPrice);
            setAvgAllPrice(data.averageAllPrice);

            setShowModal(true);
        } catch (err) {
            console.error("Failed to fetch price history: ", err);
        }
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
            await createProductSold(
                mainProduct!.id,
                currentPrice,
                userId,
                bidAmount
            );

            setShowModal(false);
            setShowToastSuccess(true);

            const remainingQuantity = mainProduct!.quantity - bidAmount;

            if (remainingQuantity <= 0) {
                if (otherProducts.length > 0) {
                    setMainProduct(otherProducts[0]!);
                    setOtherProducts(prev => prev.slice(1));
                } else {
                    setMainProduct(null);
                }
            } else {
                setMainProduct(prev =>
                    prev ? { ...prev, quantity: remainingQuantity } : null
                );
            }

        } catch (error) {
            console.error("Error placing bid: ", error);
            setToastFailText("Error processing transaction.");
            setShowToastFail(true);
        }
    };

    // Quantity Helpers
    const handleQuickAdd = (amount: number) => {
        setBidAmount(prev => {
            const newValue = (prev || 0) + amount;
            if (newValue > mainProduct!.quantity) {
                return mainProduct!.quantity;
            }
            return newValue;
        });
    };

    const handleSetAmount = (type: string) => {
        if (type === 'max') setBidAmount(mainProduct!.quantity);
        if (type === 'reset') setBidAmount(1);
    };

    if (loading) {
        return (
            <Shell>
                <LoadingSpinner />
            </Shell>
        );
    }

    if (!mainProduct) {
        return (
            <Shell>
                <Card className="noAPCard">
                    <h2 className='apNone'>No products left on auction {id}.</h2>
                    <div>
                        <Button variant='outline-primary' className='apReturnB' onClick={() => navigate(-1)}>
                            Go Back
                        </Button>
                        <Button variant='outline-primary' className='apReturnB' onClick={() => navigate(0)}>
                            Refresh
                        </Button>
                    </div>
                </Card>
            </Shell>
        );
    }

    return (
        <Shell>
            <Container className='productDetailContainer'>
                <h1 className='AuctionProductsH'>Products on Auction {id}</h1>

                {/* preview next products */}
                <Card className='productCard'>
                    <Card.Header className='productCardHeader'>
                        <h2 id='nextProductsHeader'>
                            {otherProducts.length > 0
                                ? (otherProducts.length === 1
                                    ? '1 product left to be auctioned.'
                                    : otherProducts.length + ' coming products to be auctioned:')
                                : "There are no products left."}
                        </h2>
                    </Card.Header>
                    <Card.Body className='productBannerBody'>
                        <Row>
                            {nextProducts.map(product => (
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

                {/* Main Product */}
                <Card className='productCard'>
                    <Card.Header className='productCardHeader'>
                        <h2 id='productH2'>Product, {mainProduct.name}</h2>
                    </Card.Header>
                    <Card.Body className='productBody'>
                        <Row>
                            <Col className='productCol1' xs={12} md={6} lg={4}>
                                <img
                                    src={getProductImage(mainProduct.imageUrl)}
                                    alt={mainProduct.imageAlt}
                                    className="CurrentProductImage"
                                />
                            </Col>

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

                            <Col className="pt-3 ps-3 border-top" md={12} lg={4}>
                                <div className="d-grid mb-3">
                                    <Button
                                        aria-label="View product price history"
                                        variant="outline-primary qButtonGroup fw-bold"
                                        onClick={handleOpenModal}
                                    >
                                        Price History
                                    </Button>
                                </div>

                                <Col className="mx-auto d-grid mt-3 pt-3 border-top">
                                    <p className='currentPrice'>
                                        Current Price: € {currentPrice.toFixed(2)}
                                    </p>
                                    <ProgressBar
                                        label={`${Math.floor(clockProgress)}%`}
                                        animated
                                        variant={
                                            clockProgress < 20
                                                ? "danger"
                                                : clockProgress < 50
                                                    ? "warning"
                                                    : "success"
                                        }
                                        now={clockProgress}
                                        style={{
                                            height: '32px',
                                            borderRadius: '8px',
                                            margin: '2px',
                                            maxWidth: '400px'
                                        }}
                                    />
                                </Col>

                                <Col className="mx-auto border-top pt-3 mt-3">
                                    <div className="d-flex flex-column align-items-left mb-3 quantityBidSection">
                                        <Form>
                                            <Form.Label className="fw-bold">
                                                Enter a quantity, available:
                                                <span className="badge bg-success">
                                                    Max: {mainProduct.quantity}
                                                </span>
                                            </Form.Label>

                                            <div className="input-group mb-3">
                                                <Form.Control
                                                    aria-label="Enter the amount of products you want to buy."
                                                    type="number"
                                                    min="1"
                                                    max={mainProduct.quantity}
                                                    value={bidAmount === 0 ? '' : bidAmount}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value);
                                                        if (val > mainProduct.quantity) {
                                                            setBidAmount(mainProduct.quantity);
                                                        } else {
                                                            setBidAmount(val || 0);
                                                        }
                                                    }}
                                                    style={{ minWidth: '60px', maxWidth: '120px' }}
                                                />

                                                <span className="input-group-text bg-light fw-bold buyTotalPrice">
                                                    € {(currentPrice * bidAmount).toFixed(2)}
                                                </span>

                                                <Button
                                                    variant="outline-success buyButton"
                                                    aria-label={`Buy ${bidAmount} x ${mainProduct.name}`}
                                                    title={`Buy ${bidAmount} x ${mainProduct.name}`}
                                                    onClick={handleConfirmBuy}
                                                >
                                                    <strong>Place bid</strong>
                                                </Button>
                                            </div>
                                        </Form>

                                        <div className="btn-group qButtonGroup" role="group">
                                            <Button className='quantityButtons' variant="outline-danger" size="sm" onClick={() => handleSetAmount('reset')}>
                                                Reset
                                            </Button>
                                            <Button className='quantityButtons' variant="outline-dark" size="sm" onClick={() => handleQuickAdd(1)}>
                                                +1
                                            </Button>
                                            <Button className='quantityButtons' variant="outline-dark" size="sm" onClick={() => handleQuickAdd(10)}>
                                                +10
                                            </Button>
                                            {mainProduct.quantity > 100 && (
                                                <Button className='quantityButtons' variant="outline-dark" size="sm" onClick={() => handleQuickAdd(100)}>
                                                    +100
                                                </Button>
                                            )}
                                            <Button className='quantityButtons' variant="outline-primary" size="sm" onClick={() => handleSetAmount('max')}>
                                                Max
                                            </Button>
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
                <Toast bg="success" show={showToastSuccess} onClose={() => setShowToastSuccess(false)} delay={6000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Bid placed for {mainProduct.name}</strong>
                        <small>Just now</small>
                    </Toast.Header>
                    <Toast.Body style={{ color: "white" }}>
                        Your bid on {mainProduct.name} was successful!
                    </Toast.Body>
                </Toast>

                <Toast bg="danger" show={showToastFail} onClose={() => setShowToastFail(false)} delay={10000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Failed to place bid.</strong>
                        <small>Just now</small>
                    </Toast.Header>
                    <Toast.Body style={{ color: "white" }}>
                        {toastFailText}
                    </Toast.Body>
                </Toast>
            </ToastContainer>

            {/* PRICE HISTORY MODAL */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                <Modal.Header closeButton className="fw-bold" style={{ backgroundColor: "#ecfce6ff", padding: "8px" }}>
                    <Modal.Title>
                        Price history: {mainProduct.name}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p className="fw-bold">Historic prices from this supplier (last 10):</p>
                    <p className="text-muted mb-2">Supplier: {mainProduct.supplier}</p>

                    <Table striped bordered hover size="sm" className="mb-4">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {supplierHistory.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.date}</td>
                                    <td>€ {item.price.toFixed(2)} per {mainProduct.type}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <p className="small fst-italic">
                        Average price all historical orders of {mainProduct.supplier}:
                        <strong> € {avgSupplierPrice.toFixed(2)} per {mainProduct.type}</strong>
                    </p>

                    <hr />

                    <p className="fw-bold mt-3">Historic prices from all suppliers (last 10):</p>

                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Supplier</th>
                                <th>Date</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allHistory.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.supplier}</td>
                                    <td>{item.date}</td>
                                    <td>€ {item.price.toFixed(2)} per {mainProduct.type}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <p className="small fst-italic">
                        Average price all historical orders:
                        <strong> € {avgAllPrice.toFixed(2)} per {mainProduct.type}</strong>
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Shell>
    );
};

export default ProductDetail;