"use client"
import localFont from "next/font/local";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
          <ChakraProvider theme={theme}>
          {children}
          </ChakraProvider>

      </body>
    </html>
  );
}
