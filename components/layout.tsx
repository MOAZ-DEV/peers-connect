import { PeerConnectionProvider } from "@/states/pc-connection";
import { UserStateProvider } from "@/states/user-state";
import { Toaster } from "./ui/toaster";

export default function Layout({ children }) {
    return (
        <>
            <PeerConnectionProvider>
                <UserStateProvider>
                    <main>{children}</main>
                </UserStateProvider>
            </PeerConnectionProvider>
            <Toaster />
        </>
    )
}