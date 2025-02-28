'use client';

import { useState } from 'react';
import { queryLocks, queryKeys, NetworkId, Lock, Key } from '../../lib/unlock';

export default function LockQueryPage() {
  const [locks, setLocks] = useState<Lock[]>([]);
  const [keys, setKeys] = useState<Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [network, setNetwork] = useState<NetworkId>(8453); // Properly typed as NetworkId

  // Function to fetch locks
  const fetchLocks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const locksData = await queryLocks(
        {
          first: 10, // Limit to 10 results
          orderBy: 'createdAtBlock',
          orderDirection: 'desc',
        },
        [network] // Correctly passing network as an array of NetworkId
      );
      
      setLocks(locksData);
    } catch (err) {
      console.error('Error fetching locks:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch keys for a specific lock
  const fetchKeysForLock = async (lockAddress: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const keysData = await queryKeys(
        {
          first: 10, // Limit to 10 results
          where: { lock: lockAddress.toLowerCase() },
        },
        [network]
      );
      
      setKeys(keysData.map((key) => ({ ...key, id: key.id.toString() })));
    } catch (err) {
      console.error('Error fetching keys:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Unlock Protocol Lock Query</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Network</label>
        <select 
          className="w-full p-2 border rounded"
          value={network}
          onChange={(e) => setNetwork(Number(e.target.value) as NetworkId)}
        >
          <option value={8453}>Base Mainnet</option>
          <option value={137}>Polygon Mainnet</option>
        </select>
      </div>
      
      <button
        onClick={fetchLocks}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 mb-6"
      >
        {loading ? 'Loading...' : 'Query Locks'}
      </button>
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {locks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Locks ({locks.length})</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Address</th>
                  <th className="py-2 px-4 border-b">Price</th>
                  <th className="py-2 px-4 border-b">Total Keys</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {locks.map((lock, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-2 px-4 border-b">{lock.name || 'Unnamed Lock'}</td>
                    <td className="py-2 px-4 border-b font-mono text-sm">{formatAddress(lock.address)}</td>
                    <td className="py-2 px-4 border-b">{lock.price ? `${Number(lock.price) / 1e18} ETH` : 'N/A'}</td>
                    <td className="py-2 px-4 border-b">{typeof lock.totalKeys === 'number' ? lock.totalKeys : (lock.totalSupply || '0')}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => fetchKeysForLock(lock.address)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        View Keys
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {keys.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Keys ({keys.length})</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Owner</th>
                  <th className="py-2 px-4 border-b">Expiration</th>
                  <th className="py-2 px-4 border-b">Created</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((key, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-2 px-4 border-b font-mono text-sm">{key.id ? formatAddress(key.id) : 'N/A'}</td>
                    <td className="py-2 px-4 border-b font-mono text-sm">{key.owner ? formatAddress(key.owner) : 'N/A'}</td>
                    <td className="py-2 px-4 border-b">
                      {key.expiration ? new Date(Number(key.expiration) * 1000).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {key.createdAt ? new Date(Number(key.createdAt) * 1000).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
