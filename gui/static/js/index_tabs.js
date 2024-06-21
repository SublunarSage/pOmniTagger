let currentTab;

function loadTab(tabId) {

    // if the clicked tab is the current tab, do nothing
    if (currentTab === tabId) return;

    // Remove 'active' class from all tab contents
    document.getElementById(currentTab).classList.remove('active');

    // Add 'active' class to the selected tab content
    document.getElementById(tabId).classList.add('active');

    // Update active state of tab buttons
    document.querySelector(`.tab-button[data-tab="${currentTab}"]`).classList.remove('active');
    document.querySelector(`.tab-button[data-tab="${tabId}"]`).classList.add('active');

    // Update the current tab
    currentTab = tabId;

}

document.addEventListener('DOMContentLoaded', function() {
    currentTab = document.querySelector('.app-tab-container').dataset.initialTab;
});