// Rehma's Fitness Tracker - Main JavaScript
// Advanced PCOS-specific fitness calculations and self-learning algorithms

class RehmaFitnessTracker {
    constructor() {
        // User profile data
        this.userProfile = {
            name: 'Rehma',
            birthDate: new Date('2005-10-12'),
            weight: 65, // kg
            height: 165, // cm
            activityLevel: 'moderate',
            currentWeight: 65,
            lastWeightUpdate: new Date(),
            goals: {
                targetWeight: 60,
                dailyCalories: 1500,
                weeklyWorkouts: 4,
                waterGlasses: 13
            }
        };
        
        // Cycle tracking data
        this.cycleData = {
            lastPeriodStart: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
            cycleHistory: [28, 31, 26, 29, 33, 27, 30], // PCOS pattern
            currentPhase: 'luteal',
            predictions: [],
            symptoms: {},
            confidence: 0.85
        };
        
        // Daily tracking data
        this.dailyData = {
            waterIntake: 0,
            foodLog: [],
            workouts: [],
            weight: 65,
            mood: null,
            energy: null
        };
        
        // PCOS-specific parameters
        this.pcosParams = {
            bmrReduction: 0.15, // 15% reduction
            insulinResistanceFactor: 0.9,
            waterMultiplier: 1.15,
            workoutEfficiency: 0.95
        };
        
        // Cycle phase definitions
        this.cyclePhases = {
            menstrual: {
                name: 'Menstrual',
                days: 5,
                color: '#8B0000',
                metabolicModifier: 0.95,
                pcosAdjustment: 0.98
            },
            follicular: {
                name: 'Follicular',
                days: 7,
                color: '#FFB6C1',
                metabolicModifier: 1.0,
                pcosAdjustment: 1.0
            },
            ovulation: {
                name: 'Ovulation',
                days: 3,
                color: '#FF69B4',
                metabolicModifier: 1.05,
                pcosAdjustment: 1.03
            },
            luteal: {
                name: 'Luteal',
                days: 13,
                color: '#FFA500',
                metabolicModifier: 1.02,
                pcosAdjustment: 1.0
            }
        };
        
        this.init();
    }
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.startNotifications();
        this.updateUI();
        this.startSelfLearning();
    }
    
    // ========== ADVANCED CALCULATIONS ==========
    
    calculateAge() {
        const today = new Date();
        const birthDate = this.userProfile.birthDate;
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }
    
    calculateBMR(weight = this.userProfile.currentWeight, height = this.userProfile.height) {
        const age = this.calculateAge();
        
        // Mifflin-St Jeor equation
        let bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        
        // PCOS-specific adjustment
        bmr *= (1 - this.pcosParams.bmrReduction);
        
        return Math.round(bmr);
    }
    
    calculateTDEE(bmr = this.calculateBMR()) {
        const activityMultipliers = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.45, // PCOS-adjusted
            active: 1.6     // PCOS-adjusted
        };
        
        const multiplier = activityMultipliers[this.userProfile.activityLevel] || 1.45;
        return Math.round(bmr * multiplier);
    }
    
    calculateCycleDay(date = new Date()) {
        const lastStart = this.cycleData.lastPeriodStart;
        const daysDiff = Math.floor((date - lastStart) / (1000 * 60 * 60 * 24));
        const predictedLength = this.predictCycleLength();
        const cycleDay = (daysDiff % predictedLength) + 1;
        
        return {
            cycleDay,
            cycleLength: predictedLength,
            phase: this.getCyclePhase(cycleDay, predictedLength),
            daysSinceStart: daysDiff
        };
    }
    
    predictCycleLength() {
        // Self-learning algorithm for cycle prediction
        const history = this.cycleData.cycleHistory;
        
        if (history.length < 3) return 28; // Default
        
        // Weighted moving average with emphasis on recent cycles
        const weights = history.map((_, index) => index + 1); // More weight to recent
        const weightedSum = history.reduce((sum, length, index) => sum + (length * weights[index]), 0);
        const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
        
        const predicted = Math.round(weightedSum / weightSum);
        
        // PCOS variability constraint (21-35 days)
        return Math.max(21, Math.min(35, predicted));
    }
    
    getCyclePhase(cycleDay, cycleLength = 28) {
        const phaseLengths = {
            menstrual: 5,
            follicular: Math.round(cycleLength * 0.25) - 5,
            ovulation: 3,
            luteal: Math.round(cycleLength * 0.45)
        };
        
        let currentDay = cycleDay;
        
        if (currentDay <= phaseLengths.menstrual) return 'menstrual';
        currentDay -= phaseLengths.menstrual;
        
        if (currentDay <= phaseLengths.follicular) return 'follicular';
        currentDay -= phaseLengths.follicular;
        
        if (currentDay <= phaseLengths.ovulation) return 'ovulation';
        
        return 'luteal';
    }
    
    calculatePhaseCalories(phase = this.calculateCycleDay().phase) {
        const tdee = this.calculateTDEE();
        const phaseData = this.cyclePhases[phase];
        
        const adjustedTDEE = tdee * phaseData.metabolicModifier * phaseData.pcosAdjustment;
        const deficitCalories = Math.round(adjustedTDEE * 0.85); // 15% deficit
        
        return {
            maintenance: Math.round(adjustedTDEE),
            deficit: deficitCalories,
            phase: phase,
            phaseColor: phaseData.color
        };
    }
    
    calculateWaterIntake() {
        const baseWater = this.userProfile.currentWeight * 35; // 35ml per kg
        const activityMultiplier = this.userProfile.activityLevel === 'active' ? 1.2 : 1.0;
        const totalWater = baseWater * activityMultiplier * this.pcosParams.waterMultiplier;
        
        return {
            totalMl: Math.round(totalWater),
            glasses: Math.round(totalWater / 250),
            currentProgress: this.dailyData.waterIntake
        };
    }
    
    calculateWorkoutCalories(duration, workoutType, intensity = 'moderate') {
        const weight = this.userProfile.currentWeight;
        
        const metValues = {
            cardio: { low: 4.0, moderate: 6.0, high: 8.0 },
            strength: { low: 3.0, moderate: 5.0, high: 7.0 },
            yoga: { low: 2.0, moderate: 3.0, high: 4.0 },
            hiit: { low: 6.0, moderate: 8.0, high: 12.0 },
            walking: { low: 2.5, moderate: 3.5, high: 4.5 }
        };
        
        const met = metValues[workoutType]?.[intensity] || 4.0;
        const caloriesPerMinute = (met * weight * 3.5) / 200;
        const totalCalories = caloriesPerMinute * duration * this.pcosParams.workoutEfficiency;
        
        return Math.round(totalCalories);
    }
    
    // ========== SELF-LEARNING ALGORITHMS ==========
    
    startSelfLearning() {
        // Continuously learn from user patterns
        setInterval(() => {
            this.analyzePatterns();
            this.updatePredictions();
        }, 60000); // Every minute for demo (should be daily in production)
    }
    
    analyzePatterns() {
        // Analyze cycle patterns
        this.analyzeCyclePatterns();
        
        // Analyze food patterns
        this.analyzeFoodPatterns();
        
        // Analyze workout patterns
        this.analyzeWorkoutPatterns();
        
        // Save learned data
        this.saveData();
    }
    
    analyzeCyclePatterns() {
        const history = this.cycleData.cycleHistory;
        
        if (history.length < 5) return;
        
        // Detect irregularity patterns
        const variations = history.map((length, index) => {
            if (index === 0) return 0;
            return Math.abs(length - history[index - 1]);
        });
        
        const avgVariation = variations.reduce((sum, var) => sum + var, 0) / variations.length;
        
        // Update confidence based on pattern stability
        this.cycleData.confidence = avgVariation < 3 ? 0.9 : 0.7;
        
        // Detect trends
        const recentAvg = history.slice(-3).reduce((sum, len) => sum + len, 0) / 3;
        const olderAvg = history.slice(0, 3).reduce((sum, len) => sum + len, 0) / 3;
        
        if (Math.abs(recentAvg - olderAvg) > 5) {
            console.log('Significant cycle length change detected');
        }
    }
    
    analyzeFoodPatterns() {
        // Analyze eating patterns and preferences
        const foodLog = this.dailyData.foodLog;
        
        if (foodLog.length < 10) return;
        
        // Find most common foods
        const foodCounts = {};
        foodLog.forEach(entry => {
            foodCounts[entry.foodId] = (foodCounts[entry.foodId] || 0) + 1;
        });
        
        // Find time patterns
        const timePatterns = {};
        foodLog.forEach(entry => {
            const hour = new Date(entry.timestamp).getHours();
            const timeSlot = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
            timePatterns[timeSlot] = (timePatterns[timeSlot] || 0) + 1;
        });
        
        // Use patterns to suggest meal timing
        this.foodPatterns = { foodCounts, timePatterns };
    }
    
    analyzeWorkoutPatterns() {
        // Analyze workout preferences and performance
        const workouts = this.dailyData.workouts;
        
        if (workouts.length < 10) return;
        
        // Find preferred workout types
        const workoutCounts = {};
        workouts.forEach(workout => {
            workoutCounts[workout.type] = (workoutCounts[workout.type] || 0) + 1;
        });
        
        // Find performance patterns by cycle phase
        const phasePerformance = {};
        workouts.forEach(workout => {
            const cycleDay = this.calculateCycleDay(new Date(workout.timestamp));
            const phase = cycleDay.phase;
            
            if (!phasePerformance[phase]) {
                phasePerformance[phase] = { totalCalories: 0, count: 0 };
            }
            
            phasePerformance[phase].totalCalories += workout.caloriesBurned;
            phasePerformance[phase].count += 1;
        });
        
        this.workoutPatterns = { workoutCounts, phasePerformance };
    }
    
    updatePredictions() {
        // Update cycle predictions
        const nextCycleLength = this.predictCycleLength();
        const nextPeriodDate = new Date(this.cycleData.lastPeriodStart);
        nextPeriodDate.setDate(nextPeriodDate.getDate() + nextCycleLength);
        
        this.cycleData.predictions = [{
            date: nextPeriodDate,
            confidence: this.cycleData.confidence,
            type: 'period'
        }];
        
        // Update calorie recommendations based on patterns
        if (this.foodPatterns) {
            this.adjustCalorieTargets();
        }
    }
    
    adjustCalorieTargets() {
        // Adjust targets based on actual consumption patterns
        const avgIntake = this.calculateAverageIntake();
        const target = this.userProfile.goals.dailyCalories;
        
        if (Math.abs(avgIntake - target) > 200) {
            // Gradually adjust target
            const adjustment = avgIntake > target ? 50 : -50;
            this.userProfile.goals.dailyCalories += adjustment;
        }
    }
    
    calculateAverageIntake() {
        // Calculate average calorie intake from recent logs
        const recentLogs = this.dailyData.foodLog.slice(-20); // Last 20 entries
        if (recentLogs.length === 0) return this.userProfile.goals.dailyCalories;
        
        const totalCalories = recentLogs.reduce((sum, entry) => sum + entry.calories, 0);
        return totalCalories / recentLogs.length;
    }
    
    // ========== NOTIFICATION SYSTEM ==========
    
    startNotifications() {
        // Request notification permission
        if ('Notification' in window) {
            Notification.requestPermission();
        }
        
        // Schedule notifications
        this.scheduleWaterReminders();
        this.scheduleLoggingReminders();
    }
    
    scheduleWaterReminders() {
        // 3 times daily: 9 AM, 2 PM, 7 PM
        const times = [9, 14, 19];
        
        times.forEach(hour => {
            setInterval(() => {
                const now = new Date();
                if (now.getHours() === hour && now.getMinutes() === 0) {
                    this.showWaterReminder();
                }
            }, 60000); // Check every minute
        });
    }
    
    scheduleLoggingReminders() {
        // 2 times daily: 1 PM, 8 PM
        const times = [13, 20];
        
        times.forEach(hour => {
            setInterval(() => {
                const now = new Date();
                if (now.getHours() === hour && now.getMinutes() === 0) {
                    this.showLoggingReminder();
                }
            }, 60000);
        });
    }
    
    showWaterReminder() {
        const waterData = this.calculateWaterIntake();
        const remaining = waterData.glasses - waterData.currentProgress;
        
        if (remaining > 0) {
            const message = `💧 Time to drink water! You need ${remaining} more glasses today.`;
            
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Rehma\'s Health Tracker', {
                    body: message,
                    icon: '/resources/icon-water.png'
                });
            }
            
            this.showInAppNotification(message, 'water');
        }
    }
    
    showLoggingReminder() {
        const hasLoggedToday = this.hasLoggedFoodToday();
        
        if (!hasLoggedToday) {
            const message = '📝 Don\'t forget to log your meals and workouts for today!';
            
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Rehma\'s Health Tracker', {
                    body: message,
                    icon: '/resources/icon-log.png'
                });
            }
            
            this.showInAppNotification(message, 'logging');
        }
    }
    
    showInAppNotification(message, type) {
        // Create in-app notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    hasLoggedFoodToday() {
        const today = new Date().toDateString();
        return this.dailyData.foodLog.some(entry => 
            new Date(entry.timestamp).toDateString() === today
        );
    }
    
    // ========== DATA MANAGEMENT ==========
    
    saveData() {
        const data = {
            userProfile: this.userProfile,
            cycleData: this.cycleData,
            dailyData: this.dailyData,
            foodPatterns: this.foodPatterns,
            workoutPatterns: this.workoutPatterns,
            lastSaved: new Date()
        };
        
        localStorage.setItem('rehmaFitnessData', JSON.stringify(data));
    }
    
    loadData() {
        const saved = localStorage.getItem('rehmaFitnessData');
        
        if (saved) {
            const data = JSON.parse(saved);
            
            // Convert date strings back to Date objects
            this.userProfile = {
                ...this.userProfile,
                ...data.userProfile,
                birthDate: new Date(data.userProfile.birthDate),
                lastWeightUpdate: new Date(data.userProfile.lastWeightUpdate)
            };
            
            this.cycleData = {
                ...this.cycleData,
                ...data.cycleData,
                lastPeriodStart: new Date(data.cycleData.lastPeriodStart)
            };
            
            this.dailyData = { ...this.dailyData, ...data.dailyData };
            this.foodPatterns = data.foodPatterns;
            this.workoutPatterns = data.workoutPatterns;
        }
    }
    
    // ========== UI UPDATE METHODS ==========
    
    updateUI() {
        this.updateCycleDisplay();
        this.updateCalorieDisplay();
        this.updateWaterDisplay();
        this.updateProgressBars();
        this.updateTheme();
    }
    
    updateCycleDisplay() {
        const cycleInfo = this.calculateCycleDay();
        const phaseData = this.cyclePhases[cycleInfo.phase];
        
        const cycleElement = document.getElementById('cycle-status');
        if (cycleElement) {
            cycleElement.innerHTML = `
                <div class="cycle-phase" style="background-color: ${phaseData.color}20; border-color: ${phaseData.color}">
                    <h3>${phaseData.name} Phase</h3>
                    <p>Day ${cycleInfo.cycleDay} of ${cycleInfo.cycleLength}</p>
                    <p>${cycleInfo.daysInPhase} days in current phase</p>
                </div>
            `;
        }
        
        // Update background glow
        document.documentElement.style.setProperty('--cycle-glow', phaseData.color);
    }
    
    updateCalorieDisplay() {
        const calorieData = this.calculatePhaseCalories();
        const calorieElement = document.getElementById('calorie-target');
        
        if (calorieElement) {
            calorieElement.innerHTML = `
                <div class="calorie-info">
                    <h3>Daily Calorie Target</h3>
                    <div class="calorie-numbers">
                        <span class="target">${calorieData.deficit}</span>
                        <span class="unit">calories</span>
                    </div>
                    <p class="phase-note">${calorieData.phase} phase adjustment applied</p>
                </div>
            `;
        }
    }
    
    updateWaterDisplay() {
        const waterData = this.calculateWaterIntake();
        const waterElement = document.getElementById('water-progress');
        
        if (waterElement) {
            const percentage = (waterData.currentProgress / waterData.glasses) * 100;
            
            waterElement.innerHTML = `
                <div class="water-info">
                    <h3>Water Intake</h3>
                    <div class="water-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%"></div>
                        </div>
                        <span class="progress-text">${waterData.currentProgress}/${waterData.glasses} glasses</span>
                    </div>
                </div>
            `;
        }
    }
    
    updateProgressBars() {
        // Update various progress indicators
        this.updateWaterProgress();
        this.updateCalorieProgress();
        this.updateWorkoutProgress();
    }
    
    updateWaterProgress() {
        const waterData = this.calculateWaterIntake();
        const progressBar = document.querySelector('.water-progress-bar');
        
        if (progressBar) {
            const percentage = (waterData.currentProgress / waterData.glasses) * 100;
            progressBar.style.width = `${Math.min(percentage, 100)}%`;
        }
    }
    
    updateCalorieProgress() {
        const calorieData = this.calculatePhaseCalories();
        const consumed = this.calculateTodayCalories();
        const percentage = (consumed / calorieData.deficit) * 100;
        
        const progressBar = document.querySelector('.calorie-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${Math.min(percentage, 100)}%`;
        }
    }
    
    updateWorkoutProgress() {
        const todayWorkouts = this.getTodayWorkouts();
        const target = this.userProfile.goals.weeklyWorkouts / 7; // Daily target
        const percentage = (todayWorkouts.length / target) * 100;
        
        const progressBar = document.querySelector('.workout-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${Math.min(percentage, 100)}%`;
        }
    }
    
    calculateTodayCalories() {
        const today = new Date().toDateString();
        return this.dailyData.foodLog
            .filter(entry => new Date(entry.timestamp).toDateString() === today)
            .reduce((sum, entry) => sum + entry.calories, 0);
    }
    
    getTodayWorkouts() {
        const today = new Date().toDateString();
        return this.dailyData.workouts.filter(workout => 
            new Date(workout.timestamp).toDateString() === today
        );
    }
    
    // ========== EVENT LISTENERS ==========
    
    setupEventListeners() {
        // Water intake buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.water-glass')) {
                this.addWaterGlass();
            }
            
            if (e.target.matches('.theme-toggle')) {
                this.toggleTheme();
            }
            
            if (e.target.matches('.add-food-btn')) {
                this.showFoodLogger();
            }
            
            if (e.target.matches('.add-workout-btn')) {
                this.showWorkoutLogger();
            }
        });
        
        // Form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.matches('.food-form')) {
                e.preventDefault();
                this.logFood(new FormData(e.target));
            }
            
            if (e.target.matches('.workout-form')) {
                e.preventDefault();
                this.logWorkout(new FormData(e.target));
            }
        });
    }
    
    addWaterGlass() {
        this.dailyData.waterIntake++;
        this.updateWaterDisplay();
        this.saveData();
        
        // Celebration animation for reaching goal
        const waterData = this.calculateWaterIntake();
        if (this.dailyData.waterIntake === waterData.glasses) {
            this.celebrateGoal('water');
        }
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        this.updateTheme();
    }
    
    updateTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Update cycle-aware backlighting
        const cycleInfo = this.calculateCycleDay();
        const phaseColor = this.cyclePhases[cycleInfo.phase].color;
        document.documentElement.style.setProperty('--cycle-glow', phaseColor);
    }
    
    showFoodLogger() {
        // Implementation for food logging modal
        console.log('Show food logger');
    }
    
    showWorkoutLogger() {
        // Implementation for workout logging modal
        console.log('Show workout logger');
    }
    
    logFood(formData) {
        const foodEntry = {
            foodId: formData.get('foodId'),
            name: formData.get('name'),
            calories: parseInt(formData.get('calories')),
            protein: parseInt(formData.get('protein')),
            timestamp: new Date().toISOString()
        };
        
        this.dailyData.foodLog.push(foodEntry);
        this.updateCalorieProgress();
        this.saveData();
    }
    
    logWorkout(formData) {
        const workoutEntry = {
            type: formData.get('type'),
            duration: parseInt(formData.get('duration')),
            intensity: formData.get('intensity'),
            caloriesBurned: parseInt(formData.get('caloriesBurned')),
            timestamp: new Date().toISOString()
        };
        
        this.dailyData.workouts.push(workoutEntry);
        this.updateWorkoutProgress();
        this.saveData();
    }
    
    celebrateGoal(type) {
        // Goal celebration animation
        const celebration = document.createElement('div');
        celebration.className = 'celebration';
        celebration.innerHTML = `
            <div class="celebration-content">
                <h2>🎉 Goal Achieved!</h2>
                <p>You completed your ${type} goal!</p>
            </div>
        `;
        
        document.body.appendChild(celebration);
        
        setTimeout(() => {
            celebration.remove();
        }, 3000);
    }
    
    // ========== PUBLIC API METHODS ==========
    
    getHealthSummary() {
        const cycleInfo = this.calculateCycleDay();
        const calorieData = this.calculatePhaseCalories();
        const waterData = this.calculateWaterIntake();
        
        return {
            cycle: cycleInfo,
            calories: calorieData,
            water: waterData,
            recommendations: this.getPersonalizedRecommendations(cycleInfo.phase)
        };
    }
    
    getPersonalizedRecommendations(phase) {
        const exerciseRecs = this.getExerciseRecommendations(phase);
        const nutritionRecs = this.getNutritionRecommendations(phase);
        
        return {
            exercise: exerciseRecs,
            nutrition: nutritionRecs,
            lifestyle: this.getLifestyleRecommendations(phase)
        };
    }
    
    getExerciseRecommendations(phase) {
        const recommendations = {
            menstrual: {
                focus: 'Gentle movement and recovery',
                suggested: ['Light walking', 'Gentle yoga', 'Stretching'],
                intensity: 'Low',
                duration: '20-30 minutes',
                avoid: ['High-intensity workouts', 'Heavy lifting']
            },
            follicular: {
                focus: 'Build energy and strength',
                suggested: ['Cardio', 'Strength training', 'Moderate HIIT'],
                intensity: 'Moderate to high',
                duration: '30-45 minutes',
                avoid: []
            },
            ovulation: {
                focus: 'Peak performance',
                suggested: ['High-intensity cardio', 'Heavy lifting', 'Long runs'],
                intensity: 'High',
                duration: '45-60 minutes',
                avoid: []
            },
            luteal: {
                focus: 'Maintain and support',
                suggested: ['Moderate cardio', 'Pilates', 'Swimming'],
                intensity: 'Moderate',
                duration: '30-40 minutes',
                avoid: ['Extreme HIIT', 'Very heavy lifting']
            }
        };
        
        return recommendations[phase] || recommendations.follicular;
    }
    
    getNutritionRecommendations(phase) {
        const recommendations = {
            menstrual: {
                focus: 'Iron and comfort',
                foods: ['Leafy greens', 'Lean proteins', 'Complex carbs', 'Warm foods'],
                avoid: ['Excessive caffeine', 'Processed foods', 'Cold foods'],
                supplements: ['Iron', 'B vitamins', 'Magnesium']
            },
            follicular: {
                focus: 'Energy and preparation',
                foods: ['Fresh vegetables', 'Lean proteins', 'Whole grains', 'Antioxidants'],
                avoid: ['Excess sugar', 'Trans fats', 'Processed foods'],
                supplements: ['Folate', 'Vitamin C', 'Omega-3']
            },
            ovulation: {
                focus: 'Peak nutrition',
                foods: ['High-quality proteins', 'Healthy fats', 'Colorful vegetables', 'Fruits'],
                avoid: ['Excessive alcohol', 'High sodium', 'Processed foods'],
                supplements: ['Zinc', 'Vitamin E', 'Probiotics']
            },
            luteal: {
                focus: 'Stability and comfort',
                foods: ['Complex carbs', 'Healthy fats', 'Calcium-rich foods', 'Fiber'],
                avoid: ['Excessive sugar', 'Caffeine', 'Salty foods', 'Alcohol'],
                supplements: ['Calcium', 'Magnesium', 'Vitamin B6']
            }
        };
        
        return recommendations[phase] || recommendations.follicular;
    }
    
    getLifestyleRecommendations(phase) {
        const recommendations = {
            menstrual: {
                sleep: '8-9 hours, prioritize rest',
                stress: 'Low stress activities only',
                self_care: 'Warm baths, heating pads, gentle activities',
                social: 'Quiet time, close friends only'
            },
            follicular: {
                sleep: '7-8 hours, good quality',
                stress: 'Moderate stress tolerance',
                self_care: 'Active recovery, planning, goal setting',
                social: 'Social activities, trying new things'
            },
            ovulation: {
                sleep: '7-8 hours, consistent schedule',
                stress: 'High stress tolerance',
                self_care: 'Challenging activities, social events',
                social: 'Perfect for important meetings and events'
            },
            luteal: {
                sleep: '8 hours, may need more',
                stress: 'Decreasing stress tolerance',
                self_care: 'Comfort activities, preparation',
                social: 'Balance social time with rest'
            }
        };
        
        return recommendations[phase] || recommendations.follicular;
    }
}

// Initialize the fitness tracker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.fitnessTracker = new RehmaFitnessTracker();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RehmaFitnessTracker;
}