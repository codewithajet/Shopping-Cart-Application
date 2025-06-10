// Define your CartItemType with attributes optional.
export interface CartItemType {
  id: number;
  name: string;
  price: number;
  quantity: number;
  attributes?: any; // Add this line to fix the error
}