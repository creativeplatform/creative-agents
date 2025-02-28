"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Address } from "@coinbase/onchainkit/identity";

export default function Home() {
  return (
    <div className="container mx-auto py-12 px-4 bg-black text-white min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">The Creative Platform</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          A blockchain-based membership platform for creators, brands, and
          investors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Creator NFT</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Exclusive membership for content creators and artists. Unlock
              special tools and resources to help you grow your creative
              business.
            </p>
            <p className="text-sm text-gray-400 mb-2">
              Contract:&nbsp;
              <Link
                href="https://basescan.org/address/0xf7c4cd399395d80f9d61fde833849106775269c6"
                className="text-sm text-gray-400 mb-2"
              >
                <Address address="0xf7c4cd399395d80f9d61fde833849106775269c6" />
              </Link>
            </p>
            <p className="text-sm text-gray-400">
              Network:&nbsp;
              <Link
                href="https://basescan.org/address/0xf7c4cd399395d80f9d61fde833849106775269c6"
                target="_blank"
                className="text-blue-400 hover:text-blue-300"
              >
                Base Mainnet
              </Link>
            </p>
            <div className="mt-4">
              <Link
                href="https://creativeplatform.xyz/blog/creator-membership"
                target="_blank"
                className="text-blue-400 hover:text-blue-300"
              >
                Learn more →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Brand NFT</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              For brands looking to collaborate with creators. Get access to our
              network of talented creators and exclusive partnership
              opportunities.
            </p>
            <p className="text-sm text-gray-400 mb-2">
              Contract:&nbsp;
              <Address address="0x9c3744c96200a52d05a630d4aec0db707d7509be" />
            </p>
            <p className="text-sm text-gray-400">
              Network:&nbsp;
              <Link
                href="https://basescan.org/address/0x9c3744c96200a52d05a630d4aec0db707d7509be"
                target="_blank"
                className="text-blue-400 hover:text-blue-300"
              >
                Base Mainnet
              </Link>
            </p>
            <div className="mt-4">
              <Link
                href="https://creativeplatform.xyz/blog/brand-membership"
                target="_blank"
                className="text-blue-400 hover:text-blue-300"
              >
                Learn more →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Investor NFT</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              For investors interested in supporting the creative economy. Get
              early access to promising projects and investment opportunities.
            </p>
            <p className="text-sm text-gray-400 mb-2">
              Contract:&nbsp;
              <Address address="0x13b818daf7016b302383737ba60c3a39fef231cf" />
            </p>
            <p className="text-sm text-gray-400">
              Network:&nbsp;
              <Link
                href="https://basescan.org/address/0x13b818daf7016b302383737ba60c3a39fef231cf"
                className="text-sm text-gray-400 mb-2 underline"
              >
                Base Mainnet
              </Link>
            </p>
            <div className="mt-4">
              <Link
                href="https://creativeplatform.xyz/blog/investor-membership"
                target="_blank"
                className="text-blue-400 hover:text-blue-300"
              >
                Learn more →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gray-900 rounded-lg p-8 mb-12 border border-gray-800">
        <h2 className="text-2xl font-bold mb-4">Verify Your NFT Membership</h2>
        <p className="mb-6 text-gray-300">
          Connect your wallet to check if you own any Creative Agents NFTs. Our
          platform uses Unlock Protocol to verify your membership status.
        </p>
        <div className="flex justify-center mt-5">
          <Link href="/nft-check">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 border-2 p-2"
            >
              Check NFT Ownership
            </Button>
          </Link>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Powered by Unlock Protocol</h2>
        <p className="text-gray-400 mb-6">
          We use Unlock Protocol to manage membership NFTs on the Base
          blockchain network. Our integration ensures secure and efficient
          verification of NFT ownership.
        </p>
      </div>
    </div>
  );
}
