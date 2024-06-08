"use client"

import { createContext, useContext, useEffect, useState } from "react"
import Web3 from "web3"

const abi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "Deposited",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "Withdrawn",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_newOwner",
          "type": "address"
        }
      ],
      "name": "changeOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "checkBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "deposit",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
]

const BlockchainContext = createContext()

export const useWeb3 = () => useContext(BlockchainContext)

export function Web3Provider({children}) {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [connectedAccount, setConnectedAccount] = useState(null);

    useEffect(() => {
        async function initializeWeb3() {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                await window.ethereum.request({ method: 'eth_requestAccounts' });

                const accounts = await web3Instance.eth.getAccounts();
                const contractAddress = '0xcdca0a0E330bc3C2c8D74f15BF783321087E141f';

                const contractInstance = new web3Instance.eth.Contract(abi, contractAddress);

                setWeb3(web3Instance);
                setContract(contractInstance);
                setConnectedAccount(accounts[0]);
                console.log(connectedAccount, 'contextjs address')

            } else {
                alert("Please install MetaMask!")
            }
        }

        initializeWeb3()
    }, [connectedAccount])

    async function connectMetamask() {
        if (window.ethereum) {
            const web3Instance = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3Instance.eth.getAccounts();
            setConnectedAccount(accounts[0]);
          } else {
            alert('Please install Metamask');
          }
    }

    async function checkBalance() {
        if (contract) {
            const balance = await contract.methods.checkBalance().call();
            console.log(web3.utils.fromWei(balance, 'ether'), 'ETH: contextjs balance')
            return web3.utils.fromWei(balance, 'ether')
        }
        return null;
    }

    async function deposit(amount) {
        if (contract && connectedAccount) {
            await contract.methods.deposit().send({
                from: connectedAccount,
                value: Web3.utils.toWei(amount, 'ether')
            });
        }
    }

    async function withdraw(amount) {
        if (contract && connectedAccount) {
            const amountInWei = web3.utils.toWei(amount.toString(), 'ether');
            await contract.methods.withdraw(amountInWei).send({
                from: connectedAccount
            })
        }
    }

    async function changeOwner(address) {
        if (contract && connectedAccount) {
            await contract.methods.changeOwner(address).send({
                from: connectedAccount
            })
        }
    }

    return (
        <BlockchainContext.Provider value={{connectedAccount, connectMetamask, checkBalance, deposit, withdraw, changeOwner}}>
            {children}
        </BlockchainContext.Provider>
    )
}