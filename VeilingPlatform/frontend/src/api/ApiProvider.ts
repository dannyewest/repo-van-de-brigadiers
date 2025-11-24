import { Auction } from "src/definitions/AuctionDefinition";
import { Product } from "src/definitions/ProductDefinition";
const API_BASE_URL = "http://localhost:5160/api";

export const getAuctions = async (): Promise<Auction[]> => {
  const response = await fetch(`${API_BASE_URL}/Auction`);
  if (!response.ok) {
    console.error("Failed to fetch auctions");
    throw new Error("Failed to fetch auctions");
  }
  return await response.json();
};

export const getAuction = async (id: number): Promise<Auction | undefined> => {
  const response = await fetch(`${API_BASE_URL}/Auction/${id}`);
  if (!response.ok) {
    console.error(`Auction with ID ${id} not found`);
    return undefined;
  }
  return await response.json();
};

export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/Product`);
  if (!response.ok) {
    console.error("Failed to fetch products");
    throw new Error("Failed to fetch products");
  }
  return await response.json();
};

export const getProduct = async (id: number): Promise<Product | undefined> => {
  const response = await fetch(`${API_BASE_URL}/Product/${id}`);
  if (!response.ok) {
    console.error(`Product with ID ${id} not found`);
    return undefined;
  }
  return await response.json();
};
