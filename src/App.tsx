import React, { useRef, useState, useEffect } from 'react';
import Hls from 'hls.js'; // Ensure hls.js is available in the environment or loaded via script tag

// Define the main App component
const App: React.FC = () => {
  // useRef to get direct access to the video element in the DOM
  const videoRef = useRef<HTMLVideoElement>(null);
  // useRef to store the Hls.js instance, so it persists across renders
  const hlsRef = useRef<Hls | null>(null);

  // useState for the HLS URL input field
  const [hlsUrl, setHlsUrl] = useState<string>('');
  // useState for displaying status messages to the user
  const [statusMessage, setStatusMessage] = useState<string>('Enter a URL and click Load Stream to begin.');
  // useState for controlling the style of the status message (e.g., error, success)
  const [statusType, setStatusType] = useState<'info' | 'error' | 'success'>('info');

  // useEffect hook for initializing and cleaning up Hls.js
  useEffect(() => {
    // This function will be called when the component unmounts or dependencies change
    return () => {
      // If an Hls.js instance exists, destroy it to prevent memory leaks
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  // Function to display messages to the user with different styles
  const displayMessage = (msg: string, type: 'info' | 'error' | 'success' = 'info') => {
    setStatusMessage(msg);
    setStatusType(type);
  };

  // Function to load the HLS stream
  const loadHlsStream = () => {
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
      // Ensure video is stopped and cleared on invalid URL
      video.pause();
      video.removeAttribute('src');
      return;
    }

    // Check if HLS.js is supported by the browser
    if (Hls.isSupported()) {
      hlsRef.current = new Hls(); // Create a new Hls.js instance

      // Attach error listener for HLS.js
      hlsRef.current.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // Specific handling for manifest load error
              if (data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR) {
                displayMessage(`Error: Could not load stream manifest from "${data.url}". The URL might be incorrect, the stream is offline, or there's a CORS issue.`, 'error');
                // Explicitly stop video and destroy HLS instance on fatal manifest load error
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
              // Cannot recover from other fatal errors
              displayMessage(`An unrecoverable HLS error occurred: ${data.details}.`, 'error');
              // Explicitly stop video and destroy HLS instance
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
      }, { once: true }); // Ensure listener runs only once

      // Native video element error handling
      video.addEventListener('error', () => {
        displayMessage(`Native video playback error: Could not load stream from "${hlsUrl}". The URL might be incorrect or the stream is offline.`, 'error');
        // Explicitly stop video and clear source on native playback error
        video.pause();
        video.removeAttribute('src');
      }, { once: true });
    } else {
      // Browser does not support HLS at all
      displayMessage('Your browser does not support HLS streaming. Please use a modern browser like Chrome, Firefox, Edge, or Safari.', 'error');
      // Explicitly stop video and clear source if HLS is not supported
      video.pause();
      video.removeAttribute('src');
    }
  };

  // Determine the status message text color based on statusType
  const getStatusColorClass = () => {
    switch (statusType) {
      case 'error':
        return 'text-red-500';
      case 'success':
        return 'text-green-600';
      case 'info':
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 font-inter">
      <div className="video-container flex w-full max-w-3xl flex-col items-center rounded-xl bg-white p-6 shadow-xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">HLS Stream Player</h1>

        <div className="controls mb-4 flex w-full flex-wrap justify-center gap-3">
          <input
            type="text"
            id="hlsUrlInput"
            placeholder="Enter HLS Stream URL"
            className="flex-grow rounded-lg border border-gray-300 p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 sm:max-w-md"
            value={hlsUrl}
            onChange={(e) => setHlsUrl(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                loadHlsStream();
              }
            }}
          />
          <button
            id="loadStreamButton"
            className="rounded-lg bg-blue-500 px-6 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={loadHlsStream}
          >
            Load Stream
          </button>
        </div>

        <video
          ref={videoRef}
          id="videoPlayer"
          controls
          muted
          autoPlay
          className="mt-4 w-full rounded-lg bg-black shadow-lg"
        ></video>
        <p id="statusMessage" className={`mt-4 text-sm ${getStatusColorClass()} min-h-[1.5em]`}>
          {statusMessage}
        </p>
      </div>
    </div>
  );
};

export default App;

