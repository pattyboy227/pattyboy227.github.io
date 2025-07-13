// Narrative Visualization Parameters
const narrativeParams = {
    currentScene: 1,
    totalScenes: 4,
    chartData: {},
    annotations: [],
    userInteractions: {
        hoverEnabled: true,
        clickEnabled: true
    }
};

// Sample data for the visualization
const renewableEnergyData = {
    globalOverview: [
        { region: "Asia Pacific", solar: 280, wind: 320, hydro: 450 },
        { region: "Europe", solar: 180, wind: 280, hydro: 200 },
        { region: "North America", solar: 120, wind: 200, hydro: 180 },
        { region: "South America", solar: 15, wind: 25, hydro: 150 },
        { region: "Africa", solar: 8, wind: 12, hydro: 35 },
        { region: "Middle East", solar: 25, wind: 8, hydro: 15 }
    ],
    
    growthTrends: [
        { year: 2015, solar: 50, wind: 80 },
        { year: 2016, solar: 75, wind: 95 },
        { year: 2017, solar: 100, wind: 110 },
        { year: 2018, solar: 130, wind: 130 },
        { year: 2019, solar: 160, wind: 150 },
        { year: 2020, solar: 200, wind: 180 },
        { year: 2021, solar: 250, wind: 220 },
        { year: 2022, solar: 320, wind: 280 },
        { year: 2023, solar: 400, wind: 350 }
    ],
    
    regionalMix: [
        { region: "Europe", renewable: 45, fossil: 35, nuclear: 20 },
        { region: "North America", renewable: 25, fossil: 60, nuclear: 15 },
        { region: "Asia Pacific", renewable: 20, fossil: 70, nuclear: 10 },
        { region: "South America", renewable: 60, fossil: 35, nuclear: 5 },
        { region: "Africa", renewable: 15, fossil: 80, nuclear: 5 },
        { region: "Middle East", renewable: 5, fossil: 90, nuclear: 5 }
    ],
    
    futureProjections: [
        { year: 2024, optimistic: 450, moderate: 420, conservative: 400 },
        { year: 2025, optimistic: 520, moderate: 480, conservative: 440 },
        { year: 2026, optimistic: 600, moderate: 540, conservative: 480 },
        { year: 2027, optimistic: 700, moderate: 600, conservative: 520 },
        { year: 2028, optimistic: 800, moderate: 660, conservative: 560 },
        { year: 2029, optimistic: 900, moderate: 720, conservative: 600 },
        { year: 2030, optimistic: 1000, moderate: 780, conservative: 640 }
    ]
};

// Initialize the narrative visualization
function initNarrativeVisualization() {
    updateNavigation();
    createScene1();
}

// Navigation functions
function nextScene() {
    if (narrativeParams.currentScene < narrativeParams.totalScenes) {
        narrativeParams.currentScene++;
        updateScene();
    }
}

function previousScene() {
    if (narrativeParams.currentScene > 1) {
        narrativeParams.currentScene--;
        updateScene();
    }
}

function updateScene() {
    // Hide all scenes
    d3.selectAll('.scene').classed('active', false);
    
    // Show current scene
    d3.select(`#scene${narrativeParams.currentScene}`).classed('active', true);
    
    // Update navigation
    updateNavigation();
    
    // Create the appropriate chart based on current scene
    switch(narrativeParams.currentScene) {
        case 1:
            createScene1();
            break;
        case 2:
            createScene2();
            break;
        case 3:
            createScene3();
            break;
        case 4:
            createScene4();
            break;
    }
}

function updateNavigation() {
    document.getElementById('currentScene').textContent = narrativeParams.currentScene;
    document.getElementById('totalScenes').textContent = narrativeParams.totalScenes;
    
    // Update button states
    document.getElementById('prevBtn').disabled = narrativeParams.currentScene === 1;
    document.getElementById('nextBtn').disabled = narrativeParams.currentScene === narrativeParams.totalScenes;
}

// Scene 1: Global Overview - Stacked Bar Chart
function createScene1() {
    const container = d3.select('#chart1');
    container.html(''); // Clear previous content
    
    const margin = { top: 40, right: 30, bottom: 60, left: 80 };
    const width = container.node().getBoundingClientRect().width - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const data = renewableEnergyData.globalOverview;
    
    // Prepare data for stacked bar chart
    const stack = d3.stack()
        .keys(['solar', 'wind', 'hydro'])
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);
    
    const series = stack(data);
    
    // Scales
    const x = d3.scaleBand()
        .domain(data.map(d => d.region))
        .range([0, width])
        .padding(0.1);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
        .range([height, 0]);
    
    const color = d3.scaleOrdinal()
        .domain(['solar', 'wind', 'hydro'])
        .range(['#3498db', '#2ecc71', '#f39c12']);
    
    // Add bars
    svg.selectAll('.series')
        .data(series)
        .enter().append('g')
        .attr('class', 'series')
        .attr('fill', d => color(d.key))
        .selectAll('rect')
        .data(d => d)
        .enter().append('rect')
        .attr('x', d => x(d.data.region))
        .attr('y', d => y(d[1]))
        .attr('height', d => y(d[0]) - y(d[1]))
        .attr('width', x.bandwidth())
        .on('mouseover', function(event, d) {
            const tooltip = d3.select('body').append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0);
            
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            
            tooltip.html(`
                <strong>${d.data.region}</strong><br/>
                Solar: ${d.data.solar} GW<br/>
                Wind: ${d.data.wind} GW<br/>
                Hydro: ${d.data.hydro} GW<br/>
                Total: ${d.data.solar + d.data.wind + d.data.hydro} GW
            `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            d3.selectAll('.tooltip').remove();
        });
    
    // Add axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)');
    
    svg.append('g')
        .call(d3.axisLeft(y).ticks(5).tickFormat(d => d + ' GW'));
    
    // Add title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text('Renewable Energy Capacity by Region (2023)');
    
    // Add annotations
    addAnnotations(svg, [
        {
            x: x('Asia Pacific') + x.bandwidth() / 2,
            y: y(1050) - 20,
            text: 'Asia Pacific leads in total renewable capacity',
            dx: 0,
            dy: -10
        },
        {
            x: x('Europe') + x.bandwidth() / 2,
            y: y(660) - 20,
            text: 'Europe shows balanced renewable mix',
            dx: 0,
            dy: -10
        }
    ]);
}

// Scene 2: Growth Trends - Line Chart
function createScene2() {
    const container = d3.select('#chart2');
    container.html('');
    
    const margin = { top: 40, right: 30, bottom: 60, left: 80 };
    const width = container.node().getBoundingClientRect().width - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const data = renewableEnergyData.growthTrends;
    
    // Scales
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width]);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.max(d.solar, d.wind))])
        .range([height, 0]);
    
    // Line generators
    const solarLine = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.solar));
    
    const windLine = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.wind));
    
    // Add lines
    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#e74c3c')
        .attr('stroke-width', 3)
        .attr('d', solarLine)
        .on('mouseover', function() {
            d3.select(this).attr('stroke-width', 5);
        })
        .on('mouseout', function() {
            d3.select(this).attr('stroke-width', 3);
        });
    
    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#9b59b6')
        .attr('stroke-width', 3)
        .attr('d', windLine)
        .on('mouseover', function() {
            d3.select(this).attr('stroke-width', 5);
        })
        .on('mouseout', function() {
            d3.select(this).attr('stroke-width', 3);
        });
    
    // Add dots
    svg.selectAll('.solar-dot')
        .data(data)
        .enter().append('circle')
        .attr('class', 'solar-dot')
        .attr('cx', d => x(d.year))
        .attr('cy', d => y(d.solar))
        .attr('r', 4)
        .attr('fill', '#e74c3c')
        .on('mouseover', function(event, d) {
            const tooltip = d3.select('body').append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0);
            
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            
            tooltip.html(`
                <strong>${d.year}</strong><br/>
                Solar: ${d.solar} GW<br/>
                Wind: ${d.wind} GW
            `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            d3.selectAll('.tooltip').remove();
        });
    
    svg.selectAll('.wind-dot')
        .data(data)
        .enter().append('circle')
        .attr('class', 'wind-dot')
        .attr('cx', d => x(d.year))
        .attr('cy', d => y(d.wind))
        .attr('r', 4)
        .attr('fill', '#9b59b6')
        .on('mouseover', function(event, d) {
            const tooltip = d3.select('body').append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0);
            
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            
            tooltip.html(`
                <strong>${d.year}</strong><br/>
                Solar: ${d.solar} GW<br/>
                Wind: ${d.wind} GW
            `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            d3.selectAll('.tooltip').remove();
        });
    
    // Add axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format('d')));
    
    svg.append('g')
        .call(d3.axisLeft(y).ticks(5).tickFormat(d => d + ' GW'));
    
    // Add title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text('Renewable Energy Growth Trends (2015-2023)');
    
    // Add annotations
    addAnnotations(svg, [
        {
            x: x(2021),
            y: y(250) - 20,
            text: 'Solar energy surpassed wind in 2021',
            dx: 0,
            dy: -10
        },
        {
            x: x(2023),
            y: y(400) - 20,
            text: 'Exponential growth continues',
            dx: 0,
            dy: -10
        }
    ]);
}

// Scene 3: Regional Energy Mix - Stacked Bar Chart
function createScene3() {
    const container = d3.select('#chart3');
    container.html('');
    
    const margin = { top: 40, right: 30, bottom: 60, left: 80 };
    const width = container.node().getBoundingClientRect().width - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const data = renewableEnergyData.regionalMix;
    
    // Prepare data for stacked bar chart
    const stack = d3.stack()
        .keys(['renewable', 'fossil', 'nuclear'])
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);
    
    const series = stack(data);
    
    // Scales
    const x = d3.scaleBand()
        .domain(data.map(d => d.region))
        .range([0, width])
        .padding(0.1);
    
    const y = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);
    
    const color = d3.scaleOrdinal()
        .domain(['renewable', 'fossil', 'nuclear'])
        .range(['#1abc9c', '#e67e22', '#95a5a6']);
    
    // Add bars
    svg.selectAll('.series')
        .data(series)
        .enter().append('g')
        .attr('class', 'series')
        .attr('fill', d => color(d.key))
        .selectAll('rect')
        .data(d => d)
        .enter().append('rect')
        .attr('x', d => x(d.data.region))
        .attr('y', d => y(d[1]))
        .attr('height', d => y(d[0]) - y(d[1]))
        .attr('width', x.bandwidth())
        .on('mouseover', function(event, d) {
            const tooltip = d3.select('body').append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0);
            
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            
            tooltip.html(`
                <strong>${d.data.region}</strong><br/>
                Renewable: ${d.data.renewable}%<br/>
                Fossil Fuels: ${d.data.fossil}%<br/>
                Nuclear: ${d.data.nuclear}%
            `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            d3.selectAll('.tooltip').remove();
        });
    
    // Add axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)');
    
    svg.append('g')
        .call(d3.axisLeft(y).ticks(5).tickFormat(d => d + '%'));
    
    // Add title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text('Energy Mix by Region (2023)');
    
    // Add annotations
    addAnnotations(svg, [
        {
            x: x('South America') + x.bandwidth() / 2,
            y: y(60) - 20,
            text: 'South America leads in renewable adoption',
            dx: 0,
            dy: -10
        },
        {
            x: x('Middle East') + x.bandwidth() / 2,
            y: y(95) - 20,
            text: 'Middle East still heavily fossil fuel dependent',
            dx: 0,
            dy: -10
        }
    ]);
}

// Scene 4: Future Projections - Multi-line Chart
function createScene4() {
    const container = d3.select('#chart4');
    container.html('');
    
    const margin = { top: 40, right: 30, bottom: 60, left: 80 };
    const width = container.node().getBoundingClientRect().width - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const data = renewableEnergyData.futureProjections;
    
    // Scales
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width]);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.optimistic)])
        .range([height, 0]);
    
    // Line generators
    const optimisticLine = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.optimistic));
    
    const moderateLine = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.moderate));
    
    const conservativeLine = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.conservative));
    
    // Add lines
    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#27ae60')
        .attr('stroke-width', 3)
        .attr('d', optimisticLine)
        .on('mouseover', function() {
            d3.select(this).attr('stroke-width', 5);
        })
        .on('mouseout', function() {
            d3.select(this).attr('stroke-width', 3);
        });
    
    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#f1c40f')
        .attr('stroke-width', 3)
        .attr('d', moderateLine)
        .on('mouseover', function() {
            d3.select(this).attr('stroke-width', 5);
        })
        .on('mouseout', function() {
            d3.select(this).attr('stroke-width', 3);
        });
    
    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#e74c3c')
        .attr('stroke-width', 3)
        .attr('d', conservativeLine)
        .on('mouseover', function() {
            d3.select(this).attr('stroke-width', 5);
        })
        .on('mouseout', function() {
            d3.select(this).attr('stroke-width', 3);
        });
    
    // Add dots for interaction
    const scenarios = ['optimistic', 'moderate', 'conservative'];
    const colors = ['#27ae60', '#f1c40f', '#e74c3c'];
    
    scenarios.forEach((scenario, i) => {
        svg.selectAll(`.${scenario}-dot`)
            .data(data)
            .enter().append('circle')
            .attr('class', `${scenario}-dot`)
            .attr('cx', d => x(d.year))
            .attr('cy', d => y(d[scenario]))
            .attr('r', 4)
            .attr('fill', colors[i])
            .on('mouseover', function(event, d) {
                const tooltip = d3.select('body').append('div')
                    .attr('class', 'tooltip')
                    .style('opacity', 0);
                
                tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);
                
                tooltip.html(`
                    <strong>${d.year}</strong><br/>
                    Optimistic: ${d.optimistic} GW<br/>
                    Moderate: ${d.moderate} GW<br/>
                    Conservative: ${d.conservative} GW
                `)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function() {
                d3.selectAll('.tooltip').remove();
            });
    });
    
    // Add axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format('d')));
    
    svg.append('g')
        .call(d3.axisLeft(y).ticks(5).tickFormat(d => d + ' GW'));
    
    // Add title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text('Future Renewable Energy Projections (2024-2030)');
    
    // Add annotations
    addAnnotations(svg, [
        {
            x: x(2028),
            y: y(800) - 20,
            text: 'Optimistic scenario shows rapid growth',
            dx: 0,
            dy: -10
        },
        {
            x: x(2030),
            y: y(640) - 20,
            text: 'Conservative scenario still shows significant growth',
            dx: 0,
            dy: -10
        }
    ]);
}

// Helper function to add annotations
function addAnnotations(svg, annotations) {
    annotations.forEach(annotation => {
        svg.append('text')
            .attr('x', annotation.x + annotation.dx)
            .attr('y', annotation.y + annotation.dy)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#2c3e50')
            .style('font-weight', 'bold')
            .text(annotation.text);
        
        // Add connecting line
        svg.append('line')
            .attr('x1', annotation.x)
            .attr('y1', annotation.y)
            .attr('x2', annotation.x + annotation.dx)
            .attr('y2', annotation.y + annotation.dy - 5)
            .attr('stroke', '#2c3e50')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '3,3');
    });
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initNarrativeVisualization();
});

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