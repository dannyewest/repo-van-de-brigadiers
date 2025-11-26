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
import EditProduct from "@pages/supplier/EditProduct";
import AuctionNew from "@pages/auction/AuctionNew";
import AuctionEdit from "@pages/auction/AuctionEdit";
import Home from "@components/Home";
import ProtectedRoute from "./ProtectedRoutes";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Customer-only routes */}
            <Route
                path="/customer/auctions/dashboard"
                element={
                    <ProtectedRoute
                        element={<AuctionDashboard />}
                        allowedRoles={["Customer"]}
                    />
                }
            />

            {/* Supplier-only routes */}
            <Route
                path="/supplier"
                element={
                    <ProtectedRoute
                        element={<SupplierDashboard />}
                        allowedRoles={["Supplier"]}
                    />
                }
            />
            <Route
                path="/supplier/product/auction"
                element={
                    <ProtectedRoute
                        element={<ProductAuctionOverview />}
                        allowedRoles={["Supplier"]}
                    />
                }
            />
            <Route
                path="/supplier/product/sold"
                element={
                    <ProtectedRoute
                        element={<SoldProductsOverview />}
                        allowedRoles={["Supplier"]}
                    />
                }
            />
            <Route
                path="/supplier/product/edit/:id"
                element={
                    <ProtectedRoute
                        element={<EditProduct />}
                        allowedRoles={["Supplier"]}
                    />
                }
            />
            <Route
                path="/product/new"
                element={
                    <ProtectedRoute
                        element={<CreateProduct />}
                        allowedRoles={["Supplier"]}
                    />
                }
            />

            {/* Auctioneer-only routes */}
            <Route
                path="/auction/new"
                element={
                    <ProtectedRoute
                        element={<AuctionNew />}
                        allowedRoles={["Auctioneer"]}
                    />
                }
            />
            <Route
                path="/auction/:id/edit"
                element={
                    <ProtectedRoute
                        element={<AuctionEdit />}
                        allowedRoles={["Auctioneer"]}
                    />
                }
            />
            <Route
                path="/auctions"
                element={
                    <ProtectedRoute
                        element={<AuctionList />}
                        allowedRoles={["Auctioneer"]}
                    />
                }
            />
            <Route
                path="/auction/:id/products"
                element={
                    <ProtectedRoute
                        element={<ProductDetail />}
                        allowedRoles={["Auctioneer"]}
                    />
                }
            />

            {/* Fallback route */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}