# Global Renewable Energy Adoption: A Narrative Visualization

## Overview

This project presents an interactive narrative visualization about global renewable energy adoption, implemented using D3.js. The visualization follows an interactive slideshow structure, allowing users to explore different aspects of renewable energy data while maintaining a coherent narrative flow.

## Features

### Narrative Structure
- **Interactive Slideshow**: Users can navigate through 4 distinct scenes using navigation buttons
- **Progressive Storytelling**: Each scene builds upon the previous one to tell a complete story
- **User Exploration**: Interactive elements allow users to explore data details while maintaining narrative flow

### Scenes

1. **Global Overview**: Stacked bar chart showing renewable energy capacity by region
2. **Growth Trends**: Line chart displaying exponential growth in solar and wind energy
3. **Regional Comparison**: Energy mix comparison across different global regions
4. **Future Projections**: Multi-scenario projections for renewable energy development

### Interactive Elements

- **Hover Tooltips**: Detailed information appears on hover for all data points
- **Click Interactions**: Enhanced visual feedback on click events
- **Keyboard Navigation**: Arrow keys and spacebar for navigation
- **Responsive Design**: Adapts to different screen sizes

### Technical Implementation

- **D3.js v7**: Core visualization library
- **d3-annotation**: For adding contextual annotations
- **Vanilla JavaScript**: No additional frameworks
- **CSS3**: Modern styling with gradients and animations

## Usage

1. Open `index.html` in a web browser
2. Use the navigation buttons or keyboard arrows to move between scenes
3. Hover over data points to see detailed information
4. Explore the narrative at your own pace

## Data Sources

The visualization uses sample data representing:
- Global renewable energy capacity by region
- Growth trends from 2015-2023
- Regional energy mix percentages
- Future projections through 2030

## Narrative Visualization Elements

### Messaging
The narrative communicates the global transition toward renewable energy, highlighting:
- Current state of renewable energy adoption
- Growth patterns and trends
- Regional differences in energy mix
- Future opportunities and projections

### Visual Structure
Each scene uses consistent visual templates:
- Clear titles and descriptions
- Color-coded legends
- Interactive elements with consistent styling
- Annotations highlighting key insights

### Parameters
- `currentScene`: Tracks the active scene (1-4)
- `chartData`: Stores visualization data
- `userInteractions`: Controls interaction states
- `annotations`: Manages contextual annotations

### Triggers
- Navigation buttons trigger scene changes
- Mouse events trigger tooltips and visual feedback
- Keyboard events enable alternative navigation
- Hover events provide detailed information

## Technical Requirements

- Modern web browser with JavaScript enabled
- No additional dependencies beyond D3.js and d3-annotation
- Responsive design works on desktop and mobile devices

## Project Structure

```
pattyboy227.github.io/
├── index.html          # Main HTML file
├── script.js           # D3.js visualization logic
└── README.md          # Project documentation
```

## Deployment

This project is designed to be deployed on GitHub Pages. Simply push the files to a GitHub repository and enable GitHub Pages in the repository settings.

## Narrative Visualization Essay

### Messaging
The narrative visualization communicates the global transition toward renewable energy adoption. The message emphasizes both the current state of renewable energy deployment and the promising future trajectory, highlighting regional differences and growth patterns that demonstrate the accelerating pace of clean energy adoption worldwide.

### Narrative Structure
This visualization follows the **interactive slideshow** structure. Users can explore data within each scene through hover interactions and tooltips, while the overall narrative flow is controlled through scene progression. This structure allows for user exploration at each step while maintaining the intended storytelling sequence.

### Visual Structure
Each scene uses a consistent visual template with:
- Clear scene titles and descriptions
- Interactive charts with consistent color schemes
- Hover tooltips for detailed information
- Annotations highlighting key insights
- Navigation elements for scene transitions

The visual structure ensures viewers can understand the data context, navigate between scenes, and focus on important trends highlighted through annotations and interactive elements.

### Scenes
1. **Global Overview**: Establishes the current state of renewable energy capacity worldwide
2. **Growth Trends**: Shows the exponential growth patterns over time
3. **Regional Comparison**: Highlights differences in energy mix adoption across regions
4. **Future Projections**: Presents optimistic, moderate, and conservative scenarios

The scenes are ordered to build understanding progressively, from current state to future possibilities.

### Annotations
Annotations follow a consistent template using:
- Positioned text with connecting lines
- Consistent styling and color scheme
- Strategic placement to highlight key insights
- Contextual information that supports the narrative

Annotations change within scenes to highlight different aspects of the data and guide viewer attention to important trends and patterns.

### Parameters
Key parameters include:
- `currentScene`: Controls which scene is displayed
- `chartData`: Stores the visualization datasets
- `userInteractions`: Manages hover and click states
- `annotations`: Controls annotation positioning and content

These parameters define the state of the narrative visualization and control scene construction.

### Triggers
Triggers connect user actions to state changes:
- Navigation buttons trigger scene transitions
- Mouse hover events trigger tooltip displays
- Keyboard events enable alternative navigation
- Click events provide enhanced visual feedback

Affordances include:
- Clear navigation buttons with disabled states
- Hover effects indicating interactive elements
- Keyboard navigation support
- Visual feedback for all interactive elements 