import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useFavorites, FavoriteItemType } from "@/lib/favorites-context";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Trash2, ArrowLeft, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Favorites() {
  const [location, setLocation] = useLocation();
  const { favoriteItems, removeFromFavorites, clearFavorites } = useFavorites();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});
  const [selectedColors, setSelectedColors] = useState<Record<number, string>>({});
  const [showOptions, setShowOptions] = useState<Record<number, boolean>>({});

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

  const handleAddToCart = (item: FavoriteItemType) => {
    const size = selectedSizes[item.productId] || '';
    const color = selectedColors[item.productId] || '';
    
    if (!size || !color) {
      toast({
        title: "Selection Required",
        description: "Please select both size and color",
        variant: "destructive"
      });
      return;
    }
    
    addToCart({
      productId: item.productId,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      size,
      color,
      quantity: 1
    });
    
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`
    });
    
    // Close dialog after adding to cart
    setShowOptions({...showOptions, [item.productId]: false});
  };

  // Reset selections when dialog opens/closes
  const handleDialogChange = (open: boolean, item: FavoriteItemType) => {
    if (open) {
      // Set defaults when opening
      setSelectedSizes({...selectedSizes, [item.productId]: "M"});
      setSelectedColors({...selectedColors, [item.productId]: "Black"});
    }
  };

  // Available sizes and colors (would ideally come from the product)
  const availableSizes = ["S", "M", "L", "XL", "XXL"];
  const availableColors = ["White", "Black", "Blue", "Red", "Green"];

  return (
    <div className="container mx-auto px-3 py-4 max-w-screen-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <h1 className="text-xl font-bold text-[#1D3557] flex items-center">
          <Heart className="mr-2 text-red-500" size={20} />
          My Favorites
        </h1>
        <Button 
          variant="ghost" 
          className="text-gray-500 hover:text-red-500 px-2 py-1 h-auto text-sm self-start"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft size={14} className="mr-1" />
          Continue Shopping
        </Button>
      </div>
      
      {favoriteItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteItems.map((item) => (
              <div key={item.productId} className="product-card bg-white rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md">
                <div className="product-image-container relative">
                  <Link href={`/product/${item.productId}`}>
                    <div className="block cursor-pointer">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full aspect-square object-cover"
                      />
                    </div>
                  </Link>
                  <button 
                    onClick={() => removeFromFavorites(item.productId)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white transition-colors shadow-md"
                    aria-label="Remove from favorites"
                  >
                    <Heart size={16} fill="currentColor" />
                  </button>
                </div>
                
                <div className="p-3">
                  <Link href={`/product/${item.productId}`}>
                    <div className="block cursor-pointer">
                      <h3 className="font-medium text-[#1D3557] text-sm">{item.name}</h3>
                      <p className="text-[#457B9D] text-xs">{item.category || "T-Shirt"}</p>
                    </div>
                  </Link>
                  
                  <div className="flex justify-between items-center mt-2">
                    <Link href={`/product/${item.productId}`}>
                      <div className="font-semibold text-[#1D3557] cursor-pointer">
                        ${item.price.toFixed(2)}
                      </div>
                    </Link>
                  </div>

                  {/* Display color and size options in compact form */}
                  <div className="mt-2 flex justify-between">
                    <div className="flex-1 mr-2">
                      <p className="text-xs text-gray-500 mb-1">Color</p>
                      <div className="inline-flex flex-wrap gap-1">
                        {availableColors.slice(0, 5).map((color, index) => (
                          <button 
                            key={index} 
                            className={`w-4 h-4 rounded-full ${getColorStyle(color)} ${selectedColors[item.productId] === color ? 'ring-1 ring-[#457B9D]' : ''}`} 
                            title={color}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedColors({...selectedColors, [item.productId]: color});
                            }}
                            type="button"
                          ></button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Size</p>
                      <div className="inline-flex flex-wrap gap-1">
                        {availableSizes.map((size, index) => (
                          <button 
                            key={index} 
                            className={`text-xs border ${selectedSizes[item.productId] === size ? 'bg-[#457B9D] text-white border-[#457B9D]' : 'border-gray-300 bg-white text-gray-700'} rounded w-5 h-5 flex items-center justify-center`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedSizes({...selectedSizes, [item.productId]: size});
                            }}
                            type="button"
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Add to Cart Button and Dialog */}
                <div className="px-3 pb-3 mt-1">
                  <Dialog open={showOptions[item.productId]} onOpenChange={(open) => {
                      setShowOptions({...showOptions, [item.productId]: open});
                      handleDialogChange(open, item);
                    }}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="default" 
                        className="w-full bg-[#457B9D] hover:bg-[#1D3557] text-sm h-8"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowOptions({...showOptions, [item.productId]: true});
                        }}
                      >
                        <ShoppingCart className="mr-1 h-3 w-3" /> Add to Cart
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] p-4">
                      <DialogHeader>
                        <DialogTitle>Select Options</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-2">
                        {/* Product info */}
                        <div className="flex gap-3 items-center">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-14 h-14 object-cover rounded" 
                          />
                          <div>
                            <h3 className="font-medium text-sm">{item.name}</h3>
                            <p className="text-sm text-gray-500">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        
                        {/* Color selection */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Color</label>
                          <div className="grid grid-cols-5 gap-2">
                            {availableColors.map((color) => (
                              <button 
                                key={color}
                                type="button"
                                onClick={() => setSelectedColors({...selectedColors, [item.productId]: color})}
                                className={`h-8 rounded-md relative ${
                                  selectedColors[item.productId] === color 
                                    ? 'ring-2 ring-[#457B9D] ring-offset-2' 
                                    : 'ring-1 ring-gray-200'
                                } ${getColorStyle(color)}`}
                                title={color}
                              >
                                {selectedColors[item.productId] === color && (
                                  <span className="absolute inset-0 flex items-center justify-center">
                                    <Check className={`h-4 w-4 ${color.toLowerCase() === 'white' ? 'text-black' : 'text-white'}`} />
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Size selection */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Size</label>
                          <div className="grid grid-cols-5 gap-2">
                            {availableSizes.map((size) => (
                              <button
                                key={size}
                                type="button"
                                onClick={() => setSelectedSizes({...selectedSizes, [item.productId]: size})}
                                className={`py-1 text-center rounded-md text-sm ${
                                  selectedSizes[item.productId] === size
                                    ? 'bg-[#457B9D] text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <Button 
                            type="button" 
                            className="w-full bg-[#457B9D] hover:bg-[#1D3557]" 
                            onClick={() => handleAddToCart(item)}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-500 border-red-500 hover:bg-red-50"
              onClick={clearFavorites}
            >
              <Trash2 size={14} className="mr-1" />
              Clear All Favorites
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-10 px-4 bg-white rounded-lg shadow-sm max-w-md mx-auto mt-4">
          <Heart className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Your Favorites List is Empty</h2>
          <p className="text-gray-500 text-sm mb-4">Start adding items you love to your favorites list!</p>
          <Button 
            className="bg-[#457B9D] hover:bg-[#1D3557] text-white text-sm py-1.5"
            onClick={() => setLocation("/")}
          >
            Browse T-shirts
          </Button>
        </div>
      )}
    </div>
  );
}