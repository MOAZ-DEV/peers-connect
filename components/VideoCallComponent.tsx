import { useState, useRef, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD5RL79Q5HYy2s_RacsiAuFotPz7PzTd0c",
    authDomain: "klam-p2p.firebaseapp.com",
    projectId: "klam-p2p",
    storageBucket: "klam-p2p.firebasestorage.app",
    messagingSenderId: "4158287384",
    appId: "1:4158287384:web:0822f586b2897cb29e9d6d",
    measurementId: "G-X7G63RGGTZ"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const firestore = firebase.firestore();

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

function VideoCallComponent() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callId, setCallId] = useState<string>("");
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      pcRef.current = new RTCPeerConnection(servers);
      const newRemoteStream = new MediaStream();
      setRemoteStream(newRemoteStream);

      pcRef.current.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          newRemoteStream.addTrack(track);
        });
      };
    }

    return () => {
      pcRef.current?.close();
    };
  }, []);

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

 // Create Call Function
const createCall = async () => {
  try {
    const callDoc = firestore.collection("calls").doc();
    const offerCandidates = callDoc.collection("offerCandidates");
    const answerCandidates = callDoc.collection("answerCandidates");

    setCallId(callDoc.id);  // Log the call ID created
    console.log("Created Call ID:", callDoc.id);

    pcRef.current!.onicecandidate = (event) => {
      event.candidate && offerCandidates.add(event.candidate.toJSON());
    };

    // Create offer
    const offerDescription = await pcRef.current!.createOffer();
    await pcRef.current!.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await callDoc.set({ offer });
    console.log("Offer set in Firestore:", offer);

    // Listen for remote answer
    callDoc.onSnapshot((snapshot) => {
      const data = snapshot.data();
      if (data && data.answer && !pcRef.current!.currentRemoteDescription) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pcRef.current!.setRemoteDescription(answerDescription);
      }
    });

    // Listen for remote ICE candidates
    answerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pcRef.current!.addIceCandidate(candidate);
        }
      });
    });
  } catch (error) {
    console.error("Error creating call:", error);
  }
};

// Answer Call Function
const answerCall = async () => {
  try {
    const callDoc = firestore.collection("calls").doc(callId);
    const answerCandidates = callDoc.collection("answerCandidates");
    const offerCandidates = callDoc.collection("offerCandidates");

    pcRef.current!.onicecandidate = (event) => {
      event.candidate && answerCandidates.add(event.candidate.toJSON());
    };

    // Fetch the call document data
    const callSnapshot = await callDoc.get();
    const callData = callSnapshot.data();

    if (!callData || !callData.offer) {
      console.error("No call data or offer found for this Call ID:", callId);
      return;
    }

    // Set the remote description with the offer
    const offerDescription = callData.offer;
    await pcRef.current!.setRemoteDescription(new RTCSessionDescription(offerDescription));

    // Create and set the answer description
    const answerDescription = await pcRef.current!.createAnswer();
    await pcRef.current!.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await callDoc.update({ answer });
    console.log("Answer set in Firestore:", answer);

    // Listen for offer candidates
    offerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          pcRef.current!.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  } catch (error) {
    console.error("Error answering call:", error);
  }
};

  
  return (
    <div>
      <button onClick={startWebcam}>Start Webcam</button>
      <video ref={localVideoRef} autoPlay playsInline className="h-[300px] aspect-square"/>
      <video ref={remoteVideoRef} autoPlay playsInline className="h-[300px] aspect-square"/>
      <button onClick={createCall} disabled={!localStream}>Create Call</button>
      <input value={callId} onChange={(e) => setCallId(e.target.value)} placeholder="Enter Call ID" />
      <button onClick={answerCall} disabled={!callId}>Answer Call</button>
    </div>
  );
}

export default VideoCallComponent;
