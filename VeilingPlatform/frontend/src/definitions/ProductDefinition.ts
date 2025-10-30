import { Auction } from "./AuctionDefinition";
import { Supplier } from "./UserDefinition";

export interface Product {
  readonly id: string;
  name: string;
  type: ProductType;
  potSize: number;
  stemLength: number;
  imageUrl?: string;

  location: string;
  auctionDate: string; // ISO string
  quantity: number;
  basePrice: number;
  soldPrice: number | null;
  
  readonly supplier: Supplier;
  auction: Auction | null;
}

export interface ProductType {
  id: string;
  name: string;
}