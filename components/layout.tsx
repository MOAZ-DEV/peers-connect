import { PeerConnectionProvider } from "@/states/pc-connection";
import { Toaster } from "./ui/toaster";
import { WebRTCProvider } from "./provider/WebRTCProvider";

export default function Layout({ children }) {
    return (
        <>
            <PeerConnectionProvider>
                <WebRTCProvider>
                    <main>{children}</main>
                </WebRTCProvider>
            </PeerConnectionProvider>
            <Toaster />
        </>
    )
}