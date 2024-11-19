import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    ReactNode,
    MutableRefObject,
} from "react";
import { useAnswerCall } from "@/hooks/use-answer-call";
import { useCreateCall } from "@/hooks/use-create-call";
import { useLocalStream } from "@/hooks/use-local-stream";

// Define the context type
interface WebRTCContextType {
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    startWebcam: () => Promise<void>;
    createCall: () => Promise<void>;
    answerCall: (callId: string) => Promise<void>;
    callId: string | null;
    PcRef: MutableRefObject<RTCPeerConnection | null>;
}

// Initialize the context with null
const WebRTCContext = createContext<WebRTCContextType | null>(null);

interface WebRTCProviderProps {
    children: ReactNode;
}

export const WebRTCProvider = ({ children }: WebRTCProviderProps) => {
    const PcRef = useRef<RTCPeerConnection | null>(null);

    useEffect(() => {
        // Ensure RTCPeerConnection is supported
        if (typeof window !== "undefined" && "RTCPeerConnection" in window) {
            const pc = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: 'stun:stun.l.google.com:19302', // Example STUN server
                        username: 'a014a3d3',                // ICE username
                        credential: 'ac441404c75a430228d9be110028aa47' // ICE password
                    }
                ],
                iceCandidatePoolSize: 10,
            });
            PcRef.current = pc;

            return () => {
                // Cleanup on unmount
                pc.close();
                PcRef.current = null;
            };
        } else {
            console.error("RTCPeerConnection is not supported in this environment.");
        }
    }, []);

    // Use custom hooks for WebRTC functionalities
    const { localStream, startWebcam } = useLocalStream(PcRef);
    const { createCall, callId } = useCreateCall(PcRef);
    const { answerCall, remoteStream } = useAnswerCall(PcRef);

    return (
        <WebRTCContext.Provider
            value={{
                localStream,
                remoteStream,
                startWebcam,
                createCall,
                answerCall,
                callId,
                PcRef,
            }}
        >
            {children}
        </WebRTCContext.Provider>
    );
};

// Custom hook to consume the WebRTC context
export const useWebRTC = (): WebRTCContextType => {
    const context = useContext(WebRTCContext);
    if (!context) {
        throw new Error("useWebRTC must be used within a WebRTCProvider");
    }
    return context;
};
