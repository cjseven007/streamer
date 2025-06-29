import React from 'react';

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
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={hlsUrl}
                onChange={(e) => setHlsUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') loadHlsStream();
                }}
                placeholder="Enter stream URL"
                className="w-full rounded-full bg-white/10 px-4 pr-12 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={loadHlsStream}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-blue-400"
              >
                <i className="fa fa-search text-base" />
              </button>
            </div>
          </div>

          {/* Right spacing / future user icon */}
          <div className="w-10" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;