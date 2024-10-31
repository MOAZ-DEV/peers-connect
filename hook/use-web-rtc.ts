import { useEffect, useState } from "react";

export const useWebRTC = () => {
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [pc, setPc] = useState<RTCPeerConnection | null>(null); // Initialize as null

    useEffect(() => {
        const peerConnection = new RTCPeerConnection();
        setPc(peerConnection);

        const handleTrackEvent = (event: RTCTrackEvent) => {
            const stream = new MediaStream();
            event.streams[0].getTracks().forEach(track => {
                stream.addTrack(track);
            });
            setRemoteStream(stream);
        };

        peerConnection.ontrack = handleTrackEvent;

        return () => {
            peerConnection.close(); // Clean up the connection on unmount
        };
    }, []);

    const call = async (localStream: MediaStream) => {
        if (!pc) return; // Ensure pc is initialized

        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

        pc.onicecandidate = event => {
            if (event.candidate) {
                console.log('New ICE candidate:', event.candidate);
                // Send the candidate through your signaling method
            }
        };

        const offerDescription = await pc.createOffer();
        await pc.setLocalDescription(offerDescription);
        console.log('Offer sent:', offerDescription);
        // Send the offer through your signaling method
    };

    const answer = async (offerDescription: RTCSessionDescriptionInit) => {
        if (!pc) return; // Ensure pc is initialized

        await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));
        const answerDescription = await pc.createAnswer();
        await pc.setLocalDescription(answerDescription);
        console.log('Answer sent:', answerDescription);
        // Send the answer through your signaling method
    };

    return {
        remoteStream,
        call,
        answer,
    };
};
