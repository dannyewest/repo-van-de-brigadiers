import { Clock } from "lucide-react";
import { Button } from "react-bootstrap";

export default function ActionClock({ price }) {
  return (
    <div className="d-flex flex-column align-items-center text-center">
      <div
        className="rounded-circle border border-dark d-flex flex-column align-items-center justify-content-center"
        style={{ width: "100px", height: "100px" }}
      >
        <Clock size={24} className="opacity-75 mb-1" />
        <span className="fw-semibold">{price}</span>
      </div>
      <Button variant="success" size="sm" className="fw-bold shadow-sm mt-2">
        Koop
      </Button>
    </div>
  );
}
