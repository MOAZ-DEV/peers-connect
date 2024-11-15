// import { useAnswerCall } from "@/hooks/use-answer-call";
import { useCreateCall } from "@/hooks/use-create-call";
import { useLocalStream } from "@/hooks/use-local-stream";
import { usePeerConnection } from "@/hooks/use-peer-connection";
import React, { useEffect, useRef } from "react";
import { Input } from "./ui/input";


const VideoCallComponent = () => {
  const { PcRef, remoteStream } = usePeerConnection();
  const { localStream, startWebcam } = useLocalStream(PcRef);
  const { createCall } = useCreateCall(PcRef);
  // const {  } = useAnswerCall(PcRef);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div>
      <Input ref={inputRef} type="text"  />
      <video ref={localVideoRef} autoPlay playsInline className="h-[300px] aspect-square"/>
      <video ref={remoteVideoRef} autoPlay playsInline className="h-[300px] aspect-square"/>
      <button onClick={startWebcam}>Start Webcam</button>
      <button onClick={createCall}>Create Call</button>
      {/* <button onClick={() => answerCall(inputRef.current.value || callId)}>Answer Call</button> */}
    </div>
  );
};

export default VideoCallComponent;
