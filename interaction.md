# Rehma's Fitness Tracker - Interaction Design

## Core Interactive Components

### 1. Menstrual Cycle Calendar
**Main Interface**: Monthly calendar view with color-coded cycle phases
- **Cycle Phase Visualization**: Each day displays background color based on menstrual phase
  - Menstrual Phase: Deep red (#8B0000)
  - Follicular Phase: Light pink (#FFB6C1) 
  - Ovulation Phase: Bright coral (#FF69B4)
  - Luteal Phase: Warm orange (#FFA500)
- **Period Logging**: Click any date to log period start/end with simple toggle
- **Custom Food Addition**: Plus button on each date to add custom foods with calorie/protein editing
- **Food Presets**: Quick-add buttons for biryani (450 cal), chai (120 cal), roti (70 cal), daal (180 cal)
- **Water Tracking**: Glass icons (8 total) that fill up when clicked to track daily water intake

### 2. Daily Dashboard (Home)
**Real-time Health Overview**:
- **Current Cycle Stage**: Prominent display with phase name and days remaining
- **Daily Calorie Target**: Dynamic calculation based on current cycle phase
- **Water Progress**: Visual progress bar showing glasses consumed vs target
- **Quick Actions**: Fast buttons for logging water, food, workouts
- **Smart Notifications**: In-app notifications for water reminders and logging prompts

### 3. Progress Analytics
**Comprehensive Health Reports**:
- **Weekly Calorie Balance**: Visual chart showing deficit/surplus trends
- **Cycle Phase Reports**: Detailed analysis of each phase's impact on metabolism
- **Weight Tracking**: Monthly weight input with trend analysis
- **Prediction Engine**: Self-learning algorithm showing cycle predictions and health trends
- **Pattern Recognition**: Identifies patterns in energy levels, cravings, and performance

### 4. Workout Tracker
**Exercise Logging Interface**:
- **Activity Selection**: Grid of workout types (cardio, strength, yoga, HIIT)
- **Duration Input**: Time slider for workout length
- **Intensity Level**: Low/medium/high selector affecting calorie calculations
- **Cycle-Specific Recommendations**: Suggested workouts based on current cycle phase
- **Progress Tracking**: Weekly workout summary with calorie burn totals

## Multi-Turn Interaction Flows

### Food Logging Flow
1. Click date on calendar → Food logging modal opens
2. Select preset food or "Add Custom" → Custom food form appears
3. Enter food name, calories, protein → Save and add to daily log
4. View updated daily totals → Option to add more foods or close

### Cycle Tracking Flow
1. Click calendar date → Period tracking toggle appears
2. Toggle period start/end → Calendar updates with phase colors
3. System calculates current phase → Dashboard updates with phase info
4. Calorie targets adjust automatically → Notifications update timing

### Workout Logging Flow
1. Navigate to workouts → Activity selection grid displays
2. Choose workout type → Duration and intensity inputs appear
3. Enter workout details → Calorie calculation updates
4. Save workout → Progress charts update automatically

## Adaptive Learning Features

### Cycle Prediction Algorithm
- Tracks cycle length variations over time
- Learns from user input patterns
- Adjusts predictions based on PCOS irregularities
- Shows confidence levels for predictions

### Calorie Calculation Adaptation
- Adjusts BMR based on weight changes
- Modifies targets for each cycle phase
- Accounts for PCOS-related metabolic differences
- Learns from user's actual consumption patterns

### Notification Intelligence
- Learns optimal reminder times based on user behavior
- Adjusts frequency based on compliance rates
- Provides contextual reminders (e.g., pre-workout nutrition)

## Data Persistence
- All interactions save to localStorage
- Weight updates trigger recalculation of all metrics
- Custom foods persist across sessions
- Cycle history maintains for pattern analysis
- Workout logs accumulate for trend identification

## Mobile Optimization
- Touch-friendly interface with large tap targets
- Swipe gestures for calendar navigation
- Pull-to-refresh for data updates
- Haptic feedback for important actions
- Optimized for one-handed use