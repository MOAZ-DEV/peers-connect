import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { useWebRTC } from "../provider/WebRTCProvider";

export const Video = {
    LocalStram: () => {
        const localVideoRef = useRef(null);
        const { localStream, startWebcam } = useWebRTC();

        useEffect(() => {
            if (localVideoRef.current && localStream) {
                localVideoRef.current.srcObject = localStream;
            }
        }, [localStream]);

        return <div className="flex items-center justify-center aspect-auto min-h-72 max-h-fit w-96 max-w-full border border-[#ffffff12] bg-[#ffffff07] rounded">
            {
                localStream ?
                    <video ref={localVideoRef} autoPlay playsInline className="h-fit w-full object-cover rounded bg-[#80808013] transition-all" />
                    : <Button variant="secondary" onClick={startWebcam}>Start Streaming</Button>
            }
        </div>
    },
    RemoteStream: () => {
        const remoteVideoRef = useRef(null);
        const { remoteStream } = useWebRTC();


        useEffect(() => {
            if (remoteVideoRef.current && remoteStream) {
                remoteVideoRef.current.srcObject = remoteStream;
            }
        }, [remoteStream]);

        return remoteStream &&
            <div className="flex items-center justify-center aspect-auto min-h-72 max-h-fit w-96 max-w-full border border-[#ffffff12] bg-[#ffffff07] rounded">
                <video ref={remoteVideoRef} autoPlay playsInline className="h-fit w-full object-cover rounded bg-[#80808013] transition-all" />
            </div>
    }
}