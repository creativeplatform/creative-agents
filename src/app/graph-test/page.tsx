'use client';

import { cacheExchange, createClient, fetchExchange, Provider, useQuery } from 'urql';
import { GRAPH_API_KEY } from '../../lib/graphqlClient';

// Define types for the GraphQL response
interface Lock {
  id: string;
  address: string;
  name: string;
  expirationDuration: string;
  totalSupply: string;
  maxNumberOfKeys: string;
}

interface GraphQLData {
  locks: Lock[];
}

// Create a client with proper authentication
const client = createClient({
  url: `https://gateway.thegraph.com/api/${GRAPH_API_KEY}/subgraphs/id/ECQhJQV8KWMfAAgWf8WV5duy1si9TnZpL4f194oGLrWW`,
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GRAPH_API_KEY}`,
      },
    };
  },
});

// Alternative client for direct subgraph access (no auth needed)
const directClient = createClient({
  url: 'https://api.thegraph.com/subgraphs/name/unlock-protocol/base-mainnet',
  exchanges: [cacheExchange, fetchExchange],
});

// Sample query to test
const QUERY = `{
  locks(first: 5) {
    id
    address
    name
    expirationDuration
    totalSupply
    maxNumberOfKeys
  }
}`;

const ExampleComponent = () => {
  const [result] = useQuery<GraphQLData>({ query: QUERY });
  const { data, fetching, error } = result;

  if (fetching) return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Testing Graph API Connection</h1>
      <div className="animate-pulse p-4 bg-gray-100 rounded">
        <p>Loading data from The Graph...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Testing Graph API Connection</h1>
      <div className="p-4 bg-red-100 rounded border border-red-300">
        <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
        <p className="text-red-700">{error.message}</p>
        <pre className="mt-4 p-2 bg-gray-800 text-white rounded overflow-auto text-sm">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    </div>
  );
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Testing Graph API Connection</h1>
      <div className="mb-4 p-4 bg-green-100 rounded border border-green-300">
        <h2 className="text-xl font-semibold text-green-700 mb-2">Success!</h2>
        <p className="text-green-700">Successfully connected to The Graph API</p>
      </div>
      <div className="bg-gray-100 p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Data Retrieved:</h3>
        <pre className="bg-gray-800 text-white p-4 rounded overflow-auto text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};

// Toggle between gateway client and direct client
const USE_DIRECT_CLIENT = true;

const GraphTestPage = () => (
  <Provider value={USE_DIRECT_CLIENT ? directClient : client}>
    <ExampleComponent />
  </Provider>
);

export default GraphTestPage;
