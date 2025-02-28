import { createClient } from 'urql';
import { cacheExchange, fetchExchange } from '@urql/core';

export const GRAPH_API_KEY = "f8aec79dd9d28cb3df9ec0ea32969c03";
export const UNLOCK_SUBGRAPH_ID = "ECQhJQV8KWMfAAgWf8WV5duy1si9TnZpL4f194oGLrWW";
export const GRAPH_ENDPOINT = "https://gateway.thegraph.com/api";

export const createGraphClient = (endpoint: string, needsAuth: boolean = false) => {
  const clientConfig = {
    url: endpoint,
    exchanges: [cacheExchange, fetchExchange],
  };

  // Only add auth headers if needed (for gateway endpoints)
  if (needsAuth) {
    return createClient({
      ...clientConfig,
      fetchOptions: () => {
        return {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GRAPH_API_KEY}`,
          },
        };
      },
    });
  }

  // For direct subgraph access, no auth needed
  return createClient(clientConfig);
};

// For the Unlock Protocol subgraph specifically
export const getSubgraphEndpoint = () => {
  // Using the direct Unlock Protocol subgraph URL instead of the gateway
  // This endpoint doesn't require token authentication
  return "https://api.thegraph.com/subgraphs/name/unlock-protocol/unlock-mainnet";
};

// For Base network - using the hosted service endpoint that doesn't require authentication
export const getBaseSubgraphEndpoint = () => {
  return "https://api.thegraph.com/subgraphs/name/unlock-protocol/base-mainnet";
};

// For Polygon network
export const getPolygonSubgraphEndpoint = () => {
  return "https://api.thegraph.com/subgraphs/name/unlock-protocol/polygon-mainnet";
};

export const getUnlockClient = (chainId: number = 8453) => {
  let endpoint;
  
  // Use the appropriate endpoint based on the chain ID
  if (chainId === 137) {
    endpoint = getPolygonSubgraphEndpoint();
  } else {
    // Default to Base
    endpoint = getBaseSubgraphEndpoint();
  }
  
  // Direct subgraph endpoints don't need auth
  return createGraphClient(endpoint, false);
};
