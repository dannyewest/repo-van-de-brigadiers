import Shell from "@components/Shell";
import { Table, Badge, Card } from "react-bootstrap";
import "@style/auction.scss";
import { SquarePlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteAuction, getAllAuctions } from "@api/ApiProvider";
import LoadingSpinner from "@components/LoadingSpinner";

function AuctionList() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [auctions, setAuctions] = useState<any[]>([]);
    useEffect(() => {
        let cancelled = false;
        (async () => {
        try {
            const data = await getAllAuctions();
            if (!cancelled) setAuctions(data ?? []);
        } finally {
            if (!cancelled) setLoading(false);
        }
        })();
        return () => { cancelled = true; };
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this auction?")) return;

        try {
            const response = deleteAuction(id)

            if (!(await response).ok) throw new Error("Auction couldn't be deleted");

            setAuctions(auctions.filter(a => a.id !== id));
            alert("Auction has been deleted!");
        } catch (error) {
            console.error(error);
            alert("Something went wrong with deleting the auction.");
        }
    };

    const statusToVariant: Record<string, string> = {
        Running: "success",
        Scheduled: "warning",
        Stopped: "dark",
        Error: "danger",
    };

    if (loading) return (<Shell><LoadingSpinner /></Shell>);

    return (
        <Shell>
            <Card className="shadow-sm border-0 overflow-hidden rounded-3 w-75 mx-auto p-2">
                <Card.Header className="bg-body d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">Auction Overview</span>
                    {/* TODO Add filter/search field if needed */}
                    <div className="align-items-end">
                        <button onClick={() => navigate("/auction/new")} className="btn d-flex align-items-center">
                            <SquarePlusIcon /> Create Auction
                        </button>
                    </div>
                </Card.Header>

                <div className="table-responsive" style={{ maxHeight: 420 }}>
                    <Table hover size="sm" className="mb-0 auction-table align-center">
                        <thead className="table-flora sticky-top">
                            <tr>
                            <th className="text-uppercase small">Auction ID</th>
                            <th className="text-uppercase small">Auctioneer</th>
                            <th className="text-uppercase small">Amount Products</th>
                            <th className="text-uppercase small">Start Time</th>
                            <th className="text-uppercase small">End Time</th>
                            <th className="text-uppercase small">Status</th>
                            <th className="text-uppercase small">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {auctions.length ? (
                                auctions.map((a) => (
                                    <tr key={a.id}>
                                        <td className="fw-medium">
                                            {a.id}
                                        </td>
                                        <td>
                                            <span>{a.auctioneer?.name ?? "Unknown"}</span>
                                        </td>
                                        <td className="font-monospace">
                                            {a.products.length}
                                        </td>
                                        <td className="font-monospace text-nowrap">
                                            {a.startTime ?? "Unknown"}
                                        </td>
                                        <td className="font-monospace text-nowrap">
                                            {a.endTime ?? "Unknown"}
                                        </td>
                                        <td>
                                            <Badge
                                                bg={statusToVariant[a.status] || "secondary"}
                                                className="rounded-pill px-3"
                                            >
                                                {a.status ?? "Unknown"}
                                            </Badge>
                                        </td>
                                        <td className="font-monospace text-nowrap">
                                            <button
                                                onClick={() => navigate(`/auction/${a.id}/edit`)}
                                                className="btn btn-sm btn-primary me-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(a.id)}
                                                className="btn btn-sm btn-danger me-2"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                                ) : (
                                <tr>
                                    <td colSpan={7} className="text-center text-muted py-4">
                                        No auctions available
                                    </td>
                                </tr>
                                )}
                        </tbody>
                    </Table>
                </div>
            </Card>
        </Shell>
    );
}

export default AuctionList;