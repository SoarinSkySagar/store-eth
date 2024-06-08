"use client"

import { useWeb3 } from "@/context/Web3Context";
import { useState, useEffect } from "react";
import Link from 'next/link';

export default function Navbar() {

    const { connectedAccount, checkBalance} = useWeb3();
    const [mybalance, setMyBalance] = useState(null);
  
    useEffect(() => {
      if (connectedAccount) {
        async function fetchBalance() {
          const balance = await checkBalance();
          setMyBalance(balance)
          console.log(mybalance, 'pagejs balance')
          console.log(connectedAccount, 'pagejs address')
        }
        fetchBalance();
      }
    }, [connectedAccount, checkBalance, mybalance]);
    
    return (
        <nav className="bg-gray-800 p-4 flex justify-between items-center text-white">
      <div className="flex items-center">
        <span className="font-bold mr-4">Balance: {mybalance} ETH</span>
      </div>
      <div className="flex space-x-4">
        <Link href="/" legacyBehavior>
          <a className={`px-3 py-2 rounded-md text-sm font-bold mr-4 `}>
            Deposit
          </a>
        </Link>
        <Link href="/withdraw" legacyBehavior>
          <a className={`px-3 py-2 rounded-md text-sm font-bold mr-4 `}>
            Withdraw
          </a>
        </Link>
      </div>
      <div className="flex items-center">
        <span className="font-bold">{connectedAccount}</span>
      </div>
    </nav>
    )
}
