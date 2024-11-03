// globalState.ts
import createUserState from "@/hooks/use-user-state";

export interface UserData {
    name?: string;
    CallCode?: string;
    hasCallCode: boolean | null;
}

// Set default values for the global state
const defaultUserData: UserData = {
    hasCallCode: null
};



// Create the global state with default values
export const { UserStateProvider, useUserState } = createUserState(defaultUserData);
