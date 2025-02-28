'use client';

import UnlockAuth from '@/app/components/UnlockAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function UnlockAuthDemo() {
  return (
    <div className="container mx-auto py-8 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-2">Unlock Protocol Authentication</h1>
      <p className="text-gray-400 mb-8">
        Demonstrate how to use Unlock Protocol for authentication and wallet connection
      </p>
      
      <Alert className="mb-6 bg-blue-900/30 border-blue-800">
        <Info className="h-4 w-4" />
        <AlertTitle>Demo Information</AlertTitle>
        <AlertDescription className="text-gray-300">
          This demo shows how to integrate Unlock Protocol&apos;s authentication capabilities into your application.
          You can use this approach to authenticate users and enable them to sign messages or perform transactions.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="auth" className="space-y-4">
        <TabsList className="bg-gray-900 border-gray-800">
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="code">Code Example</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="auth" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Unlock Protocol Authentication</CardTitle>
              <CardDescription className="text-gray-400">
                Connect your wallet and check your NFT membership status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UnlockAuth />
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                This demo uses Unlock Protocol to verify NFT ownership. The process works as follows:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-gray-300">
                <li>Connect your wallet using the button above</li>
                <li>The application checks if you own any Creative Agents NFTs</li>
                <li>Your membership status is displayed based on NFT ownership</li>
                <li>Different access levels can be granted based on which NFTs you own</li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="code">
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Code Example</CardTitle>
              <CardDescription className="text-gray-400">
                How to implement Unlock Protocol authentication in your app
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-800 p-4 rounded-lg overflow-auto max-h-96 text-xs text-gray-300 border border-gray-700">
{`// 1. Import the necessary dependencies
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { checkCreativeNFTOwnership } from "@/lib/unlock";

// 2. Create your authentication component
export default function UnlockAuth() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  
  // 3. Check NFT ownership when address changes
  useEffect(() => {
    if (address && isConnected) {
      checkNFTOwnership();
    }
  }, [address, isConnected]);

  const checkNFTOwnership = async () => {
    if (!address) return;
    
    try {
      const ownershipStatus = await checkCreativeNFTOwnership(address);
      // Use the ownership status to determine access rights
    } catch (err) {
      console.error("Error checking NFT ownership:", err);
    }
  };

  // 4. Render the UI based on connection state
  return (
    <div>
      {isConnected ? (
        <div>
          <p>Connected: {address}</p>
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      ) : (
        <button onClick={() => connect({ connector: injected() })}>Connect Wallet</button>
      )}
    </div>
  );
}`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="docs">
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription className="text-gray-400">
                Resources for learning more about Unlock Protocol
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Official Documentation</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                  <li><a href="https://docs.unlock-protocol.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Unlock Protocol Docs</a></li>
                  <li><a href="https://docs.unlock-protocol.com/tools/paywall" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Paywall Documentation</a></li>
                  <li><a href="https://docs.unlock-protocol.com/core-protocol/public-lock" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Public Lock Contract</a></li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Developer Resources</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                  <li><a href="https://github.com/unlock-protocol/unlock" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">GitHub Repository</a></li>
                  <li><a href="https://www.npmjs.com/package/@unlock-protocol/unlock-js" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">unlock-js NPM Package</a></li>
                  <li><a href="https://www.npmjs.com/package/@unlock-protocol/paywall" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">paywall NPM Package</a></li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Community</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                  <li><a href="https://discord.com/invite/Ah6ZEJyTDp" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Discord Server</a></li>
                  <li><a href="https://twitter.com/unlockProtocol" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Twitter</a></li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
