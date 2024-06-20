let currentTab = null;

function loadTab(tab) {
    if(currentTab === tab) return;

    fetch(`/${tab}`).then(response=>response.text())
    .then(data => {
        document.getElementById('tab-content').innerHTML = data;
        document.getElementById('tab-content').classList.add('active-tab');
        executeScripts();
        currentTab = tab;
    }).catch(error => console.log('Error:', error));
}

function executeScripts() {
        const scriptTags = document.getElementById('tab-content').querySelectorAll('script');
        scriptTags.forEach(script => {
            const newScript = document.createElement('script');
            newScript.textContent = script.textContent;
            document.body.appendChild(newScript).parentNode.removeChild(newScript);
        });
    }

window.onload = () => {
    loadTab('image_input_processing');
}