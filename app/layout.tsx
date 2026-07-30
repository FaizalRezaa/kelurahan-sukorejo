import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/app/providers";

export const metadata: Metadata = {
  title: "Kelurahan Sukorejo",
  description: "Website Resmi Kelurahan Sukorejo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="antialiased scroll-smooth">
      <body>
          <Providers>
            {children}
            </Providers>
        
      </body>
    </html>
  );
}