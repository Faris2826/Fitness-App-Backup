# Rehma's Fitness Tracker - Design Style Guide

## Design Philosophy

### Visual Language
**Sophisticated Minimalism**: Clean, editorial-inspired interface that feels like a premium health journal rather than a typical fitness app. The design emphasizes clarity, elegance, and purposeful interaction without visual clutter.

**Empowering Femininity**: Subtle feminine touches through refined typography and gentle curves, while maintaining professional credibility. The design celebrates Rehma's strength and health journey with dignity and grace.

**Intelligent Adaptation**: The interface dynamically responds to Rehma's menstrual cycle phases, creating an intuitive connection between her body's natural rhythms and the digital experience.

## Color Palette

### Light Theme
- **Primary Background**: Soft cream (#FEFDF8) - warm, inviting, never harsh
- **Secondary Background**: Pure white (#FFFFFF) - clean sections and cards
- **Accent Primary**: Sage green (#9CAF88) - growth, health, balance
- **Accent Secondary**: Dusty rose (#D4A5A5) - feminine, gentle, supportive
- **Text Primary**: Charcoal (#2C2C2C) - strong contrast, excellent readability
- **Text Secondary**: Warm gray (#6B6B6B) - supporting information

### Dark Theme
- **Primary Background**: Deep charcoal (#1A1A1A) - sophisticated, never black
- **Secondary Background**: Medium gray (#2D2D2D) - layered depth
- **Accent Primary**: Soft sage (#A8C090) - muted, elegant
- **Accent Secondary**: Muted rose (#C49B9B) - gentle, refined
- **Text Primary**: Warm white (#F5F5F5) - comfortable brightness
- **Text Secondary**: Light gray (#B0B0B0) - subtle hierarchy

### Cycle-Aware Backlighting
- **Menstrual Phase**: Deep burgundy glow (#8B0000) - strength, grounding
- **Follicular Phase**: Soft pink luminescence (#FFB6C1) - renewal, energy
- **Ovulation Phase**: Bright coral radiance (#FF69B4) - peak vitality
- **Luteal Phase**: Warm amber backlight (#FFA500) - comfort, preparation

## Typography

### Primary Font: "Playfair Display" (Serif)
- **Usage**: Headings, important metrics, cycle phase names
- **Characteristics**: Elegant, editorial, sophisticated
- **Weights**: Regular (400), Medium (500), Bold (700)

### Secondary Font: "Inter" (Sans-serif)
- **Usage**: Body text, navigation, data labels, forms
- **Characteristics**: Clean, readable, modern
- **Weights**: Light (300), Regular (400), Medium (500), Semibold (600)

### Typography Hierarchy
- **H1 (Page Titles)**: Playfair Display, 28px, Bold
- **H2 (Section Headers)**: Playfair Display, 24px, Medium
- **H3 (Subsections)**: Inter, 18px, Semibold
- **Body Text**: Inter, 14px, Regular
- **Small Text**: Inter, 12px, Light
- **Data/Numbers**: Inter, 16px, Medium

## Visual Effects & Animation

### Background Effects
**Subtle Gradient Flow**: Gentle aurora-like gradient that shifts based on cycle phase
- Light theme: Soft cream to pale sage
- Dark theme: Deep charcoal to muted sage
- Animated with slow, breathing-like movement

### Interactive Elements
**Micro-animations**: 
- Button hover: Gentle scale (1.02x) with soft shadow
- Card interactions: Subtle lift with shadow expansion
- Form focus: Smooth border color transition
- Loading states: Elegant pulse animations

### Cycle Visualization
**Dynamic Backlighting**: The entire interface receives a subtle colored glow that corresponds to the current menstrual phase, creating an immersive, supportive environment.

### Data Visualization
**Chart Styling**:
- Line charts: Smooth curves with gradient fills
- Progress bars: Rounded corners with subtle gradients
- Calendar cells: Soft rounded rectangles with phase-appropriate colors
- All charts use desaturated colors (S < 50%) for sophistication

## Layout & Structure

### Grid System
- **Mobile-first**: 16px base padding, flexible grid
- **Card-based Layout**: Rounded corners (12px), subtle shadows
- **Generous Whitespace**: Breathing room between elements
- **Consistent Spacing**: 8px base unit (8, 16, 24, 32px)

### Navigation Design
**Bold Tab Bar**: 
- Fixed bottom position for mobile accessibility
- Large, clear icons with text labels
- Active state: Color fill with subtle animation
- Inactive state: Outline style with reduced opacity

### Component Styling
**Buttons**:
- Primary: Rounded (8px), gradient background, white text
- Secondary: Rounded (8px), outline style, colored text
- Icon buttons: Circular, minimal, subtle hover effects

**Forms**:
- Input fields: Rounded (6px), subtle borders, focus animations
- Labels: Positioned above inputs, medium weight
- Validation: Gentle color changes, no harsh reds

**Cards**:
- Background: Slightly elevated from main background
- Border radius: 12px for soft, approachable feel
- Shadow: Subtle, multi-layered for depth

## Mobile Optimization

### Touch Targets
- Minimum 44px tap targets for accessibility
- Generous spacing between interactive elements
- Swipe gestures for calendar navigation
- Pull-to-refresh for data updates

### Responsive Behavior
- Fluid typography scaling
- Flexible grid system
- Optimized for portrait orientation
- One-handed usage considerations

## Accessibility Features

### Color Contrast
- All text meets WCAG AA standards (4.5:1 minimum)
- Interactive elements have clear focus states
- Color is never the only indicator of meaning

### Typography
- Scalable text (supports system font size)
- High contrast mode compatibility
- Clear hierarchy and readable fonts

## Implementation Notes

### CSS Custom Properties
All colors, fonts, and spacing use CSS custom properties for easy theme switching and cycle-aware styling.

### Animation Performance
All animations use transform and opacity properties for GPU acceleration and smooth 60fps performance.

### Theme Switching
Seamless transition between light and dark themes with smooth color interpolation and state persistence.