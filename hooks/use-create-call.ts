import { useState } from "react";
import useFirestore from "./use-firestore";

export const useCreateCall = (pcRef) => {
  const firestore = useFirestore();
  const [callId, setCallId] = useState<string | null>(null);

  const createCall = async () => {
    try {
      // Create a new Firestore call document
      const callDoc = firestore.collection("calls").doc();
      const offerCandidates = callDoc.collection("offerCandidates");
      const answerCandidates = callDoc.collection("answerCandidates");

      // Save the call ID for later reference
      setCallId(callDoc.id);

      // Add ICE candidates to Firestore
      pcRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          offerCandidates.add(event.candidate.toJSON());
        }
      };

      // Create and send the offer
      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);

      // Save the offer SDP to Firestore
      await callDoc.set({
        offer: {
          type: offer.type,
          sdp: offer.sdp,
        },
      });

      // Listen for the answer SDP and set it as the remote description
      callDoc.onSnapshot((snapshot) => {
        const data = snapshot.data();
        if (data?.answer && !pcRef.current.currentRemoteDescription) {
          const answer = new RTCSessionDescription(data.answer);
          pcRef.current.setRemoteDescription(answer);
        }
      });

      // Listen for remote ICE candidates and add them to the peer connection
      answerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidate = new RTCIceCandidate(change.doc.data());
            pcRef.current.addIceCandidate(candidate);
          }
        });
      });
    } catch (error) {
      console.error("Error creating call:", error);
    }
  };

  return { createCall, callId };
};
