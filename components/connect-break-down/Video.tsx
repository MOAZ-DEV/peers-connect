import { ComponentProps, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { useWebRTC } from "../provider/WebRTCProvider";

interface StramDivProps extends ComponentProps<'div'> {
  className?: string;
}

const Video = {
  LocalStream: ({ className }: StramDivProps) => {
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
      <div className={
        "flex items-center justify-center aspect-auto min-h-72 max-h-fit w-96 max-w-[100vw] max-sm:w-[calc(100vw-24px)] border border-[#ffffff12] bg-[#ffffff07] rounded"
        + className
      }>
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

  RemoteStream: ({ className }: StramDivProps) => {
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const { remoteStream } = useWebRTC();

    useEffect(() => {
      if (remoteVideoRef.current && remoteStream !== null) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    }, [remoteStream]);

    return remoteStream && (
      <div className={
        "flex items-center justify-center aspect-auto min-h-72 max-h-fit w-96 max-w-[100vw] max-sm:w-full border border-[#ffffff12] bg-[#ffffff07] rounded "
        + className
      }>
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="h-fit w-full object-cover rounded bg-[#80808013] transition-all"
        />
      </div>
    );
  },
};

export const VideoStrams = () => {

  return (
    <div className={
      `flex flex-row gap-2 relative ` +
      `max-md:flex-col`
    }>
      <Video.LocalStream className=" max-md:absolute max-md:top-4 max-md:left-4 max-md:z-50 max-md:!max-w-32 max-md:!min-w-32 max-md:!min-h-min max-md:border max-md:border-[#ffffff75]" />
      <Video.RemoteStream className="" />
    </div>
  )
}