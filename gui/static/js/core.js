let currentTab;
export const initializedTabs = new Set();
export const tabModules = {};
export const moduleMap = {
    "image_input_processing": ["imageInputProcessing"]
};

export const loadTab = (tabId) => {
    if (currentTab === tabId) return;

    const oldTab = document.getElementById(currentTab);
    const newTab = document.getElementById(tabId);

    oldTab?.classList.remove('active');
    newTab?.classList.add('active');

    document.querySelector(`.tab-button[data-tab="${currentTab}"]`)?.classList.remove('active');
    document.querySelector(`.tab-button[data-tab="${tabId}"]`)?.classList.add('active');

    loadTabResources(tabId);

    currentTab = tabId;
};

const loadTabResources = (tabId) => {
    loadTabCSS(tabId);
    loadTabScript(tabId);
};

const loadTabCSS = async (tabId) => {
    const cssHref = `/static/css/${tabId}.css`;
    
    // Check if the stylesheet is already loaded
    if (!document.querySelector(`link[href="${cssHref}"]`)) {
        try {
            const response = await fetch(cssHref);
            if (response.ok) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = cssHref;
                document.head.appendChild(link);
            } else {
                console.log(`No specific CSS file found for ${tabId}`);
            }
        } catch (error) {
            console.error(`Error checking for ${tabId}.css:`, error);
        }
    }
};

const loadTabScript = async (tabId) => {
    try {
        await import(`/static/js/${tabId}.js`);
        initializeTabIfNeeded(tabId);
    } catch (error) {
        console.error(`Error loading module for ${tabId}:`, error);
    }
};

const initializeTabIfNeeded = (tabId) => {
    const modulesToInit = moduleMap[tabId] ?? [];
    
    if (!initializedTabs.has(tabId)) {
        modulesToInit.forEach(name => tabModules[name]?.initializeTab?.());
        initializedTabs.add(tabId);
    }
    
    modulesToInit.forEach(name => tabModules[name]?.onTabAccess?.());
};

document.addEventListener('DOMContentLoaded', () => {
    const tabContainer = document.querySelector('.app-tab-container');
    currentTab = tabContainer?.dataset.initialTab;

    // Set initial tab-specific CSS
    if (currentTab) {
        loadTabResources(currentTab);
    }
});