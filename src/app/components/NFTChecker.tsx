import { useState, useEffect } from "react";
import { checkCreativeNFTOwnership } from "../../lib/unlock";

interface NFTCheckerProps {
  address: string;
  onStatusChange?: (hasAccess: boolean) => void;
}

// Export as named export for dynamic import compatibility
export function NFTChecker({ address, onStatusChange }: NFTCheckerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ownership, setOwnership] = useState<{
    BRAND: boolean;
    INVESTOR: boolean;
    CREATOR: boolean;
    anyNFT: boolean;
  } | null>(null);

  // Reset state when address changes
  useEffect(() => {
    setLoading(true);
    setError(null);
  }, [address]);

  // Check NFT ownership
  useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }

    const checkOwnership = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await checkCreativeNFTOwnership(address);

        setOwnership(result);

        // Notify parent component if callback provided
        if (onStatusChange) {
          onStatusChange(result.anyNFT);
        }
      } catch (err) {
        console.error("Error checking NFT ownership:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");

        // Notify parent of failure
        if (onStatusChange) {
          onStatusChange(false);
        }
      } finally {
        setLoading(false);
      }
    };

    checkOwnership();
  }, [address, onStatusChange]);

  if (!address) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-yellow-700">
          Please connect your wallet to check membership status.
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
          <p className="text-blue-700">Checking membership status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <p className="text-red-700">Error checking membership: {error}</p>
        <button
          onClick={() => setLoading(true)}
          className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!ownership?.anyNFT) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded">
        <p className="text-gray-700">
          No valid membership found for this wallet.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Purchase a membership to access exclusive content.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded">
      <p className="text-green-700 font-medium">Membership verified! ✓</p>
      <div className="mt-2 grid grid-cols-1 gap-2">
        {ownership.BRAND && (
          <div className="text-sm bg-green-100 p-2 rounded">
            Brand Membership
          </div>
        )}
        {ownership.INVESTOR && (
          <div className="text-sm bg-green-100 p-2 rounded">
            Investor Membership
          </div>
        )}
        {ownership.CREATOR && (
          <div className="text-sm bg-green-100 p-2 rounded">
            Creator Membership
          </div>
        )}
      </div>
    </div>
  );
}

// Also export as default for compatibility
export default NFTChecker;
