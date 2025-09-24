import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const UserObject = () => {
  const [data, setData] = useState([]);
  const [latestMaterial, setLatestMaterial] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState("");
  const [detectedImage, setDetectedImage] = useState(null);
  const [detectionResults, setDetectionResults] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [detectionProgress, setDetectionProgress] = useState(0);
  const [detectionTime, setDetectionTime] = useState(null);
  const [cameraStatus, setCameraStatus] = useState("idle");
  const intervalRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const navigate = useNavigate();

  const getMaterialColor = (material) => {
    const colors = {
      plastic: "#00ffcc",
      metal: "#39ff14",
      glass: "#1effff",
      bottle: "#ff6b35",
      default: "#7f8c8d",
    };
    return colors[material?.toLowerCase()] || colors.default;
  };

  const startObjectDetection = async () => {
    setShowPopup(true);
    setIsDetecting(true);
    setDetectionStatus("Initializing camera...");
    setDetectionProgress(10);
    setCameraStatus("initializing");
    const startTime = Date.now();

    try {
      // Simulate detection process steps
      setTimeout(() => {
        setDetectionStatus("Starting real-time detection...");
        setDetectionProgress(20);
        setCameraStatus("starting");
      }, 500);

      setTimeout(() => {
        setDetectionStatus("Camera active - Scanning for bottles...");
        setDetectionProgress(40);
        setCameraStatus("scanning");
      }, 1000);

      setTimeout(() => {
        setDetectionStatus("Processing live camera feed...");
        setDetectionProgress(60);
        setCameraStatus("processing");
      }, 1500);

      // Call the real-time object detection API
      const response = await fetch("http://localhost:5000/api/detect-bottle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mode: "real-time-auto-stop" }),
      });

      if (response.ok) {
        const result = await response.json();
        setDetectionProgress(80);
        setDetectionStatus("Processing detection results...");
        setCameraStatus("analyzing");

        if (result.success && result.image) {
          setTimeout(() => {
            const detectionTimeMs = Date.now() - startTime;
            setDetectedImage(result.image);
            setDetectionResults(result.detection_data);
            setDetectionStatus("🍾 Bottle captured successfully!");
            setDetectionProgress(100);
            setDetectionTime(detectionTimeMs);
            setCameraStatus("completed");
          }, 500);
        } else {
          const detectionTimeMs = Date.now() - startTime;
          setDetectionStatus(result.message || "Camera scan complete - No bottles detected.");
          setDetectionProgress(100);
          setDetectionTime(detectionTimeMs);
          setCameraStatus("completed");
          setTimeout(() => {
            setShowPopup(false);
            setIsDetecting(false);
          }, 3000);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Detection service unavailable");
      }
    } catch (error) {
      console.error("Real-time detection error:", error);
      const detectionTimeMs = Date.now() - startTime;
      setDetectionStatus(`Detection failed: ${error.message}`);
      setDetectionProgress(100);
      setDetectionTime(detectionTimeMs);
      setCameraStatus("error");
      setTimeout(() => {
        setShowPopup(false);
        setIsDetecting(false);
      }, 4000);
    }
  };

  const proceedToDetails = () => {
    // Navigate to bottle details page with detection data
    navigate("/bottle-details", {
      state: {
        image: detectedImage,
        detectionData: detectionResults,
        material: "bottle",
      },
    });
  };

  const closeDetection = () => {
    setShowPopup(false);
    setIsDetecting(false);
    setDetectedImage(null);
    setDetectionResults(null);
    setDetectionProgress(0);
    setDetectionStatus("");
    setDetectionTime(null);
    setCameraStatus("idle");
  };

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/joystick");
      const json = await res.json();
      if (json.length > 0) {
        setData(json);
        setLatestMaterial(json[0].material);
      }
    } catch (err) {
      console.error("Error fetching joystick data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, 2000);
    return () => clearInterval(intervalRef.current);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 font-mono text-green-300 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <i className="fas fa-eye text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-green-400 to-blue-500 bg-clip-text text-transparent tracking-wider drop-shadow-lg">
              AI Object Detection
            </h1>
            <p className="text-gray-400 text-sm mt-1">Real-time bottle classification system</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-green-500/20 border border-green-400/50 px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-semibold">LIVE</span>
          </div>
          <div className="text-sm text-gray-400">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex justify-center">
        {/* Control Panel */}
        <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 shadow-2xl max-w-2xl w-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-cogs text-white text-sm"></i>
            </div>
            <h2 className="text-xl font-bold text-white">Detection Controls</h2>
          </div>

          {/* Detection Button */}
          <div className="space-y-6">
            <button
              onClick={startObjectDetection}
              disabled={isDetecting}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-6 px-8 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center gap-3">
                <i className={`fas ${isDetecting ? 'fa-spinner fa-spin' : 'fa-camera'} text-xl`}></i>
                <span className="text-xl">
                  {isDetecting ? 'Detecting...' : 'Start Bottle Detection'}
                </span>
              </div>
            </button>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="group bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-400/30 text-purple-300 font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-center gap-2">
                  <i className="fas fa-chart-line"></i>
                  <span>Dashboard</span>
                </div>
              </button>
              <button className="group bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-400/30 text-green-300 font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center gap-2">
                  <i className="fas fa-history"></i>
                  <span>History</span>
                </div>
              </button>
            </div>

            {/* System Status */}
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-600/30">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">System Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-semibold">OPERATIONAL</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Last scan: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detection Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-gray-700/50 shadow-2xl max-w-2xl w-full p-8 relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 animate-pulse"></div>
            
            {/* Close Button */}
            <button
              onClick={closeDetection}
              className="absolute top-4 right-4 w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
            >
              <i className="fas fa-times text-gray-300"></i>
            </button>

            <div className="relative z-10">
              {!detectedImage ? (
                /* Detection In Progress */
                <div className="text-center">
                  <div className="mb-8">
                    <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                      <i className={`fas ${cameraStatus === 'scanning' ? 'fa-video' : 'fa-camera'} text-white text-2xl`}></i>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Real-Time Bottle Detection</h3>
                    <p className="text-gray-400 mb-2">{detectionStatus}</p>
                    {detectionTime && (
                      <p className="text-sm text-cyan-400">Processing time: {(detectionTime / 1000).toFixed(1)}s</p>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-700 rounded-full h-3 mb-6 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                      style={{ width: `${detectionProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <div className="text-cyan-400 font-semibold">{detectionProgress}%</div>
                    {cameraStatus === 'scanning' && (
                      <div className="flex items-center gap-2 text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm">Camera Live</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Detection Results */
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    <i className="fas fa-check-circle text-green-400 mr-2"></i>
                    Bottle Captured from Live Feed!
                  </h3>

                  {/* Detected Image */}
                  <div className="bg-black/50 rounded-2xl p-4 mb-6 border border-gray-600/30">
                    <img 
                      src={detectedImage} 
                      alt="Detected Bottle" 
                      className="w-full max-h-80 object-contain rounded-xl"
                    />
                  </div>

                  {/* Detection Info */}
                  {detectionResults && (
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 mb-6 border border-green-400/30">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Bottles Found:</span>
                          <div className="text-green-400 font-bold text-xl">{detectionResults.bottle_count}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Confidence:</span>
                          <div className="text-green-400 font-bold text-xl">
                            {Math.round(detectionResults.bottles?.[0]?.confidence * 100 || 0)}%
                          </div>
                        </div>
                        {detectionTime && (
                          <div>
                            <span className="text-gray-400">Detection Time:</span>
                            <div className="text-cyan-400 font-bold text-xl">{(detectionTime / 1000).toFixed(1)}s</div>
                          </div>
                        )}
                        {detectionResults.processing_time && (
                          <div>
                            <span className="text-gray-400">Processing:</span>
                            <div className="text-purple-400 font-bold text-xl">{detectionResults.processing_time}s</div>
                          </div>
                        )}
                      </div>
                      {detectionResults.timestamp && (
                        <div className="mt-3 text-xs text-gray-400">
                          Captured: {detectionResults.timestamp}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={proceedToDetails}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <i className="fas fa-arrow-right mr-2"></i>
                      Analyze Bottle
                    </button>
                    <button
                      onClick={closeDetection}
                      className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <i className="fas fa-redo mr-2"></i>
                      Detect Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserObject;
