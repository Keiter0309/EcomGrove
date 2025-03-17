import { useEffect, useState } from "react";
import { product } from "../interfaces";
import { productService } from "../services/productService";
import toast from "react-hot-toast";

export const useProductData = () => {
  const [products, setProducts] = useState<product[]>([]);
  const fetchProducts = async () => {
    try {
      const response = await productService.findAll();
      const productList: product[] = response.data.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        desc: item.description,
        price: item.price,
        stock: item.stock,
        imagePath: JSON.parse(item.imagePath),
      }));

      setProducts(productList);
    } catch (error: unknown) {
      toast.error(`Error while fetching ${error}`);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products };
};
