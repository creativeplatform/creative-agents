"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import PaywallComponent from "@/app/components/PaywallComponent";
import { NFT_CONTRACTS } from "@/lib/unlock";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

export default function PaywallDemo() {
  const { address, isConnected } = useAccount();
  const [purchaseHash, setPurchaseHash] = useState<string | null>(null);

  const handlePurchaseSuccess = (hash: string) => {
    console.log("Purchase successful with hash:", hash);
    setPurchaseHash(hash);
  };

  return (
    <div className="container mx-auto py-16 pb-32">
      <h1 className="text-3xl font-bold mb-8">Unlock Protocol Paywall Demo</h1>

      {!isConnected ? (
        <Alert className="mb-6 relative z-10">
          <AlertTitle>Connect your wallet</AlertTitle>
          <AlertDescription>
            Please connect your wallet using the button in the navigation bar to
            interact with this application.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="mb-6 bg-green-50 relative z-10">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-black">Connected</AlertTitle>
          <AlertDescription className="text-black">
            Wallet connected: {address}
          </AlertDescription>
        </Alert>
      )}

      {purchaseHash && (
        <Alert className="mb-6 bg-green-50 border-green-200 relative z-10">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-black">Purchase Successful!</AlertTitle>
          <AlertDescription className="text-black">
            Transaction hash: {purchaseHash}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="brand">
        <TabsList className="mb-4">
          <TabsTrigger value="brand">Brand Membership</TabsTrigger>
          <TabsTrigger value="investor">Investor Membership</TabsTrigger>
          <TabsTrigger value="creator">Creator Membership</TabsTrigger>
        </TabsList>

        <TabsContent value="brand">
          <Card>
            <CardHeader>
              <CardTitle>Brand Membership</CardTitle>
              <CardDescription>
                Access exclusive brand resources and features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Benefits:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Access to brand templates.</li>
                  <li>Priority customer support.</li>
                  <li>Monthly brand strategy sessions.</li>
                </ul>
              </div>

              <PaywallComponent
                lockAddress={NFT_CONTRACTS.BRAND}
                title="Brand Membership Access"
                onPurchaseSuccess={handlePurchaseSuccess}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investor">
          <Card>
            <CardHeader>
              <CardTitle>Investor Membership</CardTitle>
              <CardDescription>
                Gain access to investor-only opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Benefits:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Early access to new projects.</li>
                  <li>Quarterly investment reports.</li>
                  <li>Exclusive investment community.</li>
                </ul>
              </div>

              <PaywallComponent
                lockAddress={NFT_CONTRACTS.INVESTOR}
                title="Investor Membership Access"
                onPurchaseSuccess={handlePurchaseSuccess}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creator">
          <Card>
            <CardHeader>
              <CardTitle>Creator Membership</CardTitle>
              <CardDescription>
                Tools and resources for content creators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Benefits:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Creator toolkit and resources.</li>
                  <li>Collaboration opportunities.</li>
                  <li>Featured promotion of your work.</li>
                </ul>
              </div>

              <PaywallComponent
                lockAddress={NFT_CONTRACTS.CREATOR}
                title="Creator Membership Access"
                onPurchaseSuccess={handlePurchaseSuccess}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
