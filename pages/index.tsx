import { useEffect, useRef, useState } from "react";
import { useVideoStream } from "@/hook/use-video-stream";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const Home = () => {
  const { toast } = useToast();
  const { WebcamVideoSrc } = useVideoStream();
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const [offer, setOffer] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");

  // Set local video stream
  useEffect(() => {
    if (videoRef.current && WebcamVideoSrc) {
      videoRef.current.srcObject = WebcamVideoSrc;
    }
  }, [WebcamVideoSrc]);

  // Setup peer connection
  useEffect(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] // Use your desired STUN servers
    });
    setPeerConnection(pc);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("ICE Candidate: ", event.candidate);
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    return () => {
      pc.close(); // Cleanup on unmount
    };
  }, []);

  const createOffer = async () => {
    if (!peerConnection) return;
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    setOffer(JSON.stringify(offer)); // Store offer for sharing
  };

  const handleOffer = async () => {
    if (!peerConnection) return;
    const parsedOffer = JSON.parse(offer);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(parsedOffer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    setAnswer(JSON.stringify(answer)); // Store answer for sharing
  };

  const handleAnswer = async () => {
    if (!peerConnection) return;
    const parsedAnswer = JSON.parse(answer);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(parsedAnswer));
  };

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
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-[500px] w-[655px] max-w-full bg-[#ffffff07] rounded-lg object-cover"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          muted
          className="h-[500px] w-[650px] max-w-full border border-[#ffffff12] rounded-lg object-cover"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Button onClick={createOffer}>Create Offer</Button>
        <input className="flex h-10 w-full rounded-md bg-background px-3 py-2 text-sm border-[1px] border-[#8181812a] ring-offset-background outline-0 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={offer} onChange={(e) => setOffer(e.target.value)} placeholder="Paste Offer Here..." />
        <Button onClick={handleOffer}>Send Offer</Button>
        <input className="flex h-10 w-full rounded-md bg-background px-3 py-2 text-sm border-[1px] border-[#8181812a] ring-offset-background outline-0 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Paste Answer Here..." />
        <Button onClick={handleAnswer}>Send Answer</Button>
      </div>
      <Toaster />
    </div>
  );
};

export default Home;
