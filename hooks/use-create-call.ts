import { useState } from "react";
import useFirestore from "./use-firestore";

export const useCreateCall = (pcRef) => {
  const firestore = useFirestore();
  const [callId, setCallId] = useState("");

  const createCall = async () => {
    try {
      const callDoc = firestore.collection("calls").doc();
      const offerCandidates = callDoc.collection("offerCandidates");
      const answerCandidates = callDoc.collection("answerCandidates");

      setCallId(callDoc.id);

      pcRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          offerCandidates.add(event.candidate.toJSON());
        }
      };

      // Create offer
      const offerDescription = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offerDescription);

      // Save the offer to Firestore (without `toJSON`)
      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };

      await callDoc.set({ offer });

      callDoc.onSnapshot((snapshot) => {
        const data = snapshot.data();
        if (data && data.answer && !pcRef.current.currentRemoteDescription) {
          const answerDescription = new RTCSessionDescription(data.answer);
          pcRef.current.setRemoteDescription(answerDescription);
        }
      });

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
