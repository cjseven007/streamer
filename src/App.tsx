import React, { useCallback } from 'react';
import { useHlsPlayerLogic } from './controller/useHlsPlayerLogic';
import Navbar from './view/components/navBar';
import HLSPlayerComponent from './view/components/HLSPlayerComponent';
import SearchBox from './view/components/searchBox';
import VideoList from './view/components/videoList';
import { videoList } from './data/videoListData';

const App: React.FC = () => {
  const {
    hlsUrl,
    setHlsUrl,
    statusMessage,
    statusType,
    videoRef,
    loadHlsStream,
    getStatusColorClass,
  } = useHlsPlayerLogic();


  const handleSelectVideo = useCallback(
    (url: string) => {
      setHlsUrl(url);
      loadHlsStream();
    },
    [setHlsUrl, loadHlsStream]
  );

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Navbar
        hlsUrl={hlsUrl}
        setHlsUrl={setHlsUrl}
        loadHlsStream={loadHlsStream}
      />
      {/* Mobile Search Box (hidden on desktop) */}
      <div className="flex justify-center px-4 pt-2 sm:hidden">
        <SearchBox value={hlsUrl} onChange={setHlsUrl} onSubmit={loadHlsStream} />
      </div>
      {/* Main content: Player + Video list */}
      <div className="flex flex-col sm:flex-row px-4 py-6 gap-6 max-w-7xl mx-auto">
        {/* HLS Player */}
        <div className="flex-1">
          <HLSPlayerComponent
            videoRef={videoRef}
            statusMessage={statusMessage}
            statusType={statusType}
            getStatusColorClass={getStatusColorClass}
          />
        </div>

        {/* Video List */}
        <VideoList videos={videoList} onSelectVideo={handleSelectVideo} />
      </div>
    </div>
  );
};

export default App;