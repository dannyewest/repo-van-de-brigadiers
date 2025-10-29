import { Clock } from "lucide-react";
import "../style/VeilingKlok.css";

export default function AuctionClock({ price }) {
  return (
    <div className="auction-clock-container">
      <div className="auction-clock-circle">
        <div className="auction-clock-center">
          <Clock size={24} className="clock-icon" />
          <span className="auction-clock-price">{price}</span>
        </div>
      </div>
      <button className="btn btn-success btn-sm mt-2 fw-bold shadow-sm">Koop</button>
    </div>
  );
}
