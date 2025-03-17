export interface product {
  id: number,
  name: string;
  desc: string;
  price: number | string;
  stock: number,
  imagePath: ProductImage[];
}

export interface ProductImage {
  name: string;
  url: string;
}

export interface ProductDetailsProps {
  id: number;
  name: string;
  desc: string;
  price: number | string;
  stock: number;
  imagePath: ProductImage[];
}

