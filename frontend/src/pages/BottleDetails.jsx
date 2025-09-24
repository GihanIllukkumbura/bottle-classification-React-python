import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BottleDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bottleData, setBottleData] = useState(null);
  const [analysisStep, setAnalysisStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (location.state) {
      setBottleData(location.state);
    } else {
      // Redirect back if no data
      navigate("/user-object");
    }
  }, [location.state, navigate]);

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisStep(1);

    // Simulate analysis steps
    const steps = [
      { step: 1, message: "Analyzing bottle material...", duration: 2000 },
      { step: 2, message: "Checking bottle condition...", duration: 1500 },
      { step: 3, message: "Calculating recycling value...", duration: 1800 },
      { step: 4, message: "Generating recommendations...", duration: 1200 },
    ];

    steps.forEach((stepData, index) => {
      setTimeout(() => {
        setAnalysisStep(stepData.step);
        if (index === steps.length - 1) {
          setTimeout(() => {
            setIsAnalyzing(false);
            setAnalysisStep(5); // Complete
          }, stepData.duration);
        }
      }, index * 1000);
    });
  };

  const getStepMessage = () => {
    const messages = {
      1: "Analyzing bottle material composition...",
      2: "Checking bottle condition and damage...",
      3: "Calculating potential recycling value...",
      4: "Generating sustainability recommendations...",
      5: "Analysis complete!"
    };
    return messages[analysisStep] || "";
  };

  if (!bottleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 font-mono text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/user-object")}
          className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-xl flex items-center justify-center transition-colors duration-200"
        >
          <i className="fas fa-arrow-left text-white"></i>
        </button>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-green-400 to-blue-500 bg-clip-text text-transparent">
            Bottle Analysis
          </h1>
          <p className="text-gray-400 text-sm mt-1">Detailed bottle classification and recycling information</p>
        </div>
      </div>

      <div className="relative z-10 grid lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-image text-white text-sm"></i>
            </div>
            <h2 className="text-xl font-bold">Detected Image</h2>
          </div>

          <div className="bg-black/50 rounded-2xl p-4 mb-6">
            {bottleData.image && (
              <img 
                src={bottleData.image} 
                alt="Detected Bottle" 
                className="w-full h-80 object-contain rounded-xl"
              />
            )}
          </div>

          {/* Detection Info */}
          {bottleData.detectionData && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-400/30">
                <div className="text-blue-400 text-2xl font-bold">
                  {bottleData.detectionData.bottle_count || 1}
                </div>
                <div className="text-gray-400 text-sm">Bottles Detected</div>
              </div>
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-400/30">
                <div className="text-green-400 text-2xl font-bold">
                  {Math.round((bottleData.detectionData.bottles?.[0]?.confidence || 0.85) * 100)}%
                </div>
                <div className="text-gray-400 text-sm">Confidence</div>
              </div>
            </div>
          )}
        </div>

        {/* Analysis Section */}
        <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-cogs text-white text-sm"></i>
            </div>
            <h2 className="text-xl font-bold">Bottle Analysis</h2>
          </div>

          {!isAnalyzing && analysisStep < 5 ? (
            /* Start Analysis */
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-play text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Ready for Analysis</h3>
              <p className="text-gray-400 mb-8">
                Start comprehensive bottle analysis to get recycling recommendations and material classification.
              </p>
              <button
                onClick={startAnalysis}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <i className="fas fa-search mr-2"></i>
                Start Analysis
              </button>
            </div>
          ) : isAnalyzing ? (
            /* Analysis in Progress */
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <i className="fas fa-spinner fa-spin text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Analyzing Bottle</h3>
              <p className="text-gray-400 mb-8">{getStepMessage()}</p>

              {/* Progress Steps */}
              <div className="space-y-4 mb-8">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center gap-3">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step <= analysisStep 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-600 text-gray-400'
                      }`}
                    >
                      {step < analysisStep ? (
                        <i className="fas fa-check text-sm"></i>
                      ) : step === analysisStep ? (
                        <i className="fas fa-spinner fa-spin text-sm"></i>
                      ) : (
                        step
                      )}
                    </div>
                    <div className={`text-sm ${step <= analysisStep ? 'text-white' : 'text-gray-500'}`}>
                      {step === 1 && "Material Analysis"}
                      {step === 2 && "Condition Check"}
                      {step === 3 && "Value Calculation"}
                      {step === 4 && "Recommendations"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Analysis Complete */
            <div>
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-check text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-green-400 mb-2">Analysis Complete!</h3>
              </div>

              {/* Results */}
              <div className="space-y-4">
                {/* Material Type */}
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-400/30">
                  <div className="flex items-center gap-3 mb-2">
                    <i className="fas fa-flask text-blue-400"></i>
                    <span className="font-semibold">Material Type</span>
                  </div>
                  <div className="text-blue-400 font-bold text-lg">PET Plastic</div>
                  <div className="text-gray-400 text-sm">High-quality recyclable plastic</div>
                </div>

                {/* Condition */}
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-400/30">
                  <div className="flex items-center gap-3 mb-2">
                    <i className="fas fa-shield-alt text-green-400"></i>
                    <span className="font-semibold">Condition</span>
                  </div>
                  <div className="text-green-400 font-bold text-lg">Excellent</div>
                  <div className="text-gray-400 text-sm">No damage detected, ready for recycling</div>
                </div>

                {/* Recycling Value */}
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-400/30">
                  <div className="flex items-center gap-3 mb-2">
                    <i className="fas fa-coins text-yellow-400"></i>
                    <span className="font-semibold">Recycling Value</span>
                  </div>
                  <div className="text-yellow-400 font-bold text-lg">$0.05</div>
                  <div className="text-gray-400 text-sm">Standard PET bottle deposit</div>
                </div>

                {/* Recommendation */}
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-400/30">
                  <div className="flex items-center gap-3 mb-2">
                    <i className="fas fa-lightbulb text-purple-400"></i>
                    <span className="font-semibold">Recommendation</span>
                  </div>
                  <div className="text-purple-400 font-bold text-lg">Recycle</div>
                  <div className="text-gray-400 text-sm">Place in plastic recycling bin</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  <i className="fas fa-chart-line mr-2"></i>
                  View Dashboard
                </button>
                <button
                  onClick={() => navigate("/user-object")}
                  className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  <i className="fas fa-camera mr-2"></i>
                  Detect Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BottleDetails;