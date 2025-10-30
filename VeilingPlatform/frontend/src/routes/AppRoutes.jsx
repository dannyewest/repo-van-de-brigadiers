import { Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import ProductForm from "../pages/aanvoerder/ProductForm.jsx";
import ProductList from "../pages/aanvoerder/ProductList.jsx";
import VerkoopOverzicht from "../pages/aanvoerder/SoldOverview.jsx";
import Register from "../pages/register.jsx";
import AuctionList from "../pages/AuctionList.jsx";
import NotFound from "../shared/NotFound.jsx";
import AuctionDetail from "../pages/AuctionDetail.jsx";
import Dashboard from "../pages/VeilingDashboard.jsx";
import AanvoerderDashboard from "../pages/aanvoerder/SupplierDashboard.jsx";
import ProductWeergave from "../pages/product.jsx";


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/product/new" element={<ProductForm />} />
            <Route path="/product/auction" element={<ProductList />} />
            <Route path="/product/sold" element={<VerkoopOverzicht />} />
            <Route path="/register" element={<Register />} />
            <Route path="/supllier" element={<AanvoerderDashboard />} />
            <Route path="/product" element={<ProductWeergave />} />

            <Route path="/login" element={<Login />} />
            <Route path="/auction/new" element={<AuctionDetail />} />
            <Route path="/auction/:id" element={<AuctionDetail />} />
            <Route path="/auctions" element={<AuctionList />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}