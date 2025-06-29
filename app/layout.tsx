import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import WagmiAppProvider from "@/components/Wagmi"
import { headers } from "next/headers";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartFocus",
  description: "An AI-powered platform for increasing focus and help preparing for mock interviews & quizes.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get('cookie')
  return (
    <html lang="en" className="dark">
      <body className={`${monaSans.className} antialiased pattern`}>
        <AuthProvider>
          <WagmiAppProvider cookies={cookies}>
          {children}
          </WagmiAppProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
