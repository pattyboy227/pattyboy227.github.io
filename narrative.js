// Narrative Visualization Parameters
const narrativeState = {
    currentScene: 1,
    totalScenes: 3,
    annotations: [],
    chartData: {},
    sceneConfigs: {}
};

// Chart configurations and data
const chartConfigs = {
    scene1: {
        title: "Global Temperature Anomalies (1880-2023)",
        data: generateTemperatureData(),
        colors: ["#ff6b6b"],
        annotations: [
            { x: 0.2, y: 0.3, text: "Industrial Revolution begins", year: 1880 },
            { x: 0.5, y: 0.4, text: "Post-war economic boom", year: 1950 },
            { x: 0.8, y: 0.7, text: "Accelerated warming", year: 2000 }
        ]
    },
    scene2: {
        title: "Global CO2 Emissions by Region (2023)",
        data: [
            { region: "Asia Pacific", emissions: 45, color: "#4ecdc4" },
            { region: "North America", emissions: 25, color: "#45b7d1" },
            { region: "Europe", emissions: 20, color: "#96ceb4" },
            { region: "Other Regions", emissions: 10, color: "#feca57" }
        ],
        colors: ["#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"],
        annotations: [
            { angle: 0.3, text: "Largest emitter", region: "Asia Pacific" },
            { angle: 1.2, text: "Per capita highest", region: "North America" }
        ]
    },
    scene3: {
        title: "Renewable Energy Capacity Growth (2010-2023)",
        data: generateRenewableData(),
        colors: ["#6c5ce7", "#a29bfe", "#fd79a8"],
        annotations: [
            { x: 0.3, y: 0.4, text: "Solar boom begins", year: 2015 },
            { x: 0.7, y: 0.6, text: "Exponential growth", year: 2020 }
        ]
    }
};

// Generate realistic temperature data
function generateTemperatureData() {
    const data = [];
    let baseTemp = -0.3;
    
    for (let year = 1880; year <= 2023; year++) {
        // Add some realistic variation
        const variation = Math.sin(year * 0.1) * 0.1;
        const trend = (year - 1880) * 0.008; // Warming trend
        const anomaly = baseTemp + trend + variation;
        
        data.push({
            year: year,
            anomaly: parseFloat(anomaly.toFixed(2))
        });
    }
    
    return data;
}

// Generate renewable energy data
function generateRenewableData() {
    const data = [];
    const years = [2010, 2012, 2014, 2016, 2018, 2020, 2023];
    
    years.forEach(year => {
        data.push({
            year: year,
            solar: Math.pow(year - 2000, 2) * 0.1,
            wind: Math.pow(year - 2000, 1.8) * 0.08,
            hydro: Math.pow(year - 2000, 1.2) * 0.05
        });
    });
    
    return data;
}

// Scene Management Functions
function showScene(sceneNumber) {
    // Hide all scenes
    document.querySelectorAll('.scene-container').forEach(scene => {
        scene.classList.remove('active');
    });
    
    // Show current scene
    const currentScene = document.getElementById(`scene${sceneNumber}`);
    if (currentScene) {
        currentScene.classList.add('active');
    }
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Update progress bar
    updateProgressBar();
    
    // Render the chart for current scene
    renderScene(sceneNumber);
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = narrativeState.currentScene === 1;
    nextBtn.disabled = narrativeState.currentScene === narrativeState.totalScenes;
}

function updateProgressBar() {
    const progress = (narrativeState.currentScene / narrativeState.totalScenes) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

// Navigation Triggers
function nextScene() {
    if (narrativeState.currentScene < narrativeState.totalScenes) {
        narrativeState.currentScene++;
        showScene(narrativeState.currentScene);
    }
}

function previousScene() {
    if (narrativeState.currentScene > 1) {
        narrativeState.currentScene--;
        showScene(narrativeState.currentScene);
    }
}

// Chart Rendering Functions
function renderScene(sceneNumber) {
    const config = chartConfigs[`scene${sceneNumber}`];
    if (!config) return;
    
    const container = document.getElementById(`chart${sceneNumber}`);
    container.innerHTML = ''; // Clear previous content
    
    switch(sceneNumber) {
        case 1:
            renderTemperatureChart(container, config);
            break;
        case 2:
            renderEmissionsChart(container, config);
            break;
        case 3:
            renderRenewableChart(container, config);
            break;
    }
}

function renderTemperatureChart(container, config) {
    const margin = { top: 40, right: 60, bottom: 60, left: 60 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = container.clientHeight - margin.top - margin.bottom;
    
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const x = d3.scaleLinear()
        .domain(d3.extent(config.data, d => d.year))
        .range([0, width]);
    
    const y = d3.scaleLinear()
        .domain([-0.5, 1.2])
        .range([height, 0]);
    
    // Add axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format('d')));
    
    svg.append('g')
        .call(d3.axisLeft(y).tickFormat(d => `${d}°C`));
    
    // Add grid lines
    svg.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSize(-height).tickFormat(''));
    
    // Add the line
    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.anomaly));
    
    svg.append('path')
        .datum(config.data)
        .attr('fill', 'none')
        .attr('stroke', config.colors[0])
        .attr('stroke-width', 3)
        .attr('d', line);
    
    // Add data points
    svg.selectAll('.data-point')
        .data(config.data)
        .enter()
        .append('circle')
        .attr('class', 'data-point')
        .attr('cx', d => x(d.year))
        .attr('cy', d => y(d.anomaly))
        .attr('r', 3)
        .attr('fill', config.colors[0])
        .on('mouseover', function(event, d) {
            showTooltip(event, `Year: ${d.year}<br>Anomaly: ${d.anomaly}°C`);
        })
        .on('mouseout', hideTooltip);
    
    // Add annotations
    config.annotations.forEach(annotation => {
        const yearData = config.data.find(d => d.year === annotation.year);
        if (yearData) {
            addAnnotation(svg, x(annotation.year), y(yearData.anomaly), annotation.text);
        }
    });
    
    // Add labels
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text(config.title);
}

function renderEmissionsChart(container, config) {
    const margin = { top: 40, right: 60, bottom: 60, left: 60 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = container.clientHeight - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;
    
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${width/2 + margin.left},${height/2 + margin.top})`);
    
    const pie = d3.pie()
        .value(d => d.emissions)
        .sort(null);
    
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);
    
    const arcs = svg.selectAll('.arc')
        .data(pie(config.data))
        .enter()
        .append('g')
        .attr('class', 'arc');
    
    arcs.append('path')
        .attr('d', arc)
        .attr('fill', d => d.data.color)
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .on('mouseover', function(event, d) {
            showTooltip(event, `${d.data.region}<br>${d.data.emissions}% of global emissions`);
        })
        .on('mouseout', hideTooltip);
    
    // Add labels
    arcs.append('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .style('fill', 'white')
        .text(d => `${d.data.emissions}%`);
    
    // Add annotations
    config.annotations.forEach(annotation => {
        const dataItem = config.data.find(d => d.region === annotation.region);
        if (dataItem) {
            const angle = pie(dataItem)[0].startAngle + (pie(dataItem)[0].endAngle - pie(dataItem)[0].startAngle) / 2;
            const x = Math.cos(angle) * (radius + 30);
            const y = Math.sin(angle) * (radius + 30);
            addAnnotation(svg, x, y, annotation.text);
        }
    });
    
    // Add title
    svg.append('text')
        .attr('x', 0)
        .attr('y', -height/2 - 20)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text(config.title);
}

function renderRenewableChart(container, config) {
    const margin = { top: 40, right: 60, bottom: 60, left: 60 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = container.clientHeight - margin.top - margin.bottom;
    
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const x = d3.scaleLinear()
        .domain(d3.extent(config.data, d => d.year))
        .range([0, width]);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(config.data, d => Math.max(d.solar, d.wind, d.hydro))])
        .range([height, 0]);
    
    // Add axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format('d')));
    
    svg.append('g')
        .call(d3.axisLeft(y).tickFormat(d => `${d} GW`));
    
    // Add grid lines
    svg.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSize(-height).tickFormat(''));
    
    // Create line generators
    const solarLine = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.solar));
    
    const windLine = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.wind));
    
    const hydroLine = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.hydro));
    
    // Add lines
    svg.append('path')
        .datum(config.data)
        .attr('fill', 'none')
        .attr('stroke', config.colors[0])
        .attr('stroke-width', 3)
        .attr('d', solarLine);
    
    svg.append('path')
        .datum(config.data)
        .attr('fill', 'none')
        .attr('stroke', config.colors[1])
        .attr('stroke-width', 3)
        .attr('d', windLine);
    
    svg.append('path')
        .datum(config.data)
        .attr('fill', 'none')
        .attr('stroke', config.colors[2])
        .attr('stroke-width', 3)
        .attr('d', hydroLine);
    
    // Add data points
    config.data.forEach(d => {
        svg.append('circle')
            .attr('cx', x(d.year))
            .attr('cy', y(d.solar))
            .attr('r', 4)
            .attr('fill', config.colors[0])
            .on('mouseover', function(event) {
                showTooltip(event, `Year: ${d.year}<br>Solar: ${d.solar.toFixed(1)} GW`);
            })
            .on('mouseout', hideTooltip);
        
        svg.append('circle')
            .attr('cx', x(d.year))
            .attr('cy', y(d.wind))
            .attr('r', 4)
            .attr('fill', config.colors[1])
            .on('mouseover', function(event) {
                showTooltip(event, `Year: ${d.year}<br>Wind: ${d.wind.toFixed(1)} GW`);
            })
            .on('mouseout', hideTooltip);
        
        svg.append('circle')
            .attr('cx', x(d.year))
            .attr('cy', y(d.hydro))
            .attr('r', 4)
            .attr('fill', config.colors[2])
            .on('mouseover', function(event) {
                showTooltip(event, `Year: ${d.year}<br>Hydro: ${d.hydro.toFixed(1)} GW`);
            })
            .on('mouseout', hideTooltip);
    });
    
    // Add annotations
    config.annotations.forEach(annotation => {
        const yearData = config.data.find(d => d.year === annotation.year);
        if (yearData) {
            addAnnotation(svg, x(annotation.year), y(yearData.solar), annotation.text);
        }
    });
    
    // Add title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text(config.title);
}

// Annotation and Tooltip Functions
function addAnnotation(svg, x, y, text) {
    const annotation = svg.append('g')
        .attr('class', 'annotation');
    
    annotation.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 6)
        .attr('fill', '#667eea')
        .attr('stroke', 'white')
        .attr('stroke-width', 2);
    
    annotation.append('text')
        .attr('x', x + 15)
        .attr('y', y - 15)
        .attr('text-anchor', 'start')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .style('fill', '#667eea')
        .text(text);
}

function showTooltip(event, content) {
    const tooltip = document.getElementById('tooltip');
    tooltip.innerHTML = content;
    tooltip.style.left = event.pageX + 10 + 'px';
    tooltip.style.top = event.pageY - 10 + 'px';
    tooltip.style.opacity = 1;
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.opacity = 0;
}

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        nextScene();
    } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        previousScene();
    }
});

// Initialize the narrative visualization
document.addEventListener('DOMContentLoaded', function() {
    showScene(1);
}); 