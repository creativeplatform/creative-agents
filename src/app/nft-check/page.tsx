"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { checkCreativeNFTOwnership } from "@/lib/unlock";
import { useAccount } from "wagmi";

export default function NFTCheckPage() {
  const { address, isConnected } = useAccount();
  const [nftStatus, setNftStatus] = useState<{
    BRAND: boolean;
    INVESTOR: boolean;
    CREATOR: boolean;
    anyNFT: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkNFTOwnership = async () => {
    if (!address) {
      setError("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Checking NFT ownership for address:", address);
      const ownershipStatus = await checkCreativeNFTOwnership(address);
      console.log("NFT ownership status:", ownershipStatus);
      setNftStatus(ownershipStatus);
    } catch (err) {
      console.error("Error checking NFT ownership:", err);
      setError(
        err instanceof Error ? err.message : "Failed to check NFT ownership"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">NFT Ownership Verification</h1>

      <Card className="mb-6 bg-gray-900 border-gray-800 text-white">
        <CardHeader>
          <CardTitle>Wallet Status</CardTitle>
        </CardHeader>
        <CardContent>
          {isConnected ? (
            <div>
              <p className="text-green-500 font-medium">Connected</p>
              <p className="text-sm text-gray-400 mt-1">
                Address: {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>
          ) : (
            <p className="text-yellow-500">
              Please connect your wallet to check NFT ownership
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center mb-6">
        <Button
          onClick={checkNFTOwnership}
          disabled={!isConnected || isLoading}
          className="px-6 bg-blue-600 hover:bg-blue-700 border-2"
        >
          {isLoading ? "Checking..." : "Check NFT Ownership"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 bg-red-900 border-red-800">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {nftStatus && (
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <CardTitle>NFT Ownership Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-700 rounded-lg bg-gray-800">
                <h3 className="font-medium mb-2">Creator NFT</h3>
                <p
                  className={
                    nftStatus.CREATOR ? "text-green-500" : "text-red-500"
                  }
                >
                  {nftStatus.CREATOR ? "Owned" : "Not Owned"}
                </p>
              </div>
              <div className="p-4 border border-gray-700 rounded-lg bg-gray-800">
                <h3 className="font-medium mb-2">Brand NFT</h3>
                <p
                  className={
                    nftStatus.BRAND ? "text-green-500" : "text-red-500"
                  }
                >
                  {nftStatus.BRAND ? "Owned" : "Not Owned"}
                </p>
              </div>
              <div className="p-4 border border-gray-700 rounded-lg bg-gray-800">
                <h3 className="font-medium mb-2">Investor NFT</h3>
                <p
                  className={
                    nftStatus.INVESTOR ? "text-green-500" : "text-red-500"
                  }
                >
                  {nftStatus.INVESTOR ? "Owned" : "Not Owned"}
                </p>
              </div>
            </div>
            <div className="mt-4 p-4 border border-gray-700 rounded-lg bg-gray-800">
              <h3 className="font-medium mb-2">Overall Status</h3>
              <p
                className={nftStatus.anyNFT ? "text-green-500" : "text-red-500"}
              >
                {nftStatus.anyNFT
                  ? "You own at least one Creative Membership NFT"
                  : "You don't own any Creative Membership NFTs"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
        <pre className="bg-gray-800 p-4 rounded-lg overflow-auto max-h-64 text-xs text-gray-300 border border-gray-700">
          {JSON.stringify(
            {
              address,
              isConnected,
              nftStatus,
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}
