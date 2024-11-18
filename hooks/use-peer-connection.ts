import { useEffect, useState, useRef } from "react";

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

export const usePeerConnection = () => {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null); 
  const PcRef = useRef<RTCPeerConnection | null>(null); 

  useEffect(() => {
    const pc = new RTCPeerConnection(servers); 
    const newRemoteStream = new MediaStream();
    setRemoteStream(newRemoteStream);

    // Set the ref to the created RTCPeerConnection
    PcRef.current = pc;

    // Handle the ontrack event
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        event.streams[0].getTracks().forEach((track) => {
          newRemoteStream.addTrack(track);
          console.log(track)
        });
      }
    };

    return () => {
      PcRef.current?.close();
      PcRef.current = null;
    };
  }, []);

  return { PcRef, remoteStream };
};
