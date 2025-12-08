import { getAvailableProducts, getProductImage } from "@api/ApiProvider";
import { useEffect, useState } from "react";
import { Button, Card, Col, Form, FormControl, Modal, Row } from "react-bootstrap";
import LoadingSpinner from "./LoadingSpinner";
import { ProductOption } from "src/definitions/ProductDefinition";

type Props = {
  value: ProductOption[];
  auctionId?: number | null;
  onChange: (value: ProductOption[]) => void;
};

export default function ProductSelect({
  value,
  auctionId,
  onChange,
}: Props) {
  const [modalState, setModalState] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);

  const handleClose = () => setModalState(false);
  const handleShow = () => setModalState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getAvailableProducts(auctionId ?? undefined);
        if (!cancelled) setProducts(data ?? []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [auctionId]);

  if (loading) return (<LoadingSpinner />);

  return (
    <div>
      <Button onClick={handleShow}>Select Product</Button>
      <Modal show={modalState} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Select Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            {products.map((product) => {
              const selected = value.find((p) => p.id === product.id);
              const isChecked = !!selected;

              return (
                <Col className="col-3" key={product.id}>
                  <Card>
                    <Card.Header>
                      <Form.Check
                        label={product.name}
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            const exists = value.find((p) => p.id === product.id);
                            if (exists) {
                              onChange(value);
                            } else {
                              onChange([
                                ...value,
                                {
                                  id: product.id,
                                  maxPrice:
                                    product.maxPrice ?? null,
                                },
                              ]);
                            }
                          } else {
                            // verwijderen
                            onChange(value.filter((p) => p.id !== product.id));
                          }
                        }}
                      />
                    </Card.Header>
                    <Card.Img
                      variant="top"
                      src={getProductImage(product.imageUrl)}
                    />
                    <Card.Body hidden={!isChecked}>
                      <span className="w-50">
                        €{product.basePrice?.toFixed(2) ?? "0.00"} - €
                      </span>
                      <FormControl
                        placeholder="Max Price"
                        type="number"
                        size="sm"
                        style={{ width: "50%", display: "inline-block" }}
                        value={selected?.maxPrice ?? ""}
                        onChange={(e) => {
                          const raw = e.target.value;
                          const parsed = raw === "" ? null : Number(raw);

                          onChange(
                            value.map((p) =>
                              p.id === product.id
                                ? { ...p, maxPrice: isNaN(parsed ?? NaN) ? null : parsed }
                                : p
                            )
                          );
                        }}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
}