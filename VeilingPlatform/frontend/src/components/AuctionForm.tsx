import { Button, Col, Form, Row } from "react-bootstrap";
import FlowerSelect from "@components/FlowerSelect";
import { useState } from "react";
import { Auction } from "src/definitions/AuctionDefinition";
import { Auctioneer } from '../definitions/UserDefinition';
import { useNavigate } from "react-router-dom";

type Props = {
  auction?: Auction;
  onSubmit: (
    data: {
      auctioneer: Auctioneer;
      productIds: string[];
      startsAt: string;
      endsAt: string;
    }
  ) => void;
};

export default function AuctionForm({ auction, onSubmit }: Props) {
    const [auctioneer, setAuctioneer] = useState<Auctioneer | null>(auction?.auctioneer ?? null);
    const [productIds, setProductIds] = useState<string[]>(auction?.products?.map(p => p.id) ?? []);
    const [startsAt, setStartsAt] = useState<string>(auction?.startsAt ?? "");
    const [endsAt, setEndsAt] = useState<string>(auction?.endsAt ?? "");
    const [errors, setErrors] = useState<{ auctioneer?: string }>({});

    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!auctioneer) {
        setErrors({ auctioneer: "Select an auctioneer" });
        return; // -> zonder auctioneer geen submit
    }

    onSubmit({ auctioneer, productIds, startsAt, endsAt });
    };

    // TODO fetch auctioneers and products from API, populate select options dynamically
    // TODO decide on how to handle products, either through multi-select or a collection window (popup with a small gallery of the products to choose from)
    // TODO add validators and handle form state, and check on if products have been added by other auctions first, remove if they have been.

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3 gy-2" controlId="formAuctionDetails">
                    <Form.Label column sm="2">Auctioneer</Form.Label>
                    <Col sm="10">
                        <Form.Select aria-label="Default select example" value={auctioneer?.name || ""}>
                            <option hidden selected>Please pick an auctioneer</option>
                            <option value="Jane Doe">Jane Doe</option>
                            <option value="John Doe">John Doe</option>
                            <option value="John Smith">John Smith</option>
                            <option value="Alice Johnson">Alice Johnson</option>
                        </Form.Select>
                    </Col>
                    <Form.Label column sm="2">Start Time</Form.Label>
                    <Col sm="10">
                        <Form.Control type="time" placeholder="Start Time" value={startsAt || ""} onChange={(e) => setStartsAt(e.target.value)} />
                    </Col>
                    <Form.Label column sm="2">End Time</Form.Label>
                    <Col sm="10">
                        <Form.Control type="time" placeholder="End Time" value={endsAt || ""} onChange={(e) => setEndsAt(e.target.value)} />
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row} className="mb-3 gy-2" controlId="formProducts">
                    <Form.Label column sm="2">Products</Form.Label>
                    <Col sm="10">
                        <FlowerSelect />
                    </Col>
                </Form.Group>
                

                <div className="d-flex justify-content-end mt-4">
                    <Button className="me-2" variant="secondary" onClick={() => navigate("/auctions")}>
                        Cancel
                    </Button>
                    <Button variant="success" type="submit" disabled={!auctioneer || !startsAt || !endsAt}>
                        { auction?.id ? "Update Auction" : "Create Auction" }
                    </Button>
                </div>
                
            </Form>
        </div>
  );
}