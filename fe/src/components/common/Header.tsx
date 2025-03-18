import React, { useEffect, useState, useRef } from "react";
import { ShoppingCart, CircleUserRound } from "lucide-react";
import AnimatedMenuButton from "../../common/Menu";
import { Link, useNavigate } from "react-router-dom";
import { navItems } from "../../utils";
import { useAuthStore } from "../../store/useAuthStore";
import Loading from "./Loading";
import Cart from "../../pages/cart/Cart";

export default function Header() {
  const [isOpened, setIsOpened] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isCartOpen, setCartOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    await logout();
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const handleOpenMenu = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpened(!isOpened);
  };

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div>
      <header
        className={`w-full sticky lg:fixed top-0 z-50 h-20 flex items-center justify-between px-5 transition-colors duration-200 ease-in-out ${
          isScrolled
            ? "bg-gray-900/90 backdrop-blur-md text-white"
            : "bg-gray-950 text-white"
        }`}
      >
        <div className="flex items-center space-x-10">
          <h1 className="font-bold text-2xl">
            <a href="/">Brand</a>
          </h1>
          <ul className="hidden space-x-2 lg:flex">
            {navItems.map((item) => (
              <li
                key={item.name}
                className="hover:text-indigo-400 transition-colors duration-200 ease-in-out"
              >
                <Link key={item.name} to={item.href}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center space-x-3">
          <button
            className="hover:cursor-pointer hover:text-indigo-400 transition-colors duration-200 ease-in-out"
            onClick={() => {
              setCartOpen(!isCartOpen);
            }}
          >
            <ShoppingCart className="h-7 w-7" />
          </button>
          <div
            className="hover:cursor-pointer hover:text-indigo-400 transition-colors duration-200 ease-in-out"
            onClick={handleOpenMenu}
          >
            <div className="lg:hidden block">
              <AnimatedMenuButton
                onClick={handleOpenMenu}
                isOpened={isOpened}
              />
            </div>
          </div>

          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="hover:cursor-pointer hover:text-indigo-400 transition-colors duration-200 ease-in-out hidden lg:block relative"
                onClick={handleToggleDropdown}
              >
                <CircleUserRound className="h-7 w-7" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg overflow-hidden z-50">
                  <ul className="py-2 text-gray-700">
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="space-x-1 lg:flex hidden">
              <a
                href="/login"
                className="hover:text-indigo-400 transition-colors duration-200 ease-in-out"
              >
                Login
              </a>
              <div className="border-r-1 rotate-12"></div>
              <a
                href="/signup"
                className="hover:text-indigo-400 transition-colors duration-200 ease-in-out"
              >
                Signup
              </a>
            </div>
          )}
        </div>
      </header>

      {isOpened && (
        <div
          className={`w-full p-4 bg-indigo-400 backdrop-blur-2xl overflow-hidden shadow-lg transition-all`}
        >
          <ul className="text-white space-y-5">
            {navItems.map((item) => (
              <li key={item.name}>
                <a href={item.href}>{item.name}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Loading isVisible={isLoading} />
      {isCartOpen && <Cart onClose={() => setCartOpen(false)} />}
    </div>
  );
}
