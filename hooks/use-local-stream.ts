import { useState } from "react";

export const useLocalStream = (pcRef) => {
  const [localStream, setLocalStream] = useState(null);

  const startWebcam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);

    stream.getTracks().forEach((track) => {
      pcRef.current?.addTrack(track, stream);
    });
  };

  return { localStream, startWebcam };
};
