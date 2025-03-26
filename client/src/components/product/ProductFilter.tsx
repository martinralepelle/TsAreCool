import { useState } from "react";

interface FilterOption {
  name: string;
  value: string;
}

interface SortOption {
  name: string;
  value: string;
}

interface ProductFilterProps {
  filterOptions: FilterOption[];
  sortOptions: SortOption[];
  onFilterChange: (filter: string) => void;
  onSortChange: (sort: string) => void;
  selectedFilter: string;
  selectedSort: string;
}

const ProductFilter = ({
  filterOptions,
  sortOptions,
  onFilterChange,
  onSortChange,
  selectedFilter,
  selectedSort
}: ProductFilterProps) => {
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const toggleFilterDropdown = () => {
    setFilterDropdownOpen(!filterDropdownOpen);
    setSortDropdownOpen(false);
  };

  const toggleSortDropdown = () => {
    setSortDropdownOpen(!sortDropdownOpen);
    setFilterDropdownOpen(false);
  };

  const handleFilterSelect = (value: string) => {
    onFilterChange(value);
    setFilterDropdownOpen(false);
  };

  const handleSortSelect = (value: string) => {
    onSortChange(value);
    setSortDropdownOpen(false);
  };

  // Get the currently selected option names for display
  const selectedFilterName = filterOptions.find(option => option.value === selectedFilter)?.name || 'Filter by';
  const selectedSortName = sortOptions.find(option => option.value === selectedSort)?.name || 'Sort by';

  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
      {/* Filter dropdown */}
      <div className="relative">
        <button 
          className="bg-white px-4 py-2 rounded-md shadow-sm text-[#1D3557] border border-gray-200 flex items-center justify-between w-full sm:w-40"
          onClick={toggleFilterDropdown}
        >
          <span>{selectedFilterName}</span>
          <i className="fas fa-chevron-down ml-2 text-xs"></i>
        </button>
        {filterDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-md shadow-lg py-1 z-10">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                className="block w-full text-left px-4 py-2 text-sm text-[#1D3557] hover:bg-[#F1FAEE]"
                onClick={() => handleFilterSelect(option.value)}
              >
                {option.name}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Sort dropdown */}
      <div className="relative">
        <button 
          className="bg-white px-4 py-2 rounded-md shadow-sm text-[#1D3557] border border-gray-200 flex items-center justify-between w-full sm:w-40"
          onClick={toggleSortDropdown}
        >
          <span>{selectedSortName}</span>
          <i className="fas fa-chevron-down ml-2 text-xs"></i>
        </button>
        {sortDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-md shadow-lg py-1 z-10">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                className="block w-full text-left px-4 py-2 text-sm text-[#1D3557] hover:bg-[#F1FAEE]"
                onClick={() => handleSortSelect(option.value)}
              >
                {option.name}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Overlay to close dropdowns when clicking outside */}
      {(filterDropdownOpen || sortDropdownOpen) && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => {
            setFilterDropdownOpen(false);
            setSortDropdownOpen(false);
          }}
        ></div>
      )}
    </div>
  );
};

export default ProductFilter;
