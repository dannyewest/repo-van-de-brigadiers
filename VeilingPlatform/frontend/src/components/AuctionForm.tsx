import { useEffect, useMemo, useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Auction } from "src/definitions/AuctionDefinition";
import { Product } from "src/definitions/ProductDefinition";
import { Auctioneer } from "src/definitions/UserDefinition";
import ProductSelect from "./ProductSelect";

type Props = {
  auction: Auction | null;
  onSubmit: (data: {
    auctioneer: Auctioneer;
    productIds: number[];
    startsAt: string;
    endsAt: string;
    status: string;
  }) => void;
};

type FormErrors = {
  auctioneer?: string;
  startsAt?: string;
  endsAt?: string;
};

export default function AuctionForm({ auction, onSubmit }: Props) {
  const navigate = useNavigate();

  const [auctioneer, setAuctioneer] = useState<Auctioneer | null>(
    auction?.auctioneer ?? null
  );

  const initialProductIds: number[] = useMemo(
    () => auction?.products?.map((p: Product) => p.id) ?? [],
    [auction]
  );
  const [productIds, setProductIds] = useState<number[]>(initialProductIds);

  const [startsAt, setStartsAt] = useState<string>(auction?.startsAt ?? "");
  const [endsAt, setEndsAt] = useState<string>(auction?.endsAt ?? "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<string>(auction?.status ?? "Scheduled");

  useEffect(() => {
    setAuctioneer(auction?.auctioneer ?? null);
    setProductIds(auction?.products?.map((p: Product) => p.id) ?? []);
    setStartsAt(auction?.startsAt ?? "");
    setEndsAt(auction?.endsAt ?? "");
  }, [auction]);

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!auctioneer?.name || auctioneer.name.trim() === "") {
      next.auctioneer = "Please pick an auctioneer";
    }
    if (!startsAt) next.startsAt = "Start time is required";
    if (!endsAt) next.endsAt = "End time is required";
    if (startsAt && endsAt && new Date(startsAt) > new Date(endsAt)) {
      next.endsAt = "End time must be after start time";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !auctioneer) return;

    onSubmit({
      auctioneer,
      productIds,
      startsAt,
      endsAt,
      status,
    });
  };

  const handleProductIdsChange = (value: string) => {
    const parts = value
      .split(/[,\s]+/)
      .map(s => s.trim())
      .filter(Boolean);
    const nums = parts
      .map(s => Number(s))
      .filter(n => Number.isFinite(n)) as number[];
    setProductIds(nums);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card className="border-0">
        <Card.Body>
          {/* Auctioneer */}
          <Form.Group className="mb-3">
            <Form.Label>Auctioneer</Form.Label>
            <Form.Select
              aria-label="Pick auctioneer"
              value={auctioneer?.name ?? ""}
              onChange={(e) => {
                const name = e.target.value || "";
                setAuctioneer(name ? ({ id: auctioneer?.id ?? 0, name } as Auctioneer) : null);
                if (errors.auctioneer) setErrors((prev) => ({ ...prev, auctioneer: undefined }));
              }}
              isInvalid={!!errors.auctioneer}
            >
              <option value="" hidden>Please pick an auctioneer</option>
              <option value="Jane Doe">Jane Doe</option>
              <option value="John Doe">John Doe</option>
              <option value="John Smith">John Smith</option>
              <option value="Alice Johnson">Alice Johnson</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.auctioneer}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Product IDs */}
          <Form.Group className="mb-3">
            <Form.Label>Products</Form.Label>
            <ProductSelect
              value={productIds}
              onChange={setProductIds}
              placeholder="Type to search products…"
              isClearable
            />
            <Form.Text className="text-muted">
              Pick one or more products for this auction.
            </Form.Text>
          </Form.Group>

          {/* StartsAt */}
          <Form.Group className="mb-3">
            <Form.Label>Starts at</Form.Label>
            <Form.Control
              type="time"
              value={startsAt}
              onChange={(e) => {
                setStartsAt(e.target.value);
                if (errors.startsAt) setErrors((prev) => ({ ...prev, startsAt: undefined }));
              }}
              isInvalid={!!errors.startsAt}
            />
            <Form.Control.Feedback type="invalid">
              {errors.startsAt}
            </Form.Control.Feedback>
          </Form.Group>

          {/* EndsAt */}
          <Form.Group className="mb-3">
            <Form.Label>Ends at</Form.Label>
            <Form.Control
              type="time"
              value={endsAt}
              onChange={(e) => {
                setEndsAt(e.target.value);
                if (errors.endsAt) setErrors((prev) => ({ ...prev, endsAt: undefined }));
              }}
              isInvalid={!!errors.endsAt}
            />
            <Form.Control.Feedback type="invalid">
              {errors.endsAt}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Status */}
          {auction && (
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  borderLeft: `5px solid ${
                    status === "Running" ? "#198754" : status === "Scheduled" ? "#ffc107" : "#212529"
                  }`,
                }}
              >
                <option value="Running">Running</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Stopped">Stopped</option>
              </Form.Select>
              <Form.Text className="text-muted">
                Current status of the auction
              </Form.Text>
            </Form.Group>
          )}

          <div className="d-flex gap-2">
            <Button type="submit" variant="primary">Save</Button>
            <Button type="button" variant="outline-secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </Card.Body>
      </Card>
    </form>
  );
}
