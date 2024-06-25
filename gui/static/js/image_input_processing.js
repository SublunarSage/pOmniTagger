import { tabModules } from './core.js';

const imageInputProcessing = (() => {
    console.log("Image Input Processing script loaded");

    const onTabAccess = () => {
        console.log("Image Input Processing tab accessed, running necessary updates");
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
            directoryButton.addEventListener('click', () => openDirectory(directoryContainer.id));
        }
    };


    

    return { initializeTab, onTabAccess };
})();

tabModules.imageInputProcessing = imageInputProcessing;
