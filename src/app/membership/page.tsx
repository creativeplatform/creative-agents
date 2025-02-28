"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { checkCreativeNFTOwnership } from "../../lib/unlock";
import { LockManager } from "../components/LockManager";

export default function MembershipPage() {
  const { address, isConnected } = useAccount();
  const [isChecking, setIsChecking] = useState(false);
  const [membershipStatus, setMembershipStatus] = useState({
    brand: false,
    investor: false,
    creator: false,
    ownsAny: false,
  });

  useEffect(() => {
    if (address && isConnected) {
      checkMembership(address);
    }
  }, [address, isConnected]);

  const checkMembership = async (walletAddress: string) => {
    if (!walletAddress) return;

    setIsChecking(true);
    try {
      const status = await checkCreativeNFTOwnership(walletAddress);
      setMembershipStatus({
        brand: status.BRAND,
        investor: status.INVESTOR,
        creator: status.CREATOR,
        ownsAny: status.anyNFT,
      });
    } catch (error) {
      console.error("Error checking membership status:", error);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Creative Memberships</h1>

          <div className="mb-8">
            <p className="text-xl mb-4">
              Creative memberships are powered by NFTs on the Base network. Own
              one of our NFTs to unlock premium features and content.
            </p>

            <Link
              href="/"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>

          {/* Membership Status */}
          <LockManager />

          {/* Membership Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Creative Brand</h3>
              <p className="mb-4">
                Access to exclusive brand assets and templates.
              </p>
              <div
                className={`text-sm font-medium px-3 py-1 rounded-full inline-block ${
                  membershipStatus.brand
                    ? "bg-green-900 text-green-300"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {membershipStatus.brand ? "Active" : "Not Owned"}
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Creative Investor</h3>
              <p className="mb-4">
                Early access to new features and investment opportunities.
              </p>
              <div
                className={`text-sm font-medium px-3 py-1 rounded-full inline-block ${
                  membershipStatus.investor
                    ? "bg-green-900 text-green-300"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {membershipStatus.investor ? "Active" : "Not Owned"}
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Creative Creator</h3>
              <p className="mb-4">
                Premium tools and support for content creators.
              </p>
              <div
                className={`text-sm font-medium px-3 py-1 rounded-full inline-block ${
                  membershipStatus.creator
                    ? "bg-green-900 text-green-300"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {membershipStatus.creator ? "Active" : "Not Owned"}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          {!membershipStatus.ownsAny && !isChecking && isConnected && (
            <div className="mt-12 bg-blue-900 p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-4">
                Unlock Full Access Today
              </h2>
              <p className="mb-6">
                Get special access to premium features with our NFT memberships.
              </p>
              <a
                href="https://app.unlock-protocol.com/checkout?id=8be2d03a-2bfa-4bdf-aeb0-b84b3a886e7f"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg font-medium transition"
              >
                Get Your Membership NFT
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
