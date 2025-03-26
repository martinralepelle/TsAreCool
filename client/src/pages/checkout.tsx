import { useRef } from "react";
import { useLocation } from "wouter";
import { useToastNotification } from "@/components/ui/toast-notification";
import { useCart } from "@/lib/cart-context";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { UserAddress } from "@shared/schema";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { showToast } = useToastNotification();
  const [, setLocation] = useLocation();
  const formRef = useRef<HTMLFormElement>(null);

  const triggerFormSubmit = () => {
    // Use the form ref to submit the form
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (cartItems.length === 0) {
        showToast("Your cart is empty. Please add items before checking out.");
        setLocation("/");
        return;
      }

      // Determine which shipping information to use
      let shippingInfo;
      
      if (data.selectedAddressId) {
        // User selected a saved address
        try {
          const res = await apiRequest("GET", `/api/users/addresses/${data.selectedAddressId}`);
          if (!res.ok) {
            throw new Error("Failed to fetch selected address");
          }
          const selectedAddress = await res.json();
          
          // Format the address for the order
          shippingInfo = {
            firstName: selectedAddress.firstName,
            lastName: selectedAddress.lastName,
            address: selectedAddress.address,
            city: selectedAddress.city,
            state: selectedAddress.state,
            zipCode: selectedAddress.zipCode,
            country: selectedAddress.country,
            phone: selectedAddress.phone
          };
        } catch (error) {
          console.error("Error fetching address:", error);
          shippingInfo = data.shipping;
        }
      } else if (data.newAddress) {
        // User added a new address but didn't save it
        shippingInfo = {
          firstName: data.newAddress.firstName,
          lastName: data.newAddress.lastName,
          address: data.newAddress.address,
          city: data.newAddress.city,
          state: data.newAddress.state,
          zipCode: data.newAddress.zipCode,
          country: data.newAddress.country,
          phone: data.newAddress.phone
        };
      } else {
        // Fallback to the shipping information in the form
        shippingInfo = data.shipping;
      }
      
      // Submit order to backend
      await apiRequest("POST", "/api/orders", { 
        shippingInfo,
        paymentInfo: data.payment,
        cartItems
      });
      
      // Clear cart and redirect to order confirmation
      clearCart();
      setLocation("/order-confirmation");
    } catch (error) {
      showToast("There was a problem processing your order. Please try again.");
      console.error("Order submission error:", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#1D3557] mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout form */}
        <div className="lg:col-span-2">
          <CheckoutForm 
            onFormSubmit={handleFormSubmit}
            formRef={formRef}
          />
        </div>
        
        {/* Order summary */}
        <div className="lg:col-span-1">
          <OrderSummary 
            triggerSubmit={triggerFormSubmit} 
            buttonText="Place Order"
            showTermsNotice={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
