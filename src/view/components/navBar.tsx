import React from 'react';
import SearchBox from './searchBox';

interface NavbarProps {
  hlsUrl: string;
  setHlsUrl: React.Dispatch<React.SetStateAction<string>>;
  loadHlsStream: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ hlsUrl, setHlsUrl, loadHlsStream }) => {
  return (
    <nav className="bg-black">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img
              className="w-[10rem] h-auto object-contain"
              src="./hub_long_logo.png"
              alt="Your Company"
            />
          </div>

          {/* Centered Search Bar */}
          {/* Desktop Search Box (hidden on mobile) */}
            <div className="flex-1 justify-center hidden sm:flex">
            <SearchBox value={hlsUrl} onChange={setHlsUrl} onSubmit={loadHlsStream} />
            </div>


          {/* Right spacing / future user icon */}
          <div className="w-10" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
