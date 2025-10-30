import { Clock } from "lucide-react";

type Props = {
  price: number;
};

export default function AuctionClock({ price }: Props) {
  return (
    <div className="d-flex flex-column align-items-center text-center">
      <div
        className="rounded-circle border border-dark d-flex flex-column align-items-center justify-content-center"
        style={{ width: "100px", height: "100px" }}
      >
        <Clock size={24} className="opacity-75 mb-1" />
        <span className="fw-semibold">{price}</span>
      </div>
    </div>
  );
}
