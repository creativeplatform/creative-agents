"use client";

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { HTTPException } from "hono/http-exception";
import { PropsWithChildren, useState } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base, baseSepolia } from "wagmi/chains";

import { WagmiProvider, createConfig, http } from "wagmi";
import { coinbaseWallet, injected } from "wagmi/connectors";

const wagmiConfig = createConfig({
  chains: [baseSepolia, base],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: "Creative Memberships",
    }),
  ],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
});

export const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (err) => {
            if (err instanceof HTTPException) {
              // global error handling, e.g. toast notification ...
            }
          },
        }),
      })
  );

  return (
    <OnchainKitProvider
      projectId={
        process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_ID || "YOUR_PROJECT_ID_HERE"
      }
      config={{
        appearance: {
          name: "Creative Memberships", // Displayed in modal header
          logo: "https://bafybeiesvinhgaqvr62rj77jbwkazg3w6bhcrsfyg6zyozasaud53nucnm.ipfs.w3s.link/Creative%20TV%20Logo.png", // Displayed in modal header
          mode: "auto", // 'light' | 'dark' | 'auto'
          theme: "default", // 'default' or custom theme
        },
        wallet: {
          display: "modal",
          termsUrl: "https://creativeplatform.xyz/docs/legal/terms-conditions",
          privacyUrl: "https://creativeplatform.xyz/docs/legal/privacy-policy",
        },
      }}
      chain={base}
    >
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </OnchainKitProvider>
  );
};
