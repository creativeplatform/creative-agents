import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownBasename,
  WalletDropdownFundLink,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import { useState, useEffect } from "react";

export function WalletComponents() {
  // Check if we're on mobile or desktop
  const [isDesktop, setIsDesktop] = useState(true);

  // Effect to detect screen size changes
  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 768); // 768px is the md breakpoint in Tailwind
    };
    
    // Check on initial load
    checkIfDesktop();
    
    // Set up event listener for window resize
    window.addEventListener('resize', checkIfDesktop);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfDesktop);
  }, []);

  return (
    <div className="flex justify-end">
      <Wallet>
        <ConnectWallet>
          <Avatar className={`${isDesktop ? 'h-6 w-6' : 'h-5 w-5'}`} />
          {isDesktop && <Name />}
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address />
            <EthBalance />
          </Identity>
          <WalletDropdownBasename />
          <WalletDropdownLink icon="wallet" href="https://keys.coinbase.com">
            Wallet
          </WalletDropdownLink>
          <WalletDropdownFundLink />
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </div>
  );
}
