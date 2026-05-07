import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FVMA Disaster Response",
  description: "Emergency coordination platform for Florida veterinary clinics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
