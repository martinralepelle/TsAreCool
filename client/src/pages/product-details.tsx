import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToastNotification } from "@/components/ui/toast-notification";
import { useCart } from "@/lib/cart-context";

const ProductDetails = () => {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id ? parseInt(params.id) : null;
  const [, setLocation] = useLocation();
  
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("blue");
  const [selectedImage, setSelectedImage] = useState(0);
  
  const { showToast } = useToastNotification();
  const { addToCart } = useCart();

  // Fetch product details
  const { data: product, isLoading, error } = useQuery({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId,
  });

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        size: selectedSize,
        color: selectedColor,
        quantity: 1
      });
      showToast("Item added to cart!");
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading product details...</div>;
  }

  if (error || !product) {
    return <div className="text-center py-10 text-red-500">Error loading product details. Please try again.</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <div
          onClick={() => setLocation('/')}
          className="text-[#457B9D] hover:text-[#1D3557] flex items-center cursor-pointer"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          <span>Back to Products</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          <div className="relative pb-4">
            <img 
              src={product.images ? product.images[selectedImage] : product.imageUrl} 
              alt={`${product.name} view`} 
              className="w-full h-96 md:h-[500px] object-cover"
            />
            
            {/* Thumbnail navigation */}
            {product.images && product.images.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2 px-4">
                {product.images.map((image, index) => (
                  <button 
                    key={index}
                    className={`w-20 h-20 border-2 ${
                      selectedImage === index ? "border-[#A8DADC]" : "border-transparent hover:border-[#A8DADC]"
                    } rounded overflow-hidden`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={image} 
                      alt={`View ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Product Information */}
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-semibold text-[#1D3557] mb-1">{product.name}</h1>
            <p className="text-[#457B9D] font-lora mb-4">{product.category}</p>
            
            <div className="mb-6">
              <span className="text-2xl font-bold text-[#1D3557]">${product.price.toFixed(2)}</span>
            </div>
            
            <div className="mb-6">
              <p className="font-lora text-[#457B9D]">
                {product.description}
              </p>
            </div>
            
            {/* Size selection */}
            <div className="mb-6">
              <label className="block text-[#1D3557] font-medium mb-2">Size</label>
              <div className="grid grid-cols-5 gap-2">
                {["XS", "S", "M", "L", "XL"].map((size) => (
                  <button 
                    key={size}
                    className={`border ${
                      selectedSize === size 
                        ? "border-[#A8DADC] bg-[#A8DADC]" 
                        : "border-gray-200 hover:border-[#A8DADC] hover:bg-[#A8DADC]"
                    } rounded-md py-2 ${
                      selectedSize === size ? "text-[#1D3557] font-medium" : "text-[#457B9D]"
                    } hover:text-[#1D3557] transition-colors`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Color selection */}
            <div className="mb-8">
              <label className="block text-[#1D3557] font-medium mb-2">Color</label>
              <div className="flex space-x-3">
                <button 
                  className={`w-10 h-10 rounded-full bg-blue-400 ${selectedColor === "blue" ? "ring-2 ring-offset-2 ring-[#A8DADC]" : "hover:ring-2 hover:ring-offset-2 hover:ring-[#A8DADC]"} transition-all`}
                  onClick={() => setSelectedColor("blue")}
                ></button>
                <button 
                  className={`w-10 h-10 rounded-full bg-gray-200 ${selectedColor === "gray" ? "ring-2 ring-offset-2 ring-[#A8DADC]" : "hover:ring-2 hover:ring-offset-2 hover:ring-[#A8DADC]"} transition-all`}
                  onClick={() => setSelectedColor("gray")}
                ></button>
                <button 
                  className={`w-10 h-10 rounded-full bg-green-300 ${selectedColor === "green" ? "ring-2 ring-offset-2 ring-[#A8DADC]" : "hover:ring-2 hover:ring-offset-2 hover:ring-[#A8DADC]"} transition-all`}
                  onClick={() => setSelectedColor("green")}
                ></button>
              </div>
            </div>
            
            {/* Add to cart button */}
            <Button 
              className="w-full bg-[#1D3557] hover:bg-[#457B9D] text-white font-medium py-3 px-4 rounded-md transition-colors"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
          
          {/* Additional product info */}
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h3 className="font-medium text-[#1D3557] mb-2">Materials</h3>
              <p className="font-lora text-[#457B9D]">{product.materials || "100% Cotton"}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-[#1D3557] mb-2">Care Instructions</h3>
              <p className="font-lora text-[#457B9D]">{product.careInstructions || "Machine wash cold. Tumble dry low."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
