import { useState, useEffect } from "react";

// TypeScript support for the peer connection ref
interface PCRef {
  current: RTCPeerConnection | null;
}

export const useLocalStream = (pcRef: PCRef) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  // Start webcam function with customizable constraints
  const startWebcam = async (constraints: MediaStreamConstraints = { video: true, audio: true }) => {
    try {
      // Request media stream from the user's webcam
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);

      // Add tracks to the peer connection if it exists
      stream.getTracks().forEach((track) => {
        if (pcRef.current) {
          pcRef.current.addTrack(track, stream);
        }
      });
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  // Stop webcam function, which stops all media tracks
  const stopWebcam = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
      setLocalStream(null);
    }
  };

  // Cleanup the stream when component is unmounted or webcam is stopped
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [localStream]);

  return { localStream, startWebcam, stopWebcam };
};
