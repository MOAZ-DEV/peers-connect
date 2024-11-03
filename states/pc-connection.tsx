import React, { useRef, useEffect, createContext, useContext } from "react";

// Create a context to provide the peer connection
const PeerConnectionContext = createContext(null);

export const PeerConnectionProvider = ({ children }) => {
  const pcRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Only create RTCPeerConnection in the browser
      pcRef.current = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
        ],
      });
    }

    return () => {
      pcRef.current?.close();
      pcRef.current = null; // Cleanup the reference
    };
  }, []);

  return (
    <PeerConnectionContext.Provider value={pcRef}>
      {children}
    </PeerConnectionContext.Provider>
  );
};

// Custom hook to use the PeerConnection context
export const usePeerConnection = () => {
  const context = useContext(PeerConnectionContext);
  if (!context) {
    throw new Error("usePeerConnection must be used within a PeerConnectionProvider");
  }
  return context;
};
