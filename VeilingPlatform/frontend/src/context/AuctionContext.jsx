import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const initialProducts = [
  {
    id: "f1",
    species: "Rosa",
    variety: "Avalanche+",
    type: "cut",
    color: "white",
    stemLengthCm: 60,
    potSizeCm: null,
    img: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=1200&auto=format&fit=crop",
    description: "Long-stem premium white rose, auction-fresh.",
    minPrice: 0.45,
    currentBid: 0.45,
    endsAt: Date.now() + 1000 * 60 * 12,
    bids: [],
  },
  {
    id: "f2",
    species: "Tulipa",
    variety: "Strong Gold",
    type: "cut",
    color: "yellow",
    stemLengthCm: 40,
    potSizeCm: null,
    img: "https://images.unsplash.com/photo-1505575972945-28021aa0d22c?q=80&w=1200&auto=format&fit=crop",
    description: "Classic Dutch tulip, uniform bud size.",
    minPrice: 0.18,
    currentBid: 0.18,
    endsAt: Date.now() + 1000 * 60 * 20,
    bids: [],
  },
  {
    id: "f3",
    species: "Phalaenopsis",
    variety: "Multiflora",
    type: "potted",
    color: "purple",
    stemLengthCm: null,
    potSizeCm: 12,
    img: "https://images.unsplash.com/photo-1543363136-6a67cf524720?q=80&w=1200&auto=format&fit=crop",
    description: "Potted orchid, 2 spikes, retail-ready.",
    minPrice: 4.20,
    currentBid: 4.20,
    endsAt: Date.now() + 1000 * 60 * 28,
    bids: [],
  },
];

const AuctionContext = createContext(null);

export function AuctionProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("mini-auction-products");
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialProducts;
  });

  useEffect(() => {
    localStorage.setItem("mini-auction-products", JSON.stringify(products));
  }, [products]);

  const placeBid = (productId, amount, bidder = "You") => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        if (amount <= p.currentBid) return p;
        const bid = { id: crypto.randomUUID(), amount, bidder, at: Date.now() };
        return { ...p, currentBid: amount, bids: [bid, ...p.bids].slice(0, 20) };
      })
    );
  };

  const value = useMemo(() => ({ products, placeBid }), [products]);
  return <AuctionContext.Provider value={value}>{children}</AuctionContext.Provider>;
}

export const useAuction = () => useContext(AuctionContext);