import { Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import ProductForm from "../pages/aanvoerder/ProductForm.jsx";
import ProductList from "../pages/aanvoerder/ProductList.jsx";
import VerkoopOverzicht from "../pages/aanvoerder/VerkoopOverzicht.jsx";


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/aanmaken" element={<ProductForm />} />
            <Route path="/opveiling" element={<ProductList />} />
            <Route path="/verkocht" element={<VerkoopOverzicht />} />
        </Routes>
    );
}