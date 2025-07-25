console.log('farmers.js loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded');
    
    // Test if toggleSidebar is accessible
    console.log('toggleSidebar function available:', typeof window.toggleSidebar);
    
    // Initialize active navigation
    setActiveNavigation();
    
    // Form validation and enhancement
    initializeForms();
    
    // Table interactions
    initializeTables();
    
    // Card animations
    initializeAnimations();
    
    // Auto-calculate total amount in order forms
    initializeOrderCalculations();
    
    // Restore sidebar state
    if (window.localStorage && localStorage.getItem('sidebarHidden') === '1') {
        document.body.classList.add('sidebar-hidden');
    }
    
    // Sidebar toggle is handled by onclick attribute
    // No need for additional event listener
});

function toggleSidebar() {
    console.log('toggleSidebar function called');
    try {
        document.body.classList.toggle('sidebar-hidden');
        console.log('sidebar-hidden class toggled:', document.body.classList.contains('sidebar-hidden'));
        
        // Optionally persist state
        if (window.localStorage) {
            localStorage.setItem('sidebarHidden', document.body.classList.contains('sidebar-hidden') ? '1' : '');
        }
        
        // Visual feedback for debugging
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        console.log('Sidebar element:', sidebar);
        console.log('Main content element:', mainContent);
        console.log('Sidebar transform:', sidebar ? getComputedStyle(sidebar).transform : 'N/A');
        console.log('Main content margin-left:', mainContent ? getComputedStyle(mainContent).marginLeft : 'N/A');
        
    } catch (error) {
        console.error('Error in toggleSidebar:', error);
    }
}

// Make toggleSidebar globally accessible
window.toggleSidebar = toggleSidebar;

// Set active navigation based on current route
function setActiveNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (href) {
            // Check if current path matches the route
            if (href.includes('farmers.dashboard') && currentPath === '/farmer/dashboard') {
                link.classList.add('active');
            }
            else if (href.includes('harvests') && currentPath.includes('harvests')) {
                link.classList.add('active');
            }
            else if (href.includes('inventory') && currentPath.includes('inventory')) {
                link.classList.add('active');
            }
            else if (href.includes('orders') && currentPath.includes('orders')) {
                link.classList.add('active');
            }
            else if (href.includes('financials') && currentPath.includes('financials')) {
                link.classList.add('active');
            }
            else if (href.includes('analytics') && currentPath.includes('analytics')) {
                link.classList.add('active');
            }
            else if (href.includes('communication') && currentPath.includes('communication')) {
                link.classList.add('active');
            }
        }
    });
}

// Initialize form validation and enhancement
function initializeForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });
        
        // Form submission
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                showFormErrors(this);
            } else {
                showSuccessMessage(this);
            }
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    
    // Remove existing validation classes
    field.classList.remove('is-invalid');
    
    // Check if required field is empty
    if (isRequired && value === '') {
        field.classList.add('is-invalid');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('is-invalid');
            return false;
        }
    }
    
    // Number validation
    if (field.type === 'number' && value !== '') {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < 0) {
            field.classList.add('is-invalid');
            return false;
        }
    }
    
    return true;
}

// Validate entire form
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

// Show form errors
function showFormErrors(form) {
    const invalidFields = form.querySelectorAll('.is-invalid');
    if (invalidFields.length > 0) {
        invalidFields[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Show success message
function showSuccessMessage(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
        submitBtn.classList.add('btn-success');
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove('btn-success');
        }, 2000);
    }
}

// Initialize table interactions
function initializeTables() {
    const tableRows = document.querySelectorAll('.table tbody tr');
    
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.01)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Initialize animations
function initializeAnimations() {
    // Fade in animation for cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .stat-card, .form-container').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(element);
    });
}

// Initialize order calculations
function initializeOrderCalculations() {
    const quantityInput = document.querySelector('input[name="quantity_kg"]');
    const unitPriceInput = document.querySelector('input[name="unit_price"]');
    const totalAmountInput = document.querySelector('input[name="total_amount"]');
    
    if (quantityInput && unitPriceInput && totalAmountInput) {
        const calculateTotal = () => {
            const quantity = parseFloat(quantityInput.value) || 0;
            const unitPrice = parseFloat(unitPriceInput.value) || 0;
            const total = quantity * unitPrice;
            totalAmountInput.value = total.toFixed(2);
        };
        
        quantityInput.addEventListener('input', calculateTotal);
        unitPriceInput.addEventListener('input', calculateTotal);
    }
}

// Add click effects to action cards
document.addEventListener('click', function(e) {
    if (e.target.closest('.action-card')) {
        const card = e.target.closest('.action-card');
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    }
});

// Add hover effects for activity items
document.addEventListener('DOMContentLoaded', function() {
    const activityItems = document.querySelectorAll('.activity-item');
    
    activityItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(8px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
});

// Simulate dynamic data updates for dashboard
function updateStats() {
    const statValues = document.querySelectorAll('.stat-value');
    
    setTimeout(() => {
        const harvestValue = statValues[0];
        if (harvestValue) {
            const currentValue = parseInt(harvestValue.textContent.replace(/[^\d]/g, ''));
            const newValue = currentValue + Math.floor(Math.random() * 10) - 5;
            harvestValue.textContent = newValue.toLocaleString();
        }
    }, 5000);
}

// Initialize stats updates if on dashboard
if (window.location.pathname === '/farmer/dashboard') {
    updateStats();
}

// Quick Actions Dropdown logic
function toggleQuickActionsDropdown(event) {
    event.stopPropagation();
    const dropdown = event.currentTarget.parentElement;
    const menu = dropdown.querySelector('.quick-actions-menu');
    const btn = dropdown.querySelector('.quick-actions-btn');
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    if (expanded) {
        menu.style.display = 'none';
        btn.setAttribute('aria-expanded', 'false');
    } else {
        // Close any other open dropdowns
        document.querySelectorAll('.quick-actions-menu').forEach(m => m.style.display = 'none');
        document.querySelectorAll('.quick-actions-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));
        menu.style.display = 'block';
        btn.setAttribute('aria-expanded', 'true');
        // Focus first link for accessibility
        setTimeout(() => {
            const firstLink = menu.querySelector('a');
            if (firstLink) firstLink.focus();
        }, 100);
    }
}

// Close dropdown on outside click or escape
window.addEventListener('click', function(e) {
    document.querySelectorAll('.quick-actions-menu').forEach(menu => {
        menu.style.display = 'none';
    });
    document.querySelectorAll('.quick-actions-btn').forEach(btn => btn.setAttribute('aria-expanded', 'false'));
});

document.querySelectorAll('.quick-actions-dropdown').forEach(dropdown => {
    dropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    dropdown.addEventListener('keydown', function(e) {
        const menu = dropdown.querySelector('.quick-actions-menu');
        const btn = dropdown.querySelector('.quick-actions-btn');
        if (e.key === 'Escape') {
            menu.style.display = 'none';
            btn.setAttribute('aria-expanded', 'false');
            btn.focus();
        }
        if (e.key === 'Tab' && menu.style.display === 'block') {
            // Trap focus inside dropdown
            const focusable = menu.querySelectorAll('a');
            if (focusable.length) {
                if (e.shiftKey && document.activeElement === focusable[0]) {
                    e.preventDefault();
                    focusable[focusable.length - 1].focus();
                } else if (!e.shiftKey && document.activeElement === focusable[focusable.length - 1]) {
                    e.preventDefault();
                    focusable[0].focus();
                }
            }
        }
    });
});