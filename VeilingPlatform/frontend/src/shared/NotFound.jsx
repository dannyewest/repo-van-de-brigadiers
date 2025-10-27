import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader } from "react-bootstrap";
import Shell from "../components/Shell.jsx";

export default function NotFound() {
  return (
    <Shell>
      <Card className="p-6 text-center">
        <CardHeader className="mb-2 text-lg font-semibold">Page not found</CardHeader>
        <CardBody>
          <p className="mb-4 text-sm text-slate-600">The page you requested does not exist.</p>
          <Link to="/" className="rounded-xl border px-3 py-2 text-sm">Back to dashboard</Link>
        </CardBody>
      </Card>
    </Shell>
  );
}