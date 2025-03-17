import { useEffect, useState } from "react";
import { CartDetails } from "../interfaces/cart";
import { useAuthStore } from "../store/useAuthStore";
import { cartService } from "../services/cartService";

export default function useCartData() {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartDetails[]>([]);
  const [error, setError] = useState("");
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
        imagePath:
          Array.isArray(item.product?.imagePath) 
            ? item.product.imagePath
            : (typeof item.product?.imagePath === "string"
                ? JSON.parse(item.product.imagePath)
                : []),
      },
    }));
  };

  /** Fetches cart data from API or local storage */
  const fetchCartData = async () => {
    setLoading(true);
    try {
      let cartData = [];

      if (isAuthenticated) {
        const response = await cartService.getCart();
        if (!response?.data?.data || !Array.isArray(response.data.data)) {
          throw new Error("Invalid cart data format");
        }
        cartData = response.data.data;
      } else {
        try {
          const localCart = localStorage.getItem("cart");
          cartData = localCart ? JSON.parse(localCart) : [];
        } catch (storageError) {
          console.error("Error parsing local cart:", storageError);
          cartData = [];
        }
      }

      setCart(transformCartData(cartData));
    } catch (err) {
      console.error("Error fetching cart data:", err);
      setError("Failed to load cart data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [isAuthenticated]); 
  return { cart, setCart, loading, error, transformCartData, fetchCartData };
}

