"use client";
import { useEffect, useRef, useState } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";

export const useFaceTracking = ({
  videoRef,
  canvasRef,
  stats,
  setStats,
  setAttentionState,
}) => {
  const faceLandmarkerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const idleTimeoutRef = useRef(null);
  const [showMesh, setShowMesh] = useState(false);
  const detectorModelRef = useRef(null);

  // Ref to track last update time for each metric (in ms)
  const lastUpdateRef = useRef({
    distraction_seconds: 0,
    looked_away_count: 0,
    phone_detected_count: 0,
  });

  const updateThrottled = (key) => {
    if (
      typeof window !== "undefined" &&
      window.shouldMonitorStats?.() === false
    )
      return;

    const now = Date.now();
    if (now - lastUpdateRef.current[key] >= 1000) {
      setStats((prev) => ({ ...prev, [key]: prev[key] + 1 }));
      lastUpdateRef.current[key] = now;
    }
  };

  const updateMetric = (key) => {
    if (
      typeof window !== "undefined" &&
      window.shouldMonitorStats?.() === false
    )
      return;

    setStats((prev) => ({ ...prev, [key]: prev[key] + 1 }));
  };
  const detectAttention = (blendshapes) => {
    const features = {};
    blendshapes.forEach((f) => (features[f.categoryName] = f.score || 0));

    const eyeClosed = Math.max(features.eyeBlinkLeft, features.eyeBlinkRight);
    const lookingAway = Math.max(
      features.eyeLookInLeft,
      features.eyeLookInRight
    );
    const lookingDown = Math.max(
      features.eyeLookDownLeft,
      features.eyeLookDownRight
    );
    const confused = Math.max(features.browDownLeft, features.browDownRight);

    if (eyeClosed > 0.4) return "eyesClosed";
    if (lookingAway > 0.7) return "lookingAway";
    if (lookingDown > 0.6) return "lookingDown";
    if (confused > 0.3) return "confused";
    return "attentive";
  };

  const resetIdleTimer = () => {
    clearTimeout(idleTimeoutRef.current);
    idleTimeoutRef.current = setTimeout(() => {
      updateMetric("idle_timeout_count");
    }, 15000);
  };

  const handleTabSwitch = () => {
    if (document.hidden) {
      updateMetric("tab_switch_count");
    }
  };

  const renderLoop = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const loop = () => {
      if (!video.videoWidth || !video.videoHeight || video.readyState < 2) {
        animationFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      const now = performance.now();
      if (!faceLandmarkerRef.current) {
        console.warn("FaceLandmarker not initialized yet.");
        animationFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      const results = faceLandmarkerRef.current.detectForVideo(video, now);

      if (results.faceLandmarks?.length > 0) {
        if (showMesh) {
          const drawingUtils = new DrawingUtils(ctx);
          for (const landmarks of results.faceLandmarks) {
            drawingUtils.drawConnectors(
              landmarks,
              FaceLandmarker.FACE_LANDMARKS_TESSELATION,
              { color: "#00FF00", lineWidth: 1 }
            );
          }
        }

        const attention = detectAttention(
          results.faceBlendshapes[0].categories
        );
        if (attention !== "attentive") {
          updateThrottled("distraction_seconds");
          if (attention === "lookingAway") updateThrottled("looked_away_count");
        }

        if (setAttentionState) setAttentionState(attention);
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    loop();
  };

  const phoneDetectionLoop = async () => {
    const video = videoRef.current;
    if (!video || !detectorModelRef.current) return;

    const detectFrame = async () => {
      if (!video || video.readyState !== 4) {
        requestAnimationFrame(detectFrame);
        return;
      }

      try {
        const predictions = await detectorModelRef.current.detect(video);
        const phone = predictions.find(
          (p) => p.class === "cell phone" && p.score > 0.6
        );
        if (phone) {
          updateThrottled("phone_detected_count");
          console.warn("🚨 Cell phone detected!");
        }
      } catch (err) {
        console.error("Phone detection error:", err);
      }

      requestAnimationFrame(detectFrame);
    };

    detectFrame();
  };

  const startFaceTracking = async () => {
    await tf.setBackend("webgl"); // or 'cpu'
    await tf.ready();
    detectorModelRef.current = await cocoSsd.load();
    console.log("✅ COCO-SSD loaded for phone detection");

    const filesetResolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );

    const faceLandmarker = await FaceLandmarker.createFromOptions(
      filesetResolver,
      {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU",
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1,
      }
    );

    faceLandmarkerRef.current = faceLandmarker;

    if (videoRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } else {
      console.error("Video element not available.");
      return;
    }

    resetIdleTimer();
    ["mousemove", "mousedown", "keypress", "touchstart"].forEach((e) =>
      window.addEventListener(e, resetIdleTimer)
    );
    window.addEventListener("visibilitychange", handleTabSwitch);

    renderLoop();
    phoneDetectionLoop();
  };

  const stopFaceTracking = () => {
    cancelAnimationFrame(animationFrameRef.current);
    const tracks = videoRef.current?.srcObject?.getTracks();
    tracks?.forEach((track) => track.stop());

    ["mousemove", "mousedown", "keypress", "touchstart"].forEach((e) =>
      window.removeEventListener(e, resetIdleTimer)
    );
    window.removeEventListener("visibilitychange", handleTabSwitch);

    if (faceLandmarkerRef.current) {
      faceLandmarkerRef.current.close();
      faceLandmarkerRef.current = null;
    }
  };

  useEffect(() => {
    window._stopTracking = stopFaceTracking;
    window.startFaceTracking = startFaceTracking;
    window.toggleMeshVisibility = () => setShowMesh((prev) => !prev);

    return () => {
      stopFaceTracking();
      window._stopTracking = null;
      window.startFaceTracking = null;
      window.toggleMeshVisibility = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { showMesh, setShowMesh };
};
