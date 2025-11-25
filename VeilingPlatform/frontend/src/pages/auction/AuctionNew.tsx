import Shell from "@components/Shell";
import { Card, Alert } from "react-bootstrap";
import AuctionForm from "@components/AuctionForm";
import { useNavigate } from "react-router-dom";
import { Auctioneer } from "src/definitions/UserDefinition";
import { createAuction } from "@api/ApiProvider";
import { useState } from "react";

export default function AuctionNew() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState<{ type: "success" | "danger"; message: string } | null>(null);

  const handleSubmit = async (data: {
  auctioneer: Auctioneer;
  productIds: number[];
  startsAt: string;
  endsAt: string;
  status: string;
}) => {
  setAlert(null);
  try {
    await createAuction(data);
    setAlert({ type: "success", message: "Auction successfully created!" });
    setTimeout(() => navigate("/auctions"), 1500);
  } catch (err: any) {
    console.error(err);
    setAlert({ type: "danger", message: err.message ?? "An error occurred." });
  }
};

  return (
    <Shell>
      <Card className="w-75 mx-auto shadow-sm rounded-3 overflow-hidden">
        <Card.Header>New Auction</Card.Header>
        <Card.Body>
          {alert && (
            <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
              {alert.message}
            </Alert>
          )}
          <AuctionForm auction={null} onSubmit={handleSubmit} />
        </Card.Body>
      </Card>
    </Shell>
  );
}
