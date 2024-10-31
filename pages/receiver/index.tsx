// pages/index.tsx
import dynamic from 'next/dynamic';

const VideoChat = dynamic(() => import('../../components/VideoChat'), { ssr: false });

const Receiver: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Video Chat App</h1>
      <VideoChat isCaller={false} />
    </div>
  );
};

export default Receiver;
