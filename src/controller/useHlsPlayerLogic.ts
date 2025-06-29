import { useRef, useState, useEffect, useCallback } from 'react';
import Hls from 'hls.js';

interface HLSPlayerLogic {
  hlsUrl: string;
  setHlsUrl: React.Dispatch<React.SetStateAction<string>>;
  statusMessage: string;
  statusType: 'info' | 'error' | 'success';
  videoRef: React.RefObject<HTMLVideoElement | null>; // Updated type to allow null
  loadHlsStream: () => void;
  getStatusColorClass: () => string;
}

// Custom hook to encapsulate HLS player logic
export const useHlsPlayerLogic = (): HLSPlayerLogic => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [hlsUrl, setHlsUrl] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('Enter a URL and click Load Stream to begin.');
  const [statusType, setStatusType] = useState<'info' | 'error' | 'success'>('info');

  // Function to display messages to the user with different styles
  const displayMessage = useCallback((msg: string, type: 'info' | 'error' | 'success' = 'info') => {
    setStatusMessage(msg);
    setStatusType(type);
  }, []);

  // Function to load the HLS stream
 const loadHlsStream = useCallback(() => {
    const video = videoRef.current;
    if (!video) {
        displayMessage('Video element not found.', 'error');
        return;
    }

    // Helper to extract a valid URL from any input text
    function extractValidUrl(input: string): string | null {
        const urlRegex = /(https?:\/\/[^\s]+)/i;
        const match = input.match(urlRegex);
        return match ? match[0] : null;
    }

    // Extract the URL from the user input
    const cleanUrl = extractValidUrl(hlsUrl);

    if (!cleanUrl) {
        displayMessage('Please enter a valid HTTP or HTTPS URL.', 'error');
        video.pause();
        video.removeAttribute('src');
        return;
    }

    // Update the input box with the clean URL
    if (cleanUrl !== hlsUrl) {
        setHlsUrl(cleanUrl);
    }


    // Clear any existing HLS instance before loading a new stream
    if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
    }

    // Reset video source and status
    video.removeAttribute('src');
    video.load(); // Reloads the video element
    displayMessage('Loading stream...');

    // Use the sanitized URL from now on
    if (Hls.isSupported()) {
        hlsRef.current = new Hls({
          maxBufferHole: 1,
          maxBufferLength: 20,
          lowLatencyMode: true,
          enableWorker: true,
        });

        hlsRef.current.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
            switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
                if (data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR) {
                displayMessage(
                    `Error: Could not load stream manifest from "${data.url}". The URL might be incorrect, the stream is offline, or there's a CORS issue.`,
                    'error',
                );
                video.pause();
                video.removeAttribute('src');
                hlsRef.current?.destroy();
                hlsRef.current = null;
                } else {
                displayMessage(`Network error: ${data.details}. Trying to recover...`, 'error');
                hlsRef.current?.recoverMediaError();
                }
                break;
            case Hls.ErrorTypes.MEDIA_ERROR:
                displayMessage('Media error encountered, trying to recover...', 'error');
                hlsRef.current?.recoverMediaError();
                break;
            default:
                displayMessage(`An unrecoverable HLS error occurred: ${data.details}.`, 'error');
                video.pause();
                video.removeAttribute('src');
                hlsRef.current?.destroy();
                hlsRef.current = null;
                break;
            }
        } else {
            displayMessage(`Non-fatal HLS error: ${data.details}`, 'error');
        }
        console.error('HLS.js Error:', data);
        });

        hlsRef.current.attachMedia(video);

        hlsRef.current.on(Hls.Events.MEDIA_ATTACHED, () => {
        hlsRef.current?.loadSource(cleanUrl);
        });

        hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
        displayMessage(`Manifest parsed. Playing stream...`, 'success');
        video.play().catch(error => {
            displayMessage(`Error playing video: ${error.message}. Please enable autoplay or click play.`, 'error');
            console.error('Video play failed:', error);
        });
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        displayMessage('Browser supports native HLS playback. Loading stream...');
        video.src = cleanUrl;
        video.addEventListener(
        'loadedmetadata',
        () => {
            video
            .play()
            .then(() => {
                displayMessage('Stream loaded and playing!', 'success');
            })
            .catch(error => {
                displayMessage(`Error playing video: ${error.message}. Please enable autoplay or click play.`, 'error');
                console.error('Video play failed (native):', error);
            });
        },
        { once: true },
        );

        video.addEventListener(
        'error',
        () => {
            displayMessage(
            `Native video playback error: Could not load stream from "${cleanUrl}". The URL might be incorrect or the stream is offline.`,
            'error',
            );
            video.pause();
            video.removeAttribute('src');
        },
        { once: true },
        );
    } else {
        displayMessage(
        'Your browser does not support HLS streaming. Please use a modern browser like Chrome, Firefox, Edge, or Safari.',
        'error',
        );
        video.pause();
        video.removeAttribute('src');
    }
    }, [hlsUrl, displayMessage]);


  // useEffect hook for cleaning up Hls.js instance on component unmount
  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, []);

  // Determine the status message text color based on statusType
  const getStatusColorClass = useCallback(() => {
  switch (statusType) {
    case 'error':
      return 'bg-red-500 text-white';
    case 'success':
      return 'bg-green-500 text-white';
    case 'info':
    default:
      return 'bg-gray-600 text-white';
  }
}, [statusType]);

  return {
    hlsUrl,
    setHlsUrl,
    statusMessage,
    statusType,
    videoRef,
    loadHlsStream,
    getStatusColorClass,
  };
};
