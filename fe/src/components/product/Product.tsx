import { Filter, Search, Heart, X } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useState } from "react";
import { FilterItems, ProductCategoryItems } from "../../utils";
import { filter } from "../../interfaces";
import { useNavigate } from "react-router-dom";
import { useProductData } from "../../hooks";

export default function Product() {
  const [viewState, setViewState] = useState<"filter" | "search" | "">("");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const { productData } = useProductData();
  const navigate = useNavigate();

  const handleViewState = (state: "filter" | "search") => {
    setViewState((prevState) => (prevState === state ? "" : state));
  };

  const handleShowProductDetails = async (id: number) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="px-4 py-8 md:px-8 lg:px-16 md:py-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">
          Discover Our Products
        </h2>
        <div className="flex gap-4">
          <button
            className={`px-5 py-2.5 rounded-lg flex items-center gap-2 bg-white shadow-sm border border-gray-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all duration-300 cursor-pointer ${
              viewState === "filter"
                ? "bg-indigo-600 text-black shadow-md border-indigo-600"
                : ""
            }`}
            onClick={() => handleViewState("filter")}
          >
            {viewState === "filter" ? <X size={20} /> : <Filter size={20} />}
            <span className="font-medium">Filters</span>
          </button>
          <button
            className={`px-5 py-2.5 rounded-lg flex items-center gap-2 bg-white shadow-sm border border-gray-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all duration-300 cursor-pointer${
              viewState === "search"
                ? "bg-indigo-600 text-black shadow-md border-indigo-600"
                : ""
            }`}
            onClick={() => handleViewState("search")}
          >
            {viewState === "search" ? <X size={20} /> : <Search size={20} />}
            <span className="font-medium">Search</span>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-10">
        <ul className="flex flex-wrap gap-3">
          {ProductCategoryItems.map((item) => (
            <li
              key={item.name}
              className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 ${
                activeCategory === item.name
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
              onClick={() => setActiveCategory(item.name)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Filter/Search Section */}
      {viewState === "filter" && (
        <section className="bg-white shadow-lg rounded-xl p-6 mb-10 border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {["Sort By", "Price", "Categories", "Tags"].map((title) => (
              <div key={title}>
                <h3 className="text-gray-800 font-semibold text-lg mb-4">
                  {title}
                </h3>
                <div
                  className={
                    title === "Tags" ? "flex flex-wrap gap-2" : "space-y-3"
                  }
                >
                  {FilterItems.map((item) => (
                    <a
                      key={item.id}
                      href="#"
                      className={
                        title === "Tags"
                          ? "px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300"
                          : "block text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-md transition-all duration-300"
                      }
                    >
                      {
                        item[
                          title.toLowerCase().replace(" ", "") as keyof filter
                        ]
                      }
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {viewState === "search" && (
        <div className="mb-10 max-w-xl mx-auto">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 placeholder-gray-400 transition-all duration-300"
              placeholder="Search for products..."
            />
          </div>
        </div>
      )}

      {/* Product Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 cursor-pointer">
        {productData.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
            onClick={() => handleShowProductDetails(item.id)}
          >
            <div className="relative w-full">
              <LazyLoadImage
                src={item.imagePath[0]?.url || ''}
                alt={item.name}
                className="w-full h-auto aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-105"
                effect="opacity"
                threshold={200}
              />

              <button className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white shadow-sm transition-all duration-300">
                <Heart className="h-5 w-5 text-gray-500 hover:text-red-500 transition-colors duration-300" />
              </button>
            </div>
            <div className="p-5">
              <span className="block text-gray-600 text-sm mb-2 line-clamp-2">
                {item.desc}
              </span>
              <div className="flex justify-between">
                <span className="font-bold text-indigo-600 text-xl">
                  ${item.price}
                </span>
              </div>
            </div>
            <button className="absolute bottom-0 left-0 right-0 mx-auto w-[90%] mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 cursor-pointer">
              Add to Cart
            </button>
          </div>
        ))}
      </section>

      {/* Pagination */}
      <div className="flex justify-center gap-3 mt-12">
        {[1, 2].map((page) => (
          <button
            key={page}
            className="h-11 w-11 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300"
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
