import { Routes, Route } from "react-router-dom";
import Register from "../pages/register.jsx";
import App from "../App.jsx";


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<App />} />    
            <Route path="/register" element={<Register />} />
        </Routes>
    );
}