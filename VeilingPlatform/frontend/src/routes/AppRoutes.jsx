import { Routes, Route } from "react-router-dom";
import AuctionList from "../pages/AuctionList.jsx";
import NotFound from "../shared/NotFound.jsx";


export default function AppRoutes() {
    return (
        <Routes>
            {/* <Route path="/auction/:id" element={<AuctionPage />} /> */}
            <Route path="/auctions" element={<AuctionList />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}