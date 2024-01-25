'use client'

import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "./ThemeProvider";
import { Toaster } from "../ui/Toaster";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default Providers;
