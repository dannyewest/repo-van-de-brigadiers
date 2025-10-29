import { Card } from "react-bootstrap";
import Shell from "../components/Shell";
import { useNavigate, useParams } from "react-router-dom";
import AuctionForm from "../components/AuctionForm";
import auctions from '../api/Auction.json';

function AuctionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const auction = auctions.find(auction => auction.id === parseInt(id));

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Auction ${id} saved!`);
        navigate("/auctions");
    };

    return (
        <Shell>
            <Card className="w-75 mx-auto shadow-sm rounded-3 overflow-hidden">
                <Card.Header>
                    Auction Details
                </Card.Header>
                <Card.Body>
                    <AuctionForm auction={auction} />
                </Card.Body>
            </Card>
        </Shell>
    );
}

export default AuctionDetail;