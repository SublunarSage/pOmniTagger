function openDirectoryHandler(elementID) {
    return function () {
        if (this.readyState == 4 && this.status == 200 && this.responseText) {
            var response = JSON.parse(this.responseText);
            document.getElementById(elementID).innerHTML = response.directory;
    
        }
    }
}

function openDirectory(elementID) {
    doAjax("/choose/directory", "POST", openDirectoryHandler(elementID));
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