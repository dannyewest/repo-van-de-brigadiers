import { Card, Alert } from "react-bootstrap";
import Shell from "@components/Shell";
import { useNavigate, useParams } from "react-router-dom";
import AuctionForm from "@components/AuctionForm";
import { getAuction, updateAuction } from "@api/ApiProvider";
import { useEffect, useState } from "react";
import { Auction } from "src/definitions/AuctionDefinition";
import { Auctioneer } from "src/definitions/UserDefinition";
import { ProductOption } from "src/definitions/ProductDefinition";

export default function AuctionEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: "success" | "danger"; message: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = (await getAuction(id ? Number(id) : 0)).json();
        if (!cancelled) setAuction(await data ?? null);
      } catch (err) {
        console.error(err);
        if (!cancelled) setAlert({ type: "danger", message: "Failed to load auction details." });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (data: {
    auctioneer: Auctioneer;
    startsAt: string;
    endsAt: string;
    status: string;
    products: ProductOption[];
  }) => {
    if (!id) return;
    setAlert(null);
    try {
      await updateAuction(Number(id), data);
      setAlert({ type: "success", message: "Auction updated successfully!" });
      setTimeout(() => navigate("/auctions"), 1500);
    } catch (err: any) {
      console.error(err);
      setAlert({ type: "danger", message: err.message ?? "An error occurred." });
    }
  };

  if (loading)
    return (
      <Shell>
        <div className="p-5 text-center">Loading…</div>
      </Shell>
    );

  if (!auction)
    return (
      <Shell>
        <Alert variant="danger" className="m-5">
          Auction not found.
        </Alert>
      </Shell>
    );

  return (
    <Shell>
      <Card className="w-75 mx-auto shadow-sm rounded-3 overflow-hidden">
        <Card.Header>Edit Auction</Card.Header>
        <Card.Body>
          {alert && (
            <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
              {alert.message}
            </Alert>
          )}
          <AuctionForm auction={auction} onSubmit={handleSubmit} />
        </Card.Body>
      </Card>
    </Shell>
  );
}
