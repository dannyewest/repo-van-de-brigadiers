import { Product } from "./ProductDefinition";
import { Auctioneer } from "./UserDefinition";

export interface Auction {
  readonly id: number;
  auctioneer: Auctioneer;
  startsAt: string;  // ISO string
  endsAt: string;    // ISO string
  products: Product[];
  status: "running" | "scheduled" | "stopped" | "error";
}