import React, { createContext, useContext } from "react";
import { useAnswerCall } from "@/hooks/use-answer-call";
import { useCreateCall } from "@/hooks/use-create-call";
import { useLocalStream } from "@/hooks/use-local-stream";
import { usePeerConnection } from "@/hooks/use-peer-connection";

const WebRTCContext = createContext(null);

export const WebRTCProvider = ({ children }) => {

    const { PcRef, remoteStream } = usePeerConnection();
    const { localStream, startWebcam } = useLocalStream(PcRef);
    const { createCall, callId } = useCreateCall(PcRef);
    const { answerCall } = useAnswerCall(PcRef);

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

export const useWebRTC = () => useContext(WebRTCContext);
