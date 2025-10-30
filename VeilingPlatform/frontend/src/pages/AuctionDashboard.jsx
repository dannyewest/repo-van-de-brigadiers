import { useState } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import AuctionClock from "../components/AuctionClock.jsx";
import Shell from "../components/Shell.jsx";

export default function AuctionDashboard() {
  const [auctions, setAuctions] = useState([
    { id: 1, title: "Gouden Tulp • 30 stelen", seller: "WillemDeKweker", desc: "Een Willie klassieker.", prijs: "$30" },
    { id: 2, title: "Boeket Rozen • 50 stelen", seller: "John Barbeque", desc: "Een boeket voor de ware liefde ;).", prijs: "$25" },
    { id: 3, title: "Zonnebloemen", seller: "GreenHouse", desc: "Warme ochtend!", prijs: "$10" },
    { id: 4, title: "Plukker 1850 Lily", seller: "Luxury PotWorth", desc: "Een overprijzig plant dat dood gaat na 1 week..", prijs: "$200" },
  ]);

  const [selected, setSelected] = useState(null);

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
          <h2 className="fw-bold">Lopende veilingen</h2>
        </div>

        {/* Toolbar */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          <Badge bg="light" text="dark" className="px-3 py-2 border">
            Zoeken...
          </Badge>
          <Badge bg="light" text="dark" className="px-3 py-2 border">
            Categorie
          </Badge>
          <Badge bg="light" text="dark" className="px-3 py-2 border" onClick={sortPrice} style={{ cursor: "pointer" }}>
            Prijs
          </Badge>
        </div>

        {/* Veiling Grid */}
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {auctions.map((p) => (
            <Col key={p.id}>
              <Card className="h-100 shadow-sm border-0" onClick={() => setSelected(p)}>
                <div className="bg-light d-flex align-items-center justify-content-center text-muted" style={{ height: 150 }}>
                  Afbeelding
                </div>
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title className="fw-semibold">{p.title}</Card.Title>
                    <Card.Text className="text-muted mb-2">Verkoper: {p.seller}</Card.Text>
                    <Card.Text className="text-muted small">{p.desc}</Card.Text>
                    <div className="fw-bold mt-2">{p.prijs}</div>
                  </div>
                  <div className="text-center mt-3">
                    <AuctionClock price={p.prijs} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </Shell>
  );
}
