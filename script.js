
let currentIndex = 0;
const carousel = document.getElementById('carousel');
const cards = document.querySelectorAll('.book-card');
const dotsContainer = document.getElementById('dots');

let dimensions = {
    cardWidth: 0,        
    containerWidth: 0,  
    totalWidth: 0,       
    maxOffset: 0,      
    maxSlides: 0        
};

function calculateDimensions() {
    if (cards.length >= 2) {
        dimensions.cardWidth = cards[1].offsetLeft - cards[0].offsetLeft;
    } else {
        dimensions.cardWidth = cards[0]?.offsetWidth || 280;
    }
    
    dimensions.containerWidth = carousel.parentElement.offsetWidth;
    
    const lastCard = cards[cards.length - 1];
    dimensions.totalWidth = lastCard.offsetLeft + lastCard.offsetWidth;
    
    dimensions.maxOffset = Math.max(0, dimensions.totalWidth - dimensions.containerWidth);
    
    if (dimensions.totalWidth <= dimensions.containerWidth) {
        dimensions.maxSlides = 0;
    } else {
        const normalSlides = Math.ceil(dimensions.maxOffset / dimensions.cardWidth);
        
        const lastSlideMovement = dimensions.maxOffset - ((normalSlides - 1) * dimensions.cardWidth);

        const threshold = dimensions.cardWidth * 0.3;
        
        if (lastSlideMovement < threshold && normalSlides > 1) {
            dimensions.maxSlides = normalSlides - 1;
        } else {
            dimensions.maxSlides = normalSlides;
        }
    }
}

function createDots() {
    dotsContainer.innerHTML = '';
    
    if (dimensions.maxSlides === 0) return;
    
    for (let i = 0; i <= dimensions.maxSlides; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.onclick = () => goToSlide(i);
        dotsContainer.appendChild(dot);
    }
}

function moveCarousel(direction) {
    if (dimensions.maxSlides === 0) return;
    
    currentIndex += direction;
    
    if (currentIndex < 0) {
        currentIndex = dimensions.maxSlides;
    }
    else if (currentIndex > dimensions.maxSlides) {
        currentIndex = 0;
    }
    
    updateCarousel();
}

function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
}

function updateCarousel() {
    if (currentIndex > dimensions.maxSlides) {
        currentIndex = dimensions.maxSlides;
    }
    
    let offset;
    
    if (currentIndex === dimensions.maxSlides) {
        offset = dimensions.maxOffset;
    } else {
        offset = currentIndex * dimensions.cardWidth;
        offset = Math.min(offset, dimensions.maxOffset);
    }
    
    carousel.style.transform = `translateX(-${offset}px)`;
    
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}


calculateDimensions();
createDots();
updateCarousel();

window.addEventListener('resize', () => {
    calculateDimensions();
    createDots();
    updateCarousel();
});