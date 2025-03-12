"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Define types similar to Privy's types
interface Wallet {
  address: string
  chainId: string
  connector: string
}

interface User {
  id: string
  email?: string
  displayName?: string
  wallet?: Wallet
  linkedAccounts?: {
    email?: { address: string; verified: boolean }
    wallet?: Wallet[]
  }
}

interface PrivyContextValue {
  ready: boolean
  authenticated: boolean
  user: User | null
  login: (method?: "email" | "wallet") => Promise<void>
  logout: () => Promise<void>
  updateProfile: (displayName: string, email: string) => Promise<void>
  linkWallet: (address: string) => Promise<void>
  linkEmail: (email: string) => Promise<void>
  unlinkWallet: (address: string) => Promise<void>
}

// Create a mock context
const MockPrivyContext = createContext<PrivyContextValue>({
  ready: true,
  authenticated: false,
  user: null,
  login: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  linkWallet: async () => {},
  linkEmail: async () => {},
  unlinkWallet: async () => {},
})

export function MockPrivyProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const login = async (method: "email" | "wallet" = "email") => {
    if (method === "email") {
      setUser({
        id: "mock-user-id",
        email: "mock@example.com",
        displayName: "Mock User",
        linkedAccounts: {
          email: { address: "mock@example.com", verified: true },
          wallet: [],
        },
      })
    } else {
      const mockWallet = {
        address: "0x1234567890abcdef1234567890abcdef12345678",
        chainId: "1",
        connector: "metamask",
      }

      setUser({
        id: "mock-user-id",
        displayName: "Wallet User",
        wallet: mockWallet,
        linkedAccounts: {
          wallet: [mockWallet],
        },
      })
    }
    setAuthenticated(true)
  }

  const logout = async () => {
    setUser(null)
    setAuthenticated(false)
  }

  const updateProfile = async (displayName: string, email: string) => {
    if (!user) return

    // Create updated user object
    const updatedUser = {
      ...user,
      displayName,
      email,
    }

    // Update linked accounts if email is provided
    if (email) {
      updatedUser.linkedAccounts = {
        ...user.linkedAccounts,
        email: { address: email, verified: true },
      }
    }

    setUser(updatedUser)

    // Show success message
    console.log(`Profile updated: ${displayName}, ${email}`)
  }

  const linkWallet = async (address: string) => {
    if (!user) return

    const newWallet = {
      address,
      chainId: "1",
      connector: "metamask",
    }

    setUser({
      ...user,
      wallet: newWallet,
      linkedAccounts: {
        ...user.linkedAccounts,
        wallet: [...(user.linkedAccounts?.wallet || []), newWallet],
      },
    })

    // Show success message
    console.log(`Wallet ${address} linked successfully`)
  }

  const linkEmail = async (email: string) => {
    if (!user) return

    setUser({
      ...user,
      email,
      linkedAccounts: {
        ...user.linkedAccounts,
        email: { address: email, verified: true },
      },
    })

    // Show success message
    console.log(`Email ${email} linked successfully`)
  }

  const unlinkWallet = async (address: string) => {
    if (!user || !user.linkedAccounts?.wallet) return

    const updatedWallets = user.linkedAccounts.wallet.filter((w) => w.address !== address)

    setUser({
      ...user,
      wallet: updatedWallets.length > 0 ? updatedWallets[0] : undefined,
      linkedAccounts: {
        ...user.linkedAccounts,
        wallet: updatedWallets,
      },
    })

    // Show success message
    console.log(`Wallet ${address} unlinked successfully`)
  }

  return (
    <MockPrivyContext.Provider
      value={{
        ready: true,
        authenticated,
        user,
        login,
        logout,
        updateProfile,
        linkWallet,
        linkEmail,
        unlinkWallet,
      }}
    >
      {children}
    </MockPrivyContext.Provider>
  )
}

// Export a hook that can be used as a replacement for usePrivy
export function useMockPrivy() {
  return useContext(MockPrivyContext)
}

