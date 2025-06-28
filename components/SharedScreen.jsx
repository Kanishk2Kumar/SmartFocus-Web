import { useRef } from 'react';

export default function SharedScreen() {
  const sharedVideoRef = useRef();

  const handleSelectTab = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser' }
      });
      sharedVideoRef.current.srcObject = stream;

      // Optional: Notify parent via custom event or callback
      if (typeof window.startFaceTracking === 'function') {
        window.startFaceTracking(); // We'll define this in webcam logic
      }

      stream.getVideoTracks()[0].addEventListener('ended', () => {
        console.log('🛑 Screen sharing ended.');
        if (typeof window.stopMonitoring === 'function') {
          window.stopMonitoring(); // We'll also expose this
        }
      });
    } catch (err) {
      alert('Failed to share screen: ' + err.message);
    }
  };

  return (
    <div className="w-full">
      <h3 className="font-semibold mb-2">📺 Shared Tab</h3>
      
      <video
        ref={sharedVideoRef}
        autoPlay
        muted
        className="w-full rounded border"
      />
      <button
        className="mt-3 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        onClick={handleSelectTab}
      >
        Select Tab to Monitor
      </button>
    </div>
  );
}
