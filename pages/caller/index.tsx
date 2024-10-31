// pages/index.tsx
import dynamic from 'next/dynamic';

const VideoChat = dynamic(() => import('../../components/VideoChat'), { ssr: false });

const Caller: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Video Chat App</h1>
      <VideoChat isCaller={true} />
    </div>
  );
};

export default Caller;
