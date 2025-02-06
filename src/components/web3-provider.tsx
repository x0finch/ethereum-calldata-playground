"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConnectKitProvider, getDefaultConfig } from "connectkit"
import { createConfig, WagmiProvider } from "wagmi"

const config = createConfig(
  getDefaultConfig({
    appName: "Ethereum Calldata Playground",
    appDescription: "A playground for Ethereum calldata",
    walletConnectProjectId: "",
  })
)

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
