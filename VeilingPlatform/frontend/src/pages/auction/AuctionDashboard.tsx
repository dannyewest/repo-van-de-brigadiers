import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import AuctionClock from "@components/AuctionClock.jsx";
import Shell from "@components/Shell.jsx";
import { Auction } from "src/definitions/AuctionDefinition";
import { getAuctions } from "@api/ApiProvider";
import LoadingSpinner from "@components/LoadingSpinner";

export default function AuctionDashboard() {
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
        try {
            const data = await getAuctions();
            if (!cancelled) setAuctions(data ?? []);
        } finally {
            if (!cancelled) setLoading(false);
        }
        })();
        return () => { cancelled = true; };
    }, []);
  
  if (loading) return (<Shell><LoadingSpinner /></Shell>);

  return (
    <Shell>
      <Container className="py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold">Ongoing Auctions</h2>
        </div>

        {/* Toolbar */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          <Badge bg="light" text="dark" className="px-3 py-2 border">
            Search...
          </Badge>
          <Badge bg="light" text="dark" className="px-3 py-2 border">
            Category
          </Badge>
          <Badge bg="light" text="dark" className="px-3 py-2 border" style={{ cursor: "pointer" }}>
            Price
          </Badge>
        </div>

        {/* Veiling Grid */}
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {auctions.map((p) => (
            <Col key={p.id}>
              <Card className="h-100 shadow-sm border-0" >
                <div className="bg-light d-flex align-items-center justify-content-center text-muted" style={{ height: 150 }}>
                  <img src={`/flowers/${p.products[0]?.imageUrl ?? "unknown.jpg"}`} alt={p.products[0]?.name ?? "Unknown Product"} style={{ maxHeight: "100%", maxWidth: "100%" }}/>
                </div>
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title className="fw-semibold">{p.auctioneer.name}</Card.Title>
                    <Card.Text className="text-muted mb-2">Amount Products: {p.products.length}</Card.Text>
                    <div className="fw-bold mt-2">{p.products[0]?.basePrice ?? 0}</div>
                  </div>
                  <div className="text-center mt-3">
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
