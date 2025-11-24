import { Auction } from "src/definitions/AuctionDefinition";
import { Product } from "src/definitions/ProductDefinition";
import { Auctioneer } from "src/definitions/UserDefinition"

const API = "http://localhost:5160/api";

type AuctionPayload = {
  auctioneer: Auctioneer;
  productIds: number[];
  startsAt: string;
  endsAt: string;
  status: string;
};

export const getAllAuctions = async (): Promise<Auction[]> => {
  const res = await fetch(`${API}/auctions`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const getAuction = async (id: number): Promise<Response> => {
  return await fetch(`${API}/auction/${id}`);
};


export const deleteAuction = async (id: number): Promise<Response> => {
  return await fetch(`${API}/auction/${id}/delete`, { method: "DELETE" });
};

export async function createAuction(payload: AuctionPayload): Promise<Auction> {
  const res = await fetch(`${API}/auction/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      auctioneerId: payload.auctioneer.id,
      productIds: payload.productIds,
      startsAt: payload.startsAt,
      endsAt: payload.endsAt,
      status: payload.status,
    }),
  });
  if (!res.ok) throw new Error(`Create failed: ${res.status}`);
  return res.json();
}

export async function updateAuction(id: number, payload: AuctionPayload): Promise<void> {
  const res = await fetch(`${API}/auction/${id}/update`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      auctioneerId: payload.auctioneer.id,
      productIds: payload.productIds,
      startsAt: payload.startsAt,
      endsAt: payload.endsAt,
      status: payload.status,
    }),
  });
  if (!res.ok) throw new Error(`Update failed: ${res.status}`);
}

export const getProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${API}/products`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const getProduct = async (id: number): Promise<Product | undefined> => {
  const response = await fetch(`${API}/Product/${id}`);
  if (!response.ok) {
    console.error(`Product with ID ${id} not found`);
    return undefined;
  }
  return await response.json();
};

export const getActioneers = async (): Promise<Response> => {
  const res = await fetch(`${API}/auctioneers`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res;
};
