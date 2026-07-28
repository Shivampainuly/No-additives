// 1. Smooth Scrolling for the Hero Button
const ctaBtn = document.getElementById('scroll-to-map');
const locatorSection = document.getElementById('locator');

ctaBtn.addEventListener('click', (e) => {
    e.preventDefault();
    locatorSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
});

// 2. Scroll Animation (Fade In Elements as they enter the screen)
// This gives the site that premium, expensive feel without heavy code.
const fadeElements = document.querySelectorAll('.fade-in');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Triggers when 15% of the element is visible
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Stop observing once faded in
        }
    });
}, observerOptions);

fadeElements.forEach(element => {
    observer.observe(element);
});