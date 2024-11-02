import { useEffect, useRef, useState } from "react";
import { useVideoStream } from "@/hook/use-video-stream";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const Home = () => {
  const
    { toast } = useToast(),
    { WebcamVideoSrc } = useVideoStream();

  const
    [RemoteStream, setRemoteStream] = useState<MediaStream | null>();

  const
    videoRef = useRef<HTMLVideoElement | null>(null),
    remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && WebcamVideoSrc) {
      videoRef.current.srcObject = WebcamVideoSrc;
    }
  }, [WebcamVideoSrc]);

  useEffect(() => {
    if (remoteVideoRef.current && RemoteStream) {
      remoteVideoRef.current.srcObject = RemoteStream;
    }
  }, [RemoteStream]);

  useEffect(() => {
    try {
      const iceConfig = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }
      const peerConnection = new RTCPeerConnection(iceConfig);
      WebcamVideoSrc && WebcamVideoSrc.getTracks().forEach(track => {
        peerConnection.addTrack(track, WebcamVideoSrc);
      });
    } catch (err) {
      console.error(err)
    }
  }, [WebcamVideoSrc]);

  useEffect(() => {
    try {
      const iceConfig = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }
      const remotePeerConnection = new RTCPeerConnection(iceConfig);
      remotePeerConnection.addEventListener('track', async (event) => {
        const [remoteStream] = event.streams;
        setRemoteStream(remoteStream);
      });
    } catch (err) {
      console.error(err)
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col gap-6 items-center justify-center">
      <div className="flex flex-row gap-6">
        <Button variant="outline" onClick={() => toast({ description: "Copied your invite code!" })}>
          <Link />
        </Button>
        <h1 className="text-3xl font-bold mb-6 underline">#ChatCode</h1>
      </div>
      <div className="flex flex-row gap-4">
        <video
          ref={videoRef} autoPlay playsInline muted
          className="h-[500px] w-[655px] max-w-full bg-[#ffffff07] rounded-lg object-cover" />
        <video ref={remoteVideoRef} autoPlay playsInline muted
          className="h-[500px] w-[650px] max-w-full border border-[#ffffff12] rounded-lg object-cover" />
      </div>
      <div className="flex flex-row gap-2">
        <input
          className="flex h-10 w-full rounded-md bg-background px-3 py-2 text-sm border-[1px] border-[#8181812a] ring-offset-background outline-0"
          value={''}
          onChange={(e) => { }}
          placeholder="Paste Code Here..."
        />
        <Button variant={"secondary"} className="font-semibold">Join</Button>
      </div>
      <Toaster />
    </div>
  );
};

export default Home;
