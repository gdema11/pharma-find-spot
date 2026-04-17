import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import QualityDashboard from "./pages/QualityDashboard";
import AdminProdutos from "./pages/AdminProdutos";

const queryClient = new QueryClient();

const FloatingNavigation = () => {
  const location = useLocation();

  return (
    <nav
      aria-label="Navegação rápida"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3"
    >
      <Link
        to="/"
        className={`rounded-full px-5 py-3 text-sm font-medium shadow-lg transition ${
          location.pathname === "/"
            ? "bg-primary text-primary-foreground"
            : "bg-white text-foreground hover:bg-muted"
        }`}
      >
        Abrir produto
      </Link>

      <Link
        to="/dashboard-qualidade"
        className={`rounded-full px-5 py-3 text-sm font-medium shadow-lg transition ${
          location.pathname === "/dashboard-qualidade"
            ? "bg-primary text-primary-foreground"
            : "bg-white text-foreground hover:bg-muted"
        }`}
      >
        Abrir dashboard
      </Link>

      <Link
        to="/admin/produtos"
        className={`rounded-full px-5 py-3 text-sm font-medium shadow-lg transition ${
          location.pathname === "/admin/produtos"
            ? "bg-primary text-primary-foreground"
            : "bg-white text-foreground hover:bg-muted"
        }`}
      >
        Admin produtos
      </Link>
    </nav>
  );
};

const AppRoutes = () => (
  <>
    <FloatingNavigation />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard-qualidade" element={<QualityDashboard />} />
      <Route path="/admin/produtos" element={<AdminProdutos />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;