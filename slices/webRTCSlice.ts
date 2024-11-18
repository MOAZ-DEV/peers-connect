import { useState } from "react";
import { useDispatch } from "react-redux";
import { setLocalStream } from "../redux/slices/webRTCSlice";  // Import the Redux action

export const useLocalStream = (pcRef) => {
  const [localStream, setLocalStreamState] = useState(null);
  const dispatch = useDispatch(); // Get the dispatch function

  const startWebcam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStreamState(stream); // Local state update
    dispatch(setLocalStream(stream)); // Redux state update

    stream.getTracks().forEach((track) => {
      pcRef.current?.addTrack(track, stream);
    });
  };

  return { localStream, startWebcam };
};
