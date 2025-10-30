import { Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import ProductForm from "../pages/supplier/ProductForm.jsx";
import ProductList from "../pages/supplier/ProductList.jsx";
import ProductSoldOverview from "../pages/supplier/SoldOverview.jsx";
import Register from "../pages/register.jsx";
import AuctionList from "../pages/auction/AuctionList.jsx";
import NotFound from "../shared/NotFound.jsx";
import AuctionDetail from "../pages/auction/AuctionDetail.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import SupplierDashboard from "../pages/supplier/SupplierDashboard.jsx";
import ProductOverview from "../pages/product/ProductDetail.jsx";


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/product/new" element={<ProductForm />} />
            <Route path="/product/:id" element={<ProductOverview />} />

            <Route path="/supplier" element={<SupplierDashboard />} />
            <Route path="/supplier/product/auction" element={<ProductList />} />
            <Route path="/supplier/product/sold" element={<ProductSoldOverview />} />

            <Route path="/auction/new" element={<AuctionDetail />} />
            <Route path="/auction/:id" element={<AuctionDetail />} />
            <Route path="/auctions" element={<AuctionList />} />

            <Route path="/" element={<Dashboard />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}