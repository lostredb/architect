'use client'

import { Roboto } from "next/font/google";
import "./globals.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
    lang="en"
    className="h-full min-h-screen w-full min-w-screen flex justify-center"
    >
      <body
        className={`${roboto.variable} antialiased h-fit min-h-screen w-full min-w-screen flex justify-center`}
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
