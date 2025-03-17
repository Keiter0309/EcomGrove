import { ECartService } from "../enums/services/ECartService";
import { EService } from "../enums/services/EService";
import { CartProps } from "../interfaces/cart";
import { instance } from "../lib/axios";

export const cartService = {
  addToCart: (payload: CartProps) => {
    const url = `${EService.CART_SERVICE}/${ECartService.ADD_TO_CART}`;
    return instance.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  getCart: () => {
    const url = `${EService.CART_SERVICE}/${ECartService.GET_CART}`;
    return instance.get(url, { withCredentials: true });
  },

  syncCart: (payload: CartProps) => {
    const url = `${EService.CART_SERVICE}/${ECartService.ADD_TO_CART}`;
    return instance.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  removeItem: (id: number) => {
    const url = `${EService.CART_SERVICE}/${id}`;
    return instance.delete(url);
  },
};
