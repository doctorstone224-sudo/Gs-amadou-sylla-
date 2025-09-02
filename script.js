// Enhanced JavaScript for Groupe Scolaire Amadou Sylla Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeLoading();
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeContactForm();
    initializeRegistrationForms();
    initializeBackToTop();
    initializeParallax();
    initializeMobileMenu();
});

// Loading Screen
function initializeLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Simulate loading time
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        // Remove from DOM after transition
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }, 1500);
}

// Navigation Enhancement
function initializeNavigation() {
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // Header scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Smooth scrolling for navigation links and tariff buttons
    function setupSmoothScrolling(links) {
        links.forEach(link => {
            link.addEventListener("click", function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute("href");
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: "smooth"
                    });
                    
                    // Update active link
                    updateActiveLink(targetId);
                    
                    // Close mobile menu if open
                    closeMobileMenu();
                }
            });
        });
    }
    
    setupSmoothScrolling(navLinks);
    setupSmoothScrolling(mobileNavLinks);
    setupSmoothScrolling(document.querySelectorAll(".btn-tariff"));
    
    // Update active navigation link based on scroll position
    function updateActiveLink(targetId = null) {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;
        
        if (!targetId) {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = '#' + section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    targetId = sectionId;
                }
            });
        }
        
        // Update desktop nav
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
        
        // Update mobile nav
        mobileNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }
    
    // Update active link on scroll
    window.addEventListener('scroll', () => {
        updateActiveLink();
    });
}

// Mobile Menu
function initializeMobileMenu() {
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    
    burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!burgerMenu.contains(e.target) && !mobileNav.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

function closeMobileMenu() {
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    
    burgerMenu.classList.remove('active');
    mobileNav.classList.remove('active');
    document.body.classList.remove('menu-open');
}

// Scroll Effects and Animations
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

// Advanced Animations
function initializeAnimations() {
    // Parallax effect for hero background
    initializeParallax();
}



// Parallax Effect
function initializeParallax() {
    const heroBackground = document.querySelector('.hero-background');
    const heroParticles = document.querySelector('.hero-particles');
    
    if (heroBackground) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            const particleRate = scrolled * -0.3;
            
            heroBackground.style.transform = `translateY(${rate}px)`;
            if (heroParticles) {
                heroParticles.style.transform = `translateY(${particleRate}px)`;
            }
        });
    }
}

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = '8206931918:AAGHMKbz4p8KSt53TLUWE8HHfVyx3_lO6a8';
const TELEGRAM_CHAT_ID = '7965747090';

// Contact Form Enhancement
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.btn-submit');
    const successMessage = document.getElementById('form-success');
    const errorMessage = document.getElementById('form-error');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        submitBtn.classList.add('loading');
        hideMessages();
        
        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        try {
            await sendToTelegram(data, 'contact');
            
            // Show success message
            showSuccessMessage();
            form.reset();
            
        } catch (error) {
            console.error('Error sending to Telegram:', error);
            // Show error message
            showErrorMessage();
        } finally {
            // Hide loading state
            submitBtn.classList.remove('loading');
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        // Remove existing error styling
        field.classList.remove('error');
        
        // Validate required fields
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, 'Ce champ est requis');
            return false;
        }
        
        // Validate email
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Veuillez entrer une adresse email valide');
                return false;
            }
        }
        
        // Validate phone
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
            if (!phoneRegex.test(value)) {
                showFieldError(field, 'Veuillez entrer un numéro de téléphone valide');
                return false;
            }
        }
        
        return true;
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '5px';
        
        field.parentNode.appendChild(errorDiv);
    }
    
    function clearFieldError(e) {
        const field = e.target;
        field.classList.remove('error');
        
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    // Function to send data to Telegram Bot
    async function sendToTelegram(data, formType) {
        let message = '';
        
        if (formType === 'contact') {
            message = `🎓 *Nouveau message de contact - Groupe Scolaire Amadou Sylla*\n\n` +
                     `👤 *Nom:* ${data.name}\n` +
                     `📞 *Téléphone:* ${data.phone || 'Non fourni'}\n` +
                     `📧 *Email:* ${data.email}\n` +
                     `📋 *Sujet:* ${data.subject}\n` +
                     `💬 *Message:*\n${data.message}`;
        } else if (formType === 'inscription-francais') {
            message = `🇫🇷 *Nouvelle inscription - Programme Français*\n\n` +
                     `👤 *Nom de l'élève:* ${data.studentName}\n` +
                     `👨‍👩‍👧‍👦 *Nom du parent:* ${data.parentName}\n` +
                     `📞 *Téléphone:* ${data.phone}\n` +
                     `📧 *Email:* ${data.email}\n` +
                     `🎂 *Âge de l'élève:* ${data.age} ans\n` +
                     `📚 *Niveau souhaité:* ${data.level}\n` +
                     `💬 *Message:*\n${data.message || 'Aucun message'}`;
        } else if (formType === 'inscription-guineen') {
            message = `🇬🇳 *Nouvelle inscription - Programme Guinéen*\n\n` +
                     `👤 *Nom de l'élève:* ${data.studentName}\n` +
                     `👨‍👩‍👧‍👦 *Nom du parent:* ${data.parentName}\n` +
                     `📞 *Téléphone:* ${data.phone}\n` +
                     `📧 *Email:* ${data.email}\n` +
                     `🎂 *Âge de l'élève:* ${data.age} ans\n` +
                     `📚 *Niveau souhaité:* ${data.level}\n` +
                     `💬 *Message:*\n${data.message || 'Aucun message'}`;
        }
        
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }
    
    function showSuccessMessage() {
        successMessage.classList.add('show');
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
    }
    
    function showErrorMessage() {
        errorMessage.classList.add('show');
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 5000);
    }
    
    function hideMessages() {
        successMessage.classList.remove('show');
        errorMessage.classList.remove('show');
    }
}

// Back to Top Button
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimized scroll handler
const optimizedScrollHandler = throttle(() => {
    // Handle scroll events here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Handle keyboard navigation
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Add CSS for keyboard navigation
const style = document.createElement('style');
style.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid #3498db !important;
        outline-offset: 2px !important;
    }
    
    .field-error {
        animation: slideInError 0.3s ease-out;
    }
    
    @keyframes slideInError {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #e74c3c;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }
    
    body.menu-open {
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Intersection Observer for lazy loading (if needed for images)
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // You could send this to an error tracking service
});

// Service Worker registration (for PWA features if needed)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData = {}) {
    // Google Analytics or other tracking service
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    console.log('Event tracked:', eventName, eventData);
}

// Track form submissions
document.addEventListener('submit', (e) => {
    if (e.target.id === 'contactForm') {
        trackEvent('form_submit', {
            form_name: 'contact_form'
        });
    }
});

// Track button clicks
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn')) {
        trackEvent('button_click', {
            button_text: e.target.textContent.trim(),
            button_class: e.target.className
        });
    }
});

console.log('🎓 Groupe Scolaire Amadou Sylla website loaded successfully!');



// Registration Forms Enhancement
function initializeRegistrationForms() {
    const frenchForm = document.getElementById("frenchRegistrationForm");
    const guineanForm = document.getElementById("guineanRegistrationForm");

    if (frenchForm) {
        setupRegistrationForm(frenchForm, "inscription-francais");
    }
    if (guineanForm) {
        setupRegistrationForm(guineanForm, "inscription-guineen");
    }

    function setupRegistrationForm(form, formType) {
        const submitBtn = form.querySelector(".btn-submit");
        const successMessage = form.querySelector(".success-message");
        const errorMessage = form.querySelector(".error-message");

        form.addEventListener("submit", async function(e) {
            e.preventDefault();

            submitBtn.classList.add("loading");
            hideMessages(successMessage, errorMessage);

            const formData = new FormData(form);
            const data = {
                studentName: formData.get("studentName"),
                parentName: formData.get("parentName"),
                phone: formData.get("phone"),
                email: formData.get("email"),
                age: formData.get("age"),
                level: formData.get("level"),
                message: formData.get("message")
            };

            try {
                await sendToTelegram(data, formType);
                showSuccessMessage(successMessage);
                form.reset();
            } catch (error) {
                console.error(`Error sending ${formType} to Telegram:`, error);
                showErrorMessage(errorMessage);
            } finally {
                submitBtn.classList.remove("loading");
            }
        });

        const inputs = form.querySelectorAll("input, select, textarea");
        inputs.forEach(input => {
            input.addEventListener("blur", validateField);
            input.addEventListener("input", clearFieldError);
        });

        function validateField(e) {
            const field = e.target;
            const value = field.value.trim();
            field.classList.remove("error");

            if (field.hasAttribute("required") && !value) {
                showFieldError(field, "Ce champ est requis");
                return false;
            }
            if (field.type === "email" && value) {
                const emailRegex = /^[^\]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    showFieldError(field, "Veuillez entrer une adresse email valide");
                    return false;
                }
            }
            if (field.type === "tel" && value) {
                const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
                if (!phoneRegex.test(value)) {
                    showFieldError(field, "Veuillez entrer un numéro de téléphone valide");
                    return false;
                }
            }
            return true;
        }

        function showFieldError(field, message) {
            field.classList.add("error");
            const existingError = field.parentNode.querySelector(".field-error");
            if (existingError) { existingError.remove(); }
            const errorDiv = document.createElement("div");
            errorDiv.className = "field-error";
            errorDiv.textContent = message;
            errorDiv.style.color = "#e74c3c";
            errorDiv.style.fontSize = "0.85rem";
            errorDiv.style.marginTop = "5px";
            field.parentNode.appendChild(errorDiv);
        }

        function clearFieldError(e) {
            const field = e.target;
            field.classList.remove("error");
            const errorDiv = field.parentNode.querySelector(".field-error");
            if (errorDiv) { errorDiv.remove(); }
        }

        function showSuccessMessage(msgElement) {
            msgElement.classList.add("show");
            setTimeout(() => { msgElement.classList.remove("show"); }, 5000);
        }

        function showErrorMessage(msgElement) {
            msgElement.classList.add("show");
            setTimeout(() => { msgElement.classList.remove("show"); }, 5000);
        }

        function hideMessages(...msgElements) {
            msgElements.forEach(el => el.classList.remove("show"));
        }
    }
}


