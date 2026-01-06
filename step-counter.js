/**
 * REHMA HEALTH TRACKER - SENSOR BRIDGE (APK READY)
 * Handles Accelerometer, Gyroscope, and Pedometer Logic
 */

class StepCounterService {
    constructor() {
        this.steps = 0;
        this.isTracking = false;
        
        // Sensitivity Config (Adjust for Android Hardware)
        this.threshold = 12; // Magnitude threshold for a step
        this.lastMagnitude = 0;
        this.lastStepTime = 0;
        
        // Sync config
        this.syncInterval = 5000; // Save to main brain every 5s
        
        this.init();
    }

    init() {
        // Load saved steps from today (if main brain exists)
        if(window.fitnessTracker) {
            this.steps = window.fitnessTracker.daily.steps || 0;
        }
        
        // Auto-start if permission granted or not required (Android)
        if (typeof DeviceMotionEvent !== 'undefined') {
            this.startTracking();
        }
        
        // Set up Sync Loop
        setInterval(() => this.syncToBrain(), this.syncInterval);
    }

    requestPermission() {
        // Required for iOS 13+
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            DeviceMotionEvent.requestPermission()
                .then(response => {
                    if (response === 'granted') {
                        this.startTracking();
                    } else {
                        console.warn("Motion permission denied");
                    }
                })
                .catch(console.error);
        } else {
            this.startTracking();
        }
    }

    startTracking() {
        if (this.isTracking) return;
        
        window.addEventListener('devicemotion', (event) => {
            this.handleMotion(event);
        });
        
        this.isTracking = true;
        console.log("Sensor Bridge: Tracking Started");
    }

    handleMotion(event) {
        if(!event.accelerationIncludingGravity) return;

        const acc = event.accelerationIncludingGravity;
        const x = acc.x;
        const y = acc.y;
        const z = acc.z;

        // Calculate Magnitude Vector
        const magnitude = Math.sqrt(x*x + y*y + z*z);
        
        // Step Detection Algorithm (Peak Detection)
        // 1. Check if magnitude breaks threshold
        // 2. Check if enough time passed since last step (Human cadence limit ~300ms)
        const now = Date.now();
        if (magnitude > this.threshold && (now - this.lastStepTime > 300)) {
            
            // Confirm it's a peak (simple version)
            if (magnitude > this.lastMagnitude) {
                this.steps++;
                this.lastStepTime = now;
                
                // Dispatch local event for UI animations
                window.dispatchEvent(new CustomEvent('step_detected', { detail: { steps: this.steps }}));
            }
        }
        
        this.lastMagnitude = magnitude;
    }

    syncToBrain() {
        // Only save if changed and brain exists
        if(window.fitnessTracker && this.steps > 0) {
            // Check if we need to update
            if(window.fitnessTracker.daily.steps !== this.steps) {
                window.fitnessTracker.updateSteps(this.steps);
            }
        }
    }
}

// Auto Init
window.stepCounterService = new StepCounterService();

// Add a button listener for iOS permission if needed in UI
// (You can trigger window.stepCounterService.requestPermission() from a button)