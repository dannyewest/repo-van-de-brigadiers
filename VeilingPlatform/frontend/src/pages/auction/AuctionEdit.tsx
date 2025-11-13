import { Card } from "react-bootstrap";
import Shell from "@components/Shell";
import { useNavigate, useParams } from "react-router-dom";
import AuctionForm from "@components/AuctionForm";
import { getAuction, updateAuction } from "@api/ApiProvider";
import { useEffect, useState } from "react";
import { Auction } from "src/definitions/AuctionDefinition";
import { Auctioneer } from "src/definitions/UserDefinition";

export default function AuctionEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getAuction(id ? Number(id) : 0);
        if (!cancelled) setAuction(data ?? null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const handleSubmit = async (data: {
    auctioneer: Auctioneer;
    productIds: number[]; // ⬅️ number[]
    startsAt: string;
    endsAt: string;
  }) => {
    if (!id) return;
    await updateAuction(Number(id), data); // helper accepteert number[]
    navigate("/auctions");
  };

  if (loading) return (<Shell><div className="p-5 text-center">Loading…</div></Shell>);
  if (!auction) return (<Shell><div className="p-5 text-center">Auction not found</div></Shell>);

  return (
    <Shell>
      <Card className="w-75 mx-auto shadow-sm rounded-3 overflow-hidden">
        <Card.Header>Edit Auction</Card.Header>
        <Card.Body>
          <AuctionForm auction={auction} onSubmit={handleSubmit} />
        </Card.Body>
      </Card>
    </Shell>
  );
}
