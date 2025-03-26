import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";

interface OrderSummaryProps {
  triggerSubmit: () => void;
  buttonText: string;
  showTermsNotice?: boolean;
}

const OrderSummary = ({ 
  triggerSubmit, 
  buttonText,
  showTermsNotice = false 
}: OrderSummaryProps) => {
  const { cartItems, getCartSubtotal } = useCart();
  const subtotal = getCartSubtotal();
  const shipping = 5.99;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-[#1D3557] mb-4">Order Summary</h2>
      
      {cartItems.length > 0 && (
        <div className="space-y-3 mb-4">
          {cartItems.map(item => (
            <div className="flex justify-between text-sm" key={`${item.productId}-${item.size}-${item.color}`}>
              <span className="text-[#457B9D]">{item.name} x{item.quantity}</span>
              <span className="text-[#1D3557]">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
      
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
        onClick={triggerSubmit}
      >
        {buttonText}
      </Button>
      
      {showTermsNotice && (
        <div className="mt-4 text-center text-xs text-[#457B9D]">
          By placing your order, you agree to our <a href="#" className="text-[#1D3557] hover:underline">Terms & Conditions</a> and <a href="#" className="text-[#1D3557] hover:underline">Privacy Policy</a>.
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
