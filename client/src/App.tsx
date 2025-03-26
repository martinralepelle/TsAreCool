import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ProductDetails from "@/pages/product-details";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import OrderConfirmation from "@/pages/order-confirmation";
import Login from "@/pages/login";
import Profile from "@/pages/profile";
import Orders from "@/pages/orders";
import Help from "@/pages/help";
import Terms from "@/pages/terms";
import Favorites from "@/pages/favorites";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ToastNotificationProvider } from "@/components/ui/toast-notification";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { FavoritesProvider } from "@/lib/favorites-context";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Added pt-16 to create space for the fixed header */}
      <main className="flex-grow container mx-auto px-4 py-6 pt-16">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/product/:id" component={ProductDetails} />
          <Route path="/cart" component={Cart} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/order-confirmation" component={OrderConfirmation} />
          <Route path="/login" component={Login} />
          <Route path="/profile" component={Profile} />
          <Route path="/orders" component={Orders} />
          <Route path="/favorites" component={Favorites} />
          <Route path="/help" component={Help} />
          <Route path="/terms" component={Terms} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ToastNotificationProvider>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <Router />
            <Toaster />
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </ToastNotificationProvider>
  );
}

export default App;
