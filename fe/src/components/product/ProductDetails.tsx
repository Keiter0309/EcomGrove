import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productService } from "../../services/productService";
import { Heart, ShoppingCart, Minus, Plus, Star } from "lucide-react";
import { ProductItems } from "../../utils";
import Header from "../common/Header";
import Footer from "../common/Footer";
import Loading from "../common/Loading";
import { cartService } from "../../services/cartService";
import { CartProps } from "../../interfaces/cart";
import toast, { Toaster } from "react-hot-toast";
import { ProductDetailsProps, ProductImage } from "../../interfaces";
import { useAuthStore } from "../../store/useAuthStore";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetailsProps | null>(null);
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"description" | "additional">(
    "description"
  );
  const [activeImage, setActiveImage] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };

  const findProductById = async () => {
    try {
      setLoading(true);
      const response = await productService.findOneById(Number(id));
      const productData = response.data.data;
      const images = JSON.parse(productData.imagePath);
      setProduct({
        id: productData.id,
        name: productData.name,
        desc: productData.description,
        price: productData.price,
        stock: productData.stock,
        imagePath: images,
      });
      setActiveImage(images[0]?.url || "");
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (
    id: number,
    quantity: number,
    imagePath?: ProductImage[],
    name?: string,
    price?: string
  ) => {
    if (isAuthenticated) {
      const payload: CartProps = {
        productId: id,
        quantity,
      };
      try {
        const response = await cartService.addToCart(payload);
        if (response.status === 200) {
          toast.success("Added to cart successfully");

          setProduct((prev) =>
            prev ? { ...prev, stock: Math.max(prev.stock - quantity, 0) } : prev
          );

          setQuantity(1);
        }
      } catch (error: unknown) {
        toast.error("Failed to add to cart");
      }
    } else {
      const existingCart: CartProps[] = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

      const newItem: CartProps = {
        productId: id,
        quantity,
        imagePath,
        name,
        price,
      };

      const existingIndex = existingCart.findIndex(
        (item) => item.productId === id
      );
      if (existingIndex !== -1) {
        existingCart[existingIndex].quantity += quantity;
      } else {
        existingCart.push(newItem);
      }

      localStorage.setItem("cart", JSON.stringify(existingCart));
      console.log(existingCart);
      toast.success("Added to cart successfully");

      setProduct((prev) =>
        prev ? { ...prev, stock: Math.max(prev.stock - quantity, 0) } : prev
      );

      setQuantity(1);
    }
  };

  useEffect(() => {
    if (id) findProductById();
    window.scrollTo(0, 0);
  }, [id]);

  const handleQuantityChange = (action: "increase" | "decrease") => {
    if (action === "increase" && product && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const relatedProducts = ProductItems.filter(
    (item) => item.id !== Number(id)
  ).slice(0, 3);

  return (
    <>
      <Header />
      <div className=" min-h-screen pt-24 pb-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <Toaster />
        {loading ? (
          <Loading isVisible={true} />
        ) : product ? (
          <div className="space-y-12">
            {/* Main Product Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="relative group bg-white rounded-2xl shadow-lg overflow-hidden">
                  <img
                    src={activeImage}
                    alt={product.name}
                    className="w-full h-[450px] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button className="absolute top-4 right-4 p-2 rounded-full bg-white/90 shadow-md hover:bg-white transition-all duration-300">
                    <Heart className="h-5 w-5 text-gray-600 hover:text-amber-500 transition-colors duration-300" />
                  </button>
                </div>
                {/* Thumbnail Images */}
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.imagePath.map((img, index) => (
                    <img
                      key={index}
                      src={img.url}
                      alt={img.name}
                      className={`h-28 w-28 object-cover rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                        activeImage === img.url
                          ? "border-indigo-500"
                          : "border-gray-200 hover:border-indigo-300"
                      }`}
                      onClick={() => setActiveImage(img.url)}
                    />
                  ))}
                </div>
              </div>

              {/* Product Details */}
              <div className="bg-white rounded-2xl p-6 shadow-lg flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                    {product.name}
                  </h2>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-amber-400 fill-current"
                        />
                      ))}
                    </div>
                    <span className="text-gray-500 text-sm font-medium">
                      (4.8/5 - 120 reviews)
                    </span>
                  </div>
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed line-clamp-2">
                    {product.desc}
                  </p>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-indigo-600 font-extrabold text-3xl">
                      $
                      {typeof product.price === "number"
                        ? product.price.toFixed(2)
                        : product.price}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                      {product.stock > 0 ? (
                        <span className="text-green-600">
                          In Stock: {product.stock}
                        </span>
                      ) : (
                        <span className="text-red-600">Out of Stock</span>
                      )}
                    </span>
                  </div>

                  {/* Quantity Selector */}
                  {product.stock > 0 && (
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-gray-700 font-medium">
                        Quantity:
                      </span>
                      <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                        <button
                          onClick={() => handleQuantityChange("decrease")}
                          className="p-2 hover:bg-gray-100 text-gray-700 transition-all duration-300 disabled:opacity-50"
                          disabled={quantity <= 1}
                        >
                          <Minus size={18} />
                        </button>
                        <input
                          className="w-12 text-center text-gray-900 font-semibold border-x border-gray-200 py-2"
                          onChange={handleInputChange}
                          value={quantity}
                        />
                        <button
                          onClick={() => handleQuantityChange("increase")}
                          className="p-2 hover:bg-gray-100 text-gray-700 transition-all duration-300 disabled:opacity-50"
                          disabled={quantity >= product.stock}
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button
                  onClick={() =>
                    handleAddToCart(
                      product.id,
                      quantity,
                      product.imagePath,
                      product.name,
                      typeof product.price === "number"
                        ? product.price.toString()
                        : product.price
                    )
                  }
                  className={`w-full py-3 rounded-full flex items-center justify-center gap-2 font-semibold text-lg transition-all duration-300 ${
                    product.stock > 0
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={product.stock <= 0}
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex gap-6 border-b border-gray-200 mb-6">
                <button
                  className={`pb-3 text-lg font-semibold transition-all duration-300 ${
                    activeTab === "description"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-600 hover:text-indigo-500"
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  Description
                </button>
                <button
                  className={`pb-3 text-lg font-semibold transition-all duration-300 ${
                    activeTab === "additional"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-600 hover:text-indigo-500"
                  }`}
                  onClick={() => setActiveTab("additional")}
                >
                  Additional Info
                </button>
              </div>
              <div className="text-gray-700 text-base leading-relaxed">
                {activeTab === "description" ? (
                  <p>{product.desc}</p>
                ) : (
                  <ul className="space-y-3">
                    <li>
                      <span className="font-semibold text-gray-900">ID:</span>{" "}
                      {product.id}
                    </li>
                    <li>
                      <span className="font-semibold text-gray-900">
                        Price:
                      </span>{" "}
                      $
                      {typeof product.price === "number"
                        ? product.price.toFixed(2)
                        : product.price}
                    </li>
                    <li>
                      <span className="font-semibold text-gray-900">
                        Stock:
                      </span>{" "}
                      {product.stock} units
                    </li>
                  </ul>
                )}
              </div>
            </div>

            {/* Related Products Section */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Related Products
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <img
                      src="#"
                      alt={item.name}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.name}
                      </h4>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                        {item.desc}
                      </p>
                      <span className="text-indigo-600 font-bold">
                        ${item.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-[60vh]">
            <p className="text-gray-600 text-xl font-medium">
              Product not found
            </p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
