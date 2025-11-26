

export interface AuctionProduct {
  readonly id: number;
  readonly listId: number;
  name: string;
  type: string;
  potSize: string;
  length: number;
  imageUrl: string;
  imageAlt: string;


  location: string;
  auctionDate: string; // ISO string
  quantity: number;
  basePrice: number;

  supplier: string;
  auction: number;
}