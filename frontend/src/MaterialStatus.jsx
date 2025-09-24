// src/MaterialStatus.jsx
import React, { useState, useEffect } from "react";
import { database } from "./firebase";
import { ref, onValue } from "firebase/database";

const MaterialStatus = () => {
  const [material, setMaterial] = useState("Waiting...");

  useEffect(() => {
    const materialRef = ref(database, "waste_sorting/joystick");

    // Listen for changes in real-time
    onValue(materialRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.material) {
        setMaterial(data.material);
      }
    });
  }, []);

  return (
    <div>
      <h2>Current Material Detected:</h2>
      <p style={{ fontSize: "24px", fontWeight: "bold" }}>{material}</p>
    </div>
  );
};

export default MaterialStatus;
