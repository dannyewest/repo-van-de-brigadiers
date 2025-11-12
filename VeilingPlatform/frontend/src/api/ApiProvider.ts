import { Auction } from "src/definitions/AuctionDefinition";
import { Product } from "src/definitions/ProductDefinition";
import auctions from "./Auction.json";
import products from "./product.json";

export const getAllAuctions = async (): Promise<Auction[]> => {
  const res = await fetch("http://localhost:5160/api/Auctions");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const getAuction = async (id: number): Promise<Auction | undefined> => {
  const res = await fetch(`http://localhost:5160/api/Auctions/${id}`);
  if (!res.ok) return undefined;
  return res.json();
};


export const getProducts = async (): Promise<Product[]> => products as unknown as Product[];
export const getProduct = async (id: number): Promise<Product | undefined> => {
    const product = products.find(product => product.id === id);
    return product as Product | undefined;
};