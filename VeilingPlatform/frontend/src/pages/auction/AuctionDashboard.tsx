import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";   // ⭐ Added for navigation
import Shell from "@components/Shell.jsx";
import LoadingSpinner from "@components/LoadingSpinner";
import { Product } from "src/definitions/ProductDefinition";
import { getProducts } from "@api/ApiProvider";

export default function AuctionDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // ⭐

  // Sorting
  const [priceSort, setPriceSort] = useState<"none" | "desc" | "asc">("none");

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  const togglePriceSort = () =>
    setPriceSort((prev) =>
      prev === "none" ? "desc" : prev === "desc" ? "asc" : "none"
    );

  const sortedProducts = [...products].sort((a, b) => {
    const priceA = a.basePrice ?? 0;
    const priceB = b.basePrice ?? 0;
    if (priceSort === "desc") return priceB - priceA;
    if (priceSort === "asc") return priceA - priceB;
    return 0;
  });

  const filteredProducts = sortedProducts.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getProducts();
        if (!cancelled) setProducts(data ?? []);
      } catch (error) {
        console.error("Failed to load auctions:", error);
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Available Auctions</h2>
        </div>

        {/* Toolbar */}
        <div className="d-flex flex-wrap gap-3 mb-4">
          <Form.Control
            type="text"
            placeholder="Search Auctions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-auto"
            style={{ minWidth: 240 }}
          />

          {/* You might remove price sort later since auctions don't display price */}
          <Button
            variant={priceSort === "none" ? "outline-secondary" : "primary"}
            className="px-3"
            onClick={togglePriceSort}
          >
            Sort by price {priceSort === "desc" ? "↓" : priceSort === "asc" ? "↑" : ""}
          </Button>
        </div>

        {/* Auction Grid */}
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {filteredProducts.length === 0 ? (
            <p className="text-muted">No auctions found.</p>
          ) : (
            filteredProducts.map((p) => (
              <Col key={p.id}>
                <Card
                  className="h-100 shadow-sm border rounded-3"
                  style={{ cursor: "pointer" }}     // ⭐ Clickable
                  onClick={() => navigate(`/auction/${p.id}`)} // ⭐ Go to auction detail
                >
                  {/* Image */}
                  <div
                    className="bg-light d-flex align-items-center justify-content-center rounded-top"
                    style={{ height: 150 }}
                  >
                    <img
                      src={`/flowers/${p.imageUrl ?? "red_roses_bouquet.jpg"}`}
                      alt={p.name ?? "Auction"}
                      className="img-fluid p-2"
                      style={{
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>

                  {/* Body */}
                  <Card.Body className="d-flex flex-column">

                    <Card.Title className="fw-semibold mb-2">
                      {p.name}
                    </Card.Title>

                    {/* Auction Date */}
                    <Card.Text className="text-secondary small mb-2">
                      Auction Date:{" "}
                      <strong>
                        {p.auctionDate
                          ? new Date(p.auctionDate).toLocaleDateString()
                          : "Unknown"}
                      </strong>
                    </Card.Text>

                    {/* Optional: number of lots */}
                    {p.quantity !== undefined && (
                      <Card.Text className="small text-muted fw-bold">
                        Quantity of {p.quantity} 
                      </Card.Text>
                    )}

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
