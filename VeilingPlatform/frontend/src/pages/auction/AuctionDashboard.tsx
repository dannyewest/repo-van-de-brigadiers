import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import AuctionClock from "@components/AuctionClock.jsx";
import Shell from "@components/Shell.jsx";
import LoadingSpinner from "@components/LoadingSpinner";
import { Product } from "src/definitions/ProductDefinition";
import { getProducts } from "@api/ApiProvider";

export default function AuctionDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getProducts();
        if (!cancelled) setProducts(data ?? []);
      } catch (error) {
        console.error("❌ Failed to load products:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading)
    return (
      <Shell>
        <LoadingSpinner />
      </Shell>
    );

  return (
    <Shell>
      <Container className="py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold">Available Products</h2>
        </div>

        {/* Toolbar */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          <Badge bg="light" text="dark" className="px-3 py-2 border">
            Search...
          </Badge>
          <Badge bg="light" text="dark" className="px-3 py-2 border">
            Category
          </Badge>
          <Badge
            bg="light"
            text="dark"
            className="px-3 py-2 border"
            style={{ cursor: "pointer" }}
          >
            Price
          </Badge>
        </div>

        {/* Product Grid */}
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {products.length === 0 ? (
            <p className="text-muted">No products found.</p>
          ) : (
            products.map((p) => (
              <Col key={p.id}>
                <Card className="h-100 shadow-sm border-0">
                  {/* Image */}
                  <div
                    className="bg-light d-flex align-items-center justify-content-center text-muted"
                    style={{ height: 150 }}
                  >
                    <img
                      src={
                        new URL(
                          `../assets/flowers/${
                            p.imageUrl ? p.imageUrl : "unknown.jpg"
                          }`,
                          import.meta.url
                        ).href
                      }
                      alt={p.name ?? "Unknown Product"}
                      style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>

                  {/* Card Content */}
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div>
                      <Card.Title className="fw-semibold">{p.name}</Card.Title>

                      <Card.Text className="text-muted mb-1">
                        Type:{" "}
                        {typeof p.type === "object"
                          ? p.type.name
                          : p.type ?? "Unknown"}
                      </Card.Text>

                      <Card.Text className="text-muted mb-1">
                        Pot Size: {p.potSize ?? "-"}
                      </Card.Text>

                      <Card.Text className="text-muted mb-1">
                        Quantity: {p.quantity ?? 0}
                      </Card.Text>

                      <Card.Text className="text-muted mb-1">
                        Supplier:{" "}
                        {typeof p.supplier === "object"
                          ? p.supplier.name
                          : p.supplier ?? "Unknown"}
                      </Card.Text>

                      <div className="fw-bold mt-2">€ {p.basePrice}</div>
                    </div>

                    {/* Optional AuctionClock display */}
                    <div className="text-center mt-3">
                      <AuctionClock price={p.basePrice ?? 0} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>
    </Shell>
  );
}
