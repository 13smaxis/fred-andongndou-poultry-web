import type { Metadata } from "next";
import { AppProviders } from "@/components/app-providers";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Five Seasons Farm",
  description: "Fresh. Healthy. Trusted.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider defaultTheme="light" storageKey="theme">
          <AppProviders>
            <div className="min-h-screen flex flex-col bg-gray-50">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
            <Sonner />
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
