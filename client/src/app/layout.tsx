import type { Metadata } from "next";
import "./globals.css";
import LayoutDefault from "@/components/Layouts/LayoutDefault";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "EIT Mock Platform",
  description: "Made by samanwirst",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LayoutDefault>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LayoutDefault>
      </body>
    </html>
  );
}
