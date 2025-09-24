"""
Object Detection API Integration Module

This module provides a simplified interface for the object detection system
that can be called from the Flask API.
"""

import json
import sys
import os
from datetime import datetime

def mock_detection():
    """
    Mock object detection function for testing
    Returns detection results in JSON format
    """
    detection_result = {
        "success": True,
        "timestamp": datetime.now().isoformat(),
        "bottle_count": 1,
        "bottles": [
            {
                "confidence": 0.89,
                "bbox": [150, 120, 280, 350]
            }
        ],
        "image_saved": True,
        "image_path": "detected_bottle.jpg"
    }
    
    # Print JSON result for the API to capture
    print(json.dumps(detection_result))
    return detection_result

if __name__ == "__main__":
    # This will be called by the Flask API
    mock_detection()