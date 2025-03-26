import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

const OrderConfirmation = () => {
  const [, setLocation] = useLocation();
  
  // Get the most recent order
  const { data: order, isLoading } = useQuery({
    queryKey: ["/api/orders/recent"],
  });

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleViewOrder = () => {
    if (order) {
      setLocation("/orders");
    }
  };

  const handleContinueShopping = () => {
    setLocation("/");
  };

  // Generate random order number if we don't have one
  const orderNumber = order?.orderNumber || `T${Math.floor(10000 + Math.random() * 90000)}`;
  
  // Generate current date for order date
  const orderDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Calculate estimated delivery date (4-6 days from now)
  const getEstimatedDelivery = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 4);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 6);
    
    return `${startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}-${endDate.toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="max-w-lg mx-auto text-center bg-white rounded-lg shadow-sm p-8">
      <div className="mb-6 text-[#A8DADC]">
        <i className="fas fa-check-circle text-5xl"></i>
      </div>
      
      <h1 className="text-2xl font-semibold text-[#1D3557] mb-4">Order Placed Successfully!</h1>
      
      <p className="text-[#457B9D] mb-6 font-lora">
        Thank you for your purchase. Your order #{orderNumber} has been confirmed and will be shipped soon.
      </p>
      
      <div className="bg-[#F1FAEE] rounded-md p-4 mb-6">
        <h3 className="font-medium text-[#1D3557] mb-2">Order Details</h3>
        <div className="text-sm text-[#457B9D] text-left">
          <div className="flex justify-between mb-1">
            <span>Order Number:</span>
            <span className="font-medium">{orderNumber}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Order Date:</span>
            <span className="font-medium">{orderDate}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Total Amount:</span>
            <span className="font-medium">${order?.total?.toFixed(2) || "0.00"}</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Delivery:</span>
            <span className="font-medium">{getEstimatedDelivery()}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <Button
          className="w-full bg-[#1D3557] hover:bg-[#457B9D] text-white font-medium py-3 px-4 rounded-md transition-colors"
          onClick={handleViewOrder}
        >
          View Order Details
        </Button>
        
        <Button
          className="w-full bg-white border border-[#1D3557] text-[#1D3557] hover:bg-[#F1FAEE] font-medium py-3 px-4 rounded-md transition-colors"
          onClick={handleContinueShopping}
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
