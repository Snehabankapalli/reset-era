import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Era",
  description: "Turn mental overload into a clear execution plan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
