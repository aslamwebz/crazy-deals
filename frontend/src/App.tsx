import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ShoppingCart, Home, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { CartIcon } from "./components/cart/CartIcon";
import Header from "./components/layout/Header";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/product/[slug]";
import CartPage from "./pages/Cart";
import CategoriesPage from "./pages/categories";
import DealsPage from "./pages/deals";
import NewArrivalsPage from "./pages/new-arrivals";
import WishlistPage from "./pages/Wishlist";
import ShopPage from "./pages/shop";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} CrazyDeals. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={
                <Layout>
                  <Index />
                </Layout>
              } />
              
              {/* Product Routes */}
              <Route path="/products/:slug" element={
                <Layout>
                  <ProductDetail />
                </Layout>
              } />
              
              {/* Cart */}
              <Route path="/cart" element={
                <Layout>
                  <CartPage />
                </Layout>
              } />
              
              {/* Wishlist */}
              <Route path="/wishlist" element={
                <Layout>
                  <WishlistPage />
                </Layout>
              } />
              
              {/* Categories */}
              <Route path="/categories" element={
                <Layout>
                  <CategoriesPage />
                </Layout>
              } />
              
              {/* Deals */}
              <Route path="/deals" element={
                <Layout>
                  <DealsPage />
                </Layout>
              } />
              
              {/* New Arrivals */}
              <Route path="/new-arrivals" element={
                <Layout>
                  <NewArrivalsPage />
                </Layout>
              } />
              
              {/* Shop */}
              <Route path="/shop" element={
                <Layout>
                  <ShopPage />
                </Layout>
              } />
              
              {/* 404 - Keep this last */}
              <Route path="*" element={
                <Layout>
                  <NotFound />
                </Layout>
              } />
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
