
document.addEventListener('DOMContentLoaded', function() {
    
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    animateSkills();
    initModal();
    checkFontAwesome();
});


const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;


const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const currentTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');

if (currentTheme === 'dark') {
    body.setAttribute('data-theme', 'dark');
    darkModeToggle.textContent = '☀️ Light';
}


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


function validateForm() {
    let isValid = true;
    const form = document.getElementById('contactForm');
    
    
    const nameInput = form.querySelector('#name');
    const nameError = nameInput.nextElementSibling;
    if (nameInput.value.length < 3) {
        nameError.textContent = 'Name must be at least 3 characters';
        isValid = false;
    } else {
        nameError.textContent = '';
    }
    
    
    const emailInput = form.querySelector('#email');
    const emailError = emailInput.nextElementSibling;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        emailError.textContent = 'Please enter a valid email address';
        isValid = false;
    } else {
        emailError.textContent = '';
    }
    
    
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


document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const spinner = form.querySelector('.spinner');
    const statusEl = form.querySelector('.form-status');
    

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
        
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').classList.remove('hidden');
        spinner.classList.add('hidden');
        
        
        setTimeout(() => {
            statusEl.textContent = '';
            statusEl.classList.remove('form-error');
        }, 5000);
    }
});


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

    
    profileImage.addEventListener('click', function() {
        modal.style.display = "block";
        modalSpinner.style.display = 'block';
        expandedImage.classList.remove('loaded');
        
    
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


    closeModal.addEventListener('click', function() {
        modal.style.display = "none";
        document.body.style.overflow = 'auto';
    });


    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    });


    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    });
}


function animateSkills() {
    const skills = document.querySelectorAll('.skill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                
                const skillLevel = entry.target.querySelector('.skill-level');
                if (skillLevel) {

                    let width;
                    switch(entry.target.dataset.skill) {
                        case 'design': width = '40%'; break;
                        case 'frontend': width = '80%'; break;
                        case 'backend': width = '60%'; break;
                        default: width = '50%';
                    }
                    

                    setTimeout(() => {
                        skillLevel.style.width = width;
                    }, 300);
                }
            }
        });
    }, { threshold: 0.5 });
    
    skills.forEach(skill => {
        observer.observe(skill);
    });
}



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