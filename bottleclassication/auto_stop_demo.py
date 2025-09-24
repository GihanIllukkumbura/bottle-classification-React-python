"""
Auto-Stop Bottle Detection Demo

This script demonstrates the new auto-stop functionality where the camera
automatically stops when a bottle is detected and displays the captured image.
"""

import object_detection_1 as detector
import time

def demo_auto_stop_detection():
    """Demonstrate the auto-stop detection feature"""
    
    print("🍾 Auto-Stop Bottle Detection Demo")
    print("=" * 50)
    print()
    print("📋 How it works:")
    print("1. Camera starts and monitors for bottles")
    print("2. When a bottle is detected, camera automatically stops")
    print("3. Detection image is displayed with highlighted bottles")
    print("4. Detection data is saved to global variables")
    print()
    print("🎯 Features:")
    print("✓ Auto-stop on first bottle detection")
    print("✓ High-resolution image display with matplotlib")
    print("✓ Detection boxes and confidence scores")
    print("✓ Automatic frame saving")
    print("✓ Terminal output with detection statistics")
    print()
    
    choice = input("Start auto-stop detection? (y/n): ").strip().lower()
    
    if choice == 'y':
        print("\n🚀 Starting auto-stop detection...")
        print("Position a bottle in front of the camera!")
        time.sleep(2)
        
        # Start the auto-stop detection
        detector.detect_webcam_with_auto_stop()
        
        # After detection, show what was captured
        print("\n📊 Checking captured data...")
        frame, results = detector.get_current_detection()
        
        if frame is not None and results is not None:
            print("✅ Detection data captured successfully!")
            print(f"   Bottles detected: {results['bottle_count']}")
            print(f"   Frame number: {results['frame_number']}")
            print(f"   Timestamp: {time.ctime(results['timestamp'])}")
            print("   Image has been displayed in matplotlib window")
            
            # Option to save the frame
            save_choice = input("\nSave detection image to file? (y/n): ").strip().lower()
            if save_choice == 'y':
                detector.save_detection_frame_to_file()
        else:
            print("❌ No detection occurred during the session")
    else:
        print("Demo cancelled.")

def show_detection_comparison():
    """Show comparison between continuous and auto-stop modes"""
    
    print("\n🔄 Detection Mode Comparison")
    print("=" * 40)
    print()
    print("Continuous Mode (Option 2):")
    print("• Runs until you press 'q'")
    print("• Detects multiple bottles over time")
    print("• Shows real-time FPS and statistics")
    print("• Good for monitoring environments")
    print()
    print("Auto-Stop Mode (Option 3):")
    print("• Stops immediately when bottle detected")
    print("• Captures and displays the detection image")
    print("• Perfect for single bottle identification")
    print("• Automatic image presentation")
    print()

if __name__ == "__main__":
    print("🍾 Bottle Detection System Demo")
    print("=" * 50)
    print()
    print("Choose demo:")
    print("1. Auto-stop detection demo")
    print("2. Detection mode comparison")
    print("3. Run main detection system")
    
    choice = input("Enter choice (1-3): ").strip()
    
    if choice == "1":
        demo_auto_stop_detection()
    elif choice == "2":
        show_detection_comparison()
    elif choice == "3":
        detector.main()
    else:
        print("Invalid choice")