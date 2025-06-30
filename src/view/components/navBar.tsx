import React, { useState } from 'react';
import SearchBox from './searchBox';
import { FaBars, FaTimes } from 'react-icons/fa';

interface NavbarProps {
  hlsUrl: string;
  setHlsUrl: React.Dispatch<React.SetStateAction<string>>;
  loadHlsStream: () => void;
  showSearch?: boolean;  // optional, default to true
}

const Navbar: React.FC<NavbarProps> = ({
  hlsUrl,
  setHlsUrl,
  loadHlsStream,
  showSearch = true,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pages = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
  ];

  return (
    <nav className="bg-black relative z-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between sm:justify-normal sm:gap-4">
          {/* Mobile: Hamburger Icon (Left) */}
          <div className="sm:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-white text-xl">
              <FaBars />
            </button>
          </div>

          {/* Mobile: Centered Logo */}
          <div className="sm:hidden absolute left-1/2 transform -translate-x-1/2">
            <img
              className="h-10 object-contain"
              src="./hub_long_logo.png"
              alt="Pork Hub"
            />
          </div>

          {/* Desktop: Logo and Nav buttons (Left) */}
          <div className="hidden sm:flex items-center gap-6">
            <img
              className="w-[10rem] h-auto object-contain"
              src="./hub_long_logo.png"
              alt="Pork Hub"
            />
            <div className="flex gap-4 text-white">
              {pages.map((page) => (
                <button
                  key={page.path}
                  className="hover:text-[#ff62d8] text-sm transition font-bold"
                  onClick={() => window.location.href = page.path}
                >
                  {page.label}
                </button>
              ))}
            </div>
          </div>

          {/* Centered SearchBox (desktop only) */}
          {showSearch && (
            <div className="hidden sm:flex flex-1 justify-center">
              <SearchBox value={hlsUrl} onChange={setHlsUrl} onSubmit={loadHlsStream} />
            </div>
          )}

          {/* Placeholder for spacing (right side in mobile) */}
          <div className="w-10 sm:hidden" />
        </div>
      </div>

      {/* Mobile: Side Modal */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex">
          <div className="w-64 bg-[#1e1e1e] h-full shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-white text-lg font-semibold">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white text-lg">
                <FaTimes />
              </button>
            </div>
            <nav className="flex flex-col gap-4 text-white">
              {pages.map((page) => (
                <button
                  key={page.path}
                  className="text-left hover:text-blue-400 transition"
                  onClick={() => {
                    window.location.href = page.path;
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {page.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
