<<<<<<<< HEAD:VeilingPlatform/frontend/src/pages/auction/AuctionList.jsx
import Shell from "../../components/Shell";
import auctions from '../../api/Auction.json';
import { Table, Badge, Card } from "react-bootstrap";
import "../../style/auction.scss";
========
import Shell from "@components/Shell";
import auctions from '@api/Auction.json';
import { Table, Badge, Card } from "react-bootstrap";
import "@style/auction.scss";
>>>>>>>> 93e86f4 (Second part of conversion):VeilingPlatform/frontend/src/pages/AuctionList.tsx
import { SquarePlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AuctionList() {
    const navigate = useNavigate();

    const statusToVariant = {
        Running: "success",
        Scheduled: "warning",
        Stopped: "dark",
        Error: "danger",
    };

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
                                            <span>{a.auctioneer}</span>
                                        </td>
                                        <td className="font-monospace">
                                            {a.products.length}
                                        </td>
                                        <td className="font-monospace text-nowrap">
                                            {a.startTime}
                                        </td>
                                        <td className="font-monospace text-nowrap">
                                            {a.endTime}
                                        </td>
                                        <td>
                                            <Badge
                                                bg={statusToVariant[a.status] || "secondary"}
                                                className="rounded-pill px-3"
                                            >
                                                {a.status}
                                            </Badge>
                                        </td>
                                        <td className="font-monospace text-nowrap">
                                            <button
                                                onClick={() => navigate(`/auction/${a.id}`)}
                                                className="btn btn-sm btn-primary me-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => navigate(`/auction/${a.id}/delete`)}
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