import type { Metadata } from "next";
import "./globals.css";
import LayoutDefault from "@/components/Layouts/LayoutDefault";

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
          {children}
        </LayoutDefault>
      </body>
    </html>
  );
}
