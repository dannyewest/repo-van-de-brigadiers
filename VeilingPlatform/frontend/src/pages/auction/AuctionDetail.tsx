import { Card } from "react-bootstrap";
import Shell from "@components/Shell";
import { useNavigate, useParams } from "react-router-dom";
import AuctionForm from "@components/AuctionForm";
import auctions from '../../api/Auction.json';
import { getAuction } from "@api/ApiProvider";
import { useEffect, useState } from "react";
import { Auction } from "src/definitions/AuctionDefinition";
import { Auctioneer } from "src/definitions/UserDefinition";
import LoadingSpinner from "@components/LoadingSpinner";

    function AuctionDetail() {
    const { id } = useParams();
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

    const handleSubmit = (data: { auctioneer: Auctioneer; startsAt: string; endsAt: string; productIds: string[] }) => {
        // TODO: implement submit logic
        console.log("Submitted auction data:", data);
        return data;
    };

    if (loading) return (<Shell><LoadingSpinner /></Shell>);
    if (!auction) return <div>Niet gevonden</div>;

    return (
        <Shell>
            <Card className="w-75 mx-auto shadow-sm rounded-3 overflow-hidden">
                <Card.Header>
                    Auction Details
                </Card.Header>
                <Card.Body>
                    <AuctionForm auction={auction} onSubmit={handleSubmit} />
                </Card.Body>
            </Card>
        </Shell>
    );
}

export default AuctionDetail;