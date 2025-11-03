import { Auction } from "./AuctionDefinition";
import { Supplier } from "./UserDefinition";

export interface Product {
  readonly id: number;
  name: string;
  type: ProductType;
  potSize: string;
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