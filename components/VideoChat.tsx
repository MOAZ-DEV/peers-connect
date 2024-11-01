// components/VideoChat.tsx
import { useEffect, useRef } from 'react';

interface VideoChatProps {
    videoSrc: string;
}

const VideoChat = ({ videoSrc }: VideoChatProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.src = videoSrc;
        }
    }, [videoSrc]);

    return (
        <div className="flex flex-col items-center">
            <video ref={videoRef} autoPlay className="w-full max-w-sm" />
        </div>
    );
};

export default VideoChat;
