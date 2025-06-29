import React from 'react';

interface HLSPlayerComponentProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  statusMessage: string;
  statusType: 'info' | 'error' | 'success';
  getStatusColorClass: () => string;
}



const HLSPlayerComponent: React.FC<HLSPlayerComponentProps> = ({
  videoRef,
  statusMessage,
  
  getStatusColorClass,
}) => {
  return (
    <div className="flex justify-center bg-[#121212] min-h-screen font-sans px-4 py-8">
      <div className="w-full max-w-[960px]">
        {/* Removed input + button */}
        <video
          ref={videoRef}
          id="videoPlayer"
          controls
          muted
          autoPlay
          className="w-full aspect-video rounded-lg bg-black"
        />
        <p id="statusMessage"
            className={`mt-4 rounded-md px-4 py-2 text-sm font-medium transition-all duration-300 ${getStatusColorClass()}`}>
            {statusMessage}
        </p>
      </div>
    </div>
  );
};

export default HLSPlayerComponent;
