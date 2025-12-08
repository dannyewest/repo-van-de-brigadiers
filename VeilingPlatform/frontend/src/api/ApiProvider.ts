import { Auction } from "src/definitions/AuctionDefinition";
import { Product, ProductOption, ProductSold } from "src/definitions/ProductDefinition";
import { Auctioneer, Supplier } from "src/definitions/UserDefinition";

const hostOnly = window.location.origin.replace(/:\d+$/, "");
export const Host = `${hostOnly}:5001`;
export const API = `${Host}/api`;

type AuctionPayload = {
  auctioneer: Auctioneer;
  products: ProductOption[];
  startsAt: string;
  endsAt: string;
  status: string;
};

type ProductPayload = {
  Name: string,
  Type: string,
  PotSize: string,
  Length: number,
  Quantity: number,
  BasePrice: number,
  Supplier: string,
  AuctionDate: string,
  Image: string,
  ImageAlt: string
};

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

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
      products: payload.products,
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
      products: payload.products,
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

export const createProduct = async (productToSend: ProductPayload): Promise<Response> => {
  return await fetchWithToken(`${API}/Product`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productToSend),
            });
};

export async function updateProduct(id: number | string) {
    return fetchWithToken(`${API}/Product/${id}`);
}

export const deleteProduct = async (id: number): Promise<Response> => {
  return await fetchWithToken(`${API}/product/${id}/delete`, { method: "DELETE" });
};

export const uploadImage = async (uploadData: FormData): Promise<Response> => {
  return await fetch(`${API}/upload/product-image`, {
                    method: "POST",
                    body: uploadData,
                });
};

export const getActioneers = async (): Promise<Response> => {
  const res = await fetchWithToken(`${API}/auctioneers`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res;
};

export const getProduct = async (id: number): Promise<Response> => {
  return await fetchWithToken(`${API}/product/${id}`);
};

export const getSoldProducts = async (): Promise<ProductSold[]> => {
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

export const logout = async (token: string): Promise<Response> => {
  return await fetch(`${API}/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
};

export const register = async (formData: RegisterForm): Promise<Response> => {
  return await fetch(`${API}/register/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
};

export const login = async (email: string, password: string): Promise<Response> => {
  return await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
};

export const getProductImage = (imageUrl: string): string => {
  return `${Host}/flowers/${imageUrl}`;
};

export const getDashboardAuctions = async (): Promise<Auction[]> => {
  const res = await fetch(`${API}/auctions/dashboard`);
  return res.json();
};