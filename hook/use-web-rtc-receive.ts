import { useEffect, useState } from "react";

export const useWebRTCReceive = () => {
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [pc, setPc] = useState<RTCPeerConnection | null>(null);

    useEffect(() => {
        // Ensure this runs only in the browser
        if (typeof window !== "undefined") {
            const peerConnection = new RTCPeerConnection();
            setPc(peerConnection);

            peerConnection.ontrack = (event) => {
                const stream = new MediaStream();
                event.streams[0].getTracks().forEach(track => {
                    stream.addTrack(track);
                });
                setRemoteStream(stream);
            };

            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log('New ICE candidate:', event.candidate);
                    // Handle sending this candidate to the other peer
                }
            };

            return () => {
                peerConnection.close(); // Clean up on unmount
            };
        }
    }, []);

    return {
        remoteStream,
        pc,
    };
};
