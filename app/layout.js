import { Inter } from "next/font/google";
import "./globals.css";

const interf = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Medibuddy",
  description: "Medibuddy",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${interf.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
