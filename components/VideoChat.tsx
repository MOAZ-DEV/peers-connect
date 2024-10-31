// components/VideoChat.tsx
import { useEffect, useRef, useState } from 'react';

interface VideoChatProps {
  isCaller: boolean; // True if this peer is the caller
  offer?: RTCSessionDescriptionInit; // Offer from the caller (for the receiver)
}

const VideoChat: React.FC<VideoChatProps> = ({ isCaller, offer }) => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);
  const remoteStream = useRef<MediaStream>(new MediaStream());

  useEffect(() => {
    // Initialize Peer Connection
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun1.l.google.com:19302' }],
    });

    // Handle incoming tracks from the remote peer
    pc.ontrack = (event) => {
      remoteStream.current.addTrack(event.track);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream.current;
      }
      console.log('Received remote track:', event.track);
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // Implement signaling logic to send candidate to the other peer
        console.log('Sending ICE candidate:', event.candidate);
      }
    };

    setPc(pc);

    // Cleanup on unmount
    return () => {
      pc.close();
    };
  }, []);

  const startLocalStream = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('getUserMedia not supported on this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      stream.getTracks().forEach((track) => pc?.addTrack(track, stream));

      if (isCaller && pc) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        // Send the offer to the other peer (implement signaling logic here)
        console.log('Sending offer:', offer);
      }
    } catch (err) {
      console.error('Error accessing media devices.', err);
    }
  };

  const setRemoteDescription = async () => {
    if (offer && pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      // Send the answer back to the caller (implement signaling logic here)
      console.log('Sending answer:', answer);
    }
  };

  useEffect(() => {
    if (isCaller) {
      startLocalStream();
    } else {
      setRemoteDescription();
    }
  }, [isCaller, offer, pc]);

  return (
    <div className="flex flex-col items-center">
      <video ref={localVideoRef} autoPlay muted className="w-full max-w-sm" />
      <video ref={remoteVideoRef} autoPlay className="w-full max-w-sm" />
      {!isCaller && (
        <button onClick={startLocalStream} className="mt-4 bg-blue-500 text-white p-2 rounded">
          Start Webcam
        </button>
      )}
    </div>
  );
};

export default VideoChat;
