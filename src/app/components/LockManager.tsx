// src/components/LockManager.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAccount } from "wagmi";
import { checkCreativeNFTOwnership, hasValidKey, NetworkId } from "../../lib/unlock";
import { useGraphQLErrorHandling } from "../../hooks/useGraphQLErrorHandling";

export function LockManager() {
  const { address, isConnected } = useAccount();
  const { handleError, clearError } = useGraphQLErrorHandling();
  const [pollingInterval] = useState(30000); // 30 seconds
  const [pollingActive, setPollingActive] = useState(true);
  const errorCountRef = useRef(0);
  const [nftStatus, setNftStatus] = useState({
    BRAND: false,
    INVESTOR: false,
    CREATOR: false,
    anyNFT: false,
    loading: false,
    error: null as string | null,
  });

  // Function to check NFT ownership
  const checkNFTs = useCallback(async () => {
    if (!isConnected || !address) {
      setNftStatus((prev) => ({ ...prev, loading: false, error: null }));
      return;
    }

    try {
      clearError();
      setNftStatus((prev) => ({ ...prev, loading: true, error: null }));

      // Use the new checkCreativeNFTOwnership function
      const result = await checkCreativeNFTOwnership(address);

      // Reset error count on success
      errorCountRef.current = 0;
      // Re-enable polling if it was disabled
      setPollingActive(true);

      setNftStatus({
        ...result,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error checking NFT status:", error);

      // Increment error count
      errorCountRef.current += 1;

      // If we've had multiple consecutive errors, disable polling
      if (errorCountRef.current >= 3) {
        setPollingActive(false);
        console.log("Polling disabled after multiple errors");
      }

      const errorMessage = handleError(error);
      setNftStatus((prev) => ({
        ...prev,
        loading: false,
        error:
          errorMessage ||
          "Failed to check NFT ownership. Please try again later.",
      }));
    }
  }, [address, isConnected, clearError, handleError]);

  // Initial check
  useEffect(() => {
    // Don't auto-check until user is connected
    if (isConnected && address) {
      checkNFTs();
    } else {
      setNftStatus((prev) => ({ ...prev, loading: false }));
    }
  }, [isConnected, address, checkNFTs]);

  // Setup polling - separate effect to avoid initial double-fetch
  useEffect(() => {
    if (!isConnected || !address) return;

    // Setup polling interval for real-time updates
    let intervalId: NodeJS.Timeout | null = null;

    if (pollingActive) {
      intervalId = setInterval(() => {
        checkNFTs();
      }, pollingInterval);
    }

    // Cleanup on unmount
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [checkNFTs, pollingInterval, pollingActive, isConnected, address]);

  // Function to handle manual refresh
  const handleRefresh = () => {
    // Reset error count and re-enable polling on manual refresh
    errorCountRef.current = 0;
    setPollingActive(true);
    checkNFTs();
  };

  if (!isConnected) {
    return (
      <div className="p-4 border rounded-lg bg-yellow-50">
        <p className="text-yellow-700">
          Please connect your wallet to check membership status.
        </p>
      </div>
    );
  }

  if (nftStatus.loading) {
    return (
      <div className="p-4 border rounded-lg bg-blue-50">
        <div className="flex items-center">
          <svg
            className="animate-spin h-5 w-5 mr-3 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-blue-700">Checking membership status...</p>
        </div>
      </div>
    );
  }

  if (nftStatus.error) {
    return (
      <div className="p-4 border rounded-lg bg-red-50">
        <p className="text-red-700">
          Error checking membership: {nftStatus.error}
        </p>
        <button
          onClick={handleRefresh}
          className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded"
        >
          Retry
        </button>
        {!pollingActive && (
          <p className="text-xs text-red-500 mt-2">
            Auto-refresh disabled due to errors. Click &quot;Retry&quot; to resume.
          </p>
        )}
      </div>
    );
  }

  if (!nftStatus.anyNFT) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <p className="text-gray-700">
          No valid membership found for this wallet.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Purchase a membership to access exclusive content.
        </p>
        <button
          onClick={handleRefresh}
          className="mt-2 text-sm px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-green-50">
      <p className="text-green-700 font-medium">Membership verified! &#10003;</p>
      <div className="mt-2 grid grid-cols-1 gap-2">
        {nftStatus.BRAND && (
          <div className="text-sm bg-green-100 p-2 rounded">
            Brand Membership
          </div>
        )}
        {nftStatus.INVESTOR && (
          <div className="text-sm bg-green-100 p-2 rounded">
            Investor Membership
          </div>
        )}
        {nftStatus.CREATOR && (
          <div className="text-sm bg-green-100 p-2 rounded">
            Creator Membership
          </div>
        )}
      </div>
      <button
        onClick={handleRefresh}
        className="mt-3 text-sm px-2 py-1 bg-green-100 hover:bg-green-200 rounded"
      >
        Refresh
      </button>
    </div>
  );
}

// New component for checking specific lock access
interface LockCheckerProps {
  lockAddress: string;
  chainId: NetworkId;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function LockChecker({
  lockAddress,
  chainId,
  children,
  fallback,
}: LockCheckerProps) {
  const { address, isConnected } = useAccount();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user has access
  useEffect(() => {
    if (!isConnected || !address) {
      setLoading(false);
      setHasAccess(false);
      return;
    }

    const checkAccess = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if user has a valid key
        const access = await hasValidKey(address, lockAddress, chainId);
        setHasAccess(access);
      } catch (err) {
        console.error("Error checking lock access:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [address, lockAddress, chainId, isConnected]);

  if (!isConnected) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-yellow-700">
          Please connect your wallet to access this content.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded">
        <div className="flex items-center">
          <svg
            className="animate-spin h-5 w-5 mr-3 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-blue-700">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <p className="text-red-700">Error checking access: {error}</p>
        <button
          onClick={() => setLoading(true)}
          className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!hasAccess) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded">
        <p className="text-gray-700">
          Access restricted. You need a membership to view this content.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
