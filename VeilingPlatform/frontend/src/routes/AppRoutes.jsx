import { Routes, Route } from "react-router-dom";
import Register from "../pages/register.jsx";
import App from "../App.jsx";
import Login from "../pages/login";
import AuctionList from "../pages/AuctionList.jsx";
import NotFound from "../shared/NotFound.jsx";
import AuctionDetail from "../pages/AuctionDetail.jsx";


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<App />} />    
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auction/new" element={<AuctionDetail />} />
            <Route path="/auction/:id" element={<AuctionDetail />} />
            <Route path="/auctions" element={<AuctionList />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}