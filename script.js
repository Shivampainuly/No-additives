// --- 1. SMOOTH FADE-IN ANIMATIONS ---
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// --- 2. SMOOTH SCROLL TO SHOP ---
const shopButton = document.getElementById('scroll-to-shop');
const shopSection = document.getElementById('shop-section');

if (shopButton && shopSection) {
    shopButton.addEventListener('click', () => {
        shopSection.scrollIntoView({ behavior: 'smooth' });
    });
}

// --- 3. TRAILING CURSOR ---
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

window.addEventListener('mousemove', (e) => {
    if(cursor && follower) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        follower.style.left = e.clientX + 'px';
        follower.style.top = e.clientY + 'px';
    }
});

const interactiveElements = document.querySelectorAll('button, select, .product-card');

interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => follower.classList.add('active'));
    el.addEventListener('mouseleave', () => follower.classList.remove('active'));
});

// --- 4. MAGNETIC BUTTONS (Applies to Hero & Add to Cart) ---
const magneticButtons = document.querySelectorAll('.cta-btn');

magneticButtons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const h = rect.width / 2;
        const v = rect.height / 2;
        const x = e.clientX - rect.left - h;
        const y = e.clientY - rect.top - v;
        
        // The pull weight. 0.3 gives a heavy, premium resistance.
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});