"""
Example script showing how to access saved detection frames programmatically

This script demonstrates how to work with the detection results from 
object_detection_1.py after running real-time detection.
"""

# Import the detection module
import object_detection_1 as detector
import cv2
import time

def access_detection_data():
    """Example function showing how to access saved frames and detection data"""
    
    print("📊 Accessing Detection Data Example")
    print("=" * 50)
    
    # Get current detection (if any)
    current_frame, current_results = detector.get_current_detection()
    
    if current_frame is not None:
        print("✅ Current detection available:")
        print(f"   Bottles detected: {current_results['bottle_count']}")
        print(f"   Frame number: {current_results['frame_number']}")
        print(f"   Timestamp: {time.ctime(current_results['timestamp'])}")
        
        # You can work with the frame here
        # For example, save it or process it further
        print(f"   Frame shape: {current_frame.shape}")
        
    else:
        print("❌ No current detection available")
    
    # Get all saved frames
    saved_frames = detector.get_saved_frames()
    
    if saved_frames:
        print(f"\n📦 {len(saved_frames)} saved frames available:")
        
        for i, frame_data in enumerate(saved_frames):
            detections = frame_data['detections']
            print(f"   Frame {i+1}: {detections['bottle_count']} bottles at {frame_data['save_time']}")
            
            # Access the actual frame data
            frame = frame_data['frame']
            print(f"            Frame size: {frame.shape}")
            
            # Example: You could save each frame with a custom name
            # cv2.imwrite(f"custom_frame_{i+1}.jpg", frame)
    else:
        print("\n📦 No saved frames available")
        print("   Run real-time detection first to capture frames")

def monitor_detection_continuously():
    """Example of continuous monitoring of detection results"""
    print("\n🔄 Continuous Detection Monitoring")
    print("Run real-time detection in another window, then watch this console...")
    print("Press Ctrl+C to stop monitoring")
    
    last_frame_count = 0
    
    try:
        while True:
            saved_frames = detector.get_saved_frames()
            current_count = len(saved_frames)
            
            # Check if new frames were detected
            if current_count > last_frame_count:
                print(f"🆕 New detection! Total saved frames: {current_count}")
                
                # Get the latest frame
                if saved_frames:
                    latest = saved_frames[-1]
                    detections = latest['detections']
                    print(f"   Latest: {detections['bottle_count']} bottles at {latest['save_time']}")
                
                last_frame_count = current_count
            
            time.sleep(1)  # Check every second
            
    except KeyboardInterrupt:
        print("\n👋 Monitoring stopped")

if __name__ == "__main__":
    print("🍾 Bottle Detection Frame Access Example")
    print("=" * 60)
    print("This script shows how to access detection data programmatically.")
    print()
    print("Options:")
    print("1. View current detection data")
    print("2. Start continuous monitoring")
    
    choice = input("Enter choice (1 or 2): ").strip()
    
    if choice == "1":
        access_detection_data()
    elif choice == "2":
        monitor_detection_continuously()
    else:
        print("Invalid choice")