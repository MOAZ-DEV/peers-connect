import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { useWebRTC } from "../provider/WebRTCProvider";

export const Video = {
  LocalStream: () => {
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const { localStream, startWebcam } = useWebRTC();
    const [isLoading, setIsLoading] = useState(false);

    const handleStartWebcam = async () => {
      setIsLoading(true);
      try {
        await startWebcam();
      } catch (error) {
        console.error("Failed to start webcam:", error);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      if (localVideoRef.current && localStream) {
        localVideoRef.current.srcObject = localStream;
      }
    }, [localStream]);

    return (
      <div className="flex items-center justify-center aspect-auto min-h-72 max-h-fit w-96 max-w-[100vw] max-sm:w-full border border-[#ffffff12] bg-[#ffffff07] rounded">
        {localStream ? (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            className="h-fit w-full object-cover rounded bg-[#80808013] transition-all"
          />
        ) : isLoading ? (
          <p className="text-white">Starting webcam...</p>
        ) : (
          <Button variant="secondary" onClick={handleStartWebcam}>
            Start Streaming
          </Button>
        )}
      </div>
    );
  },

  RemoteStream: () => {
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const { remoteStream } = useWebRTC();

    useEffect(() => {
      if (remoteVideoRef.current && remoteStream !== null) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    }, [remoteStream]);

    return (
      <div className="flex items-center justify-center aspect-auto min-h-72 max-h-fit w-96 max-w-[100vw] max-sm:w-full border border-[#ffffff12] bg-[#ffffff07] rounded">
        {remoteStream !== null ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="h-fit w-full object-cover rounded bg-[#80808013] transition-all"
          />
        ) : (
          <p className="text-white">Waiting for remote stream...</p>
        )}
      </div>
    );
  },
};
