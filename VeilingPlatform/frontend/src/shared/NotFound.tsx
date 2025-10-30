import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader } from "react-bootstrap";
import Shell from "../components/Shell.js";

export default function NotFound() {
  return (
    <Shell>
      <Card className="p-6 text-center w-50 mx-auto shadow-sm border-0 rounded-3 overflow-hidden">
        <CardHeader className="mb-2 text-lg font-semibold bg-danger text-light">Page not found</CardHeader>
        <CardBody>
          <p className="mb-4 text-sm text-slate-600">The page you requested does not exist.</p>
          <Link to="/" className="btn btn-danger">Back to dashboard</Link>
        </CardBody>
      </Card>
    </Shell>
  );
}