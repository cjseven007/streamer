import React from 'react';

interface VideoItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
}

interface VideoListProps {
  videos: VideoItem[];
  onSelectVideo: (url: string) => void;
}

const VideoList: React.FC<VideoListProps> = ({ videos, onSelectVideo }) => {
  return (
    <div className="w-full sm:max-w-xs space-y-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
      {videos.map((video) => (
        <div
          key={video.id}
          onClick={() => onSelectVideo(video.videoUrl)}
          className="flex cursor-pointer items-center gap-3 p-2 hover:bg-[#181818] transition"
        >
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="h-20 w-36 rounded object-cover"
          />
          <div className="text-white text-sm font-medium line-clamp-2">
            {video.title}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoList;
