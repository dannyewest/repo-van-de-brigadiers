import Shell from "@components/Shell";
import { Card } from "react-bootstrap";
import AuctionForm from "@components/AuctionForm";
import { useNavigate } from "react-router-dom";
import { Auctioneer } from "src/definitions/UserDefinition";
import { createAuction } from "@api/ApiProvider";

export default function AuctionNew() {
  const navigate = useNavigate();

  const handleSubmit = async (data: {
    auctioneer: Auctioneer;
    productIds: number[];
    startsAt: string;
    endsAt: string;
  }) => {
    await createAuction(data);
    navigate("/auctions");
  };

  return (
    <Shell>
      <Card className="w-75 mx-auto shadow-sm rounded-3 overflow-hidden">
        <Card.Header>New Auction</Card.Header>
        <Card.Body>
          <AuctionForm auction={null} onSubmit={handleSubmit} />
        </Card.Body>
      </Card>
    </Shell>
  );
}
