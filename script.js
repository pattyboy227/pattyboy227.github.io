// Parameters and state
const scenes = [
  {
    id: 0,
    name: "Early Signs (Jun 2005 - Oct 2007)",
    description: "In early 2006, the housing market peaked. Months later, the yield curve inverted, signaling a recession was likely within a year or two. Yet, the S&P 500 continued to rise.",
    start: new Date(2005, 5, 1), // June 2005
    end: new Date(2007, 9, 31),  // Oct 2007
    annotations: [
      {
        date: new Date(2006, 4, 31), // May 2006
        label: "JPMorgan warns of housing downturn",
      },
      {
        date: new Date(2007, 3, 30), // April 2007
        label: "Subprime mortgage crisis begins",
      },
      {
        date: new Date(2007, 9, 31), // Oct 2007
        label: "S&P hits pre-crisis high",
      },
    ],
  },
  {
    id: 1,
    name: "Crisis (Oct 2007 - Feb 2009)",
    description: "As Freddie Mac and Fannie Mae were nationalized and Congress squabbled over Wall Street bailouts, bank runs continued and the S&P 500 tumbled in panic.",
    start: new Date(2007, 9, 31), // Oct 2007
    end: new Date(2009, 1, 28),   // Feb 2009
    annotations: [
      {
        date: new Date(2007, 11, 31), // Dec 2007
        label: "Bear Stearns collapses",
      },
      {
        date: new Date(2008, 8, 30), // Sept 2008
        label: "Lehman Brothers Bankruptcy",
      },
      {
        date: new Date(2009, 1, 28), // Feb 2009
        label: "Lowest Point During Crisis",
      },
    ],
  },
  {
    id: 2,
    name: "Recovery (Feb 2009 - Jun 2013)",
    description: "The new Obama administration supported economic stimulus, quantitative easing, and regulatory reforms. Invigorated, the S&P 500 began a gradual recovery.",
    start: new Date(2009, 1, 28), // Feb 2009
    end: new Date(2013, 5, 30),   // June 2013
    annotations: [
      {
        date: new Date(2009, 2, 31), // Mar 2009
        label: "Quantitative easing accelerates",
      },
      {
        date: new Date(2010, 6, 31), // July 2010
        label: "Dodd-Frank Act signed",
      },
      {
        date: new Date(2013, 2, 31), // Mar 2013
        label: "S&P passes pre-crisis high",
      },
    ],
  },
];

let currentScene = 0;
const margin = { top: 60, right: 60, bottom: 60, left: 70 };
const width = 800;
const height = 420;

// Helper: parse date from mm/dd/yyyy
const parseDate = d3.timeParse("%m/%d/%Y");
const formatMonthYear = d3.timeFormat("%b %Y");
const formatYear = d3.timeFormat("%Y");

// Helper: check if a date is an annotation date for the current scene
function isAnnotatedPoint(date, scene) {
  return scene.annotations.some(a => a.date.getFullYear() === date.getFullYear() && a.date.getMonth() === date.getMonth());
}

// Load and filter data
function loadData() {
  d3.csv("indexprices.csv").then(raw => {
    let data = raw.map(d => ({
      date: parseDate(d.Date),
      value: +d.Value
    }));
    // Filter to June 2005 - June 2013
    data = data.filter(d => d.date >= new Date(2005, 5, 1) && d.date <= new Date(2013, 5, 30));
    renderScene(data, currentScene);
    setupControls(data);
  });
}

// Render a scene
function renderScene(data, sceneIdx) {
  const scene = scenes[sceneIdx];
  // Filter data for this scene
  const sceneData = data.filter(d => d.date >= scene.start && d.date <= scene.end);

  // Set up SVG
  d3.select("#chart").selectAll("svg").remove();
  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // X and Y scales
  const x = d3.scaleTime()
    .domain([scene.start, scene.end])
    .range([0, width]);
  const y = d3.scaleLinear()
    .domain([d3.min(sceneData, d => d.value) * 0.95, d3.max(sceneData, d => d.value) * 1.05])
    .range([height, 0]);

  // X axis (years only)
  // Find the first data point for each year in the scene
  const yearTicks = [];
  let lastYear = null;
  for (const d of sceneData) {
    const yVal = d.date.getFullYear();
    if (yVal !== lastYear) {
      yearTicks.push(d.date);
      lastYear = yVal;
    }
  }
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x)
      .tickValues(yearTicks)
      .tickFormat(formatYear)
    );

  // Y axis
  svg.append("g")
    .call(d3.axisLeft(y));

  // Axis labels
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .attr("font-size", "1.1em")
    .text("Date");
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .attr("font-size", "1.1em")
    .text("S&P 500 Index Closing Price");

  // Title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -25)
    .attr("text-anchor", "middle")
    .attr("font-size", "1.5em")
    .attr("font-weight", "bold")
    .text(scene.name);

  // Line generator
  const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.value))
    .curve(d3.curveMonotoneX);

  // Draw line
  svg.append("path")
    .datum(sceneData)
    .attr("fill", "none")
    .attr("stroke", "#1976d2")
    .attr("stroke-width", 3)
    .attr("d", line);

  // Draw data points (all)
  svg.selectAll(".dot")
    .data(sceneData)
    .enter()
    .append("circle")
    .attr("class", d => isAnnotatedPoint(d.date, scene) ? "dot annotated-dot" : "dot")
    .attr("cx", d => x(d.date))
    .attr("cy", d => y(d.value))
    .attr("r", 5)
    .attr("fill", "#111")
    .on("mouseover", function(event, d) {
      d3.select(this).transition().duration(100).attr("r", 8);
      showTooltip(event, d, x(d.date), y(d.value));
    })
    .on("mousemove", function(event, d) {
      moveTooltip(event, d, x(d.date), y(d.value));
    })
    .on("mouseout", function() {
      d3.select(this).transition().duration(100).attr("r", 5);
      hideTooltip();
    });

  // Annotations
  drawAnnotations(svg, scene, sceneData, x, y);

  // Redraw annotated points on top for interactivity
  svg.selectAll(".annotated-dot")
    .raise();

  // Scene description
  d3.select("#scene-description").html(scene.description);
}

// Tooltip functions
function showTooltip(event, d, cx, cy) {
  let tooltip = d3.select("body").selectAll(".d3-tooltip").data([null]);
  tooltip = tooltip.enter()
    .append("div")
    .attr("class", "d3-tooltip")
    .merge(tooltip);
  tooltip.style("display", "block")
    .html(`<b>${formatMonthYear(d.date)}</b><br/>S&P 500 Price: ${d.value.toFixed(2)}`);
  moveTooltip(event, d, cx, cy);
}
function moveTooltip(event, d, cx, cy) {
  const svgRect = d3.select("svg").node().getBoundingClientRect();
  d3.select(".d3-tooltip")
    .style("left", (svgRect.left + cx + 90) + "px")
    .style("top", (svgRect.top + cy + 60) + "px");
}
function hideTooltip() {
  d3.select(".d3-tooltip").style("display", "none");
}

// Annotation placement helper
function drawAnnotations(svg, scene, sceneData, x, y) {
  // Custom dx/dy for each annotation in each scene
  const annotationConfigs = [
    // Scene 1
    [
      { dx: 0, dy: -70 }, // JPMorgan warns of housing downturn (above)
      { dx: 0, dy: 80 },  // Subprime mortgage crisis begins (below, moved lower)
      { dx: -90, dy: -60 } // S&P hits pre-crisis high (left and above)
    ],
    // Scene 2
    [
      { dx: 0, dy: -70 }, // Bear Stearns collapses (above)
      { dx: -100, dy: 60 }, // Lehman Brothers Bankruptcy (left and below)
      { dx: -150, dy: -5} // Market Bottom (up and left)
    ],
    // Scene 3
    [
      { dx: 140, dy: -20 }, // Quantitative easing begins (up and right)
      { dx: 0, dy: -80 }, // Dodd-Frank Act signed (up)
      { dx: -80, dy: -50 } // S&P passes pre-crisis high (lower and left)
    ]
  ];
  const config = annotationConfigs[scene.id];
  const annotations = scene.annotations.map((a, i) => {
    // Find the closest data point to the annotation date
    const d = sceneData.reduce((prev, curr) => Math.abs(curr.date - a.date) < Math.abs(prev.date - a.date) ? curr : prev);
    return {
      note: {
        label: a.label,
        align: "middle",
        wrap: 180,
        padding: 5,
        orientation: config[i].dy < 0 ? "topBottom" : "bottomTop"
      },
      x: x(d.date),
      y: y(d.value),
      dx: config[i].dx,
      dy: config[i].dy,
      subject: { radius: 8 },
      color: "#1976d2"
    };
  });
  const makeAnnotations = d3.annotation()
    .type(d3.annotationCalloutCircle)
    .annotations(annotations);
  svg.append("g")
    .attr("class", "annotation-group")
    .call(makeAnnotations);
}

// Navigation controls
function setupControls(data) {
  d3.select("#prev-btn").on("click", function() {
    if (currentScene > 0) {
      currentScene--;
      transitionScene(data, currentScene + 1, currentScene);
    }
  });
  d3.select("#next-btn").on("click", function() {
    if (currentScene < scenes.length - 1) {
      currentScene++;
      transitionScene(data, currentScene - 1, currentScene);
    }
  });
  updateButtons();
}

function updateButtons() {
  d3.select("#prev-btn").property("disabled", currentScene === 0);
  d3.select("#next-btn").property("disabled", currentScene === scenes.length - 1);
}

// Smooth transition between scenes
function transitionScene(data, fromScene, toScene) {
  // Fade out
  d3.select("#chart svg")
    .transition()
    .duration(400)
    .style("opacity", 0)
    .on("end", function() {
      renderScene(data, toScene);
      d3.select("#chart svg")
        .style("opacity", 0)
        .transition()
        .duration(400)
        .style("opacity", 1);
      updateButtons();
    });
}

// Start
loadData(); 