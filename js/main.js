/**
 * WorkNStay AI - Main JavaScript
 * Core functionality and interactions
 */

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initCounters();
    initFormValidation();
    initTooltips();
    initModals();
    initNotifications();
    initSmoothScroll();
});

/**
 * Navbar Scroll Effect
 */
function initNavbar() {
    const navbar = document.getElementById('mainNav');
    if (!navbar) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
}

/**
 * Mobile Menu
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

    if (!mobileMenuBtn || !mobileMenu) return;

    const openMenu = () => {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    };

    mobileMenuBtn.addEventListener('click', openMenu);
    mobileMenuClose?.addEventListener('click', closeMenu);
    mobileMenuOverlay?.addEventListener('click', closeMenu);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            closeMenu();
        }
    });

    // Close on link click
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

/**
 * Scroll Reveal Animation
 */
function initScrollReveal() {
    const elements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
    
    if (!elements.length) return;

    const revealOnScroll = () => {
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100;
            
            if (isVisible) {
                el.classList.add('revealed');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
}

/**
 * Counter Animation
 */
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    if (!counters.length) return;

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += step;
            if (current < target) {
                el.textContent = formatNumber(Math.floor(current)) + '+';
                requestAnimationFrame(update);
            } else {
                el.textContent = formatNumber(target) + '+';
            }
        };

        update();
    };

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    // Use Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

/**
 * Form Validation
 */
function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                // Form is valid, proceed with submission
                handleFormSubmit(this);
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('is-invalid')) {
                    validateField(input);
                }
            });
        });
    });
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let message = '';

    // Required check
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        message = 'This field is required';
    }

    // Email validation
    if (isValid && type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        }
    }

    // Password validation
    if (isValid && type === 'password' && value && field.dataset.minLength) {
        if (value.length < parseInt(field.dataset.minLength)) {
            isValid = false;
            message = `Password must be at least ${field.dataset.minLength} characters`;
        }
    }

    // Phone validation
    if (isValid && type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-+()]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            message = 'Please enter a valid phone number';
        }
    }

    // Password confirmation
    if (isValid && field.dataset.match) {
        const matchField = document.getElementById(field.dataset.match);
        if (matchField && value !== matchField.value) {
            isValid = false;
            message = 'Passwords do not match';
        }
    }

    // Update UI
    updateFieldStatus(field, isValid, message);

    return isValid;
}

function updateFieldStatus(field, isValid, message) {
    const formGroup = field.closest('.form-group-custom') || field.parentElement;
    let errorEl = formGroup.querySelector('.form-error');

    field.classList.remove('is-valid', 'is-invalid');

    if (isValid) {
        field.classList.add('is-valid');
        if (errorEl) errorEl.remove();
    } else {
        field.classList.add('is-invalid');
        
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'form-error';
            field.parentNode.appendChild(errorEl);
        }
        errorEl.textContent = message;
    }
}

function handleFormSubmit(form) {
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="spinner" style="width: 20px; height: 20px;"></span> Processing...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Show success message
        showToast('Success!', 'Your form has been submitted successfully.', 'success');
        
        // Optionally redirect or reset form
        // form.reset();
    }, 2000);
}

/**
 * Toast Notifications
 */
function showToast(title, message, type = 'info') {
    let container = document.getElementById('toast-container');
    
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
    }

    const icons = {
        success: 'bi-check-circle-fill',
        error: 'bi-x-circle-fill',
        warning: 'bi-exclamation-triangle-fill',
        info: 'bi-info-circle-fill'
    };

    const colors = {
        success: 'var(--success)',
        error: 'var(--error)',
        warning: 'var(--warning)',
        info: 'var(--info)'
    };

    const toast = document.createElement('div');
    toast.className = 'toast-notification fade-scale-in';
    toast.style.cssText = `
        background: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        display: flex;
        align-items: flex-start;
        gap: 12px;
        min-width: 300px;
        max-width: 400px;
        border-left: 4px solid ${colors[type]};
    `;

    toast.innerHTML = `
        <i class="bi ${icons[type]}" style="color: ${colors[type]}; font-size: 20px; margin-top: 2px;"></i>
        <div style="flex: 1;">
            <strong style="display: block; margin-bottom: 2px;">${title}</strong>
            <span style="color: var(--gray-600); font-size: 14px;">${message}</span>
        </div>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; cursor: pointer; padding: 0; color: var(--gray-400);">
            <i class="bi bi-x-lg"></i>
        </button>
    `;

    container.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

/**
 * Tooltips
 */
function initTooltips() {
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    
    tooltipTriggers.forEach(trigger => {
        let tooltip = null;

        trigger.addEventListener('mouseenter', () => {
            const text = trigger.dataset.tooltip;
            tooltip = document.createElement('div');
            tooltip.className = 'tooltip-custom tooltip-fade';
            tooltip.textContent = text;
            tooltip.style.cssText = `
                position: absolute;
                background: var(--gray-900);
                color: white;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                z-index: 9999;
                white-space: nowrap;
            `;

            document.body.appendChild(tooltip);

            const rect = trigger.getBoundingClientRect();
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8 + window.scrollY}px`;
            tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
        });

        trigger.addEventListener('mouseleave', () => {
            if (tooltip) {
                tooltip.remove();
                tooltip = null;
            }
        });
    });
}

/**
 * Modal Management
 */
function initModals() {
    // Open modal
    document.querySelectorAll('[data-modal-open]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.dataset.modalOpen;
            const modal = document.getElementById(modalId);
            if (modal) openModal(modal);
        });
    });

    // Close modal
    document.querySelectorAll('[data-modal-close]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modal = trigger.closest('.modal-custom');
            if (modal) closeModal(modal);
        });
    });

    // Close on backdrop click
    document.querySelectorAll('.modal-backdrop-custom').forEach(backdrop => {
        backdrop.addEventListener('click', () => {
            const modal = backdrop.closest('.modal-custom');
            if (modal) closeModal(modal);
        });
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal-custom.show');
            if (openModal) closeModal(openModal);
        }
    });
}

function openModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

/**
 * Notification Dropdown
 */
function initNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.getElementById('notificationDropdown');

    if (!notificationBtn || !notificationDropdown) return;

    notificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!notificationDropdown.contains(e.target)) {
            notificationDropdown.classList.remove('show');
        }
    });
}

/**
 * Smooth Scroll
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Password Toggle
 */
function togglePassword(buttonEl) {
    const input = buttonEl.parentElement.querySelector('input');
    const icon = buttonEl.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    }
}

/**
 * Tab Switching
 */
function initTabs() {
    const tabContainers = document.querySelectorAll('.tabs-container');
    
    tabContainers.forEach(container => {
        const tabs = container.querySelectorAll('.tab-item');
        const panels = container.querySelectorAll('.tab-panel');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetId = tab.dataset.tab;

                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Show target panel
                panels.forEach(panel => {
                    panel.classList.remove('active');
                    if (panel.id === targetId) {
                        panel.classList.add('active');
                    }
                });
            });
        });
    });
}

/**
 * Filter Functionality
 */
function initFilters() {
    const filterForm = document.getElementById('filterForm');
    if (!filterForm) return;

    const filters = filterForm.querySelectorAll('input, select');
    
    filters.forEach(filter => {
        filter.addEventListener('change', () => {
            applyFilters();
        });
    });
}

function applyFilters() {
    // Collect filter values
    const filters = {};
    document.querySelectorAll('#filterForm input:checked, #filterForm select').forEach(el => {
        const name = el.name;
        const value = el.value;
        
        if (el.type === 'checkbox') {
            if (!filters[name]) filters[name] = [];
            filters[name].push(value);
        } else {
            filters[name] = value;
        }
    });

    console.log('Applied filters:', filters);
    // In a real app, this would filter the displayed items or make an API call
}

/**
 * Search Functionality
 */
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput) return;

    let debounceTimer;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();

        if (query.length < 2) {
            if (searchResults) searchResults.innerHTML = '';
            return;
        }

        debounceTimer = setTimeout(() => {
            performSearch(query);
        }, 300);
    });
}

function performSearch(query) {
    console.log('Searching for:', query);
    // In a real app, this would make an API call and display results
}

/**
 * Favorite/Bookmark Toggle
 */
function toggleFavorite(button) {
    const icon = button.querySelector('i');
    const isFavorited = button.classList.contains('favorited');

    if (isFavorited) {
        button.classList.remove('favorited');
        icon.classList.remove('bi-heart-fill');
        icon.classList.add('bi-heart');
        button.style.color = '';
        showToast('Removed', 'Removed from favorites', 'info');
    } else {
        button.classList.add('favorited');
        icon.classList.remove('bi-heart');
        icon.classList.add('bi-heart-fill');
        button.style.color = 'var(--error)';
        showToast('Saved', 'Added to favorites', 'success');
    }
}

/**
 * Progress Ring Animation
 */
function animateProgressRing(element, percentage) {
    const circumference = 2 * Math.PI * 45; // radius = 45
    const offset = circumference - (percentage / 100) * circumference;
    
    element.style.strokeDasharray = circumference;
    element.style.strokeDashoffset = circumference;
    
    setTimeout(() => {
        element.style.transition = 'stroke-dashoffset 1s ease';
        element.style.strokeDashoffset = offset;
    }, 100);
}

/**
 * Copy to Clipboard
 */
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="bi bi-check"></i> Copied!';
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
    });
}

/**
 * Role Selection (Signup)
 */
function selectRole(element) {
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => card.classList.remove('selected'));
    element.classList.add('selected');
    
    const roleInput = document.getElementById('selectedRole');
    if (roleInput) {
        roleInput.value = element.dataset.role;
    }
}

/**
 * File Upload Preview
 */
function handleFileUpload(input) {
    const preview = document.getElementById(input.dataset.preview);
    if (!preview) return;

    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

/**
 * Sidebar Toggle (Dashboard)
 */
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

/**
 * Match Score Visualization
 */
function initMatchScores() {
    const matchCircles = document.querySelectorAll('.match-score-circle');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const score = entry.target.dataset.score || 0;
                entry.target.style.setProperty('--score', `${score}%`);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    matchCircles.forEach(circle => observer.observe(circle));
}

// Initialize additional features when needed
document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    initFilters();
    initSearch();
    initMatchScores();
});

// Profile Data Management
let profileData = {
    personalInfo: {
        fullName: "Muhammad Khan",
        title: "Web Developer Student",
        email: "muhammad.khan@example.com",
        phone: "+92 300 1234567",
        dob: "January 15, 1998",
        address: "123 Main Street, Lahore, Punjab",
        city: "Lahore",
        avatar: "MK",
        verification: "TEVTA Verified"
    },
    stats: {
        applications: 24,
        jobsApplied: 8,
        bookedHostels: 3,
        matchScore: 95
    },
    education: [
        {
            id: 1,
            degree: "DAE Electrical Engineering",
            institution: "Government Technical Institute, Lahore",
            dates: "2022 - 2024",
            description: "Completed DAE in Electrical Engineering with distinction"
        },
        {
            id: 2,
            degree: "Intermediate (Pre-Engineering)",
            institution: "Government College, Lahore",
            dates: "2020 - 2022",
            description: "Completed intermediate in pre-engineering"
        },
        {
            id: 3,
            degree: "Matriculation",
            institution: "Government High School, Lahore",
            dates: "2018 - 2020",
            description: "Completed matriculation with science subjects"
        }
    ],
    skills: [
        { name: "HTML/CSS", level: 90 },
        { name: "JavaScript", level: 85 },
        { name: "React", level: 75 },
        { name: "Node.js", level: 70 },
        { name: "Database Management", level: 80 }
    ],
    experience: [
        {
            id: 1,
            title: "Web Development Intern",
            company: "TechCorp Solutions, Lahore",
            dates: "Jan 2024 - Present",
            description: "Working as a web development intern, building responsive websites and learning modern development practices."
        },
        {
            id: 2,
            title: "Freelance Web Developer",
            company: "Self-employed",
            dates: "Jun 2023 - Dec 2023",
            description: "Developed multiple client websites using HTML, CSS, and JavaScript. Gained experience in responsive design and client communication."
        },
        {
            id: 3,
            title: "Part-time Tutor",
            company: "Lahore Education Center",
            dates: "Jan 2023 - May 2023",
            description: "Taught programming basics to students and helped them with their technical projects."
        }
    ],
    resume: {
        name: "Muhammad_Khan_Resume.pdf",
        uploaded: true
    }
};

// Function to update profile data
function updateProfileData(data) {
    profileData = { ...profileData, ...data };
    saveProfileData();
    return profileData;
}

// Function to get profile data
function getProfileData() {
    return profileData;
}

// Function to save profile data to localStorage
function saveProfileData() {
    localStorage.setItem('profileData', JSON.stringify(profileData));
}

// Function to load profile data from localStorage
function loadProfileData() {
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
        profileData = JSON.parse(savedData);
    }
    return profileData;
}

// Export functions for global use
window.showToast = showToast;
window.togglePassword = togglePassword;
window.toggleFavorite = toggleFavorite;
window.selectRole = selectRole;
window.handleFileUpload = handleFileUpload;
window.toggleSidebar = toggleSidebar;
window.openModal = openModal;
window.closeModal = closeModal;
window.copyToClipboard = copyToClipboard;

// Profile management functions
window.updateProfileData = updateProfileData;
window.getProfileData = getProfileData;
window.saveProfileData = saveProfileData;
window.loadProfileData = loadProfileData;
