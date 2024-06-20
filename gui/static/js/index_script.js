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

function openDirectoryHandler() {
    if (this.responseText) {
        var response = JSON.parse(this.responseText);
        document.getElementById("open-directory-container").innerHTML = 'Selected directory: ' + response.directory;
    }
}

function openDirectory() {
    doAjax("/choose/directory", "POST", openDirectoryHandler);
}

function getHttpRequestObject() {
    // Define and initialize as false
    var xmlHttpRequest = false;

    // Mozilla/Safari/non-IE
    if (window.XMLHttpRequest) {
        xmlHttpRequest = new XMLHttpRequest();
    }
    // IE
    else if (window.ActiveXObject) {
        xmlHttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlHttpRequest;
}

function doAjax(url, method, responseHandler, data) {

    // Set the variables
    url = url || "";
    method = method || "GET";
    async = true;
    data = data || {};
    data.token = window.token;

    
    if(url == "") {
        alert("URL can not be null/blank");
        return false;
    }
    var xmlHttpRequest = getHttpRequestObject();

    // if AJAX supported
    if (xmlHttpRequest) {
        xmlHttpRequest.open(method, url, async);
        // set request header (optional if GET method is used)
        if(method == "POST") {
            xmlHttpRequest.setRequestHeader("Content-Type", "application/json");
        }
        // Assign (or define) response-handler/callback when ReadyState is changed.
        xmlHttpRequest.onreadystatechange = responseHandler;
        // Send data
        xmlHttpRequest.send(JSON.stringify(data));
        
    }
    else {
        alert("Your browser does not support AJAX! Please use a browser with AJAX support.");
    }
}