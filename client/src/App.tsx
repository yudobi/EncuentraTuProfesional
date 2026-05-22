import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { queryClient } from "@/lib/queryClient";
import { AppShell } from "@/components/layout/AppShell";
import { AuthShell } from "@/components/layout/AuthShell";
import { DashboardShell } from "@/components/layout/DashboardShell";
import Home from "@/views/Home";
import Categories from "@/views/Categories";
import Results from "@/views/Results";
import Profile from "@/views/Profile";
import Chat from "@/views/Chat";
import Order from "@/views/Order";
import Review from "@/views/Review";
import Auth from "@/views/Auth";
import ProDashboard from "@/views/ProDashboard";
import Admin from "@/views/Admin";
import SuperAdmin from "@/views/SuperAdmin";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/categorias" element={<Categories />} />
            <Route path="/resultados" element={<Results />} />
            <Route path="/pro/:id" element={<Profile />} />
            <Route path="/orden/:id?" element={<Order />} />
            <Route path="/review/:orderId?" element={<Review />} />
          </Route>
          <Route element={<AuthShell />}>
            <Route path="/auth" element={<Auth />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:proId" element={<Chat />} />
          </Route>
          <Route element={<DashboardShell />}>
            <Route path="/panel" element={<ProDashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/super-admin" element={<SuperAdmin />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-center" />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}
