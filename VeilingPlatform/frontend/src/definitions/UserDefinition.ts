export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
}

export interface Supplier extends User {
}

export interface Auctioneer extends User {
}