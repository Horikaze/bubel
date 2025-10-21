import type { Metadata } from "next";
import {
  Audiowide,
  Geist,
  Geist_Mono,
  Orbitron,
  Russo_One,
} from "next/font/google";
import { Toaster } from "react-hot-toast";
import NavBar from "./_components/NavBar";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// const myFont2 = Orbitron({
//   subsets: ["latin"],
//   weight: "400",
// });
// const myFont3 = Russo_One({
//   subsets: ["latin"],
//   weight: "400",
// });
const audiowide = Audiowide({
  subsets: ["latin"],
  weight: "400",
  fallback: ["geist-mono", "monospace"],
});

export const metadata: Metadata = {
  title: "Bubel",
  description: "Sklep z grami Bubel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${audiowide.className} antialiased max-w-7xl mx-auto px-1`}
      >
        <Toaster
          position="center-top"
          toastOptions={{
            duration: 5000,
          }}
        />
        <NavBar />
        {children}
        <div className="h-20"></div>
      </body>
    </html>
  );
}
