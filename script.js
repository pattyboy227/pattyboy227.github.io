// Narrative Visualization Parameters
const state = {
    currentScene: 0,
    totalScenes: 3,
    data: null,
    chart: null,
    annotations: null
};

// Scene configurations
const scenes = [
    {
        title: "The Dot-Com Bubble (1995-2002)",
        description: "Explore how the rapid rise and dramatic fall of internet stocks created one of the most significant market bubbles in history, and its lasting impact on the S&P 500.",
        focus: "dotcom",
        color: "#e74c3c"
    },
    {
        title: "The 2008 Financial Crisis",
        description: "Witness the devastating effects of the housing market collapse and banking crisis that led to the Great Recession, marking one of the worst periods in market history.",
        focus: "crisis",
        color: "#f39c12"
    },
    {
        title: "The COVID-19 Pandemic",
        description: "See how the global pandemic created unprecedented market volatility, with the fastest crash and recovery in market history.",
        focus: "covid",
        color: "#27ae60"
    }
];

// Generate S&P 500 data with realistic patterns
function generateSP500Data() {
    const data = [];
    let price = 1000; // Starting value
    const startDate = new Date('1990-01-01');
    const endDate = new Date('2023-12-31');
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 30)) {
        // Add trend
        price += (Math.random() - 0.45) * 20;
        
        // Add seasonal patterns
        const month = d.getMonth();
        if (month >= 10 || month <= 2) price += 5; // Winter boost
        
        // Add specific event impacts
        const year = d.getFullYear();
        const monthNum = d.getMonth();
        
        // Dot-com bubble (1995-2002)
        if (year >= 1995 && year <= 2000) {
            price += Math.random() * 30; // Rapid growth
        } else if (year >= 2001 && year <= 2002) {
            price -= Math.random() * 40; // Bubble burst
        }
        
        // 2008 crisis
        if (year === 2008 && monthNum >= 8) {
            price -= Math.random() * 60; // Sharp decline
        } else if (year === 2009) {
            price += Math.random() * 20; // Recovery
        }
        
        // COVID-19
        if (year === 2020 && monthNum >= 2 && monthNum <= 4) {
            price -= Math.random() * 80; // Sharp crash
        } else if (year === 2020 && monthNum >= 5) {
            price += Math.random() * 40; // Recovery
        }
        
        // Ensure price doesn't go negative
        price = Math.max(price, 100);
        
        data.push({
            date: new Date(d),
            price: Math.round(price),
            year: year,
            month: monthNum
        });
    }
    
    return data;
}

// Initialize the visualization
async function initVisualization() {
    state.data = generateSP500Data();
    
    // Set up D3 scales and dimensions
    const margin = {top: 50, right: 50, bottom: 80, left: 80};
    const width = 1000 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select("#sceneContainer")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    state.chart = svg;
    
    // Set up scales
    const xScale = d3.scaleTime()
        .domain(d3.extent(state.data, d => d.date))
        .range([0, width]);
    
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(state.data, d => d.price)])
        .range([height, 0]);
    
    // Add axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);
    
    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis);
    
    // Add axis labels
    svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 50)
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Year");
    
    svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("S&P 500 Index Value");
    
    // Create line generator
    const line = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.price))
        .curve(d3.curveMonotoneX);
    
    // Add the main line
    svg.append("path")
        .datum(state.data)
        .attr("class", "sp500-line")
        .attr("fill", "none")
        .attr("stroke", "#3498db")
        .attr("stroke-width", 3)
        .attr("d", line);
    
    // Add data points
    svg.selectAll(".data-point")
        .data(state.data)
        .enter()
        .append("circle")
        .attr("class", "data-point")
        .attr("cx", d => xScale(d.date))
        .attr("cy", d => yScale(d.price))
        .attr("r", 2)
        .attr("fill", "#3498db")
        .attr("opacity", 0.6)
        .on("mouseover", function(event, d) {
            const tooltip = d3.select("#tooltip");
            tooltip.style("opacity", 1)
                .html(`Date: ${d.date.toLocaleDateString()}<br/>S&P 500: ${d.price.toLocaleString()}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", function() {
            d3.select("#tooltip").style("opacity", 0);
        });
    
    // Initialize annotations
    state.annotations = d3.annotation()
        .annotations([])
        .type(d3.annotationCalloutCircle)
        .accessors({
            x: d => xScale(d.date),
            y: d => yScale(d.price)
        });
    
    svg.append("g")
        .attr("class", "annotation-group")
        .call(state.annotations);
    
    // Show first scene
    showScene(0);
}

// Show specific scene
function showScene(sceneIndex) {
    state.currentScene = sceneIndex;
    
    // Update scene content
    const scene = scenes[sceneIndex];
    d3.select("#sceneContainer").select(".scene-title").remove();
    d3.select("#sceneContainer").select(".scene-description").remove();
    
    d3.select("#sceneContainer")
        .insert("h2", "svg")
        .attr("class", "scene-title")
        .text(scene.title);
    
    d3.select("#sceneContainer")
        .insert("p", "svg")
        .attr("class", "scene-description")
        .text(scene.description);
    
    // Update progress bar
    const progress = ((sceneIndex + 1) / state.totalScenes) * 100;
    d3.select("#progressFill").style("width", progress + "%");
    
    // Update navigation buttons
    d3.select("#prevBtn").property("disabled", sceneIndex === 0);
    d3.select("#nextBtn").property("disabled", sceneIndex === state.totalScenes - 1);
    
    // Update scene indicators
    d3.selectAll(".indicator").classed("active", false);
    d3.select(`[data-scene="${sceneIndex}"]`).classed("active", true);
    
    // Update chart based on scene focus
    updateChartForScene(sceneIndex);
}

// Update chart for specific scene
function updateChartForScene(sceneIndex) {
    const scene = scenes[sceneIndex];
    const svg = state.chart;
    
    // Clear existing highlights
    svg.selectAll(".highlight-area").remove();
    svg.selectAll(".event-marker").remove();
    svg.selectAll(".annotation-group").selectAll("*").remove();
    
    // Define event periods
    const events = {
        dotcom: {
            bubble: {start: new Date('1995-01-01'), end: new Date('2000-03-01')},
            burst: {start: new Date('2000-03-01'), end: new Date('2002-10-01')}
        },
        crisis: {
            decline: {start: new Date('2007-10-01'), end: new Date('2009-03-01')},
            recovery: {start: new Date('2009-03-01'), end: new Date('2010-01-01')}
        },
        covid: {
            crash: {start: new Date('2020-02-01'), end: new Date('2020-03-23')},
            recovery: {start: new Date('2020-03-23'), end: new Date('2020-08-01')}
        }
    };
    
    const currentEvent = events[scene.focus];
    
    // Add highlight areas
    Object.entries(currentEvent).forEach(([phase, period]) => {
        const xScale = d3.scaleTime()
            .domain(d3.extent(state.data, d => d.date))
            .range([0, 1000 - 160]);
        
        const highlight = svg.append("rect")
            .attr("class", "highlight-area")
            .attr("x", xScale(period.start))
            .attr("y", 0)
            .attr("width", xScale(period.end) - xScale(period.start))
            .attr("height", 500 - 130)
            .attr("fill", scene.color)
            .attr("opacity", 0.1);
        
        // Add phase labels
        svg.append("text")
            .attr("class", "event-marker")
            .attr("x", xScale(period.start) + (xScale(period.end) - xScale(period.start)) / 2)
            .attr("y", 30)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .style("fill", scene.color)
            .text(phase.charAt(0).toUpperCase() + phase.slice(1));
    });
    
    // Add specific annotations for each scene
    addSceneAnnotations(sceneIndex);
}

// Add scene-specific annotations
function addSceneAnnotations(sceneIndex) {
    const scene = scenes[sceneIndex];
    const svg = state.chart;
    const xScale = d3.scaleTime()
        .domain(d3.extent(state.data, d => d.date))
        .range([0, 1000 - 160]);
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(state.data, d => d.price)])
        .range([500 - 130, 0]);
    
    let annotations = [];
    
    if (sceneIndex === 0) { // Dot-com bubble
        const peakData = state.data.find(d => d.date.getFullYear() === 2000 && d.date.getMonth() === 2);
        const bottomData = state.data.find(d => d.date.getFullYear() === 2002 && d.date.getMonth() === 9);
        
        annotations = [
            {
                note: {
                    label: "Dot-com Peak: March 2000",
                    title: "Bubble Peak"
                },
                x: xScale(peakData.date),
                y: yScale(peakData.price),
                dy: -50,
                dx: 0
            },
            {
                note: {
                    label: "Bubble Burst: October 2002",
                    title: "Market Bottom"
                },
                x: xScale(bottomData.date),
                y: yScale(bottomData.price),
                dy: 50,
                dx: 0
            }
        ];
    } else if (sceneIndex === 1) { // 2008 crisis
        const crisisData = state.data.find(d => d.date.getFullYear() === 2008 && d.date.getMonth() === 9);
        const bottomData = state.data.find(d => d.date.getFullYear() === 2009 && d.date.getMonth() === 2);
        
        annotations = [
            {
                note: {
                    label: "Lehman Brothers Collapse",
                    title: "Crisis Trigger"
                },
                x: xScale(crisisData.date),
                y: yScale(crisisData.price),
                dy: -50,
                dx: 0
            },
            {
                note: {
                    label: "Market Bottom: March 2009",
                    title: "Recovery Begins"
                },
                x: xScale(bottomData.date),
                y: yScale(bottomData.price),
                dy: 50,
                dx: 0
            }
        ];
    } else if (sceneIndex === 2) { // COVID-19
        const crashData = state.data.find(d => d.date.getFullYear() === 2020 && d.date.getMonth() === 2);
        const recoveryData = state.data.find(d => d.date.getFullYear() === 2020 && d.date.getMonth() === 7);
        
        annotations = [
            {
                note: {
                    label: "COVID-19 Crash",
                    title: "Fastest Crash Ever"
                },
                x: xScale(crashData.date),
                y: yScale(crashData.price),
                dy: -50,
                dx: 0
            },
            {
                note: {
                    label: "V-Shaped Recovery",
                    title: "Remarkable Bounce"
                },
                x: xScale(recoveryData.date),
                y: yScale(recoveryData.price),
                dy: 50,
                dx: 0
            }
        ];
    }
    
    // Update annotations
    state.annotations.annotations(annotations);
    svg.select(".annotation-group").call(state.annotations);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    initVisualization();
    
    // Navigation buttons
    document.getElementById('nextBtn').addEventListener('click', function() {
        if (state.currentScene < state.totalScenes - 1) {
            showScene(state.currentScene + 1);
        }
    });
    
    document.getElementById('prevBtn').addEventListener('click', function() {
        if (state.currentScene > 0) {
            showScene(state.currentScene - 1);
        }
    });
    
    // Scene indicators
    document.querySelectorAll('.indicator').forEach(indicator => {
        indicator.addEventListener('click', function() {
            const sceneIndex = parseInt(this.getAttribute('data-scene'));
            showScene(sceneIndex);
        });
    });
}); 