# Rehma's Fitness Tracker - Project Outline

## File Structure
```
/mnt/okcomputer/output/
├── index.html              # Home dashboard with daily overview
├── calendar.html           # Menstrual cycle tracking and food logging
├── progress.html           # Analytics and cycle reports
├── workouts.html           # Exercise tracking and recommendations
├── main.js                 # Core application logic and calculations
├── resources/              # Local data storage
│   ├── food-presets.json   # Pre-defined food items (biryani, chai, etc.)
│   └── workout-data.json   # Exercise types and calorie calculations
└── README.md              # Setup and usage instructions
```

## Page Breakdown

### 1. index.html - Home Dashboard
**Purpose**: Central hub showing Rehma's daily health status and quick actions

**Sections**:
- **Header**: App title "Rehma's Health Tracker", current date, theme toggle
- **Cycle Status Card**: Current phase, days remaining, phase-specific tips
- **Daily Overview**: Water progress, calorie target, workout summary
- **Quick Actions**: Fast buttons for logging water, food, exercise
- **Smart Notifications**: Water reminders, logging prompts
- **Recent Activity**: Last logged items and achievements

**Interactive Elements**:
- Water glass counter (8 glasses, clickable)
- Quick calorie logger with preset buttons
- Workout starter with activity selection
- Notification dismissal and snooze options

### 2. calendar.html - Cycle & Nutrition Tracking
**Purpose**: Comprehensive menstrual cycle visualization and food logging

**Sections**:
- **Calendar Grid**: Monthly view with color-coded cycle phases
- **Food Logging Panel**: Add custom foods, edit presets
- **Daily Summary**: Calories, protein, water for selected date
- **Cycle Information**: Phase descriptions, symptoms tracker
- **Food Presets**: Quick-add buttons for cultural favorites

**Interactive Elements**:
- Calendar date selection with period tracking toggle
- Food addition modal with custom calorie/protein input
- Water intake tracker with visual progress
- Cycle phase information popup
- Custom food management (add, edit, delete)

**Food Presets**:
- Biryani (450 cal, 15g protein)
- Chai (120 cal, 3g protein)
- Roti (70 cal, 2g protein)
- Daal (180 cal, 12g protein)
- Chicken Karahi (320 cal, 25g protein)

### 3. progress.html - Analytics & Reports
**Purpose**: Advanced health analytics with cycle-aware insights

**Sections**:
- **Weekly Overview**: Calorie balance, weight trends
- **Cycle Reports**: Phase-by-phase analysis and patterns
- **Prediction Engine**: Future cycle predictions with confidence levels
- **Health Metrics**: Metabolism tracking, energy levels, mood patterns
- **Goal Progress**: Long-term trends and achievements

**Interactive Elements**:
- Time range selector (week, month, quarter)
- Chart interactions (hover for details, zoom)
- Weight update modal (monthly input)
- Export data functionality
- Pattern recognition insights

**Analytics Charts**:
- Calorie balance line chart
- Cycle length variation over time
- Weight trend with cycle overlay
- Energy level correlation with phases
- Workout performance by cycle phase

### 4. workouts.html - Exercise Tracking
**Purpose**: Workout logging with cycle-specific recommendations

**Sections**:
- **Activity Selection**: Grid of workout types with icons
- **Workout Logger**: Duration, intensity, calories burned
- **Cycle Recommendations**: Phase-appropriate exercise suggestions
- **Progress Tracking**: Weekly workout summary
- **Achievement Badges**: Milestones and consistency rewards

**Interactive Elements**:
- Workout type selector with visual feedback
- Duration slider with real-time calorie calculation
- Intensity level selector (low, medium, high)
- Quick log buttons for common workouts
- Workout history timeline

**Workout Types**:
- Cardio (running, cycling, swimming)
- Strength training (weights, resistance)
- Yoga and stretching
- HIIT workouts
- Walking and light activity

## Core Features Implementation

### Advanced Calculations Engine (main.js)
**PCOS-Specific BMR Calculation**:
- Mifflin-St Jeor equation with PCOS adjustments
- Age: 18 years (born October 12, 2005)
- Activity level multipliers
- Cycle phase metabolic variations

**Menstrual Cycle Tracking**:
- Phase detection based on cycle length
- Symptom correlation algorithms
- Irregularity pattern recognition
- Prediction confidence scoring

**Adaptive Learning**:
- Pattern recognition in cycle lengths
- Calorie target adjustments based on actual intake
- Workout performance correlation with phases
- Personalized recommendation engine

### Notification System
**Water Reminders**: 3 times daily (morning, afternoon, evening)
**Logging Prompts**: 2 times daily (lunch, dinner)
**Cycle Alerts**: Phase transition notifications
**Achievement Celebrations**: Milestone completions

### Data Management
**Local Storage Structure**:
- User profile (weight, goals, preferences)
- Cycle history and predictions
- Food logs and custom foods
- Workout history and preferences
- Settings and theme preferences

**Self-Learning Algorithms**:
- Cycle length pattern analysis
- Calorie intake vs. weight correlation
- Energy level prediction based on phase
- Workout performance optimization

## Technical Implementation

### Libraries Used
- **ECharts.js**: Advanced data visualization for progress charts
- **Anime.js**: Smooth animations for UI transitions
- **p5.js**: Dynamic background effects and cycle visualization
- **Matter.js**: Physics-based animations for achievement celebrations

### Responsive Design
- Mobile-first approach with touch-optimized interactions
- Flexible grid system for various screen sizes
- Swipe gestures for calendar navigation
- Optimized for portrait orientation

### Performance Optimization
- Lazy loading for charts and heavy components
- Efficient data structures for quick lookups
- Optimized animations for 60fps performance
- Local storage management for offline functionality

## User Experience Flow

### First-Time Setup
1. Welcome screen with app introduction
2. Basic profile setup (weight, goals)
3. Cycle history input (if available)
4. Notification permissions request
5. Quick tour of main features

### Daily Usage Pattern
1. Morning: Check cycle status and daily goals
2. Meals: Log food intake with quick presets
3. Workouts: Exercise tracking with recommendations
4. Evening: Review daily progress and plan tomorrow

### Weekly Review
1. Check progress analytics and trends
2. Update weight (if it's the monthly check-in)
3. Review cycle predictions and adjust plans
4. Celebrate achievements and set new goals

This comprehensive structure ensures Rehma has a sophisticated, intelligent fitness companion that adapts to her unique needs as someone with PCOS while providing the most advanced health tracking capabilities available.