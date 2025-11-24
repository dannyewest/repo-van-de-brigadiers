import { Container, Card, Row, Col } from "react-bootstrap";
import soldProducts from "@api/soldProducts.json";
import Shell from "@components/Shell";
import { getSoldProducts, SoldProduct } from "@api/ApiProvider";
import { useState, useEffect } from "react";


function SoldProductsOverview() {

    const [soldProducts, setSoldProducts] = useState<SoldProduct[]>([]);
    const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

    // Functie om alert te tonen
    const showAlert = (type: 'success' | 'danger', message: string, duration = 5000) => {
        setAlert({ type, message });
        setTimeout(() => setAlert(null), duration);
    };

    // Data ophalen bij component mount
    useEffect(() => {
        const fetchSoldProducts = async () => {
            try {
                const data = await getSoldProducts();
                setSoldProducts(data);
            } catch (err) {
                console.error("Failed to load sold products:", err);
                showAlert("danger", "Failed to load sold products");
            }
        };
        fetchSoldProducts();
    }, []);

    return (
        <Shell>
            <Container className="py-5">
                <h1 className="text-center mb-5">Overview of Sold Products</h1>

                {/* Alert */}
                {alert && (
                    <div
                        className={`alert alert-${alert.type} text-center`}
                        role="alert"
                        aria-live="polite"
                    >
                        {alert.message}
                    </div>
                )}

                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <caption className="sr-only">List of sold products</caption>
                        <thead className="table-info">
                            <tr>
                                <th scope="col">Buyer</th>
                                <th scope="col">Selling Price (€)</th>
                                <th scope="col">Date Sold</th>
                            </tr>
                        </thead>
                        <tbody>
                            {soldProducts.map((product) => (
                                <tr key={product.productSoldId} tabIndex={0}>
                                    <td>{product.buyerName || <em>Unknown</em>}</td>
                                    <td>{product.priceSold.toFixed(2)}</td>
                                    <td>
                                        {new Date(product.dateSold).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Container>
        </Shell>

    );
}

export default SoldProductsOverview;
