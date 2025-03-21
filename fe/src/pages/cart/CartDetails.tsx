import { Minus, Plus, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import useCartData from "../../hooks/useCartData";
import Checkout from "../../components/shop/Checkout";

export default function CartDetails() {
  const { cart } = useCartData();

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (cart.length > 0) {
      const initialQuantities: { [key: string]: number } = {};
      cart.forEach((item) => {
        initialQuantities[Number(item.cart.id)] = item.cart.quantity || 1;
      });
      setQuantities(initialQuantities);
    }
  }, [cart]);

  const handleInputChange = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(e.target.value);
    if (value >= 1 && value <= 50) {
      setQuantities((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleQuantityChange = (
    id: string,
    action: "increase" | "decrease"
  ) => {
    setQuantities((prev) => {
      if (prev[id] === undefined) return prev;
      const newQuantity =
        action === "increase"
          ? Math.min(prev[id] + 1)
          : Math.max(prev[id] - 1, 1);
      return { ...prev, [id]: newQuantity };
    });
  };

  return (
    <div className="py-8 px-10 max-w-7xl mx-auto">
      <h1 className="text-gray-900 font-bold text-3xl mb-6">Shopping Cart</h1>
      <hr className="border-gray-300" />

      {/* Cart Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-10">
        {/* Left section - Product List */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              className="col-span-2 border border-gray-300 rounded-lg p-5 shadow-sm bg-white"
              key={item.cart.id}
            >
              <div className="flex gap-6 items-center">
                {/* Product Image */}
                  <div className="h-32 w-32 flex-shrink-0 border border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={item.product.imagePath[0]?.url}
                    alt={item.product.name}
                    className="w-full h-full object-cover rounded-md border"
                  />
                </div>
                {/* Product Details */}
                <div className="flex-1 mt-2">
                  <p className="text-gray-700 font-semibold text-md leading-6">
                    {item.product.name}
                  </p>

                  <p className="text-gray-700 font-semibold text-md leading-6">
                    {item.product.desc}
                  </p>

                  {/* Price */}
                  <p className="text-lg font-semibold text-gray-900 mt-2">
                    ${item.product.price} USD
                  </p>

                  {/* Controls - Delete & Quantity */}
                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      {/* Decrease Button */}
                      <button
                        onClick={() =>
                          handleQuantityChange(String(item.cart.id), "decrease")
                        }
                        className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all disabled:opacity-50"
                        disabled={quantities[String(item.cart.id)] <= 1}
                      >
                        <Minus size={16} />
                      </button>

                      {/* Quantity Input */}
                      <input
                        className="w-14 text-center text-gray-900 font-semibold border-x border-gray-300 py-2 outline-none"
                        onChange={(e) =>
                          handleInputChange(String(item.cart.id), e)
                        }
                        value={
                          quantities[String(item.cart.id)] ?? item.cart.quantity
                        } // Fallback to cart quantity
                        type="number"
                        min="1"
                        max="50"
                      />

                      {/* Increase Button */}
                      <button
                        onClick={() =>
                          handleQuantityChange(String(item.cart.id), "increase")
                        }
                        className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all disabled:opacity-50"
                        disabled={
                          quantities[String(item.cart.id)] >= item.product.stock
                        }
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Delete Button */}
                    <button className="text-red-500 hover:text-red-600 transition duration-300">
                      <Trash size={24} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right section - Order Summary */}
        <div className="col-span-1">
          <div className="border border-gray-300 rounded-lg col-span-1 p-5 shadow-sm bg-white">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>
                $
                {cart
                  .reduce(
                    (total, item) =>
                      total +
                      (quantities[Number(item.cart.id)] ?? item.cart.quantity) *
                        Number(item.product.price),
                    0
                  )
                  .toLocaleString()}{" "}
                USD
              </span>
            </div>
            <div className="flex justify-between text-gray-700 mt-2">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <hr className="my-4 border-gray-300" />
            <div className="flex justify-between text-gray-900 font-semibold">
              <span>Total</span>
              <span>
                $
                {cart
                  .reduce(
                    (total, item) =>
                      total +
                      (quantities[Number(item.cart.id)] ?? item.cart.quantity) *
                        Number(item.product.price),
                    0
                  )
                  .toLocaleString()}{" "}
                USD
              </span>
            </div>
            <button className="mt-5 w-full">
              <Checkout/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
