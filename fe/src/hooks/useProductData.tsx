import { product } from "../interfaces";
import { productService } from "../services/productService";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

export const useProductData = () => {
  /** Fetch products data from the API */
  const fetchProducts = async (): Promise<product[]> => {
    try {
      const response = await productService.findAll();
      return response.data.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        desc: item.description,
        price: item.price,
        stock: item.stock,
        imagePath: JSON.parse(item.imagePath),
      }));
    } catch (error: unknown) {
      toast.error(`Error while fetching products: ${String(error)}`);
      throw error;
    }
  };

  const { data: productData = [], isLoading, error, refetch } = useQuery<product[], Error>({
    queryKey: ["products"],
    queryFn: fetchProducts,
    retry: 2, 
    refetchOnWindowFocus: false,
  });

  return { productData, isLoading, error, refetch };
};
