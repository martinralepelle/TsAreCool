import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useFavorites } from "@/lib/favorites-context";
import { Heart, ShoppingCart, Menu, User, Package, HelpCircle, FileText, LogOut, Home } from "lucide-react";

const Header = () => {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const { favoriteItems } = useFavorites();
  const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [, setLocation] = useLocation();
  const [location] = useLocation();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (path: string) => {
    setLocation(path);
    setBurgerMenuOpen(false);
  };

  const toggleBurgerMenu = () => {
    setBurgerMenuOpen(!burgerMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigateTo("/");
  };

  const handleClickOutside = () => {
    setBurgerMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? "bg-white shadow-md py-2" : "bg-white shadow-sm py-3"
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex-1">
          <div 
            className="font-poppins font-bold text-2xl text-[#1D3557] cursor-pointer transition-transform hover:scale-105"
            onClick={() => navigateTo("/")}
          >
            Ts Are Cool
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Favorites button - visible on mobile only */}
          <div className="relative md:hidden">
            <div 
              className={`p-2 rounded-full transition-colors ${
                isActive("/favorites") 
                  ? "bg-[#F1FAEE] text-[#1D3557]" 
                  : "text-[#1D3557] hover:bg-[#F1FAEE]"
              } focus:outline-none cursor-pointer`}
              onClick={() => navigateTo("/favorites")}
              aria-label="Favorites"
            >
              <Heart className="h-5 w-5" />
              {favoriteItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#A8DADC] text-[#1D3557] rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                  {favoriteItems.length}
                </span>
              )}
            </div>
          </div>
          
          {/* Favorites counter - visible on desktop only */}
          <div className="relative hidden md:block">
            <div 
              className={`p-2 rounded-full transition-colors ${
                isActive("/favorites") 
                  ? "bg-[#F1FAEE] text-[#1D3557]" 
                  : "text-[#1D3557] hover:bg-[#F1FAEE]"
              } focus:outline-none cursor-pointer`}
              onClick={() => navigateTo("/favorites")}
              aria-label="Favorites"
            >
              <Heart className="h-5 w-5" />
              {favoriteItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#A8DADC] text-[#1D3557] rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                  {favoriteItems.length}
                </span>
              )}
            </div>
          </div>
          
          {/* Cart button */}
          <div className="relative">
            <div 
              className={`p-2 rounded-full transition-colors ${
                isActive("/cart") 
                  ? "bg-[#F1FAEE] text-[#1D3557]" 
                  : "text-[#1D3557] hover:bg-[#F1FAEE]"
              } focus:outline-none cursor-pointer`}
              onClick={() => navigateTo("/cart")}
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#A8DADC] text-[#1D3557] rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </div>
          </div>
          
          {/* Burger menu */}
          <div className="relative">
            <button 
              className={`p-2 rounded-full transition-colors ${
                burgerMenuOpen 
                  ? "bg-[#F1FAEE] text-[#1D3557]" 
                  : "text-[#1D3557] hover:bg-[#F1FAEE]"
              } focus:outline-none`}
              onClick={toggleBurgerMenu}
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            {burgerMenuOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg py-2 z-50">
                <div className="border-b border-gray-200 pb-2 px-4 mb-1">
                  <p className="text-sm text-gray-500">Welcome, {user?.username || 'Guest'}</p>
                </div>
                <button 
                  className="flex w-full items-center px-4 py-2 text-sm text-[#1D3557] hover:bg-[#F1FAEE] cursor-pointer"
                  onClick={() => navigateTo("/profile")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </button>
                <button 
                  className="flex w-full items-center px-4 py-2 text-sm text-[#1D3557] hover:bg-[#F1FAEE] cursor-pointer"
                  onClick={() => navigateTo("/orders")}
                >
                  <Package className="h-4 w-4 mr-2" />
                  My Orders
                </button>
                <button 
                  className="flex w-full items-center px-4 py-2 text-sm text-[#1D3557] hover:bg-[#F1FAEE] cursor-pointer"
                  onClick={() => navigateTo("/help")}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help
                </button>
                <button 
                  className="flex w-full items-center px-4 py-2 text-sm text-[#1D3557] hover:bg-[#F1FAEE] cursor-pointer"
                  onClick={() => navigateTo("/terms")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Terms & Conditions
                </button>
                <div className="border-t border-gray-200 mt-1 pt-1">
                  <button 
                    className="flex w-full items-center px-4 py-2 text-sm text-red-500 hover:bg-[#F1FAEE] cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside handler overlay (only when burger menu is open) */}
      {burgerMenuOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={handleClickOutside}
        ></div>
      )}
    </header>
  );
};

export default Header;
