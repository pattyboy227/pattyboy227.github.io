// Narrative Visualization Parameters
const narrativeState = {
    currentScene: 0,
    totalScenes: 3,
    highlightedCountry: null,
    selectedYear: 2020,
    showAnnotations: true,
    animationSpeed: 1000
};

// Sample renewable energy data (in GW capacity)
const renewableData = [
    { country: "China", solar: 253, wind: 281, hydro: 356, biomass: 15, year: 2020 },
    { country: "United States", solar: 75, wind: 122, hydro: 102, biomass: 12, year: 2020 },
    { country: "Germany", solar: 54, wind: 62, hydro: 20, biomass: 8, year: 2020 },
    { country: "India", solar: 39, wind: 38, hydro: 50, biomass: 10, year: 2020 },
    { country: "Japan", solar: 67, wind: 4, hydro: 50, biomass: 3, year: 2020 },
    { country: "Spain", solar: 15, wind: 27, hydro: 20, biomass: 1, year: 2020 },
    { country: "Italy", solar: 21, wind: 11, hydro: 20, biomass: 3, year: 2020 },
    { country: "United Kingdom", solar: 13, wind: 24, hydro: 4, biomass: 3, year: 2020 },
    { country: "France", solar: 11, wind: 17, hydro: 63, biomass: 2, year: 2020 },
    { country: "Brazil", solar: 7, wind: 19, hydro: 109, biomass: 15, year: 2020 }
];

// Scene configurations
const scenes = [
    {
        title: "Scene 1: The Global Picture",
        description: "Discover the worldwide landscape of renewable energy adoption. This overview shows total renewable capacity by country, revealing the global leaders in clean energy transition.",
        chartType: "bar",
        highlightType: "total",
        annotations: [
            {
                x: 400,
                y: 100,
                text: "China leads with 905 GW total renewable capacity",
                color: "#4CAF50"
            },
            {
                x: 400,
                y: 200,
                text: "United States follows with 221 GW capacity",
                color: "#2196F3"
            }
        ]
    },
    {
        title: "Scene 2: Solar vs Wind Energy",
        description: "Compare the two dominant renewable energy sources: solar and wind power. See how different countries prioritize these technologies based on their geographical advantages.",
        chartType: "scatter",
        highlightType: "comparison",
        annotations: [
            {
                x: 300,
                y: 150,
                text: "China dominates both solar and wind capacity",
                color: "#FF9800"
            },
            {
                x: 200,
                y: 250,
                text: "Germany shows strong solar adoption",
                color: "#9C27B0"
            }
        ]
    },
    {
        title: "Scene 3: Energy Mix Diversity",
        description: "Explore the diversity of renewable energy sources. This final scene reveals how countries balance different renewable technologies to create resilient energy systems.",
        chartType: "stacked",
        highlightType: "diversity",
        annotations: [
            {
                x: 350,
                y: 120,
                text: "Brazil shows excellent energy diversity",
                color: "#4CAF50"
            },
            {
                x: 350,
                y: 220,
                text: "Hydro power remains crucial for many nations",
                color: "#2196F3"
            }
        ]
    }
];

// Chart dimensions and margins
const margin = { top: 40, right: 100, bottom: 60, left: 80 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Color scales
const colorScale = d3.scaleOrdinal()
    .domain(['solar', 'wind', 'hydro', 'biomass'])
    .range(['#FF9800', '#2196F3', '#4CAF50', '#9C27B0']);

// Initialize the visualization
function initVisualization() {
    updateProgress();
    updateNavigation();
    renderScene();
}

// Update progress bar
function updateProgress() {
    const progress = (narrativeState.currentScene / (narrativeState.totalScenes - 1)) * 100;
    d3.select('#progressFill').style('width', progress + '%');
}

// Update navigation buttons
function updateNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = narrativeState.currentScene === 0;
    nextBtn.disabled = narrativeState.currentScene === narrativeState.totalScenes - 1;
}

// Navigation triggers
function nextScene() {
    if (narrativeState.currentScene < narrativeState.totalScenes - 1) {
        narrativeState.currentScene++;
        updateProgress();
        updateNavigation();
        renderScene();
    }
}

function previousScene() {
    if (narrativeState.currentScene > 0) {
        narrativeState.currentScene--;
        updateProgress();
        updateNavigation();
        renderScene();
    }
}

// Render the current scene
function renderScene() {
    const scene = scenes[narrativeState.currentScene];
    
    // Update scene information
    document.getElementById('sceneTitle').textContent = scene.title;
    document.getElementById('sceneDescription').textContent = scene.description;
    
    // Clear previous chart
    d3.select('#chartContainer').html('');
    
    // Create SVG container
    const svg = d3.select('#chartContainer')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Render based on scene type
    switch (scene.chartType) {
        case 'bar':
            renderBarChart(svg, scene);
            break;
        case 'scatter':
            renderScatterChart(svg, scene);
            break;
        case 'stacked':
            renderStackedChart(svg, scene);
            break;
    }
    
    // Add annotations after a delay
    setTimeout(() => {
        addAnnotations(scene.annotations);
    }, 1000);
}

// Render bar chart for Scene 1
function renderBarChart(svg, scene) {
    // Calculate total renewable capacity
    const data = renewableData.map(d => ({
        country: d.country,
        total: d.solar + d.wind + d.hydro + d.biomass
    })).sort((a, b) => b.total - a.total);
    
    // Scales
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.country))
        .range([0, width])
        .padding(0.1);
    
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.total)])
        .range([height, 0]);
    
    // Add grid
    svg.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(''));
    
    // Add bars
    svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.country))
        .attr('y', height)
        .attr('width', xScale.bandwidth())
        .attr('height', 0)
        .attr('fill', (d, i) => i === 0 ? '#4CAF50' : i === 1 ? '#2196F3' : '#9C27B0')
        .attr('opacity', 0.8)
        .on('mouseover', function(event, d) {
            d3.select(this).attr('opacity', 1);
            showTooltip(event, `${d.country}: ${d.total} GW`);
        })
        .on('mouseout', function() {
            d3.select(this).attr('opacity', 0.8);
            hideTooltip();
        })
        .transition()
        .duration(narrativeState.animationSpeed)
        .attr('y', d => yScale(d.total))
        .attr('height', d => height - yScale(d.total));
    
    // Add axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');
    
    svg.append('g')
        .call(d3.axisLeft(yScale));
    
    // Add labels
    svg.append('text')
        .attr('class', 'axis-label')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .style('text-anchor', 'middle')
        .text('Countries');
    
    svg.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -40)
        .style('text-anchor', 'middle')
        .text('Total Renewable Capacity (GW)');
}

// Render scatter chart for Scene 2
function renderScatterChart(svg, scene) {
    // Scales
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(renewableData, d => d.solar)])
        .range([0, width]);
    
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(renewableData, d => d.wind)])
        .range([height, 0]);
    
    // Add grid
    svg.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(''));
    
    svg.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(''));
    
    // Add circles
    svg.selectAll('.point')
        .data(renewableData)
        .enter()
        .append('circle')
        .attr('class', 'point')
        .attr('cx', d => xScale(d.solar))
        .attr('cy', height)
        .attr('r', 0)
        .attr('fill', d => d.country === 'China' ? '#FF9800' : '#9C27B0')
        .attr('opacity', 0.7)
        .on('mouseover', function(event, d) {
            d3.select(this).attr('opacity', 1).attr('r', 8);
            showTooltip(event, `${d.country}<br>Solar: ${d.solar} GW<br>Wind: ${d.wind} GW`);
        })
        .on('mouseout', function() {
            d3.select(this).attr('opacity', 0.7).attr('r', 6);
            hideTooltip();
        })
        .transition()
        .duration(narrativeState.animationSpeed)
        .attr('cy', d => yScale(d.wind))
        .attr('r', 6);
    
    // Add country labels
    svg.selectAll('.label')
        .data(renewableData)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => xScale(d.solar))
        .attr('y', d => yScale(d.wind) - 10)
        .text(d => d.country)
        .style('font-size', '10px')
        .style('text-anchor', 'middle')
        .style('opacity', 0);
    
    // Add axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale));
    
    svg.append('g')
        .call(d3.axisLeft(yScale));
    
    // Add labels
    svg.append('text')
        .attr('class', 'axis-label')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .style('text-anchor', 'middle')
        .text('Solar Capacity (GW)');
    
    svg.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -40)
        .style('text-anchor', 'middle')
        .text('Wind Capacity (GW)');
}

// Render stacked chart for Scene 3
function renderStackedChart(svg, scene) {
    // Prepare data for stacking
    const stack = d3.stack().keys(['solar', 'wind', 'hydro', 'biomass']);
    const stackedData = stack(renewableData.slice(0, 6)); // Show top 6 countries
    
    // Scales
    const xScale = d3.scaleBand()
        .domain(renewableData.slice(0, 6).map(d => d.country))
        .range([0, width])
        .padding(0.1);
    
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(stackedData, layer => d3.max(layer, d => d[1]))])
        .range([height, 0]);
    
    // Add grid
    svg.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(''));
    
    // Add stacked bars
    svg.selectAll('.layer')
        .data(stackedData)
        .enter()
        .append('g')
        .attr('class', 'layer')
        .selectAll('rect')
        .data(d => d)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d.data.country))
        .attr('y', height)
        .attr('width', xScale.bandwidth())
        .attr('height', 0)
        .attr('fill', (d, i, nodes) => {
            const layer = d3.select(nodes[i].parentNode).datum();
            return colorScale(layer.key);
        })
        .attr('opacity', 0.8)
        .on('mouseover', function(event, d) {
            d3.select(this).attr('opacity', 1);
            const layer = d3.select(this.parentNode).datum();
            showTooltip(event, `${d.data.country}<br>${layer.key}: ${d.data[layer.key]} GW`);
        })
        .on('mouseout', function() {
            d3.select(this).attr('opacity', 0.8);
            hideTooltip();
        })
        .transition()
        .duration(narrativeState.animationSpeed)
        .attr('y', d => yScale(d[1]))
        .attr('height', d => yScale(d[0]) - yScale(d[1]));
    
    // Add axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');
    
    svg.append('g')
        .call(d3.axisLeft(yScale));
    
    // Add legend
    const legend = svg.append('g')
        .attr('transform', `translate(${width + 10}, 0)`);
    
    legend.selectAll('.legend-item')
        .data(['solar', 'wind', 'hydro', 'biomass'])
        .enter()
        .append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(0, ${i * 25})`)
        .each(function(d) {
            d3.select(this).append('rect')
                .attr('width', 15)
                .attr('height', 15)
                .attr('fill', colorScale(d));
            
            d3.select(this).append('text')
                .attr('x', 20)
                .attr('y', 12)
                .text(d.charAt(0).toUpperCase() + d.slice(1))
                .style('font-size', '12px');
        });
    
    // Add labels
    svg.append('text')
        .attr('class', 'axis-label')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .style('text-anchor', 'middle')
        .text('Countries');
    
    svg.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -40)
        .style('text-anchor', 'middle')
        .text('Renewable Capacity (GW)');
}

// Add annotations to the scene
function addAnnotations(annotations) {
    const container = document.getElementById('chartContainer');
    
    annotations.forEach((annotation, index) => {
        const annotationEl = document.createElement('div');
        annotationEl.className = 'annotation';
        annotationEl.style.left = annotation.x + 'px';
        annotationEl.style.top = annotation.y + 'px';
        annotationEl.style.borderColor = annotation.color;
        annotationEl.innerHTML = annotation.text;
        
        container.appendChild(annotationEl);
        
        // Animate annotation appearance
        setTimeout(() => {
            annotationEl.style.opacity = '0';
            annotationEl.style.transform = 'translateY(-10px)';
            annotationEl.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                annotationEl.style.opacity = '1';
                annotationEl.style.transform = 'translateY(0)';
            }, 100);
        }, index * 500);
    });
}

// Tooltip functions
function showTooltip(event, content) {
    const tooltip = d3.select('body').selectAll('.tooltip').data([1]);
    
    tooltip.enter()
        .append('div')
        .attr('class', 'tooltip')
        .merge(tooltip)
        .style('opacity', 1)
        .html(content)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px');
}

function hideTooltip() {
    d3.select('.tooltip').style('opacity', 0);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initVisualization);

// Keyboard navigation triggers
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        nextScene();
    } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        previousScene();
    }
}); 