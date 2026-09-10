import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import "lenis/dist/lenis.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomerServiceWidget from "@/components/CustomerServiceWidget";
import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import { CartProvider } from "@/context/CartContext";

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: {
    default: "Nexus Store — 3D Prints, Digital Templates & Dropship",
    template: "%s | Nexus Store",
  },
  description:
    "Shop custom 3D prints, instant-download KDS Excel templates and dropship finds. Made to order in the Philippines — free shipping over ₱1,500.",
};

export const viewport = {
  themeColor: "#101820",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <CartProvider>
          <SmoothScroll />
          <Preloader />
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
          <CustomerServiceWidget />
        </CartProvider>
      </body>
    </html>
  );
}