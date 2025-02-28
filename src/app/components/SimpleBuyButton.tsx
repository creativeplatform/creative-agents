"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SimpleBuyButtonProps {
  className?: string;
  label?: string;
  amount?: string;
  tokenSymbol?: string;
}

export default function SimpleBuyButton({
  className,
  label = "Buy Tokens",
  amount = "0.01",
  tokenSymbol = "ETH",
}: SimpleBuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyClick = () => {
    setIsLoading(true);
    console.log(`Buying ${amount} ${tokenSymbol}`);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Purchase simulation complete");
      setIsLoading(false);
      // You could redirect to a success page or show a success message
      alert(`Successfully simulated purchase of ${amount} ${tokenSymbol}!`);
    }, 2000);
  };

  return (
    <Button
      onClick={handleBuyClick}
      className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md border border-[#EC407A] ${className}`}
      disabled={isLoading}
    >
      {isLoading ? "Processing..." : label}
    </Button>
  );
}
