import { useState } from "react";
import { Link } from "wouter";
import { Product } from "@shared/schema";
import { useCart } from "@/lib/cart-context";
import { useFavorites } from "@/lib/favorites-context";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ChevronDown, Check, Heart } from "lucide-react";
import { useToastNotification } from "@/components/ui/toast-notification";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { showToast } = useToastNotification();
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [showOptions, setShowOptions] = useState(false);
  const isProductFavorite = isFavorite(product.id);

  // Helper function to generate a background color style from color name
  const getColorStyle = (colorName: string) => {
    switch(colorName.toLowerCase()) {
      case 'white': return 'bg-white border border-gray-300';
      case 'black': return 'bg-black';
      case 'blue': return 'bg-blue-500';
      case 'red': return 'bg-red-500';
      case 'gray': return 'bg-gray-500';
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-400';
      case 'purple': return 'bg-purple-500';
      case 'pink': return 'bg-pink-500';
      case 'orange': return 'bg-orange-500';
      case 'brown': return 'bg-amber-800';
      case 'navy': return 'bg-blue-900';
      case 'light blue': return 'bg-blue-300';
      default: return 'bg-gray-300'; // fallback
    }
  };

  const handleAddToCart = () => {
    if (!selectedColor) {
      showToast("Please select a color");
      return;
    }
    if (!selectedSize) {
      showToast("Please select a size");
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: product.imageUrl,
      size: selectedSize,
      color: selectedColor,
      quantity: 1
    });

    showToast(`${product.name} (${selectedColor}, ${selectedSize}) added to cart`);
    setShowOptions(false); // Close the dialog after adding to cart
  };

  // Reset selections when dialog opens/closes
  const handleDialogChange = (open: boolean) => {
    if (open) {
      // Set defaults when opening
      if (product.availableColors && product.availableColors.length > 0) {
        setSelectedColor(product.availableColors[0]);
      }
      if (product.availableSizes && product.availableSizes.length > 0) {
        setSelectedSize(product.availableSizes[0]);
      }
    } else {
      setShowOptions(false);
    }
  };
  
  // Handle favorite toggle
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isProductFavorite) {
      removeFromFavorites(product.id);
      showToast(`${product.name} removed from favorites`);
    } else {
      addToFavorites({
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        imageUrl: product.imageUrl,
        description: product.description || '',
        category: product.category
      });
      showToast(`${product.name} added to favorites`);
    }
  };

  return (
    <div className="product-card bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg group">
      <div className="product-image-container relative overflow-hidden">
        <Link href={`/product/${product.id}`}>
          <div className="block cursor-pointer">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Category badge */}
            <div className="absolute top-3 left-3">
              <span className="bg-[#A8DADC] text-[#1D3557] text-xs px-2 py-1 rounded-full font-medium">
                {product.category}
              </span>
            </div>
          </div>
        </Link>
        <button 
          onClick={handleFavoriteToggle}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all duration-300 ${
            isProductFavorite 
              ? 'bg-red-500 text-white scale-110' 
              : 'bg-white text-gray-400 hover:text-red-500 hover:scale-110'
          }`}
          aria-label={isProductFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={18} fill={isProductFavorite ? "currentColor" : "none"} />
        </button>
        
        {/* Quick add to cart overlay - on desktop only */}
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center hidden md:flex">
          <button 
            onClick={(e) => {
              e.preventDefault();
              setShowOptions(true);
            }}
            className="bg-white text-[#1D3557] py-2 px-4 rounded-md font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-[#F1FAEE]"
          >
            Quick Shop
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <div className="block cursor-pointer mb-2">
            <h3 className="font-medium text-[#1D3557] text-lg hover:text-[#457B9D] transition-colors">{product.name}</h3>
          </div>
        </Link>
        
        {/* Price with sale indicator if needed */}
        <div className="mb-3">
          <div className="font-bold text-[#1D3557] text-lg">
            ${Number(product.price).toFixed(2)}
            {/* Example of a sale price */}
            {/* <span className="ml-2 text-sm line-through text-gray-400">$35.99</span> */}
          </div>
        </div>
        
        {/* Display available colors */}
        {product.availableColors && product.availableColors.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center mb-1.5">
              <p className="text-xs text-gray-500 mr-1">Colors:</p>
              <p className="text-xs font-medium text-[#1D3557]">
                {selectedColor || product.availableColors[0]}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {product.availableColors.map((color, index) => (
                <button 
                  key={index} 
                  className={`w-6 h-6 rounded-full ${getColorStyle(color)} ${
                    selectedColor === color 
                      ? 'ring-2 ring-[#457B9D] ring-offset-1 scale-110' 
                      : 'hover:scale-110'
                  } transition-all duration-200`} 
                  title={color}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedColor(color);
                  }}
                  type="button"
                ></button>
              ))}
            </div>
          </div>
        )}
        
        {/* Display available sizes */}
        {product.availableSizes && product.availableSizes.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center mb-1.5">
              <p className="text-xs text-gray-500 mr-1">Size:</p>
              <p className="text-xs font-medium text-[#1D3557]">
                {selectedSize || product.availableSizes[0]}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {product.availableSizes.map((size, index) => (
                <button 
                  key={index} 
                  className={`text-xs border ${
                    selectedSize === size 
                      ? 'bg-[#457B9D] text-white border-[#457B9D] font-medium' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                  } rounded-md px-2 py-1 transition-colors duration-200`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  type="button"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Add to Cart Button and Dialog */}
      <div className="px-4 pb-4 mt-auto">
        <Dialog open={showOptions} onOpenChange={(open) => {
            setShowOptions(open);
            handleDialogChange(open);
          }}>
          <DialogTrigger asChild>
            <Button 
              variant="default" 
              className="w-full bg-[#457B9D] hover:bg-[#1D3557] transition-colors duration-300 py-2.5"
              onClick={(e) => {
                e.preventDefault();
                setShowOptions(true);
              }}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Select Options</DialogTitle>
              <p className="text-sm text-gray-500">
                Choose your preferred color and size for {product.name}.
              </p>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Product info */}
              <div className="flex gap-4 items-center bg-gray-50 p-3 rounded-lg">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-20 h-20 object-cover rounded-md shadow-sm" 
                />
                <div>
                  <h3 className="font-medium text-[#1D3557]">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{product.category}</p>
                  <p className="text-lg font-bold text-[#1D3557]">
                    ${Number(product.price).toFixed(2)}
                  </p>
                </div>
              </div>
              
              {/* Color selection */}
              {product.availableColors && product.availableColors.length > 0 && (
                <div className="bg-white p-3 rounded-lg border border-gray-100">
                  <label className="text-sm font-medium mb-2 block text-[#1D3557]">Color</label>
                  <div className="grid grid-cols-5 gap-2">
                    {product.availableColors.map((color) => (
                      <button 
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`h-10 rounded-md relative ${
                          selectedColor === color 
                            ? 'ring-2 ring-[#457B9D] ring-offset-2' 
                            : 'ring-1 ring-gray-200 hover:ring-gray-300'
                        } ${getColorStyle(color)} transition-all duration-200`}
                        title={color}
                      >
                        {selectedColor === color && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <Check className={`h-5 w-5 ${color.toLowerCase() === 'white' ? 'text-black' : 'text-white'}`} />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Selected: {selectedColor}</p>
                </div>
              )}
              
              {/* Size selection */}
              {product.availableSizes && product.availableSizes.length > 0 && (
                <div className="bg-white p-3 rounded-lg border border-gray-100">
                  <label className="text-sm font-medium mb-2 block text-[#1D3557]">Size</label>
                  <div className="grid grid-cols-5 gap-2">
                    {product.availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 text-center rounded-md text-sm font-medium ${
                          selectedSize === size
                            ? 'bg-[#457B9D] text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } transition-colors duration-200`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Selected: {selectedSize}</p>
                </div>
              )}
              
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button 
                  type="button" 
                  variant="outline"
                  className="border-[#457B9D] text-[#457B9D] hover:bg-[#F1FAEE]" 
                  onClick={() => setShowOptions(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  className="bg-[#457B9D] hover:bg-[#1D3557] transition-colors duration-300" 
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProductCard;
