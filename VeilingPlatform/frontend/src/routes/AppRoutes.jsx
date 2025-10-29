import { Routes, Route } from "react-router-dom";
import AuctionList from "../pages/AuctionList.jsx";
import NotFound from "../shared/NotFound.jsx";
import AuctionDetail from "../pages/AuctionDetail.jsx";


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/auction/new" element={<AuctionDetail />} />
            <Route path="/auction/:id" element={<AuctionDetail />} />
            <Route path="/auctions" element={<AuctionList />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}