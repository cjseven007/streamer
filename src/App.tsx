import React from 'react';
import { useHlsPlayerLogic } from './controller/useHlsPlayerLogic';
import Navbar from './view/components/navBar';
import HLSPlayerComponent from './view/HLSPlayerComponent';
import SearchBox from './view/components/searchBox';

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
      <HLSPlayerComponent
        videoRef={videoRef}
        statusMessage={statusMessage}
        statusType={statusType}
        getStatusColorClass={getStatusColorClass}
      />
    </div>
  );
};

export default App;