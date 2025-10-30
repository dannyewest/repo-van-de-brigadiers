import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Shell from "@components/Shell";
import Dashboard from "@pages/Dashboard";
import NotFound from "@shared/NotFound";
import Login from "@pages/login";
import Register from "@pages/register";
// … import the rest

const router = createBrowserRouter([
  {
    path: "/",
    element: <Shell />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      // add your auction/product/supplier routes here
    ]
  }
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}

// export default function AppRoutes() {
//     return (
//         <Routes>
//             <Route path="/product/new" element={<ProductForm />} />
//             <Route path="/product/:id" element={<ProductOverview />} />

//             <Route path="/supplier" element={<SupplierDashboard />} />
//             <Route path="/supplier/product/auction" element={<ProductList />} />
//             <Route path="/supplier/product/sold" element={<ProductSoldOverview />} />

//             <Route path="/auction/new" element={<AuctionDetail />} />
//             <Route path="/auction/:id" element={<AuctionDetail />} />
//             <Route path="/auctions" element={<AuctionList />} />

//             <Route path="/" element={<Dashboard />} />

//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="*" element={<NotFound />} />
//         </Routes>
//     );
// }