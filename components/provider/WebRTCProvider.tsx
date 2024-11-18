import React, { createContext, useContext, useEffect, useRef } from "react";
import { useAnswerCall } from "@/hooks/use-answer-call";
import { useCreateCall } from "@/hooks/use-create-call";
import { useLocalStream } from "@/hooks/use-local-stream";

interface WebRTCContextType {
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    startWebcam: () => Promise<void>;
    createCall: () => Promise<void>;
    answerCall: (callId: string) => Promise<void>;
    callId: string | null;
    PcRef: React.MutableRefObject<RTCPeerConnection | null>;
}

const WebRTCContext = createContext<WebRTCContextType | null>(null);

export const WebRTCProvider = ({ children }) => {
    const PcRef = useRef<RTCPeerConnection | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && "RTCPeerConnection" in window) {
            const pc = new RTCPeerConnection({
                iceServers: [
                    { urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"] },
                ],
                iceCandidatePoolSize: 10,
            });
            PcRef.current = pc;

            return () => {
                pc.close();
                PcRef.current = null;
            };
        } else {
            console.error("RTCPeerConnection is not supported in this environment.");
        }
    }, []);

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

export const useWebRTC = (): WebRTCContextType => {
    const context = useContext(WebRTCContext);
    if (!context) {
        throw new Error("useWebRTC must be used within a WebRTCProvider");
    }
    return context;
};
