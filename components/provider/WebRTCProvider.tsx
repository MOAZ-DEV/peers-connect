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
    remoteStream: MediaStream | null; // Add this to the context
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
    const [remoteStream, setRemoteStream] = React.useState<MediaStream | null>(null); // Use state to store the remote stream

    useEffect(() => {
        // Ensure RTCPeerConnection is supported
        if (typeof window !== "undefined" && "RTCPeerConnection" in window) {
            const pc = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: 'stun:stun.l.google.com:19302',
                    },
                    {
                        urls: 'stun:stun.voipbuster.com'
                    }
                ],
                iceCandidatePoolSize: 10,
            });

            PcRef.current = pc;

            // Handle remote stream
            pc.ontrack = (event) => {
                if (event.streams && event.streams[0]) {
                    setRemoteStream(event.streams[0]); 
                }
            };

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
    const { answerCall } = useAnswerCall(PcRef);

    return (
        <WebRTCContext.Provider
            value={{
                localStream,
                remoteStream, // Provide remoteStream here
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
