import { Route, Routes } from "react-router-dom";
import AuctionDashboard from '@pages/auction/AuctionDashboard';
import CreateProduct from "@pages/supplier/ProductForm";
import ProductDetail from "@pages/product/ProductDetail";
import SupplierDashboard from "@pages/supplier/SupplierDashboard";
import SoldProductsOverview from "@pages/supplier/SoldOverview";
import ProductAuctionOverview from "@pages/supplier/ProductList";
import AuctionList from "@pages/auction/AuctionList";
import NotFound from "@shared/NotFound";
import Login from "@pages/login";
import Register from "@pages/register";
import AuctionDetail from "@pages/auction/AuctionDetail";
import EditProduct from "@pages/supplier/EditProduct";

// TODO Create a general dashboard page for logged in users, show different content based on role

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<AuctionDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/product/new" element={<CreateProduct />} />
            <Route path="/auction/:id/products" element={<ProductDetail />} />

            <Route path="/supplier" element={<SupplierDashboard />} />
            <Route path="/supplier/product/auction" element={<ProductAuctionOverview />} />
            <Route path="/supplier/product/sold" element={<SoldProductsOverview />} />
            <Route path="/supplier/product/edit/:id" element={<EditProduct />} />



            <Route path="/auction/new" element={<AuctionDetail />} />
            <Route path="/auction/:id" element={<AuctionDetail />} />
            <Route path="/auctions" element={<AuctionList />} />

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}