import React, { useCallback, useEffect } from 'react';
import HLSPlayerComponent from '../components/HLSPlayerComponent';
import VideoList from '../components/videoList';
import { videoList } from '../../data/videoListData';


interface HomePageProps {
  hlsUrl: string;
  setHlsUrl: React.Dispatch<React.SetStateAction<string>>;
  loadHlsStream: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  statusMessage: string;
  statusType: 'info' | 'error' | 'success';
  getStatusColorClass: () => string;
}

const HomePage: React.FC<HomePageProps> = ({
    hlsUrl,
    setHlsUrl,
    loadHlsStream,
    videoRef,
    statusMessage,
    statusType,
    getStatusColorClass,
}) => {
    const handleSelectVideo = useCallback((url: string) => {
        setHlsUrl(url); // Just update the URL
    }, [setHlsUrl]);

    useEffect(() => {
        if (hlsUrl.trim()) {
        loadHlsStream(); // Automatically trigger when URL changes
        }
    }, [hlsUrl, loadHlsStream]);

  return (
    <div className="flex flex-col sm:flex-row px-4 py-6 gap-6 max-w-7xl mx-auto">
      <div className="flex-1">
        <HLSPlayerComponent
          videoRef={videoRef}
          statusMessage={statusMessage}
          statusType={statusType}
          getStatusColorClass={getStatusColorClass}
        />
      </div>
      <VideoList videos={videoList} onSelectVideo={handleSelectVideo} />
    </div>
  );
};

export default HomePage;
