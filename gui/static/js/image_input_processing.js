import { tabModules } from './core.js';
import { openDirectory } from './api.js';

const imageInputProcessing = (() => {
    console.log("Image Input Processing script loaded");

    const onTabAccess = () => {
        console.log("Image Input Processing tab accessed, running necessary updates");

    };

    const onTabExit = () => {
        console.log("Exiting Image Input Processing tab, performing cleanup");
        // Perform any necessary cleanup here
    };

    const initializeTab = () => {
        console.log("Initializing Image Input Processing tab");
        initializeImageSizeSlider();
        initializeDirectoryButton();
        
    };

    const initializeImageSizeSlider = () => {
        const slider = document.getElementById('image-size-slider');
        const sizeValue = document.getElementById('image-size-value');
        const imageGallery = document.querySelector('.image-gallery.grid');

        console.log("Initializing image size slider");

        if (slider && sizeValue && imageGallery) {
            slider.addEventListener('input', function() {
                const size = this.value;
                sizeValue.textContent = size + 'px';
                imageGallery.style.setProperty('--image-size', size + 'px');
            });
            console.log("Slider event listener attached");
        } else {
            console.log("One or more elements not found:", {slider, sizeValue, imageGallery});
        }
    };

    const initializeDirectoryButton = () => {
        const directoryButton = document.getElementById('open-directory-button');
        const directoryContainer = document.getElementById('open-directory-container');

        if (directoryButton && directoryContainer) {
            directoryButton.addEventListener('click', async () => {
                openDirectory(directoryContainer.id, updateGallery, clearGallery);
            });
        }
    };

    const createImageItem = (imagePath, hasCaptionFile) => {
        const fileName = imagePath.split('/').pop();
        const statusClass = hasCaptionFile ? 'ok' : 'error';
        const statusText = hasCaptionFile ? 'Found an accompanying caption file' : 'No accompanying caption file found';
        
        return `
            <div class="item">
                <div class="status-tip ${statusClass}">
                    <div class="icon">${hasCaptionFile ? '✔' : '✘'}</div>
                    <div class="text">${statusText}</div>
                </div>
                <div class="image">
                    <img src="/image/${encodeURIComponent(imagePath)}" alt="${fileName}">
                </div>
            </div>
        `;
    };

    const updateGallery = (files) => {
        console.log("Gallery update called with files:", files);
        const gallery = document.getElementById('input-image-gallery-grid');
        if (!gallery) {
            console.error("Gallery element not found");
            return;
        }
    
        // Create a document fragment to hold the new items
        const fragment = document.createDocumentFragment();
    
        files.forEach(file => {
            const imagePath = file.path;
            const hasCaptionFile = file.hasCaptionFile;
            const itemHtml = createImageItem(imagePath, hasCaptionFile);
            
            // Create a temporary container to hold the HTML string
            const temp = document.createElement('div');
            temp.innerHTML = itemHtml;

            const img = temp.querySelector('img');
            if (img) {
                img.src = `${img.src}?t=${Date.now()}`;
            }
            
            // Append the new item to the fragment
            fragment.appendChild(temp.firstElementChild);
        });
    
        // Append all new items to the gallery at once
        gallery.appendChild(fragment);
    
        console.log(`Added ${files.length} new items to the gallery`);

    };

    const clearGallery = () => {
        const gallery = document.getElementById('input-image-gallery-grid');
        if (gallery) {
            // Dispose of old image data
            const images = gallery.querySelectorAll('img');
            images.forEach(img => {
                img.src = '';
                img.removeAttribute('src');
            });

            gallery.innerHTML = '';
            console.log("Gallery cleared");
        } else {
            console.error("Gallery element not found");
        }
    };



    return { initializeTab, onTabAccess, onTabExit };
})();

tabModules.imageInputProcessing = imageInputProcessing;
