"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { injected } from "wagmi/connectors";
import { checkCreativeNFTOwnership } from "@/lib/unlock";

export default function UnlockAuth() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [nftStatus, setNftStatus] = useState<{
    CREATOR: boolean;
    BRAND: boolean;
    INVESTOR: boolean;
    anyNFT: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkNFTOwnership = useCallback(async () => {
    if (!address) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log("Checking NFT ownership for address:", address);
      const ownershipStatus = await checkCreativeNFTOwnership(address);
      console.log("NFT ownership status:", ownershipStatus);
      setNftStatus(ownershipStatus);
    } catch (err) {
      console.error("Error checking NFT ownership:", err);
      setError("Failed to check NFT ownership");
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // Check NFT ownership when address changes
  useEffect(() => {
    if (address && isConnected) {
      checkNFTOwnership();
    } else {
      setNftStatus(null);
    }
  }, [address, isConnected, checkNFTOwnership]);

  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="flex flex-col items-center">
      {isConnected ? (
        <div className="flex flex-col items-center space-y-4 w-full">
          <div className="flex items-center justify-between w-full max-w-md bg-gray-900 p-3 rounded-lg border border-gray-800">
            <div>
              <p className="text-sm text-gray-300">Connected Wallet</p>
              <p className="font-medium">{formatAddress(address as string)}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => disconnect()}
              className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-400"
            >
              Disconnect
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-4">
              <p className="text-gray-400">Checking NFT ownership...</p>
            </div>
          ) : nftStatus ? (
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 w-full max-w-md">
              <h3 className="font-medium mb-3">NFT Membership Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Creator NFT:</span>
                  <span
                    className={
                      nftStatus.CREATOR ? "text-green-500" : "text-gray-400"
                    }
                  >
                    {nftStatus.CREATOR ? "Owned" : "Not Owned"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Brand NFT:</span>
                  <span
                    className={
                      nftStatus.BRAND ? "text-green-500" : "text-gray-400"
                    }
                  >
                    {nftStatus.BRAND ? "Owned" : "Not Owned"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Investor NFT:</span>
                  <span
                    className={
                      nftStatus.INVESTOR ? "text-green-500" : "text-gray-400"
                    }
                  >
                    {nftStatus.INVESTOR ? "Owned" : "Not Owned"}
                  </span>
                </div>
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span>Membership Status:</span>
                    <span
                      className={
                        nftStatus.anyNFT ? "text-green-500" : "text-red-500"
                      }
                    >
                      {nftStatus.anyNFT ? "Member" : "Not a Member"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 p-4 rounded-lg border border-red-800 w-full max-w-md">
              <h3 className="font-medium mb-2 text-red-400">Error</h3>
              <p className="text-sm">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={checkNFTOwnership}
                className="mt-3 border-red-800 hover:border-red-700"
              >
                Retry
              </Button>
            </div>
          ) : null}
        </div>
      ) : (
        <Button
          onClick={() => connect({ connector: injected() })}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Connect Wallet
        </Button>
      )}
    </div>
  );
}
