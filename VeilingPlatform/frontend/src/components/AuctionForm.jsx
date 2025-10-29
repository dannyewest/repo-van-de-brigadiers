import { Button, Col, Form, Row } from "react-bootstrap";
import FlowerSelect from "./FlowerSelect";

export default function AuctionForm({ auction }) {
    auction = auction || {};

    return (
        <div>
            <Form>
                <Form.Group as={Row} className="mb-3 gy-2" controlId="formAuctionDetails">
                    <Form.Label column sm="2">Auctioneer</Form.Label>
                    <Col sm="10">
                        <Form.Select aria-label="Default select example" value={auction.auctioneer || ""}>
                            <option hidden selected>Please pick an auctioneer</option>
                            <option value="Jane Doe">Jane Doe</option>
                            <option value="John Doe">John Doe</option>
                            <option value="John Smith">John Smith</option>
                            <option value="Alice Johnson">Alice Johnson</option>
                        </Form.Select>
                    </Col>
                    <Form.Label column sm="2">Start Time</Form.Label>
                    <Col sm="10">
                        <Form.Control type="time" placeholder="Start Time" value={auction.startTime || ""} />
                    </Col>
                    <Form.Label column sm="2">End Time</Form.Label>
                    <Col sm="10">
                        <Form.Control type="time" placeholder="End Time" value={auction.endTime || ""} />
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
                <Button variant="success" type="submit">
                    { auction.id ? "Update Auction" : "Create Auction" }
                </Button>
                </div>
            </Form>
        </div>
  );
}