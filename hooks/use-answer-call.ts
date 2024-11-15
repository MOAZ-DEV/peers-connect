import { useState } from "react";
import useFirestore from "./use-firestore";

export const useAnswerCall = (pcRef) => {
    const firestore = useFirestore();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [callId, setCallId] = useState("");

    const answerCall = async (callId) => {
        try {
            const callDoc = firestore.collection("calls").doc(callId);
            const answerCandidates = callDoc.collection("answerCandidates");
            const offerCandidates = callDoc.collection("offerCandidates");

            pcRef.current.onicecandidate = (event) => {
                if (event.candidate) {
                    answerCandidates.add(event.candidate.toJSON());
                }
            };

            // Get the offer from the call document
            const callSnapshot = await callDoc.get();
            const callData = callSnapshot.data();

            if (!callData || !callData.offer) {
                console.error("No call data or offer found for this Call ID:", callId);
                return;
            }

            // Set the remote description with the offer
            const offerDescription = callData.offer;
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(offerDescription));

            // Create and set the answer description
            const answerDescription = await pcRef.current.createAnswer();
            await pcRef.current.setLocalDescription(answerDescription);

            // Save the answer to Firestore
            const answer = {
                sdp: answerDescription.sdp,
                type: answerDescription.type,
            };

            await callDoc.update({ answer });

            offerCandidates.onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        const candidate = new RTCIceCandidate(change.doc.data());
                        pcRef.current.addIceCandidate(candidate);
                    }
                });
            });
        } catch (error) {
            console.error("Error answering call:", error);
        }
    };

    return { answerCall, setCallId };
};
