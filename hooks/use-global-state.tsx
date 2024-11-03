import { useState, createContext, useContext, Dispatch, SetStateAction } from "react";

// Define a type for our global state and context
type GlobalStateContextType<T> = [T, Dispatch<SetStateAction<T>>];

// Create the global state context
function createGlobalState<T>(defaultValue: T) {
  const GlobalStateContext = createContext<GlobalStateContextType<T> | undefined>(undefined);

  const GlobalStateProvider = ({ children }: { children: React.ReactNode }) => {
    const state = useState<T>(defaultValue);
    return <GlobalStateContext.Provider value={state}>{children}</GlobalStateContext.Provider>;
  };

  // Custom hook to access global state
  const useGlobalState = (): GlobalStateContextType<T> => {
    const context = useContext(GlobalStateContext);
    if (!context) {
      throw new Error("useGlobalState must be used within a GlobalStateProvider");
    }
    return context;
  };

  return { GlobalStateProvider, useGlobalState };
}

export default createGlobalState;
