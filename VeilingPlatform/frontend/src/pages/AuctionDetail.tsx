import { Card } from "react-bootstrap";
<<<<<<<< HEAD:VeilingPlatform/frontend/src/pages/auction/AuctionDetail.jsx
import Shell from "../../components/Shell";
import { useNavigate, useParams } from "react-router-dom";
import AuctionForm from "../../components/AuctionForm";
import auctions from '../../api/Auction.json';
========
import Shell from "@components/Shell";
import { useNavigate, useParams } from "react-router-dom";
import AuctionForm from "@components/AuctionForm";
import auctions from '@api/Auction.json';
>>>>>>>> 93e86f4 (Second part of conversion):VeilingPlatform/frontend/src/pages/AuctionDetail.tsx

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