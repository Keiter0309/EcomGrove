import { useQuery } from "@tanstack/react-query";
import { CartDetails } from "../interfaces/cart";
import { useAuthStore } from "../store/useAuthStore";
import { cartService } from "../services/cartService";
import toast from "react-hot-toast";

export default function useCartData() {
  const { isAuthenticated } = useAuthStore();

  /** Transforms API response or local storage data into CartDetails format */
  const transformCartData = (cartData: any[]): CartDetails[] => {
    return cartData.map((item) => ({
      cart: {
        id: item.id ?? "",
        productId: item.productId,
        quantity: item.quantity,
      },
      product: {
        id: item.product?.id ?? item.productId ?? "",
        name: item.product?.name ?? item.name ?? "Unknown",
        desc: item.product?.description ?? "",
        price: Number(item.product?.price ?? item.price ?? 0),
        stock: item.product?.stock ?? 0,
        imagePath: Array.isArray(item.product?.imagePath)
          ? item.product.imagePath
          : typeof item.product?.imagePath === "string"
          ? JSON.parse(item.product.imagePath)
          : [],
      },
      user: item.user
        ? {
            id: item.user.id ?? "",
            firstName: item.user.firstName ?? "",
            lastName: item.user.lastName ?? "",
            email: item.user.email ?? "",
            username: item.user.username ?? "",
          }
        : undefined,
    }));
  };

  /** Fetches cart data from API or local storage */
  const fetchCartData = async (): Promise<CartDetails[]> => {
    try {
      let cartData = [];

      if (isAuthenticated) {
        const response = await cartService.getCart();
        if (!response?.data?.data || !Array.isArray(response.data.data)) {
          throw new Error("Invalid cart data format");
        }
        cartData = response.data.data;
      } else {
        const localCart = localStorage.getItem("cart");
        cartData = localCart ? JSON.parse(localCart) : [];
      }

      return transformCartData(cartData);
    } catch (error) {
      toast.error("Failed to load cart data. Please try again.");
      throw error;
    }
  };

  /** Using useQuery for data fetching */
  const { data: cart = [], isLoading, error, refetch } = useQuery<CartDetails[], Error>({
    queryKey: ["cartData", isAuthenticated],
    queryFn: fetchCartData,
    enabled: typeof isAuthenticated === "boolean",
    retry: 2,
    refetchOnWindowFocus: true
  });

  return { cart, isLoading, error, refetch, transformCartData };
}
