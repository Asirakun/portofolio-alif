// ==========================================
// Theme Toggle (Dark/Light Mode)
// ==========================================
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// Check for saved theme preference or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

function updateThemeIcon(theme) {
    if (themeIcon) {
        if (theme === 'light') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

// ==========================================
// DOM Elements
// ==========================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navLinkItems = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('back-to-top');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const skillBars = document.querySelectorAll('.level-bar');
const contactForm = document.getElementById('contact-form');

// ==========================================
// Typed Text Animation
// ==========================================
const typedTextElement = document.getElementById('typed-text');
const textArray = ['Full Stack Developer', 'UI/UX Designer', 'Mobile Developer', 'Problem Solver'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeText() {
    const currentText = textArray[textIndex];
    
    if (isDeleting) {
        typedTextElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typedTextElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % textArray.length;
        typingSpeed = 500; // Pause before new word
    }
    
    setTimeout(typeText, typingSpeed);
}

// Start typing animation
typeText();

// ==========================================
// Optimized Scroll Handler (Combined)
// ==========================================
let ticking = false;

function onScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            
            // Navbar scroll effect
            if (scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Update active nav link
            const sections = document.querySelectorAll('section[id]');
            const scrollPosition = scrollY + (window.innerHeight / 3);
            
            let currentSection = 'home'; // Default to home
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = sectionId;
                }
            });
            
            // Remove active from all, then add to current
            navLinkItems.forEach(link => {
                link.classList.remove('active');
            });
            
            const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
            
            // Scroll progress bar
            if (scrollProgress) {
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = (scrollY / docHeight) * 100;
                scrollProgress.style.width = scrollPercent + '%';
            }
            
            // Back to top button
            if (scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
            
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('load', onScroll);

// ==========================================
// Mobile Navigation
// ==========================================
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile nav when clicking on a link
navLinkItems.forEach(link => {
    link.addEventListener('click', (e) => {
        // Remove active from all links
        navLinkItems.forEach(l => l.classList.remove('active'));
        // Add active to clicked link
        link.classList.add('active');
        
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ==========================================
// Counter Animation
// ==========================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when stats section is visible
const statsContainer = document.querySelector('.stats-container');
let counterAnimated = false;

if (statsContainer) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counterAnimated) {
                counterAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });
    
    counterObserver.observe(statsContainer);
}

// ==========================================
// Project Filter
// ==========================================
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || filter === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ==========================================
// Contact Form Handling - Moved to firebase.js
// ==========================================

// ==========================================
// Smooth Scroll for Anchor Links
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// Intersection Observer for Animations
// ==========================================
const observerOptions = {
    root: null,
    rootMargin: '50px 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.skill-card, .project-card, .service-card, .testimonial-card').forEach(el => {
    observer.observe(el);
});

// ==========================================
// Skill Bars Animation - Per Category
// ==========================================
// Reset all skill bars to 0 on page load
document.querySelectorAll('.level-bar').forEach(bar => {
    bar.style.width = '0%';
});

// Observe each skills category separately
document.querySelectorAll('.skills-category').forEach(category => {
    const categoryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                
                // Get all level bars within this category
                const bars = entry.target.querySelectorAll('.level-bar');
                
                // Animate bars with stagger effect
                setTimeout(() => {
                    bars.forEach((bar, index) => {
                        const level = bar.getAttribute('data-level');
                        setTimeout(() => {
                            bar.style.width = `${level}%`;
                        }, index * 100);
                    });
                }, 150);
                
                categoryObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    categoryObserver.observe(category);
});

// ==========================================
// Parallax Effect for Hero Section (Optimized)
// ==========================================
const hero = document.querySelector('.hero');
let parallaxTicking = false;

function updateParallax() {
    if (hero && window.scrollY < window.innerHeight) {
        hero.style.backgroundPositionY = `${window.scrollY * 0.4}px`;
    }
    parallaxTicking = false;
}

window.addEventListener('scroll', () => {
    if (!parallaxTicking) {
        requestAnimationFrame(updateParallax);
        parallaxTicking = true;
    }
}, { passive: true });

// ==========================================
// Particle Effect (Original with rotate)
// ==========================================
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 5 + 2}px;
            height: ${Math.random() * 5 + 2}px;
            background: rgba(99, 102, 241, ${Math.random() * 0.5 + 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        particlesContainer.appendChild(particle);
    }
    
    // Add particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFloat {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-1000px) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize particles
createParticles();

// ==========================================
// Tilt Effect for Project Cards
// ==========================================
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'transform 0.1s ease';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.3s ease';
    });
});

// ==========================================
// Testimonial Slider (Auto-scroll)
// ==========================================
let currentTestimonial = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialDotsContainer = document.getElementById('testimonial-dots');

// Create dots
if (testimonialCards.length > 0 && testimonialDotsContainer) {
    testimonialCards.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = `testimonial-dot ${index === 0 ? 'active' : ''}`;
        dot.style.cssText = `
            width: 10px;
            height: 10px;
            background: ${index === 0 ? 'var(--primary)' : 'var(--gray-600)'};
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        dot.addEventListener('click', () => goToTestimonial(index));
        testimonialDotsContainer.appendChild(dot);
    });
}

function updateTestimonialDots() {
    const dots = document.querySelectorAll('.testimonial-dot');
    dots.forEach((dot, index) => {
        dot.style.background = index === currentTestimonial ? 'var(--primary)' : 'var(--gray-600)';
    });
}

function goToTestimonial(index) {
    currentTestimonial = index;
    updateTestimonialDots();
}

// ==========================================
// Preloader (optional)
// ==========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger initial scroll handler
    onScroll();
});

// ==========================================
// Console Easter Egg
// ==========================================
console.log('%c🚀 Welcome to my portfolio!', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%cBuilt with ❤️ by Alif Siky Ridhofa', 'font-size: 14px; color: #9ca3af;');
console.log('%cInterested in working together? Contact me!', 'font-size: 12px; color: #10b981;');

// ==========================================
// Scroll Animations (Intersection Observer)
// ==========================================
const scrollObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            // Unobserve after animation (optional - remove if you want repeat)
            // animationObserver.unobserve(entry.target);
        }
    });
}, scrollObserverOptions);

// Observe all elements with data-animate attribute
document.querySelectorAll('[data-animate]').forEach(el => {
    animationObserver.observe(el);
});

// Observe stagger children
document.querySelectorAll('.stagger-children').forEach(el => {
    animationObserver.observe(el);
});

// ==========================================
// Tilt Effect for Cards (Disabled for performance)
// ==========================================
// Tilt effect removed for better performance

// ==========================================
// Preloader
// ==========================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.classList.add('hero-loaded');
        }, 500);
    } else {
        document.body.classList.add('hero-loaded');
    }
});

// ==========================================
// Console Easter Egg
// ==========================================
console.log('%c🚀 Welcome to my portfolio!', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%cBuilt with ❤️ by Alif Siky Ridhofa', 'font-size: 14px; color: #9ca3af;');
console.log('%cInterested in working together? Contact me!', 'font-size: 12px; color: #10b981;');