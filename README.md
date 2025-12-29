# Rehma's Health Tracker

A sophisticated, PCOS-specific fitness tracking web application designed specifically for Rehma's health journey.

## Features

### 🌸 PCOS-Specific Health Tracking
- **Advanced BMR Calculations**: Mifflin-St Jeor equation with 15% PCOS metabolic reduction
- **Cycle-Aware Calorie Targets**: Dynamic calorie recommendations based on menstrual phase
- **Insulin Resistance Considerations**: Adjusted metabolic parameters for PCOS management

### 📅 Comprehensive Menstrual Cycle Tracking
- **Visual Cycle Calendar**: Color-coded phases (Menstrual, Follicular, Ovulation, Luteal)
- **Period Logging**: Simple click-to-track period start/end dates
- **Phase-Specific Recommendations**: Exercise and nutrition guidance for each cycle phase
- **Predictive Analytics**: Self-learning algorithm for cycle prediction with confidence levels

### 🍽️ Smart Nutrition Tracking
- **Cultural Food Presets**: Pre-loaded Pakistani favorites (Biryani, Chai, Roti, Daal)
- **Custom Food Addition**: Add your own foods with editable calories and protein
- **Water Intake Tracking**: Visual glass counter with PCOS-specific hydration targets
- **Phase-Based Nutrition**: Tailored food recommendations for each cycle phase

### 💪 Intelligent Workout System
- **Cycle-Specific Exercise**: Workout recommendations based on current menstrual phase
- **Activity Tracking**: Comprehensive logging for cardio, strength, yoga, HIIT, and more
- **Calorie Calculation**: PCOS-adjusted calorie burn calculations with efficiency factors
- **Real-time Workout Timer**: Live workout tracking with duration and calorie estimation

### 📊 Advanced Analytics & Progress
- **Interactive Charts**: ECharts-powered visualizations for weight, calories, and cycles
- **Pattern Recognition**: Self-learning algorithms identify trends in your data
- **Goal Tracking**: Visual progress indicators for weight, workouts, and water intake
- **Predictive Insights**: Future weight and cycle predictions based on current trends

### 🔔 Smart Notifications
- **Water Reminders**: 3 times daily notifications for hydration
- **Logging Prompts**: Twice daily reminders for food and workout logging
- **Cycle Alerts**: Notifications for phase transitions and period predictions
- **Achievement Celebrations**: Milestone completions and goal achievements

### 🎨 Sophisticated Design
- **Cycle-Aware Backlighting**: Dynamic background glow that changes with menstrual phase
- **Light/Dark Themes**: Seamless theme switching with persistent preferences
- **Mobile-First Design**: Optimized for mobile with touch-friendly interactions
- **Premium Aesthetics**: Editorial-inspired design with elegant typography and colors

## Technical Implementation

### Core Technologies
- **HTML5/CSS3**: Modern web standards with CSS Grid and Flexbox
- **Vanilla JavaScript**: No framework dependencies for optimal performance
- **ECharts.js**: Advanced data visualization for progress charts
- **Anime.js**: Smooth animations and micro-interactions
- **Local Storage**: Client-side data persistence for offline functionality

### Advanced Calculations
```javascript
// PCOS-specific BMR calculation
const bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
const pcosAdjustedBMR = bmr * 0.85; // 15% reduction for PCOS

// Cycle phase calorie adjustment
const phaseCalories = baseTDEE * phaseModifier * pcosAdjustment;
const deficitCalories = phaseCalories * 0.85; // 15% deficit
```

### Self-Learning Algorithms
- **Cycle Pattern Analysis**: Weighted moving average with emphasis on recent cycles
- **Food Pattern Recognition**: Identifies most common foods and meal timing patterns
- **Workout Performance Correlation**: Links exercise performance to cycle phases
- **Adaptive Calorie Targets**: Adjusts recommendations based on actual consumption patterns

## File Structure

```
/
├── index.html              # Main dashboard with daily overview
├── calendar.html           # Menstrual cycle tracking and food logging
├── progress.html           # Advanced analytics and reports
├── workouts.html           # Exercise tracking and recommendations
├── main.js                 # Core application logic and calculations
├── resources/
│   ├── food-presets.json   # Pre-defined cultural food items
│   └── workout-data.json   # Exercise types and calorie calculations
├── interaction.md          # Interaction design documentation
├── design.md              # Design style guide and specifications
├── outline.md             # Project structure and implementation plan
└── README.md              # This file
```

## Getting Started

### Local Development
1. Clone or download the project files
2. Start a local server:
   ```bash
   python -m http.server 8000
   ```
3. Open `http://localhost:8000` in your browser
4. Navigate using the bottom tab bar

### First-Time Setup
1. The app will automatically detect it's your first visit
2. Basic profile information is pre-configured for Rehma
3. Start by exploring the dashboard and logging your first meal or workout
4. The app will learn from your patterns and provide personalized recommendations

## Usage Guide

### Dashboard (index.html)
- **Daily Overview**: Current cycle phase, calorie target, water progress
- **Quick Actions**: Fast buttons for logging water, food, and workouts
- **Smart Notifications**: Water reminders and logging prompts
- **Today's Summary**: Real-time tracking of calories, workouts, and hydration

### Calendar (calendar.html)
- **Cycle Visualization**: Color-coded calendar showing menstrual phases
- **Period Tracking**: Click any date to log period start/end
- **Food Logging**: Add custom foods or use preset cultural favorites
- **Daily Details**: View logged foods and cycle information for any date

### Progress (progress.html)
- **Weight Tracking**: Interactive charts showing weight trends over time
- **Calorie Balance**: Visual comparison of consumed vs. burned calories
- **Cycle Reports**: Detailed analysis of each menstrual phase
- **Goal Progress**: Visual indicators for weight, workout, and water goals
- **Predictions**: AI-powered forecasts for cycles and weight loss

### Workouts (workouts.html)
- **Exercise Selection**: Grid of workout types with cycle-specific recommendations
- **Workout Logger**: Comprehensive form for tracking exercise details
- **Real-time Timer**: Live workout tracking with calorie estimation
- **History**: Recent workouts with calories burned and duration
- **Recommendations**: Phase-appropriate exercise suggestions

## PCOS-Specific Features

### Metabolic Adjustments
- **15% BMR Reduction**: Accounts for PCOS-related metabolic slowdown
- **Insulin Resistance**: Adjusted calorie partitioning and nutrient timing
- **Hormone Balance**: Phase-specific nutrition and exercise recommendations

### Cycle Irregularity Support
- **Flexible Cycle Lengths**: Accommodates 21-35 day cycles common in PCOS
- **Pattern Learning**: Algorithm learns from your unique cycle patterns
- **Confidence Scoring**: Indicates reliability of cycle predictions
- **Symptom Tracking**: Log and correlate symptoms with cycle phases

### Cultural Food Integration
- **Pakistani Cuisine**: Pre-loaded favorites like Biryani, Chai, Roti, Daal
- **Customizable Nutrition**: Edit calories and protein for any food item
- **Traditional Meal Patterns**: Accommodates cultural eating patterns and timing

## Data Privacy & Security

- **Local Storage Only**: All data stored locally in your browser
- **No External Servers**: No data transmitted to external services
- **Offline Functionality**: Works without internet connection
- **Export Capability**: Option to export your data for backup

## Browser Compatibility

- **Chrome**: 80+ (Recommended)
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+

## Future Enhancements

- **Wearable Integration**: Sync with fitness trackers and smartwatches
- **Meal Planning**: AI-generated meal plans based on cycle phase
- **Community Features**: Connect with other PCOS warriors
- **Healthcare Integration**: Share data with healthcare providers
- **Advanced Analytics**: Deeper insights into hormone patterns

## Support & Feedback

This application was created specifically for Rehma's health journey, incorporating the most advanced PCOS-specific fitness tracking available. The self-learning algorithms will adapt to your unique patterns over time, providing increasingly personalized recommendations.

For the best experience:
- Log consistently for the first 2-3 cycles to establish baseline patterns
- Be honest with food logging for accurate calorie calculations
- Update weight monthly for precise BMR calculations
- Pay attention to cycle phase recommendations for optimal results

---

**Built with ❤️ for Rehma's health journey**
*Empowering women with PCOS through intelligent, adaptive health tracking*