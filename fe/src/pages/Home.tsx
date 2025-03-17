import Header from "../components/common/Header";
import Banner from "../components/common/Banner";
import Product from "../components/product/Product";
import Footer from "../components/common/Footer";
import BackToTop from "../components/common/BackToTop";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import Modal from "../components/common/Modal";
import { cartService } from "../services/cartService";

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const [cartData, setCartData] = useState(false);

  const handleCheckCartData = async () => {
    if (isAuthenticated) {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (cart.length > 0) {
        setCartData(true);
      } else {
        setCartData(false);
      }
    }
  };

  const handleConfirm = async () => {
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    const payload = cartItems.map((item: any) => ({
      productId: item.productId,
      quantity: Number(item.quantity),
    }));

    try {
      const responses = await Promise.all(
        payload.map((item: any) => cartService.syncCart(item))
      );
      console.log(responses);
      toast.success("Added to cart successfully");
      localStorage.removeItem("cart");
      setCartData(false);
    } catch (error: any) {
      toast.error(error.response?.data.message);
    }
  };

  useEffect(() => {
    handleCheckCartData();
  }, [isAuthenticated]);

  const handleCloseModal = () => {
    setCartData(false);
    localStorage.removeItem("cart");
  };
  return (
    <>
      {/* Navigation bar */}
      <Header />

      {/* Banner */}
      <Banner />

      {/* Product */}
      <Product />

      {/* Footer */}
      <Footer />

      {/* Scroll to top button */}
      <BackToTop />

      <Toaster />
      <Modal
        isOpen={cartData}
        status="warning"
        onConfirm={handleConfirm}
        onCancel={handleCloseModal}
        name="Do you want to sync the previous cart data"
        input={false}
        confirmButton={true}
        cancelButton={true}
      />
    </>
  );
}
