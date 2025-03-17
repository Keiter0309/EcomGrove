import { product, ProductImage } from "./product";
import { IUser } from "./user";

export interface CartProps {
  id?:number,
  productId: number;
  quantity: number;
  imagePath?: ProductImage[];
  name?: string;
  price?: string;
}

export interface CartDetails {
  cart: CartProps;
  product: product;
  user?: IUser;
}
