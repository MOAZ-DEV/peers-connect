import { useEffect, useState } from 'react';

export const useVideoStream = () => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        const getMediaStream = async () => {
            try {
                const constraints = { video: true, audio: true };
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                setLocalStream(stream);
            } catch (error) {
                console.error('Error accessing media devices.', error);
            }
        };

        getMediaStream();

        return () => {
            localStream?.getTracks().forEach(track => track.stop());
        };
    }, []);

    return {
        WebcamVideoSrc: localStream,
    };
};
