import { useRef, useState } from "react";
import { useFaceTracking } from "../lib/useFaceTracking";

export default function WebcamMonitor({ stats, setStats }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [attention, setAttention] = useState("");

  const { showMesh, setShowMesh } = useFaceTracking({
    videoRef,
    canvasRef,
    stats,
    setStats,
    setAttentionState: setAttention,
  });

  return (
    <div className="w-full space-y-2">
      <h3 className="font-semibold my-">Face Monitor</h3>

      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="rounded border w-[34rem]"
          id="webcam"
        />
        <canvas
          ref={canvasRef}
          className="absolute left-0 top-0 pointer-events-none"
          id="output_canvas"
        />
      </div>
      <div className="flex flex-row gap-6 items-center">
        <button
          onClick={() => setShowMesh(!showMesh)}
          className="mt-1 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          {showMesh ? "Hide Mesh" : "Show Mesh"}
        </button>
        <p className="text-lg text-gray-600 pt-1">
          Current Status: <strong>{attention || "N/A"}</strong>
        </p>
      </div>
    </div>
  );
}
