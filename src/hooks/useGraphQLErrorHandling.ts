import { useState, useCallback } from 'react';

/**
 * Custom hook for handling GraphQL errors with user-friendly messages
 * @returns Object containing error state and handler functions
 */
export function useGraphQLErrorHandling() {
  const [uiError, setUiError] = useState<string | null>(null);
  
  const handleError = useCallback((error: unknown): string => {
    // Log the error for debugging
    console.error("GraphQL Error:", error);
    
    // Format a user-friendly message
    let errorMessage = "An unexpected error occurred. Please refresh the page and try again.";
    
    if (error instanceof Error) {
      if (error.message.includes("Network error")) {
        errorMessage = "Unable to connect to the network. Please check your connection.";
      } else if (error.message.includes("rate limit")) {
        errorMessage = "Too many requests. Please try again in a moment.";
      } else if (error.message.includes("subgraph")) {
        errorMessage = "There was an issue with the NFT data provider. Please try again later.";
      } else {
        errorMessage = "An error occurred while checking your NFT ownership. Please try again later.";
      }
    }
    
    // Update the UI error state
    setUiError(errorMessage);
    
    // Return the error message so callers can use it directly
    return errorMessage;
  }, []); // No dependencies needed as we're not using any external values
  
  return { 
    uiError, 
    handleError, 
    clearError: () => setUiError(null) 
  };
}
