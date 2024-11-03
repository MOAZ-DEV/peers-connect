import { useState, createContext, useContext, Dispatch, SetStateAction } from "react";

// Define a type for our user state and context
type UserStateContextType<T> = [T, Dispatch<SetStateAction<T>>];

// Create the user state context
function createUserState<T>(defaultValue: T) {
  const UserStateContext = createContext<UserStateContextType<T> | undefined>(undefined);

  const UserStateProvider = ({ children }: { children: React.ReactNode }) => {
    const state = useState<T>(defaultValue);
    return <UserStateContext.Provider value={state}>{children}</UserStateContext.Provider>;
  };

  // Custom hook to access user state
  const useUserState = (): UserStateContextType<T> => {
    const context = useContext(UserStateContext);
    if (!context) {
      throw new Error("useUserState must be used within a UserStateProvider");
    }
    return context;
  };

  return { UserStateProvider, useUserState };
}

export default createUserState;
