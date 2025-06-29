// src/data/videoList.ts

export interface VideoItem {
    id:string,
    title: string;
    videoUrl: string;
    thumbnailUrl: string;
}

export const videoList: VideoItem[] = [

  {
    id:'1',
    title: 'Big Buck Bunny',
    videoUrl: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
     thumbnailUrl: 'https://placehold.co/600x400',
  },
  {
    id:'2',
    title: 'Random Animation',
    videoUrl: 'https://moiptvhls-i.akamaihd.net/hls/live/652002/btv/index.m3u8',
    thumbnailUrl: 'https://placehold.co/600x400',
  },
  {
    id:'3',
    title: '冷血奇兵（英语）',
    videoUrl: 'https://vip1.lz-cdn7.com/20230325/15084_04441862/index.m3u8',
    thumbnailUrl: 'https://placehold.co/600x400',
  },
  
];
