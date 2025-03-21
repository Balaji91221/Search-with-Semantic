import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SearchPage from "./pages/SearchPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<'login' | 'dashboard' | 'search'>('login');

  // ✅ Load accessToken and currentPage from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedPage = localStorage.getItem('currentPage') as 'login' | 'dashboard' | 'search' | null;
    if (storedToken) {
      setAccessToken(storedToken);
      setCurrentPage(storedPage || 'dashboard');
    }
  }, []);

  // ✅ Save token and page to localStorage
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
    localStorage.setItem('currentPage', currentPage);
  }, [accessToken, currentPage]);

  // ✅ Handle login
  const handleLogin = (token: string) => {
    setAccessToken(token);
    setCurrentPage('dashboard');
  };

  // ✅ Handle logout
  const handleLogout = () => {
    setAccessToken(null);
    setCurrentPage('login');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentPage');
  };

  // ✅ Navigation functions
  const goToDashboard = () => setCurrentPage('dashboard');
  const goToSearch = () => setCurrentPage('search');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster position="top-center" />

        {/* ✅ Login Page */}
        {currentPage === 'login' && <LoginPage onLogin={handleLogin} />}

        {/* ✅ Dashboard Page */}
        {accessToken && currentPage === 'dashboard' && (
          <DashboardPage 
            accessToken={accessToken}
            onLogout={handleLogout}
            onSearch={goToSearch}
          />
        )}

        {/* ✅ Search Page */}
        {accessToken && currentPage === 'search' && (
          <SearchPage 
            accessToken={accessToken}
            onLogout={handleLogout}
            onGoToDashboard={goToDashboard}
          />
        )}

        {/* ✅ Not Found (Fallback) */}
        {!accessToken && currentPage !== 'login' && <NotFound />}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
