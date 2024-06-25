let currentTab;

function loadTab(tabId) {

    // if the clicked tab is the current tab, do nothing
    if (currentTab === tabId) return;

    const oldTab = document.getElementById(currentTab);
    const newTab = document.getElementById(tabId);

    // Remove 'active' class from all tab contents
    oldTab.classList.remove('active');

    // Add 'active' class to the selected tab content
    newTab.classList.add('active');

    // Update active state of tab buttons
    document.querySelector(`.tab-button[data-tab="${currentTab}"]`).classList.remove('active');
    document.querySelector(`.tab-button[data-tab="${tabId}"]`).classList.add('active');

    // load the tab-specific CSS
    const tabStyle = document.getElementById('tab-style');
    tabStyle.href = newTab.dataset.css;

    // Load the tab-specific JavaScript
    loadTabScript(tabId);

    // Update the current tab
    currentTab = tabId;

}

function loadTabScript(tabId) {
    const scriptSrc = `/static/js/${tabId}.js`;
    
    // First, check if the script is already loaded
    if (document.querySelector(`script[src="${scriptSrc}"]`)) {
        return; // Script is already loaded, no need to load it again
    }

    // Check if the file exists before attempting to load it
    fetch(scriptSrc)
        .then(response => {
            if (response.ok) {
                // File exists, proceed with loading
                const script = document.createElement('script');
                script.src = scriptSrc;
                document.body.appendChild(script);
            } else {
                console.log(`No specific JavaScript file found for ${tabId}`);
                // Optionally, you can handle the absence of a script file here
                // For example, you might want to load a default script or do nothing
            }
        })
        .catch(error => {
            console.error(`Error checking for ${tabId}.js:`, error);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    const tabContainer = document.querySelector('.app-tab-container');
    currentTab = tabContainer.dataset.initialTab;

    // Set initial tab-specific CSS
    const tabStyle = document.getElementById('tab-style');
    const initialTabContent = document.getElementById(currentTab);
    tabStyle.href = initialTabContent.dataset.css;
    loadTabScript(currentTab);
});