import { Auction } from "src/definitions/AuctionDefinition";
import { Product, ProductOption } from "src/definitions/ProductDefinition";
import { Auctioneer } from "src/definitions/UserDefinition";

const API = "http://localhost:5160/api";

type AuctionPayload = {
  auctioneer: Auctioneer;
  productIds: number[];
  startsAt: string;
  endsAt: string;
  status: string;
};

export async function fetchWithToken(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token"); 
  }

  const res = await fetch(url, {
    ...options,
    headers: { 
      ...(options.headers || {}),
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    }
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error("Unauthorized");
  }

  return res;
}


export const getAllAuctions = async (): Promise<Auction[]> => {
  const res = await fetchWithToken(`${API}/auctions`);
  return res.json();
};

export const getAuction = async (id: number): Promise<Response> => {
  return await fetchWithToken(`${API}/auction/${id}`);
};

export const deleteAuction = async (id: number): Promise<Response> => {
  return await fetchWithToken(`${API}/auction/${id}/delete`, { method: "DELETE" });
};

export async function createAuction(payload: AuctionPayload): Promise<Auction> {
  const res = await fetchWithToken(`${API}/auction/create`, {
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
  const res = await fetchWithToken(`${API}/auction/${id}/update`, {
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
  const res = await fetchWithToken(`${API}/products`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const getActioneers = async (): Promise<Response> => {
  const res = await fetchWithToken(`${API}/auctioneers`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res;
};

export const getProduct = async (id: number): Promise<Response> => {
  return await fetchWithToken(`${API}/product/${id}`);
};

export interface ProductDefinition {
  productSoldId: number;
  productId: number;
  productName: string;
  buyerId: number;
  buyerName: string;
  dateSold: string;
  priceSold: number;
}

export const getSoldProducts = async (): Promise<ProductDefinition[]> => {
  const response = await fetchWithToken(`${API}/ProductSold`);
  if (!response.ok) 
    throw new Error(`HTTP ${response.status}`);
  return response.json();
};

export const getAvailableProducts = async (
  auctionId?: number
): Promise<ProductOption[]> => {
  let url = `${API}/products/available`;
  if (auctionId !== undefined && auctionId !== null) {
    url += `?auctionId=${auctionId}`;
  }

  const res = await fetchWithToken(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
};
