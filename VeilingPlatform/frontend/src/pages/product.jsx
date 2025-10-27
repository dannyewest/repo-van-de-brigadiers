import React, { useState } from "react";

import redRosesImage from "../assets/red_roses_bouquet.jpg";
import whiteRosesImage from "../assets/white_roses_bouquet.jpg";
import pinkRosesImage from "../assets/pink_roses_bouquet.jpg";

const Product = () => {

    // Dummy data voor producten
    const productsData = [
    {
        id: 2,
        name: "Red Roses Bouquet",
        type: "Flowers",
        potSize: "Medium",
        length: "50 cm",
        quantity: 100,
        price: 29.99,
        supplier: "Floral Delights",
        auctionDate: "2024-07-15",
        auctionId: 101,
        image: redRosesImage
    },
    {
        id: 1,
        name: "White Roses Bouquet",
        type: "Flowers",
        potSize: "Medium",
        length: "40 cm",
        quantity: 80,
        price: 24.99,
        supplier: "Floral Delights",
        auctionDate: "2024-07-15",
        auctionId: 101,
        image: whiteRosesImage
    },
    {
        id: 3,
        name: "Pink Roses Bouquet",
        type: "Flowers",
        potSize: "Medium",
        length: "45 cm",
        quantity: 72,
        price: 21.99,
        supplier: "Floral Delights",
        auctionDate: "2024-07-15",
        auctionId: 101,
        image: pinkRosesImage
    }
];

    // hoofdproduct en andere producten in aparte staten houden
    const [mainProduct, setMainProduct] = useState(productsData[0]);
    const otherProducts = productsData.filter((p) => p.id !== mainProduct.id);

    if (!mainProduct) return <p>Product wordt geladen...</p>;

    return (
        <>
            <div className="container py-4">
                {/* Product detail */}
                <h1 className="mb-3">{mainProduct.name}</h1>
                <div className="mb-4">
                    <img
                    src={mainProduct.image}
                    alt={mainProduct.name}
                    className="img-fluid mb-3 rounded float-start me-4"
                    width="320"
                    height="400"
                    />
                    <div className="mb-3">
                        <p className="pInfo"><strong>Supplier: </strong>{mainProduct.supplier}</p>
                        <p className="pInfo"><strong>Veilingdatum: </strong>{mainProduct.auctionDate}</p>
                        <p className="pInfo"><strong>Type: </strong>{mainProduct.type}</p>
                        <p className="pInfo"><strong>Length: </strong>{mainProduct.length}</p>
                        <p className="pInfo"><strong>Quantity: </strong>{mainProduct.quantity}</p>
                        <p className="pInfo"><strong>Price: </strong>{mainProduct.price}</p>
                    </div>
                </div>
                <button className="btn btn-primary">Plaats bod/Koop</button>
            </div>
            <div className="container- mt-5 pt-3">
                {/* Andere producten - horizontale balk */}
                <h2 className="mb-3"
                style={{ fontSize: "18px", fontWeight: "bold" }}>Nog te veilen artikelen:</h2>
                <div className="overflow-auto white-space-nowrap">
                    {otherProducts.map((product) => (
                    <div
                        key={product.id}
                        className="d-inline-block m-2 text-center"
                        onClick={() => setMainProduct(product)}
                        style={{ cursor: "pointer" }}
                        
                    >
                        <img
                        src={product.image}
                        alt={product.name}
                        className="mb-2 img-thumbnail"
                        width="120"
                        height="120"
                        />
                        <p className="small">{product.name}</p>
                    </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Product;