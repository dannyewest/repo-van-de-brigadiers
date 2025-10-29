import { Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import AuctionList from "../pages/AuctionList.jsx";
import NotFound from "../shared/NotFound.jsx";
import AuctionDetail from "../pages/AuctionDetail.jsx";
import Dashboard from "../pages/VeilingDashboard.jsx";


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/auction/new" element={<AuctionDetail />} />
            <Route path="/auction/:id" element={<AuctionDetail />} />
            <Route path="/auctions" element={<AuctionList />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}