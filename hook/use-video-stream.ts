import { useEffect, useState } from "react";

export const useVideoStream = () => {
    const [localStream, setLocalStream] = useState<null | MediaStream>(null);

    const
        servers = {
            iceServers: [{ urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'], },],
            iceCandidatePoolSize: 10,
        },
        pc = new RTCPeerConnection(servers);

    useEffect(() => {
        const getMediaStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);

                stream.getTracks().forEach((track: MediaStreamTrack) => {
                    pc.addTrack(track, stream);
                });
            } catch (error) {
                console.error("Error accessing media devices.", error);
            }
        };

        getMediaStream();

        return () => {
            localStream?.getTracks().forEach(track => track.stop());
        };
    }, []);

    return {
        WebcamVideoSrc: localStream
    };
};
