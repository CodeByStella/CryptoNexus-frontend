// app/layout.tsx
"use client";

import Providers from "@/providers/providers"; // Your existing Providers
import "./globals.css";
import React from "react";
import AuthWrapper from "@/providers/authWrapper";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />

        {/* Open Graph Metadata */}
        <meta property="og:title" content="CryptoNexus" />
        <meta
          property="og:description"
          content="REST ASSURED we provide the most professional technical support, and your funds are very safe."
        />
        <meta property="og:image" content="/assets/images/3-soldiers.svg" />
        <meta
          property="og:image:alt"
          content="REST ASSURED we provide the most professional technical support, and your funds are very safe."
        />
        <meta property="og:image:type" content="image/svg+xml" />
        <meta property="og:url" content="https://mansion-alpha.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CryptoNexus" />
        <meta
          name="twitter:description"
          content="REST ASSURED we provide the most professional technical support, and your funds are very safe."
        />
        <meta name="twitter:image" content="/assets/images/3-soldiers.svg" />
      </head>

      <body className="bg-white flex justify-center items-center">
        <section className="bg-white w-full">
          <Providers>
            <AuthWrapper>{children}</AuthWrapper>
          </Providers>
        </section>
      </body>
    </html>
  );
};

export default RootLayout;