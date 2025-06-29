import React from 'react';
import { useHlsPlayerLogic } from './controller/useHlsPlayerLogic';
import Navbar from './view/components/navBar';
import HLSPlayerComponent from './view/HLSPlayerComponent';

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
    <>
      <Navbar
        hlsUrl={hlsUrl}
        setHlsUrl={setHlsUrl}
        loadHlsStream={loadHlsStream}
      />
      <HLSPlayerComponent
        videoRef={videoRef}
        statusMessage={statusMessage}
        statusType={statusType}
        getStatusColorClass={getStatusColorClass}
      />
    </>
  );
};

export default App;