import { Web3Service, SubgraphService } from "@unlock-protocol/unlock-js";
import { ethers } from "ethers";

// Define network ID type to ensure type safety
export type NetworkId = 8453; // Base network only

// Define Lock type
export interface Lock {
  network: number;
  __typename?: "Lock";
  id: string;
  address: string;
  name?: string | null;
  expirationDuration?: number;
  tokenAddress: string;
  price: string;
  lockManagers?: string[];
  version?: string;
  createdAtBlock?: number;
  totalKeys?: number;
  owner?: string;
  totalSupply?: number;
  [key: string]: unknown;
}

// Define Key type
export interface Key {
  id: string;
  lock: {
    address: string;
    name?: string | null;
    [key: string]: unknown;
  };
  owner: string;
  expiration: number;
  tokenId: string;
  network?: number;
  __typename?: "Key";
  manager?: unknown;
  tokenURI?: string | null;
  createdAtBlock?: number;
  cancelled?: boolean | null;
  [key: string]: unknown;
}

// Network configurations
export const NETWORKS = {
  // Base Mainnet
  8453: {
    unlockAddress: "0xd0b14797b9D08493392865647384974470202A78",
    provider:
      process.env.NEXT_PUBLIC_BASE_RPC_URL ||
      "https://rpc.unlock-protocol.com/8453",
    // Required for contract interactions
    publicLockAddress: "0xf7c4cd399395d80f9d61fde833849106775269c6", // Public Lock address for Base
    name: "Base", // Adding network name
    id: 8453, // Adding network ID explicitly
  },
} as const;

// NFT Contract Addresses on Base
export const NFT_CONTRACTS = {
  BRAND: "0x9c3744c96200a52d05a630d4aec0db707d7509be",
  INVESTOR: "0x13b818daf7016b302383737ba60c3a39fef231cf",
  CREATOR: "0xf7c4cd399395d80f9d61fde833849106775269c6",
};

// Initialize SubgraphService for querying The Graph
const subgraphService = new SubgraphService();

// Initialize Web3Service with proper configuration
const web3Service = new Web3Service({
  8453: {
    provider: NETWORKS[8453].provider,
    unlockAddress: NETWORKS[8453].unlockAddress,
    publicLockAddress: NETWORKS[8453].publicLockAddress,
    network: NETWORKS[8453].id,
    name: NETWORKS[8453].name,
    id: NETWORKS[8453].id,
    locksmithUri: "https://locksmith.unlock-protocol.com",
    subgraphURI:
      "https://api.thegraph.com/subgraphs/name/unlock-protocol/base-v2",
  },
});

// Add a helper to check if Web3Service is properly initialized
function isWeb3ServiceInitialized() {
  if (!web3Service) return false;
  if (!web3Service.networks || !web3Service.networks[8453]) return false;
  if (!web3Service.networks[8453].publicLockAddress) return false;
  return true;
}

/**
 * Query locks from The Graph using Unlock Protocol's SubgraphService
 * @param options Query options (pagination, sorting, etc.)
 * @param networks Array of network IDs to query (e.g., [8453] for Base)
 * @returns Array of locks matching the query
 */
export async function queryLocks(
  options: {
    first?: number;
    skip?: number;
    orderBy?: string;
    orderDirection?: "asc" | "desc";
    where?: Record<string, unknown>;
  } = {},
  networks: NetworkId[] = [8453]
): Promise<Lock[]> {
  try {
    const locks = await subgraphService.locks(
      {
        first: options.first || 100,
        skip: options.skip || 0,
        where: options.where,
      },
      {
        networks,
      }
    );

    return locks;
  } catch (error) {
    console.error("Error querying locks:", error);
    throw new Error(
      `Failed to query locks: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Query keys (memberships) from The Graph using Unlock Protocol's SubgraphService
 * @param options Query options (pagination, sorting, etc.)
 * @param networks Array of network IDs to query (e.g., [8453] for Base)
 * @returns Array of keys matching the query
 */
export async function queryKeys(
  options: {
    first?: number;
    skip?: number;
    orderBy?: string;
    orderDirection?: "asc" | "desc";
    where?: Record<string, unknown>;
  } = {},
  networks: NetworkId[] = [8453]
): Promise<Key[]> {
  try {
    const keys = await subgraphService.keys(
      {
        first: options.first || 100,
        skip: options.skip || 0,
        where: options.where,
      },
      {
        networks,
      }
    );

    return keys;
  } catch (error) {
    console.error("Error querying keys:", error);
    throw new Error(
      `Failed to query keys: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

interface LockDetails {
  name: string;
  address: string;
  keyPrice: string;
  expirationDuration: number;
  maxNumberOfKeys: number;
  owner: string;
  tokenAddress?: string;
  outstandingKeys: number;
  totalSupply: number;
  balance: string;
  version: number;
}

export async function getLockDetails(
  lockAddress: string,
  chainId: NetworkId
): Promise<LockDetails> {
  if (!isValidChainId(chainId)) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  try {
    const lock = await web3Service.getLock(lockAddress, chainId);

    if (!lock) {
      throw new Error("Lock not found on the specified network");
    }

    return {
      name: lock.name,
      address: lockAddress,
      keyPrice: ethers.utils.formatUnits(lock.keyPrice, "ether"),
      expirationDuration: Number(lock.expirationDuration),
      maxNumberOfKeys: Number(lock.maxNumberOfKeys),
      owner: lock.beneficiary,
      tokenAddress: lock.currencyContractAddress || undefined,
      outstandingKeys: Number(lock.outstandingKeys),
      totalSupply: Number(lock.totalSupply),
      balance: ethers.utils.formatUnits(lock.balance, "ether"),
      version: Number(lock.publicLockVersion),
    };
  } catch (error) {
    console.error("Error fetching lock details:", error);
    throw new Error(
      `Failed to get lock details: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Check if a user has a valid key for a specific lock
 * @param userAddress The user's wallet address
 * @param lockAddress The lock contract address
 * @param chainId The blockchain network ID (default: 8453 for Base)
 * @returns Boolean indicating if user has a valid key
 */
export async function hasValidKey(
  userAddress: string,
  lockAddress: string,
  chainId: NetworkId = 8453
): Promise<boolean> {
  if (!userAddress || !lockAddress) {
    console.warn("User address and lock address are required");
    return false;
  }

  if (!isValidChainId(chainId)) {
    console.warn(
      `Chain ID ${chainId} not supported, defaulting to Base (8453)`
    );
    chainId = 8453; // Default to Base if unsupported chain
  }

  try {
    console.log(
      `Checking key validity for ${userAddress} at lock ${lockAddress} on chain ${chainId}`
    );

    // Normalize addresses to checksum format
    const normalizedUserAddress = ethers.utils.getAddress(userAddress);
    const normalizedLockAddress = ethers.utils.getAddress(lockAddress);

    // Verify we have a provider for this chain
    const networkConfig = NETWORKS[chainId];
    const provider = new ethers.providers.JsonRpcProvider(
      networkConfig.provider
    );

    // Instead of directly setting the network property, just get the network info
    // and use the network name from our config in the log
    const network = await provider.getNetwork();
    console.log(
      `Connected to network: ${networkConfig.name} (${network.chainId})`
    );

    // First try to check ownership using ethers directly
    try {
      // Basic ERC721 interface for ownership check
      const erc721Interface = new ethers.utils.Interface([
        "function balanceOf(address owner) view returns (uint256)",
        "function ownerOf(uint256 tokenId) view returns (address)",
      ]);

      const contract = new ethers.Contract(
        normalizedLockAddress,
        erc721Interface,
        provider
      );
      const balance = await contract.balanceOf(normalizedUserAddress);
      console.log(
        `NFT balance for ${normalizedUserAddress}: ${balance.toString()}`
      );

      if (balance.gt(0)) {
        console.log(
          `User has ${balance.toString()} keys for lock ${normalizedLockAddress}`
        );
        return true;
      }
    } catch (error) {
      // Type guard for the error object
      const erc721Error = error as Error;
      console.log(
        `ERC721 direct check failed, falling back to Web3Service: ${
          erc721Error.message || "Unknown error"
        }`
      );
    }

    // Fallback to Web3Service
    try {
      console.log(
        `Attempting Web3Service check for lock: ${normalizedLockAddress}`
      );

      // Verify Web3Service is properly initialized
      if (!isWeb3ServiceInitialized()) {
        console.error("Web3Service is not initialized");
        return false;
      }

      const hasKey = await web3Service.getHasValidKey(
        normalizedLockAddress,
        normalizedUserAddress,
        chainId
      );

      console.log(
        `Key validity for ${userAddress} at lock ${lockAddress}: ${hasKey}`
      );
      return hasKey;
    } catch (error: unknown) {
      // Type guard for the error object
      const web3ServiceError =
        error instanceof Error ? error : new Error(String(error));
      console.error(
        `Web3Service check failed: ${
          web3ServiceError.message || "Unknown error"
        }`
      );

      // Log additional debugging information
      console.debug("Web3Service configuration:", {
        chainId,
        networkConfig: NETWORKS[chainId],
        web3ServiceConfig: web3Service.networks?.[chainId],
      });

      // Continue with execution rather than throwing
      return false;
    }
  } catch (error: unknown) {
    // Ensure error is properly typed for logging
    const typedError =
      error instanceof Error ? error : new Error(String(error));
    console.error(
      `Error checking key validity for address ${userAddress} and lock ${lockAddress}:`,
      typedError
    );
    // Return false instead of throwing to make the function more resilient
    return false;
  }
}

/**
 * Direct check for NFT ownership using ethers.js
 * This bypasses the Web3Service and directly interacts with the contract
 */
export async function directNFTOwnershipCheck(
  userAddress: string,
  lockAddress: string,
  chainId: NetworkId = 8453
): Promise<boolean> {
  if (!userAddress || !lockAddress) {
    return false;
  }

  try {
    // Normalize addresses
    const normalizedUserAddress = ethers.utils.getAddress(userAddress);
    const normalizedLockAddress = ethers.utils.getAddress(lockAddress);

    // Get provider
    const provider = new ethers.providers.JsonRpcProvider(
      NETWORKS[chainId].provider
    );

    // Basic ERC721 interface for ownership check
    const erc721Interface = new ethers.utils.Interface([
      "function balanceOf(address owner) view returns (uint256)",
      "function ownerOf(uint256 tokenId) view returns (address)",
    ]);

    const contract = new ethers.Contract(
      normalizedLockAddress,
      erc721Interface,
      provider
    );
    const balance = await contract.balanceOf(normalizedUserAddress);

    return balance.gt(0);
  } catch (error) {
    console.error(`Direct NFT ownership check failed:`, error);
    return false;
  }
}

/**
 * Check if a user owns any Creative NFTs
 * @param address User wallet address
 * @returns Object with flags for each NFT type ownership
 */
export async function checkCreativeNFTOwnership(address: string): Promise<{
  BRAND: boolean;
  INVESTOR: boolean;
  CREATOR: boolean;
  anyNFT: boolean;
}> {
  if (!address) {
    throw new Error("Address is required");
  }

  console.log("Checking NFT ownership for address:", address);
  console.log("NFT contracts:", NFT_CONTRACTS);

  // Default state - no NFTs owned
  const result = {
    BRAND: false,
    INVESTOR: false,
    CREATOR: false,
    anyNFT: false,
  };

  try {
    // Check each NFT type in parallel for efficiency
    const [creatorResult, brandResult, investorResult] =
      await Promise.allSettled([
        // Check Creator NFT
        (async () => {
          try {
            console.log("Checking Creator NFT ownership...");
            const hasCreator = await directNFTOwnershipCheck(
              address,
              NFT_CONTRACTS.CREATOR
            );
            console.log("Creator NFT ownership result:", hasCreator);
            return hasCreator;
          } catch (error) {
            console.error("Error checking Creator NFT:", error);
            return false;
          }
        })(),

        // Check Brand NFT
        (async () => {
          try {
            console.log("Checking Brand NFT ownership...");
            const hasBrand = await directNFTOwnershipCheck(
              address,
              NFT_CONTRACTS.BRAND
            );
            console.log("Brand NFT ownership result:", hasBrand);
            return hasBrand;
          } catch (error) {
            console.error("Error checking Brand NFT:", error);
            return false;
          }
        })(),

        // Check Investor NFT
        (async () => {
          try {
            console.log("Checking Investor NFT ownership...");
            const hasInvestor = await directNFTOwnershipCheck(
              address,
              NFT_CONTRACTS.INVESTOR
            );
            console.log("Investor NFT ownership result:", hasInvestor);
            return hasInvestor;
          } catch (error) {
            console.error("Error checking Investor NFT:", error);
            return false;
          }
        })(),
      ]);

    // Process results
    result.CREATOR =
      creatorResult.status === "fulfilled" ? creatorResult.value : false;
    result.BRAND =
      brandResult.status === "fulfilled" ? brandResult.value : false;
    result.INVESTOR =
      investorResult.status === "fulfilled" ? investorResult.value : false;

    // Check if user owns any NFT
    result.anyNFT = result.CREATOR || result.BRAND || result.INVESTOR;

    console.log("Final NFT ownership results:", result);
    return result;
  } catch (error) {
    console.error("Error checking NFT ownership:", error);
    // Return the default result with all false values instead of throwing
    return result;
  }
}

// Utility function to check valid networks
export function isValidChainId(chainId: number): chainId is NetworkId {
  return Object.keys(NETWORKS).includes(String(chainId));
}
