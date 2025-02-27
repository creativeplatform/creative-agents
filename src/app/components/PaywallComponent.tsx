"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { Paywall, PaywallResponse } from "@unlock-protocol/paywall";
import {
  NETWORKS,
  directNFTOwnershipCheck,
  NetworkId,
  isValidChainId,
} from "@/lib/unlock";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface PaywallComponentProps {
  lockAddress: string;
  chainId?: NetworkId;
  title?: string;
  onPurchaseSuccess?: (hash: string) => void;
}

export default function PaywallComponent({
  lockAddress,
  chainId = 8453,
  title = "Access Premium Content",
  onPurchaseSuccess,
}: PaywallComponentProps) {
  const { address, isConnected } = useAccount();
  const [paywall, setPaywall] = useState<Paywall | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasValidMembership, setHasValidMembership] = useState(false);
  const [isCheckingMembership, setIsCheckingMembership] = useState(false);

  // Memoize the checkMembership function to avoid recreating it on every render
  const checkMembership = useCallback(async () => {
    if (!address || !lockAddress) {
      setIsCheckingMembership(false);
      return;
    }

    setIsCheckingMembership(true);

    // First try the direct NFT ownership check as it's more reliable
    try {
      console.log("Attempting direct NFT ownership check first...");
      const hasKey = await directNFTOwnershipCheck(
        address,
        lockAddress,
        isValidChainId(chainId) ? chainId : 8453
      );
      console.log(`Direct NFT ownership check result: ${hasKey}`);

      if (hasKey) {
        // If we already confirmed ownership, no need to check with Web3Service
        setHasValidMembership(true);
        setIsCheckingMembership(false);
        return;
      }

      // Only proceed to Web3Service check if direct check returns false
      setHasValidMembership(false);
      setIsCheckingMembership(false);
    } catch (directCheckError) {
      console.error("Direct NFT ownership check failed:", directCheckError);
      setHasValidMembership(false);
      setIsCheckingMembership(false);
    }
  }, [address, lockAddress, chainId]);

  // Initialize the paywall
  useEffect(() => {
    try {
      // Convert our NETWORKS object to the format expected by Paywall
      const networkConfigs = Object.entries(NETWORKS).reduce(
        (acc, [id, config]) => {
          return {
            ...acc,
            [id]: {
              provider: config.provider,
              unlockAddress: config.unlockAddress,
              // Only include essential properties to avoid serialization issues
              name: config.name,
            },
          };
        },
        {}
      );

      console.log("Initializing Paywall with network configs:", networkConfigs);
      const paywallInstance = new Paywall(networkConfigs);
      setPaywall(paywallInstance);
    } catch (error) {
      console.error("Error initializing Paywall:", error);
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Check if user already has a valid membership
  useEffect(() => {
    checkMembership();
  }, [checkMembership]);

  const openCheckout = useCallback(async () => {
    if (!paywall || !lockAddress) return;

    setIsLoading(true);
    try {
      // Ensure we're using a valid network ID for the locks configuration
      const network = isValidChainId(chainId) ? chainId : 8453;

      // Configure the paywall with minimal configuration to avoid serialization issues
      const paywallConfig = {
        locks: {
          [lockAddress]: {
            network: network,
          },
        },
        title,
        pessimistic: true,
      };

      console.log("Opening checkout with config:", paywallConfig);

      // Add timeout to prevent hanging on message channel issues
      const checkoutPromise = paywall.loadCheckoutModal(paywallConfig);
      const timeoutPromise = new Promise<PaywallResponse>((_, reject) =>
        setTimeout(() => reject(new Error("Checkout modal timed out")), 15000)
      );

      // Race the checkout against a timeout
      const response = await Promise.race([checkoutPromise, timeoutPromise]);

      // Handle the response
      if (response && response.hash && onPurchaseSuccess) {
        onPurchaseSuccess(response.hash);
        // After successful purchase, update the membership status
        setHasValidMembership(true);
      }
    } catch (error) {
      console.error("Error opening checkout:", error);
    } finally {
      setIsLoading(false);
    }
  }, [paywall, lockAddress, chainId, title, onPurchaseSuccess]);

  // If user is not connected, show a message
  if (!isConnected) {
    return (
      <div className="p-4 border rounded-md bg-gray-50">
        <p className="mb-2 text-black">
          Please connect your wallet to access premium content.
        </p>
      </div>
    );
  }

  // If checking membership status, show loading
  if (isCheckingMembership) {
    return (
      <div className="p-4 border rounded-md bg-gray-50">
        <p className="mb-2 text-black">Checking membership status...</p>
      </div>
    );
  }

  // If user already has a valid membership, show a success message
  if (hasValidMembership) {
    return (
      <div className="p-4 border rounded-md bg-green-50">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-black">{title}</h3>
        </div>
        <p className="text-black">
          You already have an active membership. No need to purchase again.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-md bg-gray-50">
      <h3 className="text-lg font-semibold mb-2 text-black">{title}</h3>
      <p className="mb-4 text-black">
        This content requires a membership. Purchase a membership to access.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          className="text-black border-2 hover:bg-blend-darken"
          onClick={openCheckout}
          disabled={isLoading || !paywall}
        >
          {isLoading ? "Loading..." : "Purchase with Unlock"}
        </Button>
      </div>
    </div>
  );
}
