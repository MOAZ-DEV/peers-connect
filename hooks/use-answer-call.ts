import { useState, useEffect } from "react";
import useFirestore from "./use-firestore";

export const useAnswerCall = (pcRef) => {
    const firestore = useFirestore();
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

    const answerCall = async (callId: string) => {
        try {
            const callDoc = firestore.collection("calls").doc(callId);
            const answerCandidates = callDoc.collection("answerCandidates");
            const offerCandidates = callDoc.collection("offerCandidates");

            pcRef.current.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log("Adding ICE candidate:", event.candidate);
                    answerCandidates.add(event.candidate.toJSON());
                } else {
                    console.log("No more ICE candidates");
                }
            };

            // Get the offer from Firestore
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

            // Handle incoming candidates for the offer
            offerCandidates.onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        const candidate = new RTCIceCandidate(change.doc.data());
                        pcRef.current.addIceCandidate(candidate);
                    }
                });
            });

            // Set up the remote stream once the peer connection has tracks
            pcRef.current.ontrack = (event) => {
                if (event.streams && event.streams[0]) {
                    setRemoteStream(event.streams[0]);
                }
            };
        } catch (error) {
            console.error("Error answering call:", error);
        }
    };

    // Cleanup the ICE candidate and track listeners when component unmounts
    useEffect(() => {
        return () => {
            if (pcRef.current) {
                pcRef.current.onicecandidate = null;
                pcRef.current.ontrack = null;
            }
        };
    }, [pcRef]);

    return { answerCall, remoteStream };
};
