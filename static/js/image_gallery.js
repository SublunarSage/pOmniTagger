console.log("Hello World!")

function highlightImage(element) {

    // Remove active class from all image containers
    document.querySelectorAll('.gal-image-container').forEach(container => 
        container.classList.remove('active')
    );

    // Add active class to the clicked image container
    element.classList.add('active');


    return [element.querySelector('.image img').src, element.querySelector('.gal-tags').textContent];
};

document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.gal-image-container').forEach(container => {
        container.addEventListener('click', () => {
            console.log("Image clicked");
            const [imageUrl, tags] = highlightImage(container);
            return [imageUrl, tags];
        });
    });
});