import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Feature from "./pages/Feature";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import Profile from "./pages/Profile";
import ProductDetails from "./components/product/ProductDetails";
import CartDetails from "./components/cart/CartDetails";

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/feature" element={<Feature />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Home />} />
      <Route
        path="/signup"
        element={!isAuthenticated ? <Signup /> : <Home />}
      />
      <Route
        path="/profile"
        element={!isAuthenticated ? <Login /> : <Profile />}
      />
      <Route path={`/product/:id`} element={<ProductDetails />} />
      <Route path="/cart-details" element={<CartDetails />} />
    </Routes>
  );
}

export default App;
