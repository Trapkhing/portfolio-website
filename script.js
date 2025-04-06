// Add this to your existing script.js
document.addEventListener('DOMContentLoaded', function() {
    // Highlight current page in navigation
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Rest of your existing code...
});


// DOM Elements
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Theme Detection
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const currentTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');

// Apply Initial Theme
if (currentTheme === 'dark') {
    body.setAttribute('data-theme', 'dark');
    darkModeToggle.textContent = '☀️ Light';
}

// Theme Toggle
darkModeToggle.addEventListener('click', () => {
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        darkModeToggle.textContent = '🌙 Dark';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        darkModeToggle.textContent = '☀️ Light';
        localStorage.setItem('theme', 'dark');
    }
});

// Social Media Configuration
const socialLinks = {
    instagram: {
        buttonId: 'instagramButton',
        url: 'https://instagram.com/trap_khing'
    },
    twitter: {
        buttonId: 'twitterButton',
        url: 'https://twitter.com/trapkhing2'
    },
    email: {
        buttonId: 'emailButton',
        action: () => {
            const email = 'kumievans466@gmail.com';
            const subject = 'Website Inquiry';
            const body = 'Hello Evans,\n\nI wanted to reach out about...';
            window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
        }
    }
};

// Initialize Social Buttons
Object.values(socialLinks).forEach(({ buttonId, url, action }) => {
    const button = document.getElementById(buttonId);
    if (button) {
        button.addEventListener('click', () => {
            if (action) {
                action();
            } else if (url) {
                window.open(url, '_blank');
            }
        });
    }
});

// Form Validation
function validateForm() {
    let isValid = true;
    const form = document.getElementById('contactForm');
    
    // Validate Name
    const nameInput = form.querySelector('#name');
    const nameError = nameInput.nextElementSibling;
    if (nameInput.value.length < 2) {
        nameError.textContent = 'Name must be at least 2 characters';
        isValid = false;
    } else {
        nameError.textContent = '';
    }
    
    // Validate Email
    const emailInput = form.querySelector('#email');
    const emailError = emailInput.nextElementSibling;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        emailError.textContent = 'Please enter a valid email address';
        isValid = false;
    } else {
        emailError.textContent = '';
    }
    
    // Validate Message
    const messageInput = form.querySelector('#message');
    const messageError = messageInput.nextElementSibling;
    if (messageInput.value.length < 10) {
        messageError.textContent = 'Message must be at least 10 characters';
        isValid = false;
    } else {
        messageError.textContent = '';
    }
    
    return isValid;
}

// Form Submission with Loading State
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const spinner = form.querySelector('.spinner');
    const statusEl = form.querySelector('.form-status');
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').classList.add('hidden');
    spinner.classList.remove('hidden');
    statusEl.textContent = '';
    statusEl.classList.remove('form-error');
    
    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
            statusEl.textContent = 'Message sent successfully!';
            form.reset();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Form submission failed');
        }
    } catch (error) {
        statusEl.textContent = error.message || 'Oops! Something went wrong. Please try again.';
        statusEl.classList.add('form-error');
        console.error('Form submission error:', error);
    } finally {
        // Reset UI
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').classList.remove('hidden');
        spinner.classList.add('hidden');
        
        // Clear status after 5s
        setTimeout(() => {
            statusEl.textContent = '';
            statusEl.classList.remove('form-error');
        }, 5000);
    }
});

// Initialize Modal
function initModal() {
    const profileImage = document.getElementById('profileImage');
    const modal = document.getElementById('imageModal');
    const expandedImage = document.getElementById('expandedImage');
    const closeModal = document.querySelector('.close-modal');
    const modalSpinner = document.querySelector('.modal-loading-spinner');

    if (!profileImage || !modal || !expandedImage || !closeModal) {
        console.error('One or more modal elements are missing');
        return;
    }

    // Click handler for profile image
    profileImage.addEventListener('click', function() {
        modal.style.display = "block";
        modalSpinner.style.display = 'block';
        expandedImage.classList.remove('loaded');
        
        // Load image in the background
        const img = new Image();
        img.src = this.src;
        img.onload = () => {
            expandedImage.src = this.src;
            expandedImage.classList.add('loaded');
            modalSpinner.style.display = 'none';
        };
        img.onerror = () => {
            modalSpinner.style.display = 'none';
            console.error('Failed to load image');
        };
        
        document.body.style.overflow = 'hidden';
    });

    // Close modal when X is clicked
    closeModal.addEventListener('click', function() {
        modal.style.display = "none";
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside image
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    });

    // Close with ESC key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    });
}

// Animate Skills on Scroll
function animateSkillsOnScroll() {
    const skills = document.querySelectorAll('.skill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                const skillLevel = entry.target.querySelector('.skill-level');
                if (skillLevel) {
                    const width = entry.target.dataset.skill === 'design' ? '80%' : '20%';
                    setTimeout(() => {
                        skillLevel.style.width = width;
                    }, 200);
                }
            }
        });
    }, { threshold: 0.5 });
    
    skills.forEach(skill => {
        observer.observe(skill);
    });
}

// Check Font Awesome Load
function checkFontAwesome() {
    const testIcon = document.createElement('i');
    testIcon.className = 'fa fa-check';
    document.body.appendChild(testIcon);
    
    const faLoaded = window.getComputedStyle(testIcon).fontFamily.includes('Awesome');
    document.body.removeChild(testIcon);
    
    if (!faLoaded) {
        console.log('Font Awesome not loaded - using SVG fallback');
        const xIcons = document.querySelectorAll('.fa-x-twitter');
        xIcons.forEach(icon => {
            icon.style.display = 'none';
            icon.insertAdjacentHTML('afterend', 
                `<svg class="x-icon-fallback" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>`);
            icon.nextElementSibling.style.display = 'inline-block';
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initModal();
    animateSkillsOnScroll();
    checkFontAwesome();
});