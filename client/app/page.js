"use client"

import './globals.css'
import { useWeb3 } from "@/context/Web3Context";
import { useState, useEffect } from "react";

export default function Home() {
  const { connectedAccount, connectMetamask, checkBalance, deposit, withdraw, changeOwner } = useWeb3();
  const [mybalance, setMyBalance] = useState(null);
  const [inputValue, setInputValue] = useState("");

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

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const depositEth = async () => {
    await deposit(inputValue);
    const ckbalance = await checkBalance()
    setMyBalance(ckbalance)
    console.log(mybalance, 'after deposit')
  }

  return (
      <div className="min-h-screen bg-papaya-whip flex items-center justify-center">
      <div className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Deposit</h1>
        <input
          type="number"
          placeholder="Enter amount"
          value={inputValue}
          onChange={handleInputChange}
          className="border border-gray-300 p-2 rounded mb-4 w-full"
        />
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700" onClick={depositEth}>
          Submit
        </button>
      </div>
    </div>
  )
}
