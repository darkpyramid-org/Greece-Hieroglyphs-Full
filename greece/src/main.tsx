import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import ErrorBoundary from "./components/error-boundary";
import "./index.css";

/**
 * The generated Orval client (`src/api/generated/api.ts`) exposes React Query
 * hooks. Without a provider those hooks throw "No QueryClient set", so the
 * client is provided here at the root.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Product data changes rarely; avoid refetching on every window focus.
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const container = document.getElementById("root");

if (!container) {
  throw new Error('Root element #root was not found in index.html');
}

createRoot(container).render(
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </ErrorBoundary>,
);