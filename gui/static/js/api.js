

const getHttpRequestObject = () => {
    if (window.XMLHttpRequest) { // Mozilla/Safari/non-IE
        return new XMLHttpRequest();
    } else if (window.ActiveXObject) { // IE
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
    throw new Error("AJAX is not supported by your browser");
}

const doAjax = (url, method = "GET", data = {}) => {
    return new Promise((resolve, reject) => {
        if (!url) {
            reject(new Error("URL cannot be null/blank"));
            return;
        }

        const xhr = getHttpRequestObject();

        xhr.open(method, url, true);

        if (method === "POST") {
            xhr.setRequestHeader("Content-Type", "application/json");
        }

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(new Error(`HTTP error! status: ${xhr.status}`));
                }
            }
        };

        // Add token to data
        data.token = window.token;

        xhr.send(JSON.stringify(data));
    });
};

let currentDirectory = null;
let batchSize = 1; // Temporary value (server sets this)

const openDirectory = async (elementId) => {
    try {
        const response = await doAjax("/choose/directory", "POST");
        if (response.status === 'success') {
            currentDirectory = response.directory;
            batchSize = response.batch_size;  // Update batch size from server
            document.getElementById(elementId).innerHTML = currentDirectory;
            console.log("Directory selected:", currentDirectory);
            console.log("Total files:", response.total_files);
            console.log("Batch size:", batchSize);
            await processFileBatches();
        } else {
            console.log("Directory selection cancelled or failed");
        }
    } catch (error) {
        console.error("Error opening directory:", error);
    }
};

const processFileBatches = async () => {
    let hasMore = true;
    while (hasMore) {
        try {
            const batchResponse = await doAjax("/get_next_batch", "POST", {
                directory: currentDirectory
            });
            if (batchResponse.status === 'success') {
                console.log("Received batch of files:", batchResponse.files);
                // Process the batch of files here
                //updateUIWithFiles(batchResponse.files);
                hasMore = batchResponse.has_more;
            } else {
                console.error("Error getting next batch:", batchResponse);
                hasMore = false;
            }
        } catch (error) {
            console.error("Error processing file batch:", error);
            hasMore = false;
        }
    }
    console.log("Finished processing all file batches");
};


export { doAjax, openDirectory };