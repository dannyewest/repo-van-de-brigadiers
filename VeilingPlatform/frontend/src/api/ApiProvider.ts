import { Auction } from "src/definitions/AuctionDefinition";
import { Product } from "src/definitions/ProductDefinition";
import auctions from "./Auction.json";
import products from "./product.json";

export const getAuctions = async (): Promise<Auction[]> => auctions as unknown as Auction[];
export const getAuction = async (id: number): Promise<Auction | undefined> => {
    const auction = auctions.find(auction => auction.id === id);
    return auction as Auction | undefined;
};
export const getProducts = async (): Promise<Product[]> => products as unknown as Product[];
export const getProduct = async (id: number): Promise<Product | undefined> => {
    const product = products.find(product => product.id === id);
    return product as Product | undefined;
};