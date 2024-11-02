import { useState, useRef, useEffect, useCallback } from "react";
import { firestore } from "@/lib/firebase";

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

// Hook to set up media streams
function useMediaStreams() {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(new MediaStream());

  const setupLocalStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);
    return stream;
  }, []);

  return { localStream, remoteStream, setRemoteStream, setupLocalStream };
}

// Hook to manage peer connection
function usePeerConnection(localStream, remoteStream) {
  const [pc] = useState(new RTCPeerConnection(servers));

  useEffect(() => {
    if (localStream) {
      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
    }

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => remoteStream.addTrack(track));
    };

    return () => {
      pc.close();
    };
  }, [localStream, remoteStream, pc]);

  return pc;
}

// Hook to handle Firestore signaling
function useFirestoreSignaling(pc, callId) {
  const callRef = callId ? firestore.collection("calls").doc(callId) : null;

  const createOffer = useCallback(async () => {
    const callDoc = firestore.collection("calls").doc();
    const offerCandidates = callDoc.collection("offerCandidates");
    const answerCandidates = callDoc.collection("answerCandidates");

    pc.onicecandidate = (event) => {
      event.candidate && offerCandidates.add(event.candidate.toJSON());
    };

    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    await callDoc.set({ offer: { sdp: offerDescription.sdp, type: offerDescription.type } });

    callDoc.onSnapshot((snapshot) => {
      const data = snapshot.data();
      if (data?.answer && !pc.currentRemoteDescription) {
        pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    });

    answerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });

    return callDoc.id;
  }, [pc]);

  const answerCall = useCallback(async (callId) => {
    const callDoc = firestore.collection("calls").doc(callId);
    const answerCandidates = callDoc.collection("answerCandidates");
    const offerCandidates = callDoc.collection("offerCandidates");

    pc.onicecandidate = (event) => {
      event.candidate && answerCandidates.add(event.candidate.toJSON());
    };

    const callData = (await callDoc.get()).data();
    const offerDescription = callData.offer;
    await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    await callDoc.update({ answer: { sdp: answerDescription.sdp, type: answerDescription.type } });

    offerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });
  }, [pc]);

  return { createOffer, answerCall };
}

// Component to control the call actions
function VideoCallComponent() {
  const { localStream, remoteStream, setupLocalStream } = useMediaStreams();
  const pc = usePeerConnection(localStream, remoteStream);
  const { createOffer, answerCall } = useFirestoreSignaling(pc);
  const [callId, setCallId] = useState("");

  const startWebcam = async () => {
    await setupLocalStream();
  };

  const handleCreateOffer = async () => {
    const id = await createOffer();
    setCallId(id);
  };

  const handleAnswerCall = async () => {
    await answerCall(callId);
  };

  return (
    <div>
      <button onClick={startWebcam}>Start Webcam</button>
      <video ref={(ref) => ref && (ref.srcObject = localStream)} autoPlay playsInline />
      <video ref={(ref) => ref && (ref.srcObject = remoteStream)} autoPlay playsInline />

      <input
        type="text"
        placeholder="Enter call ID"
        value={callId}
        onChange={(e) => setCallId(e.target.value)}
      />
      <button onClick={handleCreateOffer} disabled={!localStream}>Create Call</button>
      <button onClick={handleAnswerCall} disabled={!callId}>Answer Call</button>
    </div>
  );
}

export default VideoCallComponent;
