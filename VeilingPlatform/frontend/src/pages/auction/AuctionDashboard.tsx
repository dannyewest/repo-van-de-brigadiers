import { useEffect, useState, KeyboardEvent } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Shell from "@components/Shell.jsx";
import LoadingSpinner from "@components/LoadingSpinner";

// Types for dashboard API
interface DashboardProduct {
  id: number;
  name: string;
  basePrice: number;
  imageUrl?: string;
  imageAlt?: string;
}

interface DashboardAuction {
  id: number;
  startsAt: string;
  endsAt: string;
  status: string;
  products: DashboardProduct[];
}

export default function AuctionDashboard() {
  const [auctions, setAuctions] = useState<DashboardAuction[]>([]);
  const [filteredAuctions, setFilteredAuctions] = useState<DashboardAuction[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [priceSort, setPriceSort] = useState<"none" | "asc" | "desc">("none");

  const navigate = useNavigate();

  // Format Dutch dates
  function formatDate(dateString: string) {
    const d = new Date(dateString);
    return d.toLocaleString("nl-NL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function togglePriceSort() {
    setPriceSort((prev) =>
      prev === "none" ? "asc" : prev === "asc" ? "desc" : "none"
    );
  }

  function handleCardKeyDown(
    e: KeyboardEvent<HTMLElement>,
    auctionId: number
  ) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/auction/${auctionId}/products`);
    }
  }

  // Fetch auctions
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("http://localhost:5160/api/auctions/dashboard");
        const data = await res.json();

        if (!cancelled) {
          setAuctions(data ?? []);
          setFilteredAuctions(data ?? []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Filter + sort auctions
  useEffect(() => {
    const q = query.toLowerCase().trim();

    let result = [...auctions];

    // Search in product name
    if (q !== "") {
      result = result.filter((auction) =>
        auction.products.some((p) => p.name.toLowerCase().includes(q))
      );
    }

    // Price sorting (by first product)
    if (priceSort !== "none") {
      result.sort((a, b) => {
        const priceA = a.products[0]?.basePrice ?? 0;
        const priceB = b.products[0]?.basePrice ?? 0;

        return priceSort === "asc" ? priceA - priceB : priceB - priceA;
      });
    }

    setFilteredAuctions(result);
  }, [query, auctions, priceSort]);

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
        <div className="d-flex flex-wrap justify-content-between align-items-end mb-4 gap-3">
          <Form.Group controlId="auctionSearch" className="flex-grow-1">
            <Form.Label className="fw-semibold">Search by product name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search flowers..."
              aria-label="Search auctions"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Form.Group>
          {/* Sort */}
          <div className="d-flex flex-column">
            <Form.Label className="fw-semibold mb-1">Sort</Form.Label>
            <Button
              variant="secondary"
              className="px-4"
              onClick={togglePriceSort}
              aria-label={
                priceSort === "none"
                  ? "Sort by price ascending"
                  : priceSort === "asc"
                  ? "Sort by price descending"
                  : "Clear price sorting"
              }
            >
              Price{" "}
              {priceSort === "asc" ? "↑" : priceSort === "desc" ? "↓" : ""}
            </Button>
          </div>
        </div>

        {/* Empty State */}
        {filteredAuctions.length === 0 && (
          <div
            className="text-center text-muted py-5"
            role="status"
            aria-live="polite"
          >
            <h4 className="fw-semibold">No auctions found</h4>
            <p>Try adjusting your search or sorting options.</p>
          </div>
        )}

        {/* Auction Cards */}
        <Row className="g-3 g-lg-4">
          {filteredAuctions.map((auction) => {
            const product = auction.products[0];

            const imageUrl = product?.imageUrl
              ? `http://localhost:5160/flowers/${product.imageUrl}`
              : null;

            const alt =
              product?.imageAlt || `Image of ${product?.name ?? "product"}`;

            return (
              <Col key={auction.id} xs={12} sm={6} md={4} lg={3}>
                <Card
                  className="h-100 shadow-sm border-0"
                  tabIndex={0}
                >
                  {/* Image section */}
                  <div
                    className="bg-light d-flex align-items-center justify-content-center"
                    style={{ height: 150 }}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={alt}
                        style={{
                          maxHeight: "100%",
                          maxWidth: "100%",
                          objectFit: "contain",
                        }}
                        onError={(e) => {
                          // If the image fails to load, remove it and show alt text instead
                          e.currentTarget.style.display = "none";
                          const parent = e.currentTarget.parentElement;
                          if (parent) parent.textContent = alt;
                        }}
                      />
                    ) : (
                      <span className="text-muted small">{alt}</span>
                    )}
                  </div>

                  {/* Card */}
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div style={{ minHeight: 110 }}>
                      <Card.Title className="fw-semibold mb-1">
                        {product?.name ?? "Unknown product"}
                      </Card.Title>

                      <Card.Text className="text-muted mb-2">
                        Amount of products: {auction.products.length}
                      </Card.Text>

                      {/* Start + End Dates */}
                      <div className="text-muted small">
                        <div>Starts: {formatDate(auction.startsAt)}</div>
                        <div>Ends: {formatDate(auction.endsAt)}</div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="fw-bold mt-2">
                      €{product?.basePrice?.toFixed(2) ?? "0.00"}
                    </div>
                    <Button onClick={() => navigate(`/auction/${auction.id}/products`)}
                  onKeyDown={(e) => handleCardKeyDown(e, auction.id)}
                  style={{ cursor: "pointer" }}>View Auction</Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </Shell>
  );
}
