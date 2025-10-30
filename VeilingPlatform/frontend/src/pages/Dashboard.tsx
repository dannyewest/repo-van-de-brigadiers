import { useState } from "react";
import { Container, Row, Col, Card, Button, Badge, Form } from "react-bootstrap";
import AuctionClock from "../components/AuctionClock.js";
import Shell from "../components/Shell.js";
import auctions from '../api/Auction.json';
import orangeRosesImage from "../assets/flowers/orange_roses_bouquet.jpg"

export default function Dashboard() {
  // TODO Fetch auctions from API
  // const [auctions, setAuctions] = useState(auctions);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userName = storedUser ? storedUser.name : "Bezoeker";

  const sortPrice = () => {
    const sorted = [...auctions].sort((a, b) => {
      const priceA = parseFloat(a.prijs.replace("$", ""));
      const priceB = parseFloat(b.prijs.replace("$", ""));
      return priceA - priceB;
    });
    setAuctions(sorted);
  };

  return (
    <Shell>
      <Container className="py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold">Ongoing auctions</h2>
        </div>

        {/* Toolbar */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          <Form.Control type="text" placeholder="Search..." className="me-2" style={{ width: "200px" }} />
          <Button variant="outline-dark" className="px-3 py-2 border" text-align="center" style={{ cursor: "pointer" }}>
            Category
          </Button>
          <Button variant="outline-dark" className="px-3 py-2 border" onClick={sortPrice} style={{ cursor: "pointer" }}>
            Price
          </Button>
        </div>

        {/* Action Grid */}
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {auctions.map((a) => (
            <Col key={a.id}>
              <Card className="h-100 shadow-sm border-1 rounded-3">
                {/* Maybe use the first image of a product in an auction */}
                <Card.Img alt="Image of Products" variant="top" src={orangeRosesImage} className="d-flex align-self-center text-muted" style={{ maxHeight: 150, maxWidth: 150 }} />
                <Card.Body className="d-flex flex-column justify-content-between">
                    <Card.Title className="fw-semibold">Name of Auction</Card.Title>
                    <Card.Text className="text-muted small fw-bold mt-2">
                      Auctioneer: {a.auctioneer} <br />
                      Amount of products: {a.desc} <br />
                      Duration: {a.startTime} - {a.endTime}
                      {/* Don't think an actionclock is necessary here. */}
                    </Card.Text>
                    <AuctionClock price={11.01} />
                    <Button variant="success" size="sm" className="fw-bold shadow-sm mt-2">
                      Go to Auction
                    </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </Shell>
  );
}
