import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Form } from "react-bootstrap";
import Shell from "@components/Shell.jsx";
import LoadingSpinner from "@components/LoadingSpinner";
import { Product } from "src/definitions/ProductDefinition";
import { getProducts } from "@api/ApiProvider";

export default function AuctionDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Sorting states
  const [priceSort, setPriceSort] = useState<"none" | "desc" | "asc">("none");

  //  Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Toggle sorting mode
  const togglePriceSort = () => {
    setPriceSort((prev) =>
      prev === "none" ? "desc" : prev === "desc" ? "asc" : "none"
    );
  };

  // Apply sorting
  const sortedProducts = [...products].sort((a, b) => {
    const priceA = a.basePrice ?? 0;
    const priceB = b.basePrice ?? 0;

    if (priceSort === "desc") return priceB - priceA;
    if (priceSort === "asc") return priceA - priceB;
    return 0;
  });

  // ⭐ Apply search filter
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
        console.error("Failed to load products:", error);
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
        {/*Header*/}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold">Available Auctions</h2>
        </div>

        {/* Toolbar */}
        <div className="d-flex flex-wrap gap-2 mb-4">

          {/* Search bar */}
          <Form.Control
            type="text"
            placeholder="Search Flowers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: 220 }}
          />
          
          {/* Price sort */}
          <Badge
            bg="light"
            text="dark"
            className="px-3 py-2 border"
            style={{ cursor: "pointer" }}
            onClick={togglePriceSort}
          >
            Price{" "}
            {priceSort === "desc"
              ? "↓"
              : priceSort === "asc"
              ? "↑"
              : ""}
          </Badge>
        </div>

        {/* Product Grid */}
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {filteredProducts.length === 0 ? (
            <p className="text-muted">No products found.</p>
          ) : (
            filteredProducts.map((p) => (
              <Col key={p.id}>
                <Card className="h-100 shadow-sm border-0">
                  <div
                    className="bg-light d-flex align-items-center justify-content-center text-muted"
                    style={{ height: 150 }}
                  >
                    <img
                      src={`/flowers/${p.imageUrl ?? "red_roses_bouquet.jpg"}`}
                      alt={p.name ?? "Unknown Product"}
                      style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>

                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div>
                      <Card.Title className="fw-semibold">{p.name}</Card.Title>

                      <Card.Text className="text-muted mb-1">
                        Amount Products: {p.quantity ?? 0}
                      </Card.Text>

                      <Card.Text className="text-muted mb-1">
                        Supplier: {String(p.supplier)}
                      </Card.Text>

                      <div className="fw-bold mt-2">€ {p.basePrice}</div>
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
