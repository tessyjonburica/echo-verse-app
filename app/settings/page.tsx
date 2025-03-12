"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Wallet, Mail, Plus, Trash2, Check, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/custom-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SettingsPage() {
  const {
    authenticated,
    user,
    login,
    logout,
    updateProfile,
    linkWallet,
    unlinkWallet,
    hasLinkedEmail,
    hasLinkedWallet,
    getPrimaryIdentifier,
  } = useAuth()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)

  // Profile settings
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [originalDisplayName, setOriginalDisplayName] = useState("")
  const [originalEmail, setOriginalEmail] = useState("")
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [profileChanged, setProfileChanged] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [displayNameError, setDisplayNameError] = useState("")

  // Wallet settings
  const [newWalletAddress, setNewWalletAddress] = useState("")
  const [isLinkingWallet, setIsLinkingWallet] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Appearance settings
  const [darkMode, setDarkMode] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Playback settings
  const [autoplay, setAutoplay] = useState(true)
  const [crossfade, setCrossfade] = useState(false)
  const [normalizeVolume, setNormalizeVolume] = useState(true)

  // Privacy settings
  const [shareListening, setShareListening] = useState(true)
  const [showActivity, setShowActivity] = useState(true)

  useEffect(() => {
    setMounted(true)

    // Initialize form with user data if available
    if (user) {
      // Set display name from primary identifier or user's custom display name
      const displayName = user.displayName || getPrimaryIdentifier()
      setDisplayName(displayName)
      setOriginalDisplayName(displayName)

      // Set email if available
      let userEmail = ""
      if (typeof user.email === "string") {
        userEmail = user.email
      } else if (user.linkedAccounts?.email?.address) {
        userEmail = user.linkedAccounts.email.address
      }
      setEmail(userEmail)
      setOriginalEmail(userEmail)
    }

    return () => {
      setMounted(false)
    }
  }, [user, getPrimaryIdentifier])

  // Check if profile has changed
  useEffect(() => {
    const hasChanged = displayName !== originalDisplayName || email !== originalEmail
    setProfileChanged(hasChanged)

    // Clear errors when fields change
    if (displayName !== originalDisplayName) {
      setDisplayNameError("")
    }
    if (email !== originalEmail) {
      setEmailError("")
    }
  }, [displayName, email, originalDisplayName, originalEmail])

  const validateForm = (): boolean => {
    let isValid = true

    // Validate display name
    if (!displayName.trim()) {
      setDisplayNameError("Display name is required")
      isValid = false
    } else {
      setDisplayNameError("")
    }

    // Validate email format if provided
    if (email && !isValidEmail(email)) {
      setEmailError("Please enter a valid email address")
      isValid = false
    } else {
      setEmailError("")
    }

    return isValid
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsUpdatingProfile(true)

    try {
      const success = await updateProfile(displayName.trim(), email.trim())

      if (success) {
        // Update original values to reflect saved state
        setOriginalDisplayName(displayName.trim())
        setOriginalEmail(email.trim())
        setProfileChanged(false)

        toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully.",
          icon: <Check className="h-4 w-4" />,
        })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error updating profile",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleLinkWallet = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newWalletAddress || !newWalletAddress.startsWith("0x")) {
      toast({
        title: "Invalid wallet address",
        description: "Please enter a valid Ethereum wallet address starting with 0x.",
        variant: "destructive",
      })
      return
    }

    setIsLinkingWallet(true)

    try {
      await linkWallet(newWalletAddress)
      setNewWalletAddress("")
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error linking wallet:", error)
    } finally {
      setIsLinkingWallet(false)
    }
  }

  const handleUnlinkWallet = async (address: string) => {
    if (!address) return

    try {
      await unlinkWallet(address)
    } catch (error) {
      console.error("Error unlinking wallet:", error)
    }
  }

  const handleSaveAppearance = () => {
    toast({
      title: "Appearance settings saved",
      description: "Your appearance preferences have been updated.",
    })
  }

  const handleSavePlayback = () => {
    toast({
      title: "Playback settings saved",
      description: "Your playback preferences have been updated.",
    })
  }

  const handleSavePrivacy = () => {
    toast({
      title: "Privacy settings saved",
      description: "Your privacy preferences have been updated.",
    })
  }

  if (!mounted) return null

  if (!authenticated) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Account Settings</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Connect to manage your account settings and preferences.
          </p>
          <div className="flex gap-4">
            <Button size="lg" onClick={() => login("email")}>
              <Mail className="mr-2 h-4 w-4" />
              Connect with Email
            </Button>
            <Button size="lg" onClick={() => login("wallet")}>
              <Wallet className="mr-2 h-4 w-4" />
              Connect with Wallet
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  // Get linked wallets - ensure we're not rendering objects directly
  const linkedWallets = user?.linkedAccounts?.wallet || []
  const hasWallet = linkedWallets.length > 0

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="wallets">Wallets</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="playback">Playback</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your account information and preferences.</CardDescription>
              </CardHeader>
              <form onSubmit={handleUpdateProfile}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="flex items-center justify-between">
                      Display Name
                      {displayNameError && (
                        <span className="text-xs font-normal text-destructive flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {displayNameError}
                        </span>
                      )}
                    </Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your display name"
                      className={displayNameError ? "border-destructive" : ""}
                    />
                    <p className="text-xs text-muted-foreground">
                      This is the name that will be displayed to other users.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center justify-between">
                      Email
                      {emailError && (
                        <span className="text-xs font-normal text-destructive flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {emailError}
                        </span>
                      )}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className={emailError ? "border-destructive" : ""}
                      />
                      {hasLinkedEmail() && (
                        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                          <Mail className="mr-1 h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your email is used for account recovery and notifications.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => logout()}>
                    Disconnect
                  </Button>
                  <Button type="submit" disabled={isUpdatingProfile || !profileChanged}>
                    {isUpdatingProfile ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="wallets">
            <Card>
              <CardHeader>
                <CardTitle>Wallet Management</CardTitle>
                <CardDescription>Connect and manage your crypto wallets.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {hasWallet ? (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Connected Wallets</h3>
                    {linkedWallets.map((wallet) => (
                      <div key={wallet.address} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{`${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`}</p>
                            <p className="text-xs text-muted-foreground">Chain: {wallet.chainId}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnlinkWallet(wallet.address)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Alert>
                    <AlertDescription>You don't have any wallets connected to your account yet.</AlertDescription>
                  </Alert>
                )}

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Connect New Wallet
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Connect Wallet</DialogTitle>
                      <DialogDescription>
                        Enter your Ethereum wallet address to connect it to your account.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleLinkWallet}>
                      <div className="space-y-4 py-2">
                        <div className="space-y-2">
                          <Label htmlFor="walletAddress">Wallet Address</Label>
                          <Input
                            id="walletAddress"
                            placeholder="0x..."
                            value={newWalletAddress}
                            onChange={(e) => setNewWalletAddress(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter a valid Ethereum wallet address starting with 0x.
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isLinkingWallet || !newWalletAddress.startsWith("0x")}>
                          {isLinkingWallet ? "Connecting..." : "Connect Wallet"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how Echo Verse looks and feels.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Use a darker color theme for Echo Verse.</p>
                  </div>
                  <Switch id="darkMode" checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="highContrast">High Contrast</Label>
                    <p className="text-sm text-muted-foreground">Increase contrast for better visibility.</p>
                  </div>
                  <Switch id="highContrast" checked={highContrast} onCheckedChange={setHighContrast} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reducedMotion">Reduced Motion</Label>
                    <p className="text-sm text-muted-foreground">Minimize animations throughout the interface.</p>
                  </div>
                  <Switch id="reducedMotion" checked={reducedMotion} onCheckedChange={setReducedMotion} />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto" onClick={handleSaveAppearance}>
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="playback">
            <Card>
              <CardHeader>
                <CardTitle>Playback Settings</CardTitle>
                <CardDescription>Customize your music playback experience.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoplay">Autoplay</Label>
                    <p className="text-sm text-muted-foreground">Automatically play music when you open Echo Verse.</p>
                  </div>
                  <Switch id="autoplay" checked={autoplay} onCheckedChange={setAutoplay} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="crossfade">Crossfade</Label>
                    <p className="text-sm text-muted-foreground">Smoothly transition between songs.</p>
                  </div>
                  <Switch id="crossfade" checked={crossfade} onCheckedChange={setCrossfade} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="normalizeVolume">Normalize Volume</Label>
                    <p className="text-sm text-muted-foreground">
                      Maintain consistent volume levels across different tracks.
                    </p>
                  </div>
                  <Switch id="normalizeVolume" checked={normalizeVolume} onCheckedChange={setNormalizeVolume} />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto" onClick={handleSavePlayback}>
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}

