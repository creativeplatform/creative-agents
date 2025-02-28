// This file provides ethers v5 compatibility exports for unlock-js
import { ethers } from 'ethers';

// Create a wrapper ethers object that makes parseUnits available directly
const wrappedEthers = {
  ...ethers,
  parseUnits: ethers.utils.parseUnits,
  formatUnits: ethers.utils.formatUnits,
  getAddress: ethers.utils.getAddress
};

// Export the wrapped ethers as default and named export
export default wrappedEthers;
export { wrappedEthers as ethers };

// Explicitly export parseUnits and other common utils
export const parseUnits = ethers.utils.parseUnits;
export const formatUnits = ethers.utils.formatUnits;
export const getAddress = ethers.utils.getAddress;
export const keccak256 = ethers.utils.keccak256;
export const toUtf8Bytes = ethers.utils.toUtf8Bytes;
export const defaultAbiCoder = ethers.utils.defaultAbiCoder;

// Re-export providers
export const providers = ethers.providers;

// Re-export Contract
export const Contract = ethers.Contract;

// Re-export BigNumber
export const BigNumber = ethers.BigNumber;

// Re-export utils
export const utils = ethers.utils;
