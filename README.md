# Global Renewable Energy Revolution: Narrative Visualization

## Overview
This project presents an interactive narrative visualization exploring global renewable energy adoption using D3.js. The visualization follows a **martini glass structure**, guiding users through a carefully crafted story about clean energy transformation before allowing exploration.

## Project Structure
- **index.html**: Main HTML file with responsive design and modern UI
- **narrative.js**: Core JavaScript implementation with D3.js visualizations
- **README.md**: Project documentation

## Narrative Structure: Martini Glass
The visualization follows a **martini glass structure** where:
1. **Directed Story**: Users are guided through three sequential scenes
2. **Controlled Exploration**: Each scene highlights specific aspects of the data
3. **Final Freedom**: After the narrative, users can explore the data freely

## Three Scenes

### Scene 1: The Global Picture
- **Chart Type**: Bar chart showing total renewable capacity by country
- **Message**: Introduction to global renewable energy leaders
- **Annotations**: Highlight China and United States as top performers

### Scene 2: Solar vs Wind Energy  
- **Chart Type**: Scatter plot comparing solar vs wind capacity
- **Message**: Different countries prioritize different renewable technologies
- **Annotations**: Show China's dominance and Germany's solar focus

### Scene 3: Energy Mix Diversity
- **Chart Type**: Stacked bar chart showing energy source breakdown
- **Message**: Countries balance multiple renewable technologies
- **Annotations**: Emphasize Brazil's diversity and hydro power importance

## Technical Implementation

### Parameters (State Variables)
- `currentScene`: Controls which scene is displayed (0-2)
- `highlightedCountry`: Tracks user-selected country for exploration
- `selectedYear`: Data year (2020)
- `showAnnotations`: Controls annotation visibility
- `animationSpeed`: Controls transition timing

### Triggers (User Interactions)
- **Navigation Buttons**: Previous/Next scene progression
- **Keyboard Controls**: Arrow keys and spacebar for navigation
- **Mouse Interactions**: Hover tooltips for detailed information
- **Progress Bar**: Visual indication of narrative progress

### Annotations
- **Template**: Consistent styling with colored borders and positioning
- **Purpose**: Highlight key insights and guide user attention
- **Timing**: Appear after chart animations complete

### Visual Structure
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Gradient backgrounds, smooth animations, hover effects
- **Accessibility**: Keyboard navigation and clear visual hierarchy
- **Color Coding**: Consistent color scheme for different energy types

## Data Sources
The visualization uses sample renewable energy capacity data (2020) including:
- Solar power capacity (GW)
- Wind power capacity (GW) 
- Hydroelectric capacity (GW)
- Biomass capacity (GW)

## Deployment
This project is designed for GitHub Pages deployment:
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Access via `https://[username].github.io/[repository-name]`

## Dependencies
- **D3.js v7**: Core visualization library
- **d3-annotation**: Annotation functionality
- **No other external libraries** (as per assignment requirements)

## Browser Compatibility
- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge recommended
- Mobile-responsive design

## Future Enhancements
- Real-time data integration
- Additional renewable energy sources
- Time-series analysis
- Geographic mapping integration

---

*This narrative visualization demonstrates effective storytelling through data, guiding users through a compelling story about global renewable energy adoption while maintaining the flexibility for exploration and discovery.* 