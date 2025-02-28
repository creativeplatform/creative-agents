"use client";

import { useState, useEffect } from "react";
import { getBaseSubgraphEndpoint } from "../../lib/graphqlClient";

// Define types for the GraphQL response
interface Lock {
  id: string;
  address: string;
  name: string;
  expirationDuration: string;
  totalSupply: string;
  maxNumberOfKeys: string;
}

interface GraphQLResponse {
  data?: {
    locks?: Lock[];
  };
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

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

const ApiTestPage = () => {
  const [data, setData] = useState<GraphQLResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const endpoint = getBaseSubgraphEndpoint();

        // Use our server-side API route
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            endpoint,
            query: QUERY,
            variables: {},
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error: ${response.status} - ${errorText}`);
        }

        const result = (await response.json()) as GraphQLResponse;

        if (result.errors && result.errors.length > 0) {
          throw new Error(`GraphQL Error: ${result.errors[0]?.message}`);
        }

        setData(result.data || null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Testing API Route</h1>
        <div className="animate-pulse p-4 bg-gray-100 rounded">
          <p>Loading data via server-side API route...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Testing API Route</h1>
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
      <h1 className="text-2xl font-bold mb-4">Testing API Route</h1>
      <div className="mb-4 p-4 bg-green-100 rounded border border-green-300">
        <h2 className="text-xl font-semibold text-green-700 mb-2">Success!</h2>
        <p className="text-green-700">
          Successfully retrieved data via server-side API route
        </p>
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

export default ApiTestPage;
