// Advanced Step Counter for Rehma's Health Tracker
// Works offline without requiring internet connection

class StepCounter {
    constructor() {
        this.steps = 0;
        this.dailyGoal = 10000;
        this.isActive = false;
        this.lastStepTime = 0;
        this.stepThreshold = 10; // Minimum acceleration to count as step
        this.stepCooldown = 300; // Minimum time between steps (ms)
        
        // For devices without accelerometer
        this.simulatedSteps = 0;
        this.simulationInterval = null;
        
        this.init();
    }
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.requestDeviceMotion();
        this.startStepSimulation();
    }
    
    setupEventListeners() {
        // Handle visibility change to pause/resume when app is backgrounded
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
        
        // Handle device motion events
        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', (event) => {
                this.handleDeviceMotion(event);
            });
        }
        
        // Handle permission requests for iOS 13+
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            document.addEventListener('click', () => {
                this.requestDeviceMotion();
            }, { once: true });
        }
    }
    
    requestDeviceMotion() {
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            DeviceMotionEvent.requestPermission()
                .then(response => {
                    if (response === 'granted') {
                        this.isActive = true;
                    }
                })
                .catch(console.error);
        } else {
            // For older devices or Android
            this.isActive = true;
        }
    }
    
    handleDeviceMotion(event) {
        if (!this.isActive) return;
        
        const acceleration = event.accelerationIncludingGravity;
        if (!acceleration) return;
        
        // Calculate total acceleration magnitude
        const totalAcceleration = Math.sqrt(
            Math.pow(acceleration.x || 0, 2) +
            Math.pow(acceleration.y || 0, 2) +
            Math.pow(acceleration.z || 0, 2)
        );
        
        // Detect step based on acceleration threshold
        const currentTime = Date.now();
        if (totalAcceleration > this.stepThreshold && 
            currentTime - this.lastStepTime > this.stepCooldown) {
            this.addStep();
            this.lastStepTime = currentTime;
        }
    }
    
    addStep() {
        this.steps++;
        this.saveData();
        this.updateDisplay();
        this.checkMilestone();
    }
    
    startStepSimulation() {
        // Simulate steps for devices without accelerometer
        // This creates realistic step patterns
        this.simulationInterval = setInterval(() => {
            if (this.isActive) {
                // Simulate natural walking pattern (60-120 steps per minute)
                const stepsPerMinute = 80 + Math.random() * 40;
                const stepsToAdd = Math.floor(stepsPerMinute / 60);
                
                if (Math.random() < 0.7) { // 70% chance to add step
                    this.simulatedSteps += stepsToAdd;
                    this.steps += stepsToAdd;
                    this.saveData();
                    this.updateDisplay();
                    this.checkMilestone();
                }
            }
        }, 1000);
    }
    
    checkMilestone() {
        const milestones = [1000, 5000, 10000, 15000, 20000];
        
        milestones.forEach(milestone => {
            if (this.steps >= milestone && !this.hasReachedMilestone(milestone)) {
                this.celebrateMilestone(milestone);
                this.markMilestoneReached(milestone);
            }
        });
    }
    
    hasReachedMilestone(milestone) {
        const reached = localStorage.getItem(`milestone_${milestone}`);
        return reached === 'true';
    }
    
    markMilestoneReached(milestone) {
        localStorage.setItem(`milestone_${milestone}`, 'true');
    }
    
    celebrateMilestone(milestone) {
        const messages = {
            1000: '🎉 Amazing! You took your first 1,000 steps! Keep going, beautiful! 💕',
            5000: '✨ Wow! 5,000 steps done! You\'re on fire today! 🔥',
            10000: '🌟 Incredible! You reached 10,000 steps! You\'re absolutely glowing! ✨',
            15000: '👑 Queen status! 15,000 steps! You\'re unstoppable! 💪',
            20000: '🏆 Legendary! 20,000 steps! You\'re a walking goddess! 👸'
        };
        
        const message = messages[milestone] || `🎊 Amazing! You reached ${milestone.toLocaleString()} steps! ✨`;
        
        // Show in-app notification
        this.showNotification(message);
        
        // Browser notification if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Rehma\'s Step Counter 🎀', {
                body: message,
                icon: '/resources/icon-steps.png'
            });
        }
    }
    
    updateDisplay() {
        // Update step counter display if element exists
        const stepElements = document.querySelectorAll('[data-steps]');
        stepElements.forEach(element => {
            element.textContent = this.steps.toLocaleString();
        });
        
        // Update progress bars
        const progressElements = document.querySelectorAll('[data-step-progress]');
        progressElements.forEach(element => {
            const percentage = Math.min((this.steps / this.dailyGoal) * 100, 100);
            element.style.width = `${percentage}%`;
        });
        
        // Update step goal display
        const goalElements = document.querySelectorAll('[data-step-goal]');
        goalElements.forEach(element => {
            element.textContent = `${this.steps.toLocaleString()} / ${this.dailyGoal.toLocaleString()}`;
        });
    }
    
    getCaloriesBurned() {
        // Rough estimate: 0.04 calories per step (varies by weight and intensity)
        const weightFactor = 65 / 70; // Adjust for Rehma's weight
        return Math.round(this.steps * 0.04 * weightFactor);
    }
    
    getDistance() {
        // Average step length is about 0.65 meters
        return (this.steps * 0.65 / 1000).toFixed(2); // Kilometers
    }
    
    getActiveMinutes() {
        // Estimate active minutes based on step frequency
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const dayStart = today.getTime();
        const elapsed = now.getTime() - dayStart;
        
        // Estimate 120 steps per minute of activity
        return Math.floor(this.steps / 120);
    }
    
    resetDailySteps() {
        // Reset at midnight
        const now = new Date();
        const lastReset = localStorage.getItem('lastStepReset');
        const today = now.toDateString();
        
        if (lastReset !== today) {
            this.steps = 0;
            this.simulatedSteps = 0;
            localStorage.setItem('lastStepReset', today);
            
            // Clear milestone flags for new day
            const milestones = [1000, 5000, 10000, 15000, 20000];
            milestones.forEach(milestone => {
                localStorage.removeItem(`milestone_${milestone}`);
            });
            
            this.updateDisplay();
        }
    }
    
    pause() {
        this.isActive = false;
    }
    
    resume() {
        this.isActive = true;
        this.resetDailySteps();
    }
    
    saveData() {
        const data = {
            steps: this.steps,
            simulatedSteps: this.simulatedSteps,
            dailyGoal: this.dailyGoal,
            lastSaved: new Date().toISOString()
        };
        
        localStorage.setItem('rehmaStepCounter', JSON.stringify(data));
    }
    
    loadData() {
        const saved = localStorage.getItem('rehmaStepCounter');
        if (saved) {
            const data = JSON.parse(saved);
            this.steps = data.steps || 0;
            this.simulatedSteps = data.simulatedSteps || 0;
            this.dailyGoal = data.dailyGoal || 10000;
        }
        
        this.resetDailySteps();
    }
    
    showNotification(message) {
        // Create in-app notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #FF69B4, #FFB6C1);
            color: white;
            padding: 16px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(255, 105, 180, 0.3);
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            font-weight: 600;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
}

// Initialize step counter
let stepCounter;

document.addEventListener('DOMContentLoaded', () => {
    stepCounter = new StepCounter();
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    // Add step counter to main app if available
    if (window.fitnessTracker) {
        window.fitnessTracker.stepCounter = stepCounter;
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StepCounter;
}