import React, { useEffect, useState } from "react";

const UserDashboard = () => {
  const [wasteRecords, setWasteRecords] = useState([]);
  const [totalReward, setTotalReward] = useState(0);
  const [latestMaterial, setLatestMaterial] = useState("");
  const [error, setError] = useState("");

  const materialRewards = {
    plastic: 10,
    metal: 20,
    glass: 30,
  };

  const fetchJoystickData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/joystick");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();

      if (Array.isArray(data)) {
        let total = 0;
        const records = data.map((row) => {
          const material = row.material || "unknown";
          const reward = materialRewards[material] || 0;
          total += reward;
          return {
            dateTime: row.time ? new Date(row.time).toLocaleString() : "-",
            type: material,
            quantity: 1,
            amount: reward,
          };
        });

        setWasteRecords(records);
        setTotalReward(total);

        if (records.length > 0) {
          setLatestMaterial(records[records.length - 1].type); // ✅ latest record
        }
      }
    } catch (err) {
      console.error("Error fetching joystick data:", err);
      setError("⚠️ Unable to fetch waste records. Please try again later.");
    }
  };

  useEffect(() => {
    fetchJoystickData();
    const interval = setInterval(fetchJoystickData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4 md:p-8 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
            User Dashboard
          </h1>
          <p className="text-gray-400 text-lg">Track your waste recycling journey</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-xl mb-8 text-center backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Latest Material Card */}
          {latestMaterial && (
            <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm border border-green-500/30 p-6 rounded-2xl shadow-xl">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-sm text-gray-400 mb-2">Latest Submission</h3>
                <p className="text-3xl font-bold text-green-400 uppercase tracking-wider">
                  {latestMaterial}
                </p>
              </div>
            </div>
          )}

          {/* Total Reward Card */}
          <div className="bg-gradient-to-br from-purple-600/20 to-blue-800/20 backdrop-blur-sm border border-purple-500/30 p-6 rounded-2xl shadow-xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-sm text-gray-400 mb-2">Total Rewards</h3>
              <p className="text-3xl font-bold text-purple-400 mb-4">
                Rs. {totalReward}
              </p>
              <button
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                onClick={() => alert("Withdraw feature coming soon!")}
              >
                Withdraw Money
              </button>
            </div>
          </div>

          {/* Total Submissions Card */}
          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-800/20 backdrop-blur-sm border border-blue-500/30 p-6 rounded-2xl shadow-xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-sm text-gray-400 mb-2">Total Submissions</h3>
              <p className="text-3xl font-bold text-blue-400">
                {wasteRecords.length}
              </p>
            </div>
          </div>
        </div>

        {/* Waste Records Table */}
        <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700/50">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <svg className="w-7 h-7 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Waste Records
            </h2>
          </div>

          <div className="overflow-x-auto">
            {wasteRecords.length === 0 ? (
              <div className="p-12 text-center">
                <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-400 text-lg">No waste records found.</p>
                <p className="text-gray-500 text-sm mt-2">Start submitting waste to see your records here!</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Material Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Reward (Rs.)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {wasteRecords.map((record, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-700/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {record.dateTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${
                          record.type === 'plastic' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                          record.type === 'metal' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                          record.type === 'glass' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                        }`}>
                          {record.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {record.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-green-400 font-semibold">
                          Rs. {record.amount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
