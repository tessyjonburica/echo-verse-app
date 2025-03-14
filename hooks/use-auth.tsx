"use client"

import { usePrivy as useRealPrivy } from "@privy-io/react-auth"
import { useMockPrivy } from "@/components/auth/mock-privy"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

export interface Wallet {
  address: string
  chainId: string
  connector: string
}

export interface User {
  id: string;
  email?: string;
  displayName?: string;
  wallet?: Wallet;
  linkedAccounts?: {
    email?: { address: string; verified: boolean };
    wallet?: Wallet[];
  };
}


export function useAuth() {
  const [mounted, setMounted] = useState(false)
  const [usingMock, setUsingMock] = useState(false)
  const realPrivy = useRealPrivy()
  const mockPrivy = useMockPrivy()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    // Check if we're using the mock implementation
    setUsingMock(!process.env.NEXT_PUBLIC_PRIVY_APP_ID)

    return () => {
      setMounted(false)
    }
  }, [])

  // Helper function to safely get wallet address
  const getWalletAddress = (user: User | null): string | null => {
    if (!user) return null

    if (user.wallet?.address) {
      return user.wallet.address
    }

    if (user.linkedAccounts?.wallet && user.linkedAccounts.wallet.length > 0) {
      return user.linkedAccounts.wallet[0].address
    }

    return null
  }

  // Helper function to get primary identifier (email or wallet)
  const getPrimaryIdentifier = (user: User | null): string => {
    if (!user) return "Guest";
  
    // If user has a custom display name, use that
    if (user.displayName) {
      return user.displayName;
    }
  
    if (typeof user.email === "string" && user.email) {
      return user.email;
    }
  
    if (user.linkedAccounts?.email?.address) {
      return user.linkedAccounts.email.address;
    }
  
    const walletAddress = getWalletAddress(user);
    if (walletAddress) {
      return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    }
  
    return "Guest";
  };
  // Helper function to check if user has a linked wallet
  const hasLinkedWallet = (user: User | null): boolean => {
    if (!user) return false
    return !!(user.linkedAccounts?.wallet && user.linkedAccounts.wallet.length > 0)
  }

  // Helper function to check if user has a linked email
  const hasLinkedEmail = (user: User | null): boolean => {
    if (!user) return false
    return !!(user.linkedAccounts?.email && user.linkedAccounts.email.verified)
  }

  // Function to update user profile
  const updateProfile = async (displayName: string, email: string): Promise<boolean> => {
    try {
      if (usingMock) {
        await mockPrivy.updateProfile(displayName, email)
      } else {
        // In a real implementation, this would use the Privy SDK
        console.log("Updating profile in real Privy implementation", { displayName, email })
        // This would be an actual API call in a real implementation
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })

      return true
    } catch (error) {
      console.error("Error updating profile:", error)

      toast({
        title: "Error updating profile",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })

      return false
    }
  }

  // Function to link a wallet
  const linkWallet = async (address: string) => {
    try {
      if (usingMock) {
        await mockPrivy.linkWallet(address)
      } else {
        // In a real implementation, this would use the Privy SDK
        // await realPrivy.linkWallet(address);
        console.log("Linking wallet in real Privy implementation")
      }

      toast({
        title: "Wallet linked",
        description: "Your wallet has been successfully linked to your account.",
      })

      return true
    } catch (error) {
      console.error("Error linking wallet:", error)

      toast({
        title: "Error linking wallet",
        description: "There was an error linking your wallet. Please try again.",
        variant: "destructive",
      })

      return false
    }
  }

  // Function to unlink a wallet
  const unlinkWallet = async (address: string) => {
    try {
      if (usingMock) {
        await mockPrivy.unlinkWallet(address)
      } else {
        // In a real implementation, this would use the Privy SDK
        // await realPrivy.unlinkWallet(address);
        console.log("Unlinking wallet in real Privy implementation")
      }

      toast({
        title: "Wallet unlinked",
        description: "Your wallet has been successfully unlinked from your account.",
      })

      return true
    } catch (error) {
      console.error("Error unlinking wallet:", error)

      toast({
        title: "Error unlinking wallet",
        description: "There was an error unlinking your wallet. Please try again.",
        variant: "destructive",
      })

      return false
    }
  }

  // Function to login with a specific method
  const login = async (method: "email" | "wallet" = "email") => {
    try {
      if (usingMock) {
        await mockPrivy.login(method)
      } else {
        // In a real implementation, this would use the Privy SDK
        await realPrivy.login()
      }

      return true
    } catch (error) {
      console.error("Error logging in:", error)

      toast({
        title: "Error logging in",
        description: "There was an error logging in. Please try again.",
        variant: "destructive",
      })

      return false
    }
  }

  // Function to logout
  const logout = async () => {
    try {
      if (usingMock) {
        await mockPrivy.logout()
      } else {
        await realPrivy.logout()
      }

      return true
    } catch (error) {
      console.error("Error logging out:", error)

      toast({
        title: "Error logging out",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      })

      return false
    }
  }

  if (!mounted) {
    // Return placeholder values before mounting
    return {
      ready: false,
      authenticated: false,
      user: null,
      login,
      logout,
      updateProfile,
      linkWallet,
      unlinkWallet,
      getWalletAddress: () => null,
      getPrimaryIdentifier: () => "Guest",
      hasLinkedWallet: () => false,
      hasLinkedEmail: () => false,
    }
  }

  // Try to use the real Privy first, fall back to mock if it fails
  try {
    if (usingMock) {
      return {
        ...mockPrivy,
        getWalletAddress: () => getWalletAddress(mockPrivy.user),
        getPrimaryIdentifier: () => getPrimaryIdentifier(mockPrivy.user),
        hasLinkedWallet: () => hasLinkedWallet(mockPrivy.user),
        hasLinkedEmail: () => hasLinkedEmail(mockPrivy.user),
        updateProfile,
        linkWallet,
        unlinkWallet,
        login,
      }
    } else {
      return {
        ...realPrivy,
        getWalletAddress: () => getWalletAddress(realPrivy.user as User),
        getPrimaryIdentifier: () => getPrimaryIdentifier(realPrivy.user as User),
        hasLinkedWallet: () => hasLinkedWallet(realPrivy.user as User),
        hasLinkedEmail: () => hasLinkedEmail(realPrivy.user as User),
        updateProfile,
        linkWallet,
        unlinkWallet,
        login,
      }
    }
  } catch (error) {
    console.error("Error using Privy:", error)
    return {
      ...mockPrivy,
      getWalletAddress: () => getWalletAddress(mockPrivy.user),
      getPrimaryIdentifier: () => getPrimaryIdentifier(mockPrivy.user),
      hasLinkedWallet: () => hasLinkedWallet(mockPrivy.user),
      hasLinkedEmail: () => hasLinkedEmail(mockPrivy.user),
      updateProfile,
      linkWallet,
      unlinkWallet,
      login,
    }
  }
}

