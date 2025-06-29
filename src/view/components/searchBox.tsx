import React from 'react';

interface SearchBoxProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange, onSubmit }) => {
  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSubmit();
        }}
        placeholder="Enter stream URL"
        className="w-full rounded-full bg-white/10 px-4 pr-20 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {/* Clear icon */}
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-10 top-1/2 -translate-y-1/2 text-white hover:text-red-400"
        >
          <i className="fa fa-times text-base" />
        </button>
      )}

      {/* Search icon */}
      <button
        onClick={onSubmit}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-blue-400"
      >
        <i className="fa fa-search text-base" />
      </button>
    </div>
  );
};

export default SearchBox;
