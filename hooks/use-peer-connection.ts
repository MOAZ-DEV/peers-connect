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
  const [remoteStream, setRemoteStream] = useState(null);
  const PcRef = useRef(null);

  useEffect(() => {
    try {
      PcRef.current = new RTCPeerConnection(servers);
      const newRemoteStream = new MediaStream();
      setRemoteStream(newRemoteStream);

      PcRef.current.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          event.streams[0].getTracks().forEach((track) => {
            newRemoteStream.addTrack(track);
          });
        }
      };
    } catch (error) {
      console.error("Error creating RTCPeerConnection:", error);
    }

    return () => {
      PcRef.current?.close();
    };
  }, []);


  return { PcRef, remoteStream };
};
