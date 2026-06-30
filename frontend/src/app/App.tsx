import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { useInstanceStore } from "../shared/store/instance.store";
import AppRoutes from "./router";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Toaster } from "./components/ui/sonner";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

export default function App() {
  const hydrateInstance = useInstanceStore((s) => s.hydrate);

  useEffect(() => { hydrateInstance(); }, [hydrateInstance]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AppRoutes />
            <Toaster />
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
