import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { CartItemType } from "@/lib/cart-context";

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateCartItemQuantity, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateCartItemQuantity(item.productId, item.size, item.color, newQuantity);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateCartItemQuantity(item.productId, item.size, item.color, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.productId, item.size, item.color);
  };

  return (
    <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row">
      <img 
        src={item.imageUrl} 
        alt={item.name} 
        className="w-24 h-24 object-cover rounded-md mr-4 flex-shrink-0 mb-4 sm:mb-0"
      />
      
      <div className="flex-grow">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium text-[#1D3557]">{item.name}</h3>
            <p className="text-[#457B9D] text-sm">Size: {item.size} | Color: {item.color}</p>
          </div>
          <span className="font-semibold text-[#1D3557]">${item.price.toFixed(2)}</span>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center border border-gray-200 rounded-md">
            <button 
              className="px-3 py-1 text-[#457B9D] hover:text-[#1D3557] hover:bg-[#F1FAEE]"
              onClick={handleDecrement}
            >
              -
            </button>
            <span className="px-3 py-1 border-x border-gray-200">{quantity}</span>
            <button 
              className="px-3 py-1 text-[#457B9D] hover:text-[#1D3557] hover:bg-[#F1FAEE]"
              onClick={handleIncrement}
            >
              +
            </button>
          </div>
          
          <button 
            className="text-[#457B9D] hover:text-[#1D3557]"
            onClick={handleRemove}
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
