import { Auction } from "src/definitions/AuctionDefinition";
import { Product } from "src/definitions/ProductDefinition";
import { Auctioneer } from "src/definitions/UserDefinition"
import auctions from "./Auction.json";
import products from "./product.json";

const API = "http://localhost:5160/api";

type AuctionPayload = {
  auctioneer: Auctioneer;
  productIds: number[];
  startsAt: string;
  endsAt: string;
};

export const getAllAuctions = async (): Promise<Auction[]> => {
  const res = await fetch(`${API}/Auctions`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const getAuction = async (id: number): Promise<Auction | undefined> => {
  const res = await fetch(`${API}/Auction/${id}`);
  if (!res.ok) return undefined;
  return res.json();
};

export const deleteAuction = async (id: number): Promise<Response> => {
  return await fetch(`${API}/Auction/${id}/delete`);
};

export async function createAuction(payload: AuctionPayload): Promise<Auction> {
  const res = await fetch(`${API}/Auctions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      auctioneerName: payload.auctioneer.name,
      productIds: payload.productIds,
      startsAt: payload.startsAt,
      endsAt: payload.endsAt,
    }),
  });
  if (!res.ok) throw new Error(`Create failed: ${res.status}`);
  return res.json();
}

export async function updateAuction(id: number, payload: AuctionPayload): Promise<void> {
  const res = await fetch(`${API}/Auctions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      auctioneerName: payload.auctioneer.name,
      productIds: payload.productIds,
      startsAt: payload.startsAt,
      endsAt: payload.endsAt,
    }),
  });
  if (!res.ok) throw new Error(`Update failed: ${res.status}`);
}

export const getProducts = async (): Promise<Response> => {
  const res = await fetch(`${API}/Product`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const getProduct = async (id: number): Promise<Product | undefined> => {
    const product = products.find(product => product.id === id);
    return product as Product | undefined;
};