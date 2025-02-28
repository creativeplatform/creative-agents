"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SITE_LOGO } from "@/lib/context";
import OnchainWallet from "./OnchainWallet";

export default function SimpleNavigation() {
  return (
    <nav className="bg-gray-900 text-white p-4 border-b border-gray-800">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        {/* Logo on the left */}
        <div className="flex-shrink-0 mb-4 sm:mb-0">
          <Link href="/" className="mr-6 lg:flex" prefetch={false} passHref>
            <Image
              style={{
                width: "80px",
                height: "auto",
              }}
              src={SITE_LOGO}
              alt="Creative Logo"
              width={80}
              height={80}
              priority
            />
            <span className="mx-auto my-auto">
              <h1
                className="text-lg"
                style={{ fontFamily: "ConthraxSb-Regular , sans-serif" }}
              >
                CREATIVE{" "}
                <span
                  className="ml-1 text-xl font-bold text-red-500"
                  style={{ fontFamily: "sans-serif" }}
                >
                  Memberships
                </span>
              </h1>
            </span>
          </Link>
        </div>

        {/* Navigation links in the center */}
        <div className="flex space-x-6 mb-5">
          <Link href="/paywall-demo" className="hover:text-blue-400">
            PURCHASE
          </Link>
          <Link href="/nft-check" className="hover:text-blue-400">
            VERIFY
          </Link>
        </div>

        {/* Wallet connection on the right */}
        <div>
          <OnchainWallet />
        </div>
      </div>
    </nav>
  );
}
