import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './view/components/navBar';
import SearchBox from './view/components/searchBox';
import { useHlsPlayerLogic } from './controller/useHlsPlayerLogic';
import HomePage from './view/page/homePage';
import AboutPage from './view/page/aboutPage';

// Create a wrapper component that has Router context
const AppContent: React.FC = () => {
  const {
    hlsUrl,
    setHlsUrl,
    statusMessage,
    statusType,
    videoRef,
    loadHlsStream,
    getStatusColorClass,
  } = useHlsPlayerLogic();

  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className='min-h-screen bg-[#121212] text-white'>
      <Navbar
        hlsUrl={hlsUrl}
        setHlsUrl={setHlsUrl}
        loadHlsStream={loadHlsStream}
        showSearch={isHomePage} // Show search only on home page
      />

      {/* Mobile Search Box for home page only */}
      {isHomePage && (
        <div className="flex justify-center px-4 pt-2 sm:hidden">
          <SearchBox value={hlsUrl} onChange={setHlsUrl} onSubmit={loadHlsStream} />
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              hlsUrl={hlsUrl}
              setHlsUrl={setHlsUrl}
              loadHlsStream={loadHlsStream}
              videoRef={videoRef}
              statusMessage={statusMessage}
              statusType={statusType}
              getStatusColorClass={getStatusColorClass}
            />
          }
        />
         <Route path="/about" element={<AboutPage />}/>
      </Routes>
     
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
