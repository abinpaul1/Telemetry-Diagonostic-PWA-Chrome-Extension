// this is the background code...
let CPU_info;
let Memory_info, Storage_info, Display_info;

// Time delay between polls
const POLL_TIME_DELAY = 10000;



// Polling for all system info
function pollForCPUInfo() {
    chrome.system.cpu.getInfo(function(info) {
        CPU_info = info;
        setTimeout(pollForCPUInfo, POLL_TIME_DELAY);
    });
}

function pollForMemoryInfo() {
    chrome.system.memory.getInfo(function(info) {
        Memory_info = info;
        setTimeout(pollForMemoryInfo, POLL_TIME_DELAY);
    });
}

function pollForStorageInfo() {
    chrome.system.storage.getInfo(function(info) {
        Storage_info = info;
        setTimeout(pollForStorageInfo, POLL_TIME_DELAY);
    });
}

function pollForDisplayInfo() {
    chrome.system.display.getInfo(function(info) {
        Display_info = info;
        console.log(JSON.stringify(info));
        setTimeout(pollForDisplayInfo, POLL_TIME_DELAY);
    });
}


// For long-lived connections from PWA:
chrome.runtime.onConnectExternal.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        if (msg.question == "CPU")
            port.postMessage({ answer: JSON.stringify(CPU_info) });
        else if (msg.question == "Memory")
            port.postMessage({ answer: JSON.stringify(Memory_info) });
        else if (msg.question == "Storage")
            port.postMessage({ answer: JSON.stringify(Storage_info) });
        else if (msg.question == "Display")
            port.postMessage({ answer: JSON.stringify(Display_info) });

    });
});


chrome.runtime.onInstalled.addListener(pollForCPUInfo);
chrome.runtime.onInstalled.addListener(pollForMemoryInfo);
chrome.runtime.onInstalled.addListener(pollForDisplayInfo);
chrome.runtime.onInstalled.addListener(pollForStorageInfo);

// Startup start polling for data every 30 seconds
chrome.runtime.onStartup.addListener(pollForCPUInfo);
chrome.runtime.onStartup.addListener(pollForMemoryInfo);