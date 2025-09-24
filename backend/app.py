from flask import Flask, jsonify, request
from flask_cors import CORS
from influxdb_client import InfluxDBClient
import subprocess
import sys
import os
import base64
import json
from datetime import datetime
import threading
import time

# ----------------- Flask App -----------------
app = Flask(__name__)
CORS(app)

# ----------------- InfluxDB Config -----------------
INFLUX_URL = "https://us-east-1-1.aws.cloud2.influxdata.com"
INFLUX_TOKEN = "XOKPqtH_yfgLJThY1QBoUINIkEKOxuaM63VwdBl9hZuHi_fe2eVjOfoCv_F_Qh-zUrVOMdE7gKlUbPw5tQzf5g=="
ORG = "2ddddcf97b34592f"
BUCKET = "waste"

client = InfluxDBClient(url=INFLUX_URL, token=INFLUX_TOKEN, org=ORG)
query_api = client.query_api()

# Global variables for object detection
detection_process = None
detection_results = None
detection_lock = threading.Lock()
detection_active = False

# Import detection functions
try:
    from object_detection_1 import detect_realtime_for_api
    DETECTION_AVAILABLE = True
    print("✅ Object detection module loaded successfully")
except ImportError as e:
    print(f"⚠️ Object detection module not available: {e}")
    DETECTION_AVAILABLE = False


# ----------------- Object Detection Functions -----------------
def run_object_detection():
    """Run the object detection script and capture results"""
    global detection_results
    
    try:
        # Path to the object detection script
        script_path = os.path.join(os.path.dirname(__file__), "object_detection_1.py")
        
        # Run the object detection script
        result = subprocess.run([
            sys.executable, script_path
        ], capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            # Parse the output to get detection results
            # This is a simplified version - you'll need to modify object_detection_1.py
            # to output JSON results instead of just printing
            with detection_lock:
                detection_results = {
                    "success": True,
                    "timestamp": datetime.now().isoformat(),
                    "bottle_count": 1,  # Mock data - modify script to return actual results
                    "bottles": [{"confidence": 0.85, "bbox": [100, 100, 200, 200]}],
                    "image_path": "detected_bottle.jpg"  # Path to saved image
                }
            return True
        else:
            print(f"Detection script error: {result.stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print("Detection script timed out")
        return False
    except Exception as e:
        print(f"Detection error: {e}")
        return False

def run_realtime_detection():
    """Run real-time detection using the imported module"""
    global detection_results, detection_active
    
    if not DETECTION_AVAILABLE:
        return {
            "success": False,
            "error": "Object detection module not available"
        }
    
    try:
        detection_active = True
        print("🎥 Starting real-time bottle detection...")
        
        # Call the detection function
        result = detect_realtime_for_api()
        
        detection_active = False
        
        if result and result.get("success"):
            with detection_lock:
                detection_results = result
            return result
        else:
            return {
                "success": False,
                "error": "No bottle detected or detection failed"
            }
            
    except Exception as e:
        detection_active = False
        print(f"Real-time detection error: {e}")
        return {
            "success": False,
            "error": str(e)
        }

def encode_image_to_base64(image_path):
    """Convert image file to base64 string"""
    try:
        with open(image_path, "rb") as img_file:
            return base64.b64encode(img_file.read()).decode('utf-8')
    except Exception as e:
        print(f"Error encoding image: {e}")
        return None

# ----------------- Object Detection Endpoints -----------------
@app.route("/api/detect-bottle", methods=["POST"])
def detect_bottle():
    """Start bottle detection process"""
    global detection_process, detection_results
    
    try:
        data = request.get_json()
        mode = data.get("mode", "auto-stop")
        
        # Reset previous results
        with detection_lock:
            detection_results = None
        
        print(f"🎯 Starting bottle detection in {mode} mode...")
        
        # Use real-time detection if available
        if DETECTION_AVAILABLE:
            def detection_thread():
                global detection_results
                result = run_realtime_detection()
                with detection_lock:
                    detection_results = result
            
            thread = threading.Thread(target=detection_thread)
            thread.start()
            thread.join(timeout=25)  # Wait up to 25 seconds
            
            with detection_lock:
                if detection_results and detection_results.get("success"):
                    return jsonify(detection_results)
                else:
                    return jsonify({
                        "success": False,
                        "message": detection_results.get("error", "No bottle detected or detection failed")
                    })
        else:
            # Fallback to old method if module not available
            # Run detection in a separate thread to avoid blocking
            def detection_thread():
                run_object_detection()
            
            thread = threading.Thread(target=detection_thread)
            thread.start()
            thread.join(timeout=25)  # Wait up to 25 seconds
            
            with detection_lock:
                if detection_results and detection_results.get("success"):
                    # Try to encode the image
                    image_base64 = None
                    if detection_results.get("image_path"):
                        image_base64 = encode_image_to_base64(detection_results["image_path"])
                    
                    # If no image file, create a mock base64 image
                    if not image_base64:
                        # Create a simple mock image (1x1 pixel green)
                        import io
                        from PIL import Image
                        img = Image.new('RGB', (400, 300), color='green')
                        buffer = io.BytesIO()
                        img.save(buffer, format='JPEG')
                        image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
                    
                    return jsonify({
                        "success": True,
                        "image": f"data:image/jpeg;base64,{image_base64}",
                        "detection_data": {
                            "bottle_count": detection_results.get("bottle_count", 1),
                            "bottles": detection_results.get("bottles", []),
                            "timestamp": detection_results.get("timestamp")
                        }
                    })
                else:
                    return jsonify({
                        "success": False,
                        "message": "No bottle detected or detection failed"
                    })
                
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/api/realtime-detect", methods=["POST"])
def realtime_detect():
    """Real-time bottle detection endpoint"""
    global detection_active
    
    if not DETECTION_AVAILABLE:
        return jsonify({
            "success": False,
            "error": "Object detection module not available. Please ensure all dependencies are installed."
        }), 500
    
    if detection_active:
        return jsonify({
            "success": False,
            "error": "Detection already in progress"
        }), 409
    
    try:
        print("🔥 Starting real-time bottle detection...")
        
        # Run detection in background thread
        def detection_thread():
            try:
                result = run_realtime_detection()
                print(f"Detection completed with result: {result.get('success', False)}")
            except Exception as e:
                print(f"Detection thread error: {e}")
        
        thread = threading.Thread(target=detection_thread)
        thread.start()
        
        return jsonify({
            "success": True,
            "message": "Real-time detection started",
            "status": "processing"
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/api/detection-status", methods=["GET"])
def get_detection_status():
    """Get current detection status"""
    global detection_active
    
    with detection_lock:
        if detection_results:
            return jsonify({
                "status": "completed",
                "active": detection_active,
                "results": detection_results
            })
        else:
            return jsonify({
                "status": "running" if detection_active else "idle",
                "active": detection_active
            })
@app.route("/api/debug/schema", methods=["GET"])
def debug_schema():
    """Check what measurements and fields are available"""
    try:
        # Get all measurements
        measurements_query = f'''
            import "influxdata/influxdb/schema"
            schema.measurements(bucket: "{BUCKET}")
        '''
        measurements = []
        measurements_result = query_api.query(measurements_query)
        for table in measurements_result:
            for record in table.records:
                measurements.append(record.get_value())

        # For each measurement, get field keys
        fields_by_measurement = {}
        for measurement in measurements:
            fields_query = f'''
                import "influxdata/influxdb/schema"
                schema.measurementFieldKeys(
                    bucket: "{BUCKET}", 
                    measurement: "{measurement}"
                )
            '''
            fields = []
            try:
                fields_result = query_api.query(fields_query)
                for table in fields_result:
                    for record in table.records:
                        fields.append(record.get_value())
                fields_by_measurement[measurement] = fields
            except Exception:
                fields_by_measurement[measurement] = ["Error querying fields"]

        return jsonify({
            "measurements": measurements,
            "fields_by_measurement": fields_by_measurement
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/debug/data", methods=["GET"])
def debug_data():
    """Get sample data from all measurements"""
    try:
        # Get all measurements
        measurements_query = f'''
            import "influxdata/influxdb/schema"
            schema.measurements(bucket: "{BUCKET}")
        '''
        measurements = []
        measurements_result = query_api.query(measurements_query)
        for table in measurements_result:
            for record in table.records:
                measurements.append(record.get_value())

        # For each measurement, fetch sample data
        sample_data = {}
        for measurement in measurements:
            sample_query = f'''
                from(bucket: "{BUCKET}")
                    |> range(start: -1h)
                    |> filter(fn: (r) => r._measurement == "{measurement}")
                    |> limit(n: 5)
            '''
            try:
                result = query_api.query(sample_query)
                data = []
                for table in result:
                    for record in table.records:
                        data.append({
                            "time": record.get_time().isoformat(),
                            "measurement": record.get_measurement(),
                            "field": record.get_field(),
                            "value": record.get_value(),
                            "values": dict(record.values)
                        })
                sample_data[measurement] = data
            except Exception as e:
                sample_data[measurement] = f"Error: {str(e)}"

        return jsonify(sample_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ----------------- Joystick Endpoint -----------------
@app.route("/api/joystick", methods=["GET"])
def get_joystick_data():
    """Fetch the latest joystick movements (material only)"""
    query = f'''
        from(bucket: "{BUCKET}")
            |> range(start: -1h)
            |> filter(fn: (r) => r.topic == "waste_sorting/joystick")
            |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            |> keep(columns: ["_time", "material"])
            |> sort(columns: ["_time"], desc: true)
            |> limit(n: 50)
    '''
    try:
        result = query_api.query(query)
        data = []
        for table in result:
            for record in table.records:
                row = {
                    "time": record.get_time().isoformat(),
                    "material": record.values.get("material")
                }
                data.append(row)
        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ----------------- Health Check -----------------
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"})


# ----------------- Run App -----------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
