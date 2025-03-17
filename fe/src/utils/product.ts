import { product, productCategory } from "../interfaces/product";
import img_1 from "../assets/images/1.jpg";
import img_2 from "../assets/images/2.jpg";
import img_3 from "../assets/images/3.jpg";
import img_4 from "../assets/images/4.jpg";
import img_5 from "../assets/images/5.jpg";
import img_6 from "../assets/images/6.jpg";

// Default Values
const DEFAULT_DESC = "Ocean";
const DEFAULT_PRICE = "33.45";

export const ProductItems: product[] = [
  {
    id: 1,
    name: "Ocean",
    desc: DEFAULT_DESC,
    price: DEFAULT_PRICE,
    image_path: img_1,
  },
  {
    id: 2,
    name: "Ocean Sunrise",
    desc: "Beautiful sunrise over the ocean",
    price: "45.00",
    image_path: img_2,
  },
  {
    id: 3,
    name: "Ocean Waves",
    desc: "Crashing waves on the shore",
    price: "29.99",
    image_path: img_3,
  },
  {
    id: 4,
    name: "Ocean Sunset",
    desc: "Stunning sunset view",
    price: "50.00",
    image_path: img_4,
  },
  {
    id: 5,
    name: "Ocean Breeze",
    desc: "Gentle ocean breeze",
    price: "35.50",
    image_path: img_5,
  },
  {
    id: 6,
    name: "Ocean Horizon",
    desc: "Endless ocean horizon",
    price: "39.95",
    image_path: img_6,
  },
];

// Product Category Items
export const ProductCategoryItems: productCategory[] = [
  { name: "Ocean & Sea" },
  { name: "Mountain & Highland" },
  { name: "Forest & Nature" },
  { name: "Desert & Grassland" },
  { name: "Cityscape & Urban" },
];
