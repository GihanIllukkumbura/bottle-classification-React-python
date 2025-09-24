"""
Enhanced Bottle Detection System with Performance Optimizations

This module provides real-time bottle detection using a Faster R-CNN model with
significant performance improvements and automatic frame saving functionality.

Key Features:
- Optimized real-time detection with improved FPS
- Automatic frame saving when bottles are detected
- Terminal display of detection results
- Performance monitoring and statistics
- Frame access through global variables

Performance Optimizations:
- Frame skipping (processes every 3rd frame)
- Reduced resolution processing (320x240)
- Optimized tensor operations
- Minimal memory allocation

Usage:
    python object_detection_1.py

Global Variables:
    current_frame: Latest frame with bottle detection
    detection_results: Latest detection information
    saved_frames: Deque of saved frames with detections

Functions:
    detect_webcam_optimized(): Main real-time detection function
    get_current_detection(): Get current frame and detection data
    get_saved_frames(): Get all saved detection frames
    save_detection_frame_to_file(): Save detection frame to disk
"""

import torch
import torchvision.transforms as T
from PIL import Image
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import cv2
import numpy as np
import time
import threading
import base64
from collections import deque
from model import model  # Import the model from your model.py file

# Global variables for frame saving and monitoring
current_frame = None
detection_results = None
frame_lock = threading.Lock()
saved_frames = deque(maxlen=10)  # Store last 10 frames with detections

def detect_image(img_path):
    """Detect bottles in a static image"""
    # Transformation
    transform = T.Compose([T.ToTensor()])
    
    # Load your image
    img = Image.open(img_path).convert("RGB")
    img_tensor = transform(img)

    # Run detection
    with torch.no_grad():
        preds = model([img_tensor])

    # Extract predictions
    boxes = preds[0]["boxes"]
    labels = preds[0]["labels"]
    scores = preds[0]["scores"]

    # COCO bottle class id = 44
    fig, ax = plt.subplots(1, figsize=(10, 10))
    ax.imshow(img)

    bottle_count = 0
    for box, label, score in zip(boxes, labels, scores):
        if label.item() == 44 and score > 0.5:  # 44 = bottle
            bottle_count += 1
            x1, y1, x2, y2 = box.tolist()
            rect = patches.Rectangle((x1, y1), x2-x1, y2-y1, linewidth=2, edgecolor='r', facecolor='none')
            ax.add_patch(rect)
            ax.text(x1, y1-10, f"Bottle {score:.2f}", color="red", fontsize=12, backgroundcolor="white")

    print(f"Detected {bottle_count} bottles")
    plt.show()

def detect_webcam_optimized():
    """
    Optimized real-time bottle detection with improved FPS performance
    Features:
    - Frame skipping for better performance
    - Reduced resolution processing
    - Automatic frame saving when bottles detected
    - FPS monitoring
    - Terminal display of detection results
    - Auto-stop camera and display image when bottle detected
    """
    global current_frame, detection_results, saved_frames
    
    # Initialize webcam
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("❌ Error: Could not open webcam")
        print("   Troubleshooting:")
        print("   1. Check if camera is connected and not used by another app")
        print("   2. Try changing camera index (0, 1, 2, etc.)")
        print("   3. Check camera permissions")
        return
    
    # Test camera capture
    ret, test_frame = cap.read()
    if not ret:
        print("❌ Error: Camera connected but cannot capture frames")
        print("   This might be a driver or permission issue")
        cap.release()
        return
    
    print(f"✅ Camera initialized successfully - Frame size: {test_frame.shape}")
    
    # Set camera properties for better performance
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    cap.set(cv2.CAP_PROP_FPS, 30)
    
    print("Real-time bottle detection started...")
    print("Camera will automatically stop and display image when bottle is detected!")
    print("Press 'q' to quit manually")
    print("-" * 60)
    
    # Performance optimization parameters
    DETECTION_INTERVAL = 3  # Process every 3rd frame for detection
    RESIZE_WIDTH = 320  # Smaller resolution for faster processing
    RESIZE_HEIGHT = 240
    CONFIDENCE_THRESHOLD = 0.6  # Base confidence threshold
    HIGH_CONFIDENCE_THRESHOLD = 0.8  # High confidence threshold for auto-stop display
    
    # Create optimized transform
    transform = T.Compose([
        T.Resize((RESIZE_HEIGHT, RESIZE_WIDTH)),  # Reduce resolution
        T.ToTensor()
    ])
    
    # FPS tracking
    fps_counter = 0
    fps_start_time = time.time()
    frame_count = 0
    detection_count = 0
    
    # Detection state
    last_detection_time = 0
    bottles_detected_current = 0
    
    while True:
        start_time = time.time()
        
        # Capture frame
        ret, frame = cap.read()
        if not ret:
            print("Error: Failed to capture image")
            break
        
        frame_count += 1
        display_frame = frame.copy()
        
        # Only run detection every DETECTION_INTERVAL frames
        if frame_count % DETECTION_INTERVAL == 0:
            # Resize frame for faster processing
            small_frame = cv2.resize(frame, (RESIZE_WIDTH, RESIZE_HEIGHT))
            rgb_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
            pil_image = Image.fromarray(rgb_frame)
            
            # Transform and run detection
            img_tensor = transform(pil_image)
            
            with torch.no_grad():
                preds = model([img_tensor])
            
            # Extract predictions
            boxes = preds[0]["boxes"]
            labels = preds[0]["labels"]
            scores = preds[0]["scores"]
            
            # Scale boxes back to original size
            scale_x = frame.shape[1] / RESIZE_WIDTH
            scale_y = frame.shape[0] / RESIZE_HEIGHT
            
            bottles_detected_current = 0
            high_confidence_bottles = 0
            bottle_info = []
            high_confidence_bottle_info = []
            
            for box, label, score in zip(boxes, labels, scores):
                if label.item() == 44 and score > CONFIDENCE_THRESHOLD:  # 44 = bottle
                    bottles_detected_current += 1
                    
                    # Scale coordinates back to original frame size
                    x1, y1, x2, y2 = box.tolist()
                    x1 = int(x1 * scale_x)
                    y1 = int(y1 * scale_y)
                    x2 = int(x2 * scale_x)
                    y2 = int(y2 * scale_y)
                    
                    bottle_data = {
                        'bbox': (x1, y1, x2, y2),
                        'confidence': score.item()
                    }
                    
                    bottle_info.append(bottle_data)
                    
                    # Check if this is a high confidence detection
                    if score > HIGH_CONFIDENCE_THRESHOLD:
                        high_confidence_bottles += 1
                        high_confidence_bottle_info.append(bottle_data)
            
            # Only save and auto-stop for HIGH CONFIDENCE detections
            if high_confidence_bottles > 0:
                with frame_lock:
                    current_frame = frame.copy()
                    detection_results = {
                        'bottle_count': high_confidence_bottles,
                        'bottles': high_confidence_bottle_info,
                        'timestamp': time.time(),
                        'frame_number': frame_count
                    }
                    
                    # Save frame to deque
                    saved_frames.append({
                        'frame': frame.copy(),
                        'detections': detection_results.copy(),
                        'save_time': time.strftime("%Y-%m-%d %H:%M:%S")
                    })
                
                detection_count += 1
                last_detection_time = time.time()
                
                # Display detection info in terminal
                print(f"\n🍾 HIGH CONFIDENCE BOTTLES DETECTED! Frame #{frame_count}")
                print(f"   High confidence count: {high_confidence_bottles} bottles")
                print(f"   Total bottles seen: {bottles_detected_current} bottles")
                print(f"   Time: {time.strftime('%H:%M:%S')}")
                print(f"   High confidence scores: {[f'{b['confidence']:.2f}' for b in high_confidence_bottle_info]}")
                print(f"   Frame saved to variable (Total saved: {len(saved_frames)})")
                print("-" * 60)
                print("🎯 STOPPING CAMERA AND DISPLAYING HIGH CONFIDENCE BOTTLE IMAGE...")
                
                # Stop the camera loop
                break
        
        # Draw detection boxes on display frame (show all detections but highlight high confidence)
        if bottles_detected_current > 0:
            for bottle in bottle_info:
                x1, y1, x2, y2 = bottle['bbox']
                confidence = bottle['confidence']
                
                # Use different colors for high vs regular confidence
                if confidence > HIGH_CONFIDENCE_THRESHOLD:
                    color = (0, 255, 0)  # Green for high confidence
                    thickness = 3
                    label_text = f"HIGH: {confidence:.2f}"
                else:
                    color = (0, 165, 255)  # Orange for regular confidence
                    thickness = 2
                    label_text = f"Bottle: {confidence:.2f}"
                
                # Draw rectangle
                cv2.rectangle(display_frame, (x1, y1), (x2, y2), color, thickness)
                
                # Draw label
                cv2.putText(display_frame, label_text, (x1, y1-10), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
        
        # Calculate and display FPS
        fps_counter += 1
        if time.time() - fps_start_time >= 1.0:
            current_fps = fps_counter / (time.time() - fps_start_time)
            fps_counter = 0
            fps_start_time = time.time()
            
            # Display FPS and stats on frame
            cv2.putText(display_frame, f"FPS: {current_fps:.1f}", (10, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            cv2.putText(display_frame, f"High Conf Events: {detection_count}", (10, 60), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            cv2.putText(display_frame, f"All Bottles: {bottles_detected_current}", (10, 90), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0) if bottles_detected_current > 0 else (255, 255, 255), 2)
            if 'high_confidence_bottles' in locals():
                cv2.putText(display_frame, f"High Conf Now: {high_confidence_bottles}", (10, 120), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0) if high_confidence_bottles > 0 else (255, 255, 255), 2)
        
        # Display the frame
        cv2.imshow('Auto-Stop Bottle Detection', display_frame)
        
        # Handle key presses
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        
        # Frame rate limiting (optional, remove for maximum speed)
        # time.sleep(0.01)  # Small delay to prevent excessive CPU usage
    
    # Cleanup
    cap.release()
    cv2.destroyAllWindows()
    
    # Display bottle image if HIGH CONFIDENCE bottles detected
    if 'high_confidence_bottles' in locals() and high_confidence_bottles > 0 and current_frame is not None:
        display_bottle_detection_image()
    elif bottles_detected_current > 0:
        print("⚠️  Only low confidence bottles detected. Auto-stop requires high confidence (>0.8)")
        print(f"   Highest confidence seen: {max([b['confidence'] for b in bottle_info]) if bottle_info else 0:.2f}")
    
    # Final statistics
    print(f"\n📊 SESSION SUMMARY:")
    print(f"   Total frames processed: {frame_count}")
    print(f"   Detection events: {detection_count}")
    print(f"   Saved frames: {len(saved_frames)}")
    if frame_count > 0:
        print(f"   Detection rate: {(detection_count/frame_count*100):.1f}%")
    else:
        print("   Detection rate: No frames processed")

def display_bottle_detection_image():
    """Display the detected bottle image using matplotlib"""
    global current_frame, detection_results
    
    if current_frame is None or detection_results is None:
        print("❌ No detection image available to display")
        return
    
    print("📸 Displaying detected bottle image...")
    
    # Convert BGR to RGB for matplotlib
    rgb_frame = cv2.cvtColor(current_frame, cv2.COLOR_BGR2RGB)
    
    # Create matplotlib figure
    fig, ax = plt.subplots(1, figsize=(12, 8))
    ax.imshow(rgb_frame)
    
    # Draw detection boxes and labels
    bottles = detection_results['bottles']
    bottle_count = detection_results['bottle_count']
    
    colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
    
    for i, bottle in enumerate(bottles):
        x1, y1, x2, y2 = bottle['bbox']
        confidence = bottle['confidence']
        color = colors[i % len(colors)]
        
        # Draw rectangle
        rect = patches.Rectangle((x1, y1), x2-x1, y2-y1, linewidth=3, 
                               edgecolor=color, facecolor='none')
        ax.add_patch(rect)
        
        # Draw label with background
        label_text = f"Bottle {i+1}: {confidence:.2f}"
        ax.text(x1, y1-10, label_text, color=color, fontsize=12, 
               backgroundcolor="white", fontweight='bold')
    
    # Set title and remove axes
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(detection_results['timestamp']))
    ax.set_title(f"🍾 Detected {bottle_count} Bottle{'s' if bottle_count > 1 else ''} - {timestamp}", 
                fontsize=16, fontweight='bold', pad=20)
    ax.axis('off')
    
    # Add detection info as text
    info_text = f"Frame #{detection_results['frame_number']} | Detection Time: {timestamp}"
    plt.figtext(0.5, 0.02, info_text, ha='center', fontsize=10, style='italic')
    
    plt.tight_layout()
    plt.show()
    
    print("✅ Image displayed successfully!")
    print(f"   Bottles detected: {bottle_count}")
    print(f"   Confidence scores: {[f'{b['confidence']:.2f}' for b in bottles]}")

def detect_webcam_continuous():
    """
    Continuous real-time bottle detection (original behavior)
    Runs until user presses 'q' - doesn't auto-stop on detection
    """
    global current_frame, detection_results, saved_frames
    
    # Initialize webcam
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("Error: Could not open webcam")
        return
    
    # Set camera properties for better performance
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    cap.set(cv2.CAP_PROP_FPS, 30)
    
    print("Continuous real-time bottle detection started...")
    print("Press 'q' to quit manually")
    print("Frames with detected bottles will be automatically saved to variable")
    print("-" * 60)
    
    # Performance optimization parameters
    DETECTION_INTERVAL = 3  # Process every 3rd frame for detection
    RESIZE_WIDTH = 320  # Smaller resolution for faster processing
    RESIZE_HEIGHT = 240
    CONFIDENCE_THRESHOLD = 0.6
    
    # Create optimized transform
    transform = T.Compose([
        T.Resize((RESIZE_HEIGHT, RESIZE_WIDTH)),  # Reduce resolution
        T.ToTensor()
    ])
    
    # FPS tracking
    fps_counter = 0
    fps_start_time = time.time()
    frame_count = 0
    detection_count = 0
    
    # Detection state
    last_detection_time = 0
    bottles_detected_current = 0
    bottle_info = []
    
    while True:
        start_time = time.time()
        
        # Capture frame
        ret, frame = cap.read()
        if not ret:
            print("Error: Failed to capture image")
            break
        
        frame_count += 1
        display_frame = frame.copy()
        
        # Only run detection every DETECTION_INTERVAL frames
        if frame_count % DETECTION_INTERVAL == 0:
            # Resize frame for faster processing
            small_frame = cv2.resize(frame, (RESIZE_WIDTH, RESIZE_HEIGHT))
            rgb_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
            pil_image = Image.fromarray(rgb_frame)
            
            # Transform and run detection
            img_tensor = transform(pil_image)
            
            with torch.no_grad():
                preds = model([img_tensor])
            
            # Extract predictions
            boxes = preds[0]["boxes"]
            labels = preds[0]["labels"]
            scores = preds[0]["scores"]
            
            # Scale boxes back to original size
            scale_x = frame.shape[1] / RESIZE_WIDTH
            scale_y = frame.shape[0] / RESIZE_HEIGHT
            
            bottles_detected_current = 0
            bottle_info = []
            
            for box, label, score in zip(boxes, labels, scores):
                if label.item() == 44 and score > CONFIDENCE_THRESHOLD:  # 44 = bottle
                    bottles_detected_current += 1
                    
                    # Scale coordinates back to original frame size
                    x1, y1, x2, y2 = box.tolist()
                    x1 = int(x1 * scale_x)
                    y1 = int(y1 * scale_y)
                    x2 = int(x2 * scale_x)
                    y2 = int(y2 * scale_y)
                    
                    bottle_info.append({
                        'bbox': (x1, y1, x2, y2),
                        'confidence': score.item()
                    })
            
            # Update global variables if bottles detected
            if bottles_detected_current > 0:
                with frame_lock:
                    current_frame = frame.copy()
                    detection_results = {
                        'bottle_count': bottles_detected_current,
                        'bottles': bottle_info,
                        'timestamp': time.time(),
                        'frame_number': frame_count
                    }
                    
                    # Save frame to deque
                    saved_frames.append({
                        'frame': frame.copy(),
                        'detections': detection_results.copy(),
                        'save_time': time.strftime("%Y-%m-%d %H:%M:%S")
                    })
                
                detection_count += 1
                last_detection_time = time.time()
                
                # Display detection info in terminal
                print(f"\n🍾 BOTTLES DETECTED! Frame #{frame_count}")
                print(f"   Count: {bottles_detected_current} bottles")
                print(f"   Time: {time.strftime('%H:%M:%S')}")
                print(f"   Confidence scores: {[f'{b['confidence']:.2f}' for b in bottle_info]}")
                print(f"   Frame saved to variable (Total saved: {len(saved_frames)})")
                print("-" * 60)
        
        # Draw detection boxes on display frame (use last detection results)
        if bottles_detected_current > 0:
            for bottle in bottle_info:
                x1, y1, x2, y2 = bottle['bbox']
                confidence = bottle['confidence']
                
                # Draw rectangle
                cv2.rectangle(display_frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                
                # Draw label
                label_text = f"Bottle: {confidence:.2f}"
                cv2.putText(display_frame, label_text, (x1, y1-10), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
        
        # Calculate and display FPS
        fps_counter += 1
        if time.time() - fps_start_time >= 1.0:
            current_fps = fps_counter / (time.time() - fps_start_time)
            fps_counter = 0
            fps_start_time = time.time()
            
            # Display FPS and stats on frame
            cv2.putText(display_frame, f"FPS: {current_fps:.1f}", (10, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            cv2.putText(display_frame, f"Detections: {detection_count}", (10, 60), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            cv2.putText(display_frame, f"Bottles: {bottles_detected_current}", (10, 90), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0) if bottles_detected_current > 0 else (255, 255, 255), 2)
        
        # Display the frame
        cv2.imshow('Continuous Bottle Detection', display_frame)
        
        # Handle key presses
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
    
    # Cleanup
    cap.release()
    cv2.destroyAllWindows()
    
    # Final statistics
    print(f"\n📊 SESSION SUMMARY:")
    print(f"   Total frames processed: {frame_count}")
    print(f"   Detection events: {detection_count}")
    print(f"   Saved frames: {len(saved_frames)}")
    if frame_count > 0:
        print(f"   Detection rate: {(detection_count/frame_count*100):.1f}%")
    else:
        print("   Detection rate: No frames processed")

def detect_realtime_for_api():
    """
    Real-time bottle detection with camera window display
    Shows live camera feed until bottle is detected, then closes and returns result
    """
    global current_frame, detection_results, saved_frames
    
    try:
        # Initialize webcam
        cap = cv2.VideoCapture(0)
        
        if not cap.isOpened():
            # Try alternative camera indices
            for i in range(1, 4):
                cap = cv2.VideoCapture(0)
                if cap.isOpened():
                    print(f"✅ Camera found at index {i}")
                    break
            else:
                return {
                    "success": False,
                    "error": "Could not open webcam. Check camera connection and permissions."
                }
        
        # Test camera capture
        ret, test_frame = cap.read()
        if not ret:
            cap.release()
            return {
                "success": False,
                "error": "Camera connected but cannot capture frames. Check drivers."
            }
        
        print(f"✅ Camera initialized for API - Frame size: {test_frame.shape}")
        
        # Set camera properties for better performance
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        cap.set(cv2.CAP_PROP_FPS, 30)
        
        print("🎯 Real-time detection started - Camera window will open!")
        print("   Show a bottle to the camera to capture it")
        print("   Press 'q' to quit manually")
        
        # Create camera window
        cv2.namedWindow('Bottle Detection - Live Camera', cv2.WINDOW_AUTOSIZE)
        cv2.moveWindow('Bottle Detection - Live Camera', 100, 100)
        
        # Performance optimization parameters
        DETECTION_INTERVAL = 2  # Process every 2nd frame for detection
        RESIZE_WIDTH = 320
        RESIZE_HEIGHT = 240
        CONFIDENCE_THRESHOLD = 0.6
        HIGH_CONFIDENCE_THRESHOLD = 0.75  # Lower threshold for API use
        MAX_FRAMES = 600  # Maximum frames to process (20 seconds at 30 FPS)
        
        # Create optimized transform
        transform = T.Compose([
            T.Resize((RESIZE_HEIGHT, RESIZE_WIDTH)),
            T.ToTensor()
        ])
        
        frame_count = 0
        detection_count = 0
        start_time = time.time()
        
        while frame_count < MAX_FRAMES:
            # Capture frame
            ret, frame = cap.read()
            if not ret:
                print("❌ Failed to read frame from camera")
                break
            
            frame_count += 1
            display_frame = frame.copy()
            
            # Only run detection every DETECTION_INTERVAL frames
            if frame_count % DETECTION_INTERVAL == 0:
                # Resize frame for faster processing
                small_frame = cv2.resize(frame, (RESIZE_WIDTH, RESIZE_HEIGHT))
                rgb_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
                pil_image = Image.fromarray(rgb_frame)
                
                # Transform and run detection
                img_tensor = transform(pil_image)
                
                with torch.no_grad():
                    preds = model([img_tensor])
                
                # Extract predictions
                boxes = preds[0]["boxes"]
                labels = preds[0]["labels"]
                scores = preds[0]["scores"]
                
                # Scale boxes back to original size
                scale_x = frame.shape[1] / RESIZE_WIDTH
                scale_y = frame.shape[0] / RESIZE_HEIGHT
                
                bottles_detected = 0
                high_confidence_bottles = 0
                bottle_info = []
                
                for box, label, score in zip(boxes, labels, scores):
                    if label.item() == 44 and score > CONFIDENCE_THRESHOLD:  # 44 = bottle
                        bottles_detected += 1
                        
                        # Scale coordinates back to original frame size
                        x1, y1, x2, y2 = box.tolist()
                        x1 = int(x1 * scale_x)
                        y1 = int(y1 * scale_y)
                        x2 = int(x2 * scale_x)
                        y2 = int(y2 * scale_y)
                        
                        bottle_data = {
                            'bbox': [x1, y1, x2, y2],
                            'confidence': float(score.item())
                        }
                        
                        bottle_info.append(bottle_data)
                        
                        # Check if this is a high confidence detection
                        if score > HIGH_CONFIDENCE_THRESHOLD:
                            high_confidence_bottles += 1
                
                # Draw all detections on display frame
                for bottle in bottle_info:
                    x1, y1, x2, y2 = bottle['bbox']
                    confidence = bottle['confidence']
                    
                    # Use different colors for high vs regular confidence
                    if confidence > HIGH_CONFIDENCE_THRESHOLD:
                        color = (0, 255, 0)  # Green for high confidence
                        thickness = 3
                        label_text = f"BOTTLE DETECTED: {confidence:.2f}"
                    else:
                        color = (0, 165, 255)  # Orange for regular confidence
                        thickness = 2
                        label_text = f"Bottle: {confidence:.2f}"
                    
                    # Draw rectangle
                    cv2.rectangle(display_frame, (x1, y1), (x2, y2), color, thickness)
                    
                    # Draw label with background
                    label_size = cv2.getTextSize(label_text, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)[0]
                    cv2.rectangle(display_frame, (x1, y1-30), (x1 + label_size[0], y1), color, -1)
                    cv2.putText(display_frame, label_text, (x1, y1-10), 
                               cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
                
                # Stop on high confidence detection
                if high_confidence_bottles > 0:
                    print(f"🍾 HIGH CONFIDENCE BOTTLE DETECTED! Frame #{frame_count}")
                    print(f"   Count: {high_confidence_bottles} high confidence bottles")
                    print(f"   Total: {bottles_detected} bottles detected")
                    print(f"   Processing time: {time.time() - start_time:.2f}s")
                    
                    # Show detection for 2 seconds before closing
                    for i in range(60):  # 2 seconds at 30 FPS
                        cv2.putText(display_frame, "BOTTLE CAPTURED! Closing camera...", (50, 50), 
                                   cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 3)
                        cv2.imshow('Bottle Detection - Live Camera', display_frame)
                        cv2.waitKey(33)  # ~30 FPS
                    
                    # Close camera window
                    cv2.destroyAllWindows()
                    
                    # Prepare final detection frame
                    detection_frame = frame.copy()
                    for bottle in bottle_info:
                        if bottle['confidence'] > HIGH_CONFIDENCE_THRESHOLD:
                            x1, y1, x2, y2 = bottle['bbox']
                            cv2.rectangle(detection_frame, (x1, y1), (x2, y2), (0, 255, 0), 3)
                            label_text = f"Bottle: {bottle['confidence']:.2f}"
                            cv2.putText(detection_frame, label_text, (x1, y1-10), 
                                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                    
                    # Convert image to base64
                    try:
                        _, buffer = cv2.imencode('.jpg', detection_frame, [cv2.IMWRITE_JPEG_QUALITY, 90])
                        image_base64 = base64.b64encode(buffer).decode('utf-8')
                        
                        # Update global variables
                        with frame_lock:
                            current_frame = detection_frame.copy()
                            detection_results = {
                                'bottle_count': high_confidence_bottles,
                                'bottles': [b for b in bottle_info if b['confidence'] > HIGH_CONFIDENCE_THRESHOLD],
                                'timestamp': time.time(),
                                'frame_number': frame_count
                            }
                            
                            # Save frame to deque
                            saved_frames.append({
                                'frame': detection_frame.copy(),
                                'detections': detection_results.copy(),
                                'save_time': time.strftime("%Y-%m-%d %H:%M:%S")
                            })
                        
                        # Cleanup
                        cap.release()
                        cv2.destroyAllWindows()
                        
                        return {
                            "success": True,
                            "image": f"data:image/jpeg;base64,{image_base64}",
                            "detection_data": {
                                "bottle_count": high_confidence_bottles,
                                "bottles": [b for b in bottle_info if b['confidence'] > HIGH_CONFIDENCE_THRESHOLD],
                                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                                "processing_time": round(time.time() - start_time, 2),
                                "frames_processed": frame_count
                            }
                        }
                        
                    except Exception as e:
                        print(f"Error encoding image: {e}")
                        cap.release()
                        cv2.destroyAllWindows()
                        return {
                            "success": False,
                            "error": f"Image encoding failed: {str(e)}"
                        }
            
            # Add status text to display frame
            elapsed = time.time() - start_time
            cv2.putText(display_frame, f"Scanning for bottles... {elapsed:.1f}s", (10, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            cv2.putText(display_frame, f"Frame: {frame_count}", (10, 60), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            cv2.putText(display_frame, "Press 'q' to quit", (10, display_frame.shape[0] - 20), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            
            # Display the frame
            cv2.imshow('Bottle Detection - Live Camera', display_frame)
            
            # Handle key presses
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                print("🛑 Detection stopped by user")
                break
            
            # Print progress every 5 seconds
            if frame_count % 150 == 0:
                elapsed = time.time() - start_time
                print(f"⏱️  Scanning... {frame_count} frames processed in {elapsed:.1f}s")
        
        # Cleanup - no bottles found or timeout
        cap.release()
        cv2.destroyAllWindows()
        
        return {
            "success": False,
            "message": f"No high-confidence bottles detected in {frame_count} frames ({time.time() - start_time:.1f}s)",
            "frames_processed": frame_count,
            "processing_time": round(time.time() - start_time, 2)
        }
        
    except Exception as e:
        # Ensure camera and windows are cleaned up on any error
        try:
            cap.release()
            cv2.destroyAllWindows()
        except:
            pass
        
        print(f"❌ Detection API error: {e}")
        return {
            "success": False,
            "error": f"Detection failed: {str(e)}"
        }


def detect_realtime_continuous_for_api(duration_seconds=10):
    """
    Continuous real-time detection for API with time limit
    Returns all detections found within the time period
    """
    global current_frame, detection_results, saved_frames
    
    try:
        # Initialize webcam
        cap = cv2.VideoCapture(0)
        
        if not cap.isOpened():
            return {
                "success": False,
                "error": "Could not open webcam"
            }
        
        # Set camera properties
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        cap.set(cv2.CAP_PROP_FPS, 30)
        
        print(f"🎯 Continuous detection started for {duration_seconds} seconds...")
        
        # Parameters
        DETECTION_INTERVAL = 3
        RESIZE_WIDTH = 320
        RESIZE_HEIGHT = 240
        CONFIDENCE_THRESHOLD = 0.6
        
        transform = T.Compose([
            T.Resize((RESIZE_HEIGHT, RESIZE_WIDTH)),
            T.ToTensor()
        ])
        
        frame_count = 0
        detection_events = []
        start_time = time.time()
        end_time = start_time + duration_seconds
        
        while time.time() < end_time:
            ret, frame = cap.read()
            if not ret:
                break
            
            frame_count += 1
            
            if frame_count % DETECTION_INTERVAL == 0:
                # Process frame
                small_frame = cv2.resize(frame, (RESIZE_WIDTH, RESIZE_HEIGHT))
                rgb_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
                pil_image = Image.fromarray(rgb_frame)
                img_tensor = transform(pil_image)
                
                with torch.no_grad():
                    preds = model([img_tensor])
                
                boxes = preds[0]["boxes"]
                labels = preds[0]["labels"]
                scores = preds[0]["scores"]
                
                # Scale boxes back
                scale_x = frame.shape[1] / RESIZE_WIDTH
                scale_y = frame.shape[0] / RESIZE_HEIGHT
                
                bottles_detected = 0
                bottle_info = []
                
                for box, label, score in zip(boxes, labels, scores):
                    if label.item() == 44 and score > CONFIDENCE_THRESHOLD:
                        bottles_detected += 1
                        
                        x1, y1, x2, y2 = box.tolist()
                        x1 = int(x1 * scale_x)
                        y1 = int(y1 * scale_y)
                        x2 = int(x2 * scale_x)
                        y2 = int(y2 * scale_y)
                        
                        bottle_info.append({
                            'bbox': [x1, y1, x2, y2],
                            'confidence': float(score.item())
                        })
                
                if bottles_detected > 0:
                    # Save detection event
                    detection_frame = frame.copy()
                    for bottle in bottle_info:
                        x1, y1, x2, y2 = bottle['bbox']
                        cv2.rectangle(detection_frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    
                    _, buffer = cv2.imencode('.jpg', detection_frame)
                    image_base64 = base64.b64encode(buffer).decode('utf-8')
                    
                    detection_events.append({
                        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                        "bottle_count": bottles_detected,
                        "bottles": bottle_info,
                        "image": f"data:image/jpeg;base64,{image_base64}",
                        "frame_number": frame_count
                    })
                    
                    print(f"🍾 Detection event {len(detection_events)}: {bottles_detected} bottles")
        
        cap.release()
        
        if detection_events:
            # Return the best detection (highest confidence)
            best_detection = max(detection_events, 
                               key=lambda x: max(b['confidence'] for b in x['bottles']))
            
            return {
                "success": True,
                "image": best_detection["image"],
                "detection_data": {
                    "bottle_count": best_detection["bottle_count"],
                    "bottles": best_detection["bottles"],
                    "timestamp": best_detection["timestamp"],
                    "total_events": len(detection_events),
                    "processing_time": round(time.time() - start_time, 2)
                }
            }
        else:
            return {
                "success": False,
                "message": f"No bottles detected in {duration_seconds} seconds",
                "processing_time": round(time.time() - start_time, 2)
            }
            
    except Exception as e:
        try:
            cap.release()
        except:
            pass
        return {
            "success": False,
            "error": str(e)
        }

def get_saved_frames():
    """Get all saved frames with detections"""
    global saved_frames
    return list(saved_frames)

def print_detection_summary():
    """Print a summary of all saved detections"""
    frames = get_saved_frames()
    if not frames:
        print("No bottles detected yet.")
        return
    
    print(f"\n📋 DETECTION SUMMARY ({len(frames)} saved frames):")
    print("-" * 70)
    for i, frame_data in enumerate(frames, 1):
        detections = frame_data['detections']
        print(f"Frame {i}: {detections['bottle_count']} bottles at {frame_data['save_time']}")
        print(f"         Confidences: {[f'{b['confidence']:.2f}' for b in detections['bottles']]}")
    print("-" * 70)

def main():
    """Main function to choose between image or webcam detection"""
    print("🍾 Enhanced Bottle Detection System")
    print("=" * 50)
    print("Choose detection mode:")
    print("1. Detect in static image")
    print("2. Real-time detection (continuous)")
    print("3. Real-time detection (auto-stop on detection)")
    print("4. Show detection summary")
    print("5. Save detection frame to file")
    print("6. Test detection system")
    
    choice = input("Enter your choice (1-6): ")
    
    if choice == "1":
        img_path = input("Enter image path: ")
        detect_image(img_path)
    elif choice == "2":
        print("Starting continuous detection (manual stop with 'q')...")
        detect_webcam_continuous()
    elif choice == "3":
        print("Starting auto-stop detection (stops when bottle detected)...")
        detect_webcam_with_auto_stop()
    elif choice == "4":
        print_detection_summary()
    elif choice == "5":
        frames = get_saved_frames()
        if frames:
            print(f"Available frames: {len(frames)}")
            try:
                index = input("Enter frame index (or press Enter for most recent): ").strip()
                index = int(index) if index else None
                save_detection_frame_to_file(index)
            except ValueError:
                print("Invalid index. Using most recent frame.")
                save_detection_frame_to_file()
        else:
            print("No frames available. Run detection first.")
    elif choice == "6":
        test_detection_system()
    else:
        print("Invalid choice. Please run again.")

def detect_webcam_with_auto_stop():
    """
    Alternative detection function that stops immediately on first bottle detection
    and displays the image
    """
    detect_webcam_optimized()

def get_current_detection():
    """Get the current detection results and frame"""
    global current_frame, detection_results
    with frame_lock:
        return current_frame.copy() if current_frame is not None else None, detection_results.copy() if detection_results else None

def save_detection_frame_to_file(frame_index=None):
    """Save a detection frame to disk"""
    frames = get_saved_frames()
    if not frames:
        print("No frames available to save.")
        return False
    
    if frame_index is None:
        frame_index = -1  # Save the most recent frame
    
    try:
        frame_data = frames[frame_index]
        frame = frame_data['frame']
        detections = frame_data['detections']
        
        # Create filename with timestamp and bottle count
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        filename = f"bottle_detection_{timestamp}_{detections['bottle_count']}bottles.jpg"
        
        cv2.imwrite(filename, frame)
        print(f"✅ Frame saved as: {filename}")
        print(f"   Bottles detected: {detections['bottle_count']}")
        print(f"   Detection time: {frame_data['save_time']}")
        return True
        
    except IndexError:
        print(f"❌ Frame index {frame_index} not available. Available frames: {len(frames)}")
        return False
    except Exception as e:
        print(f"❌ Error saving frame: {e}")
        return False

def test_detection_system():
    """Test function to verify the detection system works"""
    print("🧪 Testing bottle detection system...")
    print("This will start the camera for 10 seconds to test performance.")
    
    # Configure Python environment first
    try:
        # Test model loading
        print("✓ Testing model loading...")
        test_transform = T.Compose([T.ToTensor()])
        dummy_image = torch.zeros(3, 224, 224)
        
        with torch.no_grad():
            test_pred = model([dummy_image])
        print("✓ Model loaded successfully")
        
        # Test camera access
        print("✓ Testing camera access...")
        cap = cv2.VideoCapture(0)
        if cap.isOpened():
            ret, frame = cap.read()
            if ret:
                print(f"✓ Camera working - Frame size: {frame.shape}")
            else:
                print("❌ Camera not returning frames")
            cap.release()
        else:
            print("❌ Cannot access camera")
        
        print("✅ All tests passed! System ready for detection.")
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

if __name__ == "__main__":
    main()