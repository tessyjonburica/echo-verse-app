// Mock IPFS service for decentralized content storage and retrieval

export interface IPFSContent {
  cid: string
  name: string
  size: number
  type: string
  lastModified: number
}

export interface IPFSFile extends IPFSContent {
  url: string
}

class IPFSService {
  private static instance: IPFSService
  private isConnected = false

  // Mock CID to URL mapping for audio files
  private cidMap: Record<string, string> = {
    QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG: "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav",
    QmZTR5bcpQD7cFgTorqxZDYaew1Wqgfbd2ud9QqGPAkK2V: "https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand60.wav",
    QmSgvgwxZGaBLqkGyWemEDqikCqU52XxsYLKtdy3vGZ8uq: "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav",
    QmPChd2hVbrJ6bfo3WBcTW4iZnpHm8TEzWkLHmLpXhF68A: "https://www2.cs.uic.edu/~i101/SoundFiles/ImperialMarch60.wav",
    QmTDMoVqvyBkNMRhzvukTDznntByUNDwyNdSfV8dZ3VKRC: "https://www2.cs.uic.edu/~i101/SoundFiles/PinkPanther30.wav",
    QmPCawMTd7csXKf7QVrAFbHGiLPPn3qcjNBg1g6gWHkF3m: "https://www2.cs.uic.edu/~i101/SoundFiles/tada.wav",
    QmTkzDwWqPbnAh5YiV5VwcTLnGdwSNsNTn2aDxdXBFca7D: "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars3.wav",
    QmbtFKnBuyUmRoFAoxEJxqZBCTamYeGnZ4MrHCLehWkHre: "https://www2.cs.uic.edu/~i101/SoundFiles/gettysburg10.wav",
  }

  private constructor() {}

  public static getInstance(): IPFSService {
    if (!IPFSService.instance) {
      IPFSService.instance = new IPFSService()
    }
    return IPFSService.instance
  }

  public async connect(): Promise<boolean> {
    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    this.isConnected = true
    console.log("Connected to IPFS network")
    return true
  }

  public async disconnect(): Promise<void> {
    this.isConnected = false
    console.log("Disconnected from IPFS network")
  }

  public isIPFSConnected(): boolean {
    return this.isConnected
  }

  public async getFile(cid: string): Promise<IPFSFile | null> {
    if (!this.isConnected) {
      await this.connect()
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    if (this.cidMap[cid]) {
      return {
        cid,
        name: `ipfs-file-${cid.substring(0, 8)}`,
        size: Math.floor(Math.random() * 10000000) + 1000000, // Random size between 1-10MB
        type: "audio/wav",
        lastModified: Date.now(),
        url: this.cidMap[cid],
      }
    }

    return null
  }

  public async uploadFile(file: File): Promise<string> {
    if (!this.isConnected) {
      await this.connect()
    }

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate a mock CID
    const mockCid = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

    // Store the file URL in our map
    const fileUrl = URL.createObjectURL(file)
    this.cidMap[mockCid] = fileUrl

    return mockCid
  }

  public async pinFile(cid: string): Promise<boolean> {
    if (!this.isConnected) {
      await this.connect()
    }

    // Simulate pinning delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    return !!this.cidMap[cid]
  }

  public cidToUrl(cid: string): string | null {
    return this.cidMap[cid] || null
  }
}

export const ipfsService = IPFSService.getInstance()

