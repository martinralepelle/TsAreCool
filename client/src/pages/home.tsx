import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@shared/schema";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious
} from "@/components/ui/pagination";

// Size filter options
const sizeOptions = [
  { name: "All Sizes", value: "" },
  { name: "XS", value: "XS" },
  { name: "S", value: "S" },
  { name: "M", value: "M" },
  { name: "L", value: "L" },
  { name: "XL", value: "XL" },
  { name: "XXL", value: "XXL" },
  { name: "3XL", value: "3XL" }
];

// Gender filter options
const genderOptions = [
  { name: "All Genders", value: "" },
  { name: "Men", value: "men" },
  { name: "Women", value: "women" },
  { name: "Unisex", value: "unisex" }
];

// Sort options
const sortOptions = [
  { name: "Default", value: "default" },
  { name: "Featured", value: "" },
  { name: "Price: Low to High", value: "price_asc" },
  { name: "Price: High to Low", value: "price_desc" },
  { name: "Newest", value: "newest" }
];

const categoryOptions = [
  { name: "All T-shirts", value: "" },
  { name: "Frosty Fresh Tees", value: "Frosty Fresh Tees" },
  { name: "Chill Mode Classics", value: "Chill Mode Classics" },
  { name: "Glacier Graphics", value: "Glacier Graphics" },
  { name: "Arctic Streetwear", value: "Arctic Streetwear" },
  { name: "Frozen Vintage", value: "Frozen Vintage" },
  { name: "Icy Luxe", value: "Icy Luxe" }
];

// Pagination configuration
const ITEMS_PER_PAGE = 9;

interface ProductsResponse {
  products: Product[];
  total: number;
}

const Home = () => {
  const [selectedSort, setSelectedSort] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [showSizeFilter, setShowSizeFilter] = useState(false);
  const [showGenderFilter, setShowGenderFilter] = useState(false);
  const [showSortFilter, setShowSortFilter] = useState(false);
  
  // Function to close all dropdown filters
  const closeAllDropdowns = () => {
    setShowSizeFilter(false);
    setShowGenderFilter(false);
    setShowSortFilter(false);
  };
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch products with pagination
  const { data, isLoading, error } = useQuery<ProductsResponse>({
    queryKey: ["/api/products", selectedCategory, selectedSize, selectedGender, selectedSort, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedSize) params.append("size", selectedSize);
      if (selectedGender) params.append("gender", selectedGender);
      if (selectedSort) params.append("sort", selectedSort);
      params.append("page", currentPage.toString());
      params.append("pageSize", ITEMS_PER_PAGE.toString());
      
      const url = `/api/products${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSize, selectedGender, selectedSort]);

  const products = data?.products || [];
  const totalProducts = data?.total || 0;
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  
  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    setShowSizeFilter(false);
  };
  
  const handleGenderChange = (gender: string) => {
    setSelectedGender(gender);
    setShowGenderFilter(false);
  };
  
  const handleSortOptionChange = (sort: string) => {
    setSelectedSort(sort);
    setShowSortFilter(false);
  };
  
  const handleClearFilters = () => {
    setSelectedCategory("");
    setSelectedSize("");
    setSelectedGender("");
    setSelectedSort("default");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error loading products. Please try again.</div>;
  }

  // Generate pagination items
  const paginationItems = [];
  const MAX_VISIBLE_PAGES = 5;

  if (totalPages <= MAX_VISIBLE_PAGES) {
    // Show all pages if total pages are less than or equal to MAX_VISIBLE_PAGES
    for (let i = 1; i <= totalPages; i++) {
      paginationItems.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => handlePageChange(i)} 
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
  } else {
    // Always show first page
    paginationItems.push(
      <PaginationItem key={1}>
        <PaginationLink 
          onClick={() => handlePageChange(1)} 
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Calculate start and end pages to show
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(startPage + 2, totalPages - 1);
    
    // Adjust startPage if endPage is at its maximum
    if (endPage === totalPages - 1) {
      startPage = Math.max(2, endPage - 2);
    }

    // Show ellipsis if needed before middle pages
    if (startPage > 2) {
      paginationItems.push(
        <PaginationItem key="ellipsis1">
          <PaginationLink className="cursor-default">...</PaginationLink>
        </PaginationItem>
      );
    }

    // Show middle pages
    for (let i = startPage; i <= endPage; i++) {
      paginationItems.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => handlePageChange(i)} 
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if needed after middle pages
    if (endPage < totalPages - 1) {
      paginationItems.push(
        <PaginationItem key="ellipsis2">
          <PaginationLink className="cursor-default">...</PaginationLink>
        </PaginationItem>
      );
    }

    // Always show last page
    paginationItems.push(
      <PaginationItem key={totalPages}>
        <PaginationLink 
          onClick={() => handlePageChange(totalPages)} 
          isActive={currentPage === totalPages}
        >
          {totalPages}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <h1 className="text-3xl font-semibold text-[#1D3557] mb-6">Shop T-shirts</h1>
      
      {/* Filters section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        {/* Category selection */}
        <div className="overflow-x-auto mb-4">
          <div className="flex space-x-4 min-w-max pb-2">
            {categoryOptions.map((category) => (
              <button 
                key={category.value}
                className={`whitespace-nowrap ${
                  selectedCategory === category.value
                    ? "bg-[#A8DADC] text-[#1D3557]"
                    : "bg-gray-100 text-[#457B9D] hover:bg-[#A8DADC] hover:text-[#1D3557]"
                } px-4 py-2 rounded-full font-medium text-sm transition-colors`}
                onClick={() => handleCategoryChange(category.value)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Clear filters button - only show if any filter is active */}
        {(selectedSize || selectedGender || selectedCategory || (selectedSort !== "default")) && (
          <div className="mb-3 flex justify-center w-full">
            <button
              onClick={handleClearFilters}
              className="bg-[#e63946] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center hover:bg-[#c1121f] transition-colors"
            >
              <span>Clear Filters</span>
            </button>
          </div>
        )}
        
        {/* Filter and sort bar */}
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
            {/* Size filter */}
            <div className="relative">
              <button 
                className="bg-gray-100 px-4 py-2 rounded-md text-[#1D3557] flex items-center justify-between min-w-[140px]"
                onClick={() => {
                  setShowSizeFilter(!showSizeFilter);
                  setShowGenderFilter(false);
                  setShowSortFilter(false);
                }}
              >
                <span>{selectedSize || "Size"}</span>
                <i className="fas fa-chevron-down ml-2 text-xs"></i>
              </button>
              {showSizeFilter && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                  {sizeOptions.map((option) => (
                    <button
                      key={option.value}
                      className="block w-full text-left px-4 py-2 text-sm text-[#1D3557] hover:bg-[#F1FAEE]"
                      onClick={() => handleSizeChange(option.value)}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Gender filter */}
            <div className="relative">
              <button 
                className="bg-gray-100 px-4 py-2 rounded-md text-[#1D3557] flex items-center justify-between min-w-[140px]"
                onClick={() => {
                  setShowGenderFilter(!showGenderFilter);
                  setShowSizeFilter(false);
                  setShowSortFilter(false);
                }}
              >
                <span>{selectedGender ? selectedGender.charAt(0).toUpperCase() + selectedGender.slice(1) : "Gender"}</span>
                <i className="fas fa-chevron-down ml-2 text-xs"></i>
              </button>
              {showGenderFilter && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                  {genderOptions.map((option) => (
                    <button
                      key={option.value}
                      className="block w-full text-left px-4 py-2 text-sm text-[#1D3557] hover:bg-[#F1FAEE]"
                      onClick={() => handleGenderChange(option.value)}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Sort dropdown - centered on mobile, right-aligned on desktop */}
          <div className="relative w-full sm:w-auto flex justify-center sm:justify-end mt-2 sm:mt-0">
            <button 
              className="bg-gray-100 px-4 py-2 rounded-md text-[#1D3557] flex items-center justify-between min-w-[160px]"
              onClick={() => {
                setShowSortFilter(!showSortFilter);
                setShowSizeFilter(false);
                setShowGenderFilter(false);
              }}
            >
              <span>
                {selectedSort 
                  ? sortOptions.find(o => o.value === selectedSort)?.name || "Sort" 
                  : "Sort"
                }
              </span>
              <i className="fas fa-chevron-down ml-2 text-xs"></i>
            </button>
            {showSortFilter && (
              <div className="absolute top-full left-1/2 sm:left-auto sm:right-0 -translate-x-1/2 sm:translate-x-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    className="block w-full text-left px-4 py-2 text-sm text-[#1D3557] hover:bg-[#F1FAEE]"
                    onClick={() => handleSortOptionChange(option.value)}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Overlay to close dropdowns when clicking outside */}
      {(showSizeFilter || showGenderFilter || showSortFilter) && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={closeAllDropdowns}
        ></div>
      )}
      
      {/* Product count */}
      <div className="text-sm text-gray-500 mb-4">
        Showing {products.length} of {totalProducts} products
      </div>
      
      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {products && products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        
        {(!products || products.length === 0) && (
          <div className="col-span-full text-center py-10 text-[#457B9D]">
            No products found. Try adjusting your filters.
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="my-8">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
              </PaginationItem>
            )}
            
            {paginationItems}
            
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default Home;
