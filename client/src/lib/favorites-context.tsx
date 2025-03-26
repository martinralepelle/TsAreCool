import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@shared/schema";

export interface FavoriteItemType {
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
  category?: string;
}

interface FavoritesContextType {
  favoriteItems: FavoriteItemType[];
  addToFavorites: (item: FavoriteItemType) => void;
  removeFromFavorites: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItemType[]>([]);

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      try {
        setFavoriteItems(JSON.parse(savedFavorites));
      } catch (error) {
        console.error("Error parsing favorites from localStorage:", error);
        localStorage.removeItem("favorites");
      }
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favoriteItems));
  }, [favoriteItems]);

  const addToFavorites = (item: FavoriteItemType) => {
    if (!isFavorite(item.productId)) {
      setFavoriteItems([...favoriteItems, item]);
    }
  };

  const removeFromFavorites = (productId: number) => {
    setFavoriteItems(favoriteItems.filter(item => item.productId !== productId));
  };

  const isFavorite = (productId: number) => {
    return favoriteItems.some(item => item.productId === productId);
  };

  const clearFavorites = () => {
    setFavoriteItems([]);
    localStorage.removeItem("favorites");
  };

  return (
    <FavoritesContext.Provider value={{
      favoriteItems,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      clearFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};