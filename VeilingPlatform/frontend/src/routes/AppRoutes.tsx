import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
import AuctionDashboard from '@pages/AuctionDashboard';
import CreateProduct from "@pages/supplier/ProductForm";
import ProductDetail from "@pages/product/ProductDetail";
import SupplierDashboard from "@pages/supplier/SupplierDashboard";
import SoldProductsOverview from "@pages/supplier/SoldOverview";
import ProductAuctionOverview from "@pages/supplier/ProductList";
import AuctionDetail from "@pages/AuctionDetail";
import AuctionList from "@pages/AuctionList";
import NotFound from "@shared/NotFound";
import Login from "@pages/login";
import Register from "@pages/register";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<AuctionDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        
            <Route path="/product/new" element={<CreateProduct />} />
            <Route path="/product/:id" element={<ProductDetail />} />
        
            <Route path="/supplier" element={<SupplierDashboard />} />
            <Route path="/supplier/product/auction" element={<ProductAuctionOverview />} />
            <Route path="/supplier/product/sold" element={<SoldProductsOverview />} />
        

            <Route path="/auction/new" element={<AuctionDetail />} />
            <Route path="/auction/:id" element={<AuctionDetail />} />
            <Route path="/auctions" element={<AuctionList />} />
        
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}