import { useEffect, useRef, useState } from 'react';

interface SignalingChannel {
    send: (message: any) => void;
    addEventListener: (event: string, callback: (message: any) => void) => void;
}

interface UseRemoteVideoStreamProps {
    signalingChannel: SignalingChannel | null;
}

export const useRemoteVideoStream = ({ signalingChannel }: UseRemoteVideoStreamProps) => {
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

    signalingChannel &&
        useEffect(() => {
            const configuration = {
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
            };
            const peerConnection = new RTCPeerConnection(configuration);
            peerConnectionRef.current = peerConnection;

            // Handle incoming messages from the signaling channel
            signalingChannel.addEventListener('message', async (message) => {
                if (message.offer) {
                    await peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
                    const answer = await peerConnection.createAnswer();
                    await peerConnection.setLocalDescription(answer);
                    signalingChannel.send({ answer });
                } else if (message.answer) {
                    await peerConnection.setRemoteDescription(new RTCSessionDescription(message.answer));
                } else if (message['new-ice-candidate']) {
                    await peerConnection.addIceCandidate(message['new-ice-candidate']);
                }
            });

            // Gather ICE candidates and send them to the remote peer
            peerConnection.addEventListener('icecandidate', (event) => {
                if (event.candidate) {
                    signalingChannel.send({ 'new-ice-candidate': event.candidate });
                }
            });

            // Set up remote stream when remote track is added
            peerConnection.addEventListener('track', (event) => {
                const stream = event.streams[0];
                setRemoteStream((prevStream) => {
                    if (prevStream) {
                        // If the stream already exists, just add the new track
                        stream.getTracks().forEach(track => prevStream.addTrack(track));
                        return prevStream;
                    }
                    return stream; // Set new stream if it doesn't exist
                });
            });

            return () => {
                // Cleanup on unmount
                peerConnection.close();
                setRemoteStream(null);
            };
        }, [signalingChannel]);

    return remoteStream;
};
