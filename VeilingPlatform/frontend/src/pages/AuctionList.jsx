import Shell from "../components/Shell";
import auctions from '../api/Auction.json';
import { Table, Badge, Card } from "react-bootstrap";
import "../style/auction.scss";

function AuctionList() {

    const statusToVariant = {
        Running: "success",
        Scheduled: "warning",
        Stopped: "secondary",
        Delayed: "danger",
    };

    return (
        <Shell>
            <Card className="shadow-sm border-0 overflow-hidden">
                <Card.Header className="bg-body d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">Auction Overview</span>
                    {/* TODO Add filter/search field if needed */}
                </Card.Header>

                <div className="table-responsive" style={{ maxHeight: 420 }}>
                    <Table hover size="sm" className="mb-0 auction-table align-middle">
                    <thead className="table-flora sticky-top">
                        <tr>
                        <th className="text-uppercase small">Auction ID</th>
                        <th className="text-uppercase small">Auctioneer</th>
                        <th className="text-uppercase small">Amount Products</th>
                        <th className="text-uppercase small">Start Time</th>
                        <th className="text-uppercase small">End Time</th>
                        <th className="text-uppercase small">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {auctions.length ? (
                            auctions.map((a) => (
                                <tr key={a.id}>
                                    <td className="fw-medium">
                                        {a.auctionId}
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
                                </tr>
                            ))
                            ) : (
                            <tr>
                                <td colSpan={6} className="text-center text-muted py-4">
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