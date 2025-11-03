import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "@shared/NotFound";
import Login from "@pages/login";
import Register from "@pages/register";
import AuctionDashboard from '@pages/AuctionDashboard';
import CreateProduct from "@pages/supplier/ProductForm";
import ProductDetail from "@pages/product/ProductDetail";
import SupplierDashboard from "@pages/supplier/SupplierDashboard";
import SoldProductsOverview from "@pages/supplier/SoldOverview";
import ProductAuctionOverview from "@pages/supplier/ProductList";
import AuctionDetail from "@pages/AuctionDetail";
import { Auction } from '../definitions/AuctionDefinition';
import AuctionList from "@pages/AuctionList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuctionDashboard />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <AuctionDashboard /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      { path: "product/new", element: <CreateProduct /> },
      { path: "product/:id", element: <ProductDetail /> },

      { path: "supplier", element: <SupplierDashboard /> }, // TODO Swap to dashboard, and check on roles to show which views
      { path: "supplier/product/auction", element: <ProductAuctionOverview /> },
      { path: "supplier/product/sold", element: <SoldProductsOverview /> },

      { path: "auction/new", element: <AuctionDetail /> },
      { path: "auction/:id", element: <AuctionDetail /> },
      { path: "auctions", element: <AuctionList /> },
    ]
  }
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}