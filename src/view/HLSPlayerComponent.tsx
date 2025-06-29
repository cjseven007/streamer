import React from 'react';
import { useHlsPlayerLogic } from '../controller/useHlsPlayerLogic'; // Adjust the path if needed

const HLSPlayerComponent: React.FC = () => {
  const {
    hlsUrl,
    setHlsUrl,
    statusMessage,
    videoRef,
    loadHlsStream,
    getStatusColorClass,
  } = useHlsPlayerLogic();

  return (
    <div className="flex justify-center bg-[#f9f9f9] min-h-screen font-sans px-4 py-8">
      <div className="w-full max-w-[960px]">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Video Streamer</h1>

        <video
          ref={videoRef}
          id="videoPlayer"
          controls
          muted
          autoPlay
          className="w-full aspect-video rounded-lg bg-black"
        />

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <input
            type="text"
            id="hlsUrlInput"
            placeholder="Search"
            className="flex-grow rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={hlsUrl}
            onChange={(e) => setHlsUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                loadHlsStream();
              }
            }}
          />
          <button
            id="loadStreamButton"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            onClick={loadHlsStream}
          >
            Stream Now
          </button>
        </div>

        <p id="statusMessage" className={`mt-3 text-sm ${getStatusColorClass()}`}>
          {statusMessage}
        </p>
      </div>
    </div>
  );
};

export default HLSPlayerComponent;
