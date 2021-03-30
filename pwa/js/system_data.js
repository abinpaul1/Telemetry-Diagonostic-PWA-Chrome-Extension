// Timing
const TIME_DELAY = 1000 // time dealy between checking for updates from system
const MEMORY_TIME_RANGE = 60 // x-axis time width in seconds
const start_time = new Date();


var chromeExtensionId = "lbaoddlfnnkcaacjlcaekegchbdjddbe";
var port = chrome.runtime.connect(chromeExtensionId);

// The ID of the extension we want to talk to.
let prevCpuInfo;

// Charts
let cpuUtilizationChart = init_cpu_chart();
cpuUtilizationChart.render();
let memUtilizationChart = init_mem_chart();
memUtilizationChart.render()


port.onMessage.addListener(function(msg, pp) {
    switch (msg.question) {
        case "CPU":
            {
                updateCPU(JSON.parse(msg.answer))
                break;
            }
        case "Memory":
            {
                updateMemory(JSON.parse(msg.answer))
                break;
            }
    }
});

// Ask periodically for new data
setInterval(function() {
    port.postMessage({
        question: "CPU"
    });
}, TIME_DELAY);

setInterval(function() {
    port.postMessage({
        question: "Memory"
    });
}, TIME_DELAY);


function init_cpu_chart() {
    // Construct options first and then pass it as a parameter
    return new CanvasJS.Chart("chartContainer1", {
        animationEnabled: true,
        title: {
            text: "CPU Utilization Chart"
        },
        axisY: {
            minimum: 0,
            maximum: 100,
            suffix: "%"
        },
        data: [{
            type: "bar",
            dataPoints: []
        }]
    })
};

function updateCPU(cpuInfo) {
    let newDataPoints = []
    for (let i = 0; i < cpuInfo.numOfProcessors; i++) {
        let usage = cpuInfo.processors[i].usage;
        var barHeight = 0;
        if (prevCpuInfo) {
            var oldUsage = prevCpuInfo.processors[i].usage;
            barHeight = Math.floor((usage.kernel + usage.user - oldUsage.kernel - oldUsage.user) / (usage.total - oldUsage.total) * 100);
        }
        newDataPoints.push({
            y: barHeight,
            label: "CPU" + String(i + 1)
        })
    }
    prevCpuInfo = cpuInfo;
    cpuUtilizationChart.options.data[0].dataPoints = newDataPoints;
    cpuUtilizationChart.render();
}

function init_mem_chart() {
    // Construct options first and then pass it as a parameter
    return new CanvasJS.Chart("chartContainer2", {
        animationEnabled: true,
        title: {
            text: "Memory Utilization Chart"
        },
        axisY: {
            minimum: 0,
            maximum: 100,
            suffix: "%"
        },
        data: [{
            type: "spline",
            dataPoints: []
        }]
    })
};

function updateMemory(memoryInfo) {
    let usedMem = 100 - Math.round((memoryInfo.availableCapacity / memoryInfo.capacity) * 100);
    const POINTS_ON_LINE_COUNT = Math.ceil((MEMORY_TIME_RANGE * 1000) / TIME_DELAY)
    const datapoints_arr = memUtilizationChart.options.data[0].dataPoints;
    if (datapoints_arr.length >= POINTS_ON_LINE_COUNT) {
        datapoints_arr.shift();
    }
    datapoints_arr.push({
        x: Math.floor((new Date() - start_time) / 1000),
        y: usedMem
    });
    memUtilizationChart.render();
}