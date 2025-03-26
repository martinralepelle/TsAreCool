import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import CartItem from "@/components/cart/CartItem";
import { useCart } from "@/lib/cart-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Cart = () => {
  const { cartItems, getCartSubtotal } = useCart();
  const [, setLocation] = useLocation();
  
  const subtotal = getCartSubtotal();
  const shipping = 5.99;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shipping + tax;

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleCheckout = () => {
    setLocation("/checkout");
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#1D3557] mb-8">Your Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-[#457B9D] text-4xl mb-4">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <h2 className="text-xl font-semibold text-[#1D3557] mb-4">Your cart is empty</h2>
          <p className="text-[#457B9D] mb-6">Looks like you haven't added any t-shirts to your cart yet.</p>
          <Link href="/">
            <button className="inline-block bg-[#1D3557] hover:bg-[#457B9D] text-white font-medium py-3 px-4 rounded-md transition-colors">
              Start Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {cartItems.map((item) => (
                <CartItem key={`${item.productId}-${item.size}-${item.color}`} item={item} />
              ))}
            </div>
            
            <div className="mt-4">
              <Link href="/">
                <button className="text-[#457B9D] hover:text-[#1D3557] flex items-center bg-transparent border-0 cursor-pointer p-0">
                  <i className="fas fa-arrow-left mr-2"></i>
                  <span>Continue Shopping</span>
                </button>
              </Link>
            </div>
          </div>
          
          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-[#1D3557] mb-4">Order Summary</h2>
              
              {/* Display items with quantities */}
              <div className="space-y-3 mb-4">
                {cartItems.map(item => (
                  <div className="flex justify-between text-sm" key={`${item.productId}-${item.size}-${item.color}`}>
                    <span className="text-[#457B9D]">
                      {item.name} ({item.color}, {item.size}) <span className="font-medium">x{item.quantity}</span>
                    </span>
                    <span className="text-[#1D3557]">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 pt-4 border-t border-gray-100 mb-6">
                <div className="flex justify-between">
                  <span className="text-[#457B9D]">Subtotal</span>
                  <span className="text-[#1D3557]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#457B9D]">Shipping</span>
                  <span className="text-[#1D3557]">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#457B9D]">Tax</span>
                  <span className="text-[#1D3557]">${tax.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between font-semibold">
                  <span className="text-[#1D3557]">Total</span>
                  <span className="text-[#1D3557]">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-[#1D3557] hover:bg-[#457B9D] text-white font-medium py-3 px-4 rounded-md transition-colors"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
