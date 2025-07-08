"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NetworkType, getDefaultNetwork } from '@/lib/network-config';

interface NetworkContextType {
  currentNetwork: NetworkType;
  setNetwork: (network: NetworkType) => void;
  toggleNetwork: () => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

interface NetworkProviderProps {
  children: ReactNode;
}

export function NetworkProvider({ children }: NetworkProviderProps) {
  const [currentNetwork, setCurrentNetwork] = useState<NetworkType>(getDefaultNetwork());

  useEffect(() => {
    try {
      const savedNetwork = localStorage.getItem('escrow-viewer-network') as NetworkType;
      if (savedNetwork && (savedNetwork === 'testnet' || savedNetwork === 'mainnet')) {
        setCurrentNetwork(savedNetwork);
      }
    } catch (error) {
      console.warn('Failed to access localStorage:', error);
  
    }
  }, []);

  const setNetwork = (network: NetworkType) => {
    setCurrentNetwork(network);
    try {
      localStorage.setItem('escrow-viewer-network', network);
    } catch (error) {
      console.warn('Failed to save network preference:', error);
    }
  };

  const toggleNetwork = () => {
    const newNetwork = currentNetwork === 'testnet' ? 'mainnet' : 'testnet';
    setNetwork(newNetwork);
  };

  return (
    <NetworkContext.Provider value={{ currentNetwork, setNetwork, toggleNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
} 