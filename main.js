/**
 * Rehma's Wellness Tracker - Core Engine (v2.0)
 * ==============================================
 *   ARCHITECTURE:
 *   1. STATE MANAGEMENT:
 * - Uses a Singleton pattern (RehmaHealthOS).
 * - State is atomic: Changes are written to localStorage immediately.
 * - Data Structure: Time-Series based (Key = "YYYY-MM-DD").
 *   2. BIOLOGICAL ENGINE:
 * - Metabolism: Katch-McArdle Equation (Lean Body Mass based).
 * - Cycle: Multi-phasic prediction engine (Menstrual -> Follicular -> Ovulation -> Luteal).
 * - Insulin Load: Net Carb calculation (Total Carbs - Fiber).
 *   3. PERSISTENCE LAYER:
 * - Auto-recovery: Checks for data corruption on boot.
 * - Migration: Capable of upgrading old data structures.
 */
class RehmaHealthOS {
    constructor() {
        this.STORAGE_KEY = 'rehma_health_os_final';
        
        // Runtime Cache for high-frequency calculations
        this.runtime = {
            today: new Date().toISOString().split('T')[0],
            tdee: 0,
            nextPeriod: null,
            activePhase: null
        };

        // Initialize System
        console.group("🌸 System Boot: Rehma Health OS");
        this.state = this.loadState();
        this.validateState(); // Integrity check
        this.init();
        console.groupEnd();
    }

    // =========================================================================
    // 1. SYSTEM INITIALIZATION & DATA INTEGRITY
    // =========================================================================

    loadState() {
        try {
            const serialized = localStorage.getItem(this.STORAGE_KEY);
            if (serialized) return JSON.parse(serialized);
        } catch (e) {
            console.error("CRITICAL: Storage Corruption. Restoring Factory Defaults.", e);
        }
        return this.getFactoryDefaults();
    }

    getFactoryDefaults() {
        return {
            profile: {
                name: 'Rehma',
                dob: '2000-01-01',
                height: 165,      // cm
                weight: 65.0,     // kg
                bodyFat: 22.0,    // % (Crucial for Katch-McArdle)
                activityLevel: 'moderate',
                goals: {
                    dailyCalories: 2000,
                    protein: 130, // g
                    carbs: 200,   // g
                    fat: 60,      // g
                    fiber: 25,    // g
                    water: 2500   // ml
                }
            },
            // Time-Series Data (O(1) Access)
            logs: {
                nutrition: {}, // { '2024-01-01': [Array of Food Objects] }
                workouts: {},  // { '2024-01-01': [Array of Workout Objects] }
                weight: {},    // { '2024-01-01': 65.5 }
                water: {},     // { '2024-01-01': 1500 }
                steps: {},     // { '2024-01-01': 8432 }
                symptoms: {}   // { '2024-01-01': ['Bloating', 'Cramps'] }
            },
            // Cycle Data (Event Driven)
            cycle: {
                events: [], // Array of { date: 'YYYY-MM-DD', type: 'start'|'end' }
                avgLength: 29,
                avgDuration: 5
            },
            library: [], // Custom User Foods
            settings: {
                theme: 'light',
                notifications: true
            }
        };
    }

    validateState() {
        // Ensure all required objects exist (Migration logic)
        if (!this.state.logs.symptoms) this.state.logs.symptoms = {};
        if (!this.state.library) this.state.library = [];
        if (!this.state.profile.goals.fiber) this.state.profile.goals.fiber = 25;
    }

    init() {
        // 1. Calculate Baselines
        this.runtime.tdee = this.calculateKatchMcArdle();
        
        // 2. Cycle Analysis
        this.recalculateCycleStats();
        
        // 3. Notification Service
        if (this.state.settings.notifications) {
            this.setupWaterNotifications();
        }

        // 4. UI Handshake (Wait for DOM)
        setTimeout(() => this.broadcast('SYSTEM_READY'), 100);
        
        console.log(`System Online. TDEE: ${this.runtime.tdee}kcal`);
    }

    // =========================================================================
    // 2. METABOLIC ENGINE (Katch-McArdle)
    // =========================================================================

    /**
     * Calculates precise energy expenditure ignoring BMI.
     * Uses Lean Body Mass (LBM) for accuracy.
     */
    calculateKatchMcArdle() {
        const p = this.state.profile;
        const currentWeight = this.state.logs.weight[this.runtime.today] || p.weight;
        
        // LBM Calculation
        const bodyFatDecimal = (p.bodyFat || 25) / 100;
        const lbm = currentWeight * (1 - bodyFatDecimal);
        
        // BMR Calculation (370 + 21.6 * LBM)
        let bmr = 370 + (21.6 * lbm);
        
        // Activity Multiplier
        const multipliers = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'active': 1.725,
            'athlete': 1.9
        };
        const activity = multipliers[p.activityLevel] || 1.55;
        
        // Luteal Phase Adjustment (Thermic Effect of Progesterone)
        const phase = this.getPhaseForDate(this.runtime.today);
        const phaseBurn = (phase === 'Luteal') ? 150 : 0;
        
        return Math.floor((bmr * activity) + phaseBurn);
    }

    // =========================================================================
    // 3. ADVANCED CYCLE ENGINE (Multi-Period Support)
    // =========================================================================

    logPeriodStart(dateStr) {
        // Idempotency: Don't add if already exists
        const exists = this.state.cycle.events.find(e => e.date === dateStr && e.type === 'start');
        if (exists) return;

        // Auto-close previous period if open
        this.closeOpenCycles(dateStr);

        this.state.cycle.events.push({ date: dateStr, type: 'start' });
        this.sortCycleEvents();
        this.save();
    }

    logPeriodEnd(dateStr) {
        const exists = this.state.cycle.events.find(e => e.date === dateStr && e.type === 'end');
        if (exists) return;

        // Find the relevant start date to close
        // It must be BEFORE this end date, and not already closed
        const events = this.state.cycle.events;
        let targetIndex = -1;

        for (let i = events.length - 1; i >= 0; i--) {
            if (events[i].type === 'start' && events[i].date <= dateStr) {
                // Check if this start already has a paired end
                const nextEvent = events[i+1];
                if (!nextEvent || (nextEvent.type === 'start')) {
                    targetIndex = i;
                    break;
                }
            }
        }

        if (targetIndex !== -1) {
            // Insert End Event after the start
            this.state.cycle.events.push({ date: dateStr, type: 'end' });
            this.sortCycleEvents();
            this.save();
        }
    }

    closeOpenCycles(newStartDate) {
        // Helper: If we start a new period, ensure previous ones are closed
        // to prevent logic errors in phase calculation
        const events = this.state.cycle.events;
        if (events.length === 0) return;

        const lastEvent = events[events.length - 1];
        if (lastEvent.type === 'start' && lastEvent.date < newStartDate) {
            // Synthesize an end date (assume 5 days duration)
            const d = new Date(lastEvent.date);
            d.setDate(d.getDate() + 5);
            // Only add if the synthetic end is before the new start
            if (d.toISOString().split('T')[0] < newStartDate) {
                this.state.cycle.events.push({ 
                    date: d.toISOString().split('T')[0], 
                    type: 'end' 
                });
            }
        }
    }

    sortCycleEvents() {
        this.state.cycle.events.sort((a,b) => new Date(a.date) - new Date(b.date));
        this.recalculateCycleStats();
    }

    recalculateCycleStats() {
        const events = this.state.cycle.events;
        if (events.length < 3) return;

        let totalDays = 0;
        let cycles = 0;

        // Calculate average length between STARTS
        for (let i = 0; i < events.length - 1; i++) {
            if (events[i].type === 'start') {
                // Find next start
                const nextStart = events.slice(i + 1).find(e => e.type === 'start');
                if (nextStart) {
                    const days = (new Date(nextStart.date) - new Date(events[i].date)) / (86400000);
                    // Filter outliers (15-50 days)
                    if (days > 15 && days < 50) {
                        totalDays += days;
                        cycles++;
                    }
                }
            }
        }

        if (cycles > 0) {
            this.state.cycle.avgLength = Math.round(totalDays / cycles);
        }
    }

    /**
     * THE MASTER PHASE CALCULATOR
     * Determines phase for ANY date (Past, Present, Future).
     * Used for coloring dots on the calendar.
     */
    getPhaseForDate(dateStr) {
        const tDate = new Date(dateStr);
        const tTime = tDate.getTime();
        const events = this.state.cycle.events;

        // 1. IS IT A PERIOD DAY? (Check explicit logs)
        // Find closest event before or on this date
        let lastEvent = null;
        for (let e of events) {
            if (new Date(e.date) <= tDate) lastEvent = e;
            else break;
        }

        if (lastEvent) {
            if (lastEvent.type === 'start') {
                // We are inside a period OR it was left open
                // Check if there is an end date in the future?
                // No, we are iterating chronologically. 
                // If last event was start, and we are here, we are bleeding...
                // UNLESS it's been too long (> 7 days)
                const diff = (tTime - new Date(lastEvent.date).getTime()) / 86400000;
                if (diff <= 7) return 'Menstrual';
            } else if (lastEvent.type === 'end') {
                // Period ended. Calculate days since START of that period.
                // Find the start corresponding to this end
                const startEvent = events.find(e => e.type === 'start' && e.date <= lastEvent.date); // rough approx
                // Better: rely on days since last known start
            }
        }

        // 2. PHASE MATH (Follicular/Ovulation/Luteal)
        // Find the absolute most recent START date
        const lastStart = [...events].reverse().find(e => e.type === 'start' && new Date(e.date) <= tDate);
        
        if (!lastStart) return 'Follicular'; // Default

        const daysSinceStart = Math.floor((tTime - new Date(lastStart.date).getTime()) / 86400000) + 1;
        const avgLen = this.state.cycle.avgLength || 29;

        // Modulo math for future predictions (cycles repeat)
        // Note: This assumes regularity for future dates
        const currentCycleDay = ((daysSinceStart - 1) % avgLen) + 1;

        if (currentCycleDay <= 5) return 'Menstrual';
        if (currentCycleDay <= 13) return 'Follicular';
        if (currentCycleDay <= 17) return 'Ovulation';
        return 'Luteal';
    }

    // =========================================================================
    // 4. DATA LOGGING (Instant Persistence)
    // =========================================================================

    /**
     * Updates weight and triggers immediate TDEE recalculation & save.
     */
    setWeight(dateStr, val) {
        const w = parseFloat(val);
        if (!w || w < 20) return;

        this.state.logs.weight[dateStr] = w;
        
        // Update profile baseline if it's today
        if (dateStr === this.runtime.today) {
            this.state.profile.weight = w;
        }
        
        this.save();
        this.runtime.tdee = this.calculateKatchMcArdle(); // Update runtime cache
        this.broadcast('WEIGHT_UPDATED');
    }

    setCalorieGoal(val) {
        this.state.profile.goals.dailyCalories = parseInt(val);
        this.save();
    }

    /**
     * Logs food to nutrition array + adds to Custom Library
     */
    logFood(dateStr, food) {
        if (!this.state.logs.nutrition[dateStr]) this.state.logs.nutrition[dateStr] = [];
        
        // Add Entry
        this.state.logs.nutrition[dateStr].push({
            id: Date.now(),
            name: food.name,
            cals: parseInt(food.cals),
            p: parseFloat(food.p),
            c: parseFloat(food.c),
            f: parseFloat(food.f),
            fiber: parseFloat(food.fiber || 0)
        });

        // Library Logic (Deduplication)
        const libIndex = this.state.library.findIndex(f => f.name.toLowerCase() === food.name.toLowerCase());
        if (libIndex === -1) {
            this.state.library.push({
                name: food.name, cals: food.cals, p: food.p, c: food.c, f: food.f, fiber: food.fiber
            });
            // Keep library sorted
            this.state.library.sort((a,b) => a.name.localeCompare(b.name));
        }

        this.save();
    }

    removeFood(dateStr, id) {
        if (this.state.logs.nutrition[dateStr]) {
            this.state.logs.nutrition[dateStr] = this.state.logs.nutrition[dateStr].filter(f => f.id !== id);
            this.save();
        }
    }

    logWorkout(dateStr, workout) {
        if (!this.state.logs.workouts[dateStr]) this.state.logs.workouts[dateStr] = [];
        this.state.logs.workouts[dateStr].push({ id: Date.now(), ...workout });
        this.save();
    }

    addWater(amount) {
        const curr = this.state.logs.water[this.runtime.today] || 0;
        this.state.logs.water[this.runtime.today] = curr + amount;
        this.save();
    }

    toggleTheme() {
        this.state.settings.theme = (this.state.settings.theme === 'light') ? 'dark' : 'light';
        this.save();
        return this.state.settings.theme;
    }

    // =========================================================================
    // 5. ANALYTICS & UI COMMUNICATION
    // =========================================================================

    /**
     * Calculates Today's Macro Totals on demand.
     */
    getDailyStats(dateStr) {
        const nLogs = this.state.logs.nutrition[dateStr] || [];
        const wLogs = this.state.logs.workouts[dateStr] || [];
        
        // Sum Macros
        const macros = nLogs.reduce((acc, item) => ({
            cals: acc.cals + (item.cals || 0),
            p: acc.p + (item.p || 0),
            c: acc.c + (item.c || 0),
            f: acc.f + (item.f || 0),
            fiber: acc.fiber + (item.fiber || 0)
        }), { cals:0, p:0, c:0, f:0, fiber:0 });

        // Sum Burn
        const burn = wLogs.reduce((acc, item) => acc + (item.burn || 0), 0);

        return { macros, burn };
    }

    save() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
            this.broadcast('DATA_SAVED');
        } catch (e) {
            console.error("Storage Full");
            alert("Local Storage is full. Please clear some history.");
        }
    }

    /**
     * Dispatches the 'rehma_update' event which ALL other files listen to.
     * This ensures the UI is always perfectly in sync with the data.
     */
    broadcast(reason) {
        const todayStats = this.getDailyStats(this.runtime.today);
        
        const payload = {
            reason: reason,
            theme: this.state.settings.theme,
            profile: this.state.profile,
            today: {
                date: this.runtime.today,
                weight: this.state.logs.weight[this.runtime.today] || this.state.profile.weight,
                water: this.state.logs.water[this.runtime.today] || 0,
                steps: this.state.logs.steps[this.runtime.today] || 0,
                macros: todayStats.macros,
                burn: todayStats.burn
            },
            calculated: {
                tdee: this.runtime.tdee,
                phase: this.getPhaseForDate(this.runtime.today),
                nextPeriod: this.predictNextPeriod()
            },
            library: this.state.library
        };

        window.dispatchEvent(new CustomEvent('rehma_update', { detail: payload }));
    }

    predictNextPeriod() {
        const events = this.state.cycle.events;
        const lastStart = [...events].reverse().find(e => e.type === 'start');
        if (!lastStart) return null;

        const d = new Date(lastStart.date);
        d.setDate(d.getDate() + this.state.cycle.avgLength);
        return d.toDateString();
    }

    setupWaterNotifications() {
        // Simple interval check (every 30 mins)
        setInterval(() => {
            const h = new Date().getHours();
            // Alert at 10, 14, 17, 20
            const targets = [10, 14, 17, 20];
            const lastAlert = sessionStorage.getItem('last_water_alert');
            
            if (targets.includes(h) && lastAlert != h) {
                if (Notification.permission === 'granted') {
                    new Notification("Hydration Check 💧", { body: "Time to drink a glass of water, Rehma!" });
                }
                sessionStorage.setItem('last_water_alert', h);
            }
        }, 1000 * 60 * 30);
    }
}

// Instantiate on Load
document.addEventListener('DOMContentLoaded', () => {
    window.healthOS = new RehmaHealthOS();
});