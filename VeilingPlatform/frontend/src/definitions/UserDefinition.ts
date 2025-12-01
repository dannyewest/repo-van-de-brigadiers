export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: "Customer" | "Supplier" | "Auctioneer"; 
}

export interface Supplier extends User {
}

export interface Auctioneer extends User {
}