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

    // Clear any existing HLS instance before loading a new stream
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Reset video source and status
    video.removeAttribute('src');
    video.load(); // Reloads the video element
    displayMessage('Loading stream...');

    // Basic URL validation
    if (!hlsUrl.trim() || (!hlsUrl.startsWith('http://') && !hlsUrl.startsWith('https://'))) {
      displayMessage('Please enter a valid HTTP or HTTPS URL.', 'error');
      video.pause();
      video.removeAttribute('src');
      return;
    }

    // Check if HLS.js is supported by the browser
    if (Hls.isSupported()) {
      hlsRef.current = new Hls(); // Create a new Hls.js instance

      // Attach error listener for HLS.js
      hlsRef.current.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              if (data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR) {
                displayMessage(`Error: Could not load stream manifest from "${data.url}". The URL might be incorrect, the stream is offline, or there's a CORS issue.`, 'error');
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

      // Attach the video element to HLS.js
      hlsRef.current.attachMedia(video);

      // Load the stream source once media is attached
      hlsRef.current.on(Hls.Events.MEDIA_ATTACHED, () => {
        hlsRef.current?.loadSource(hlsUrl);
      });

      // Once manifest is parsed, try to play the video
      hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
        displayMessage(`Manifest parsed. Playing stream...`, 'success');
        video.play().catch(error => {
          displayMessage(`Error playing video: ${error.message}. Please enable autoplay or click play.`, 'error');
          console.error('Video play failed:', error);
        });
      });

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (e.g., Safari)
      displayMessage('Browser supports native HLS playback. Loading stream...');
      video.src = hlsUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play().then(() => {
          displayMessage('Stream loaded and playing!', 'success');
        }).catch(error => {
          displayMessage(`Error playing video: ${error.message}. Please enable autoplay or click play.`, 'error');
          console.error('Video play failed (native):', error);
        });
      }, { once: true });

      // Native video element error handling
      video.addEventListener('error', () => {
        displayMessage(`Native video playback error: Could not load stream from "${hlsUrl}". The URL might be incorrect or the stream is offline.`, 'error');
        video.pause();
        video.removeAttribute('src');
      }, { once: true });
    } else {
      // Browser does not support HLS at all
      displayMessage('Your browser does not support HLS streaming. Please use a modern browser like Chrome, Firefox, Edge, or Safari.', 'error');
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
        return 'text-red-500';
      case 'success':
        return 'text-green-600';
      case 'info':
      default:
        return 'text-gray-600';
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
