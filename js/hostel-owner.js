/**
 * Hostel Owner Module - JavaScript
 * WorkNStay AI
 * 
 * Handles all interactive functionality for:
 * - Dashboard
 * - Add Hostel Form
 * - Manage Bookings
 * - Reviews Management
 * 
 * @version 2.0.0
 * @author Ali Raza
 */

// ============================================
// Configuration
// ============================================

const CONFIG = {
    notificationDuration: 5000,
    animationDuration: 300,
    debounceDelay: 300,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    minRoomTypes: 1,
    maxRoomTypes: 10
};

// ============================================
// Sidebar Toggle
// ============================================

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');

        // Add overlay for mobile
        let overlay = document.querySelector('.sidebar-overlay');
        if (!overlay && sidebar.classList.contains('open')) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 999;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(overlay);
            setTimeout(() => overlay.style.opacity = '1', 10);
            overlay.addEventListener('click', toggleSidebar);
        } else if (overlay && !sidebar.classList.contains('open')) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        }
    }
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function (e) {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.querySelector('.mobile-menu-btn');

    if (sidebar && menuBtn && window.innerWidth <= 992) {
        if (!sidebar.contains(e.target) &&
            !menuBtn.contains(e.target) &&
            sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            const overlay = document.querySelector('.sidebar-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 300);
            }
        }
    }
});

// ============================================
// Booking Management Functions
// ============================================

/**
 * Filter bookings by status
 * @param {string} status - Status to filter by (all, pending, approved, rejected, checked-in)
 * @param {HTMLElement} btn - The clicked filter button
 */
function filterBookings(status, btn) {
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    btn.classList.add('active');

    // Filter table rows with animation
    const rows = document.querySelectorAll('.booking-table tbody tr');
    rows.forEach(row => {
        if (status === 'all' || row.dataset.status === status) {
            row.style.display = '';
            row.style.animation = 'fadeInUp 0.3s ease';
        } else {
            row.style.display = 'none';
        }
    });

    // Update count
    updateFilterCounts();
}

/**
 * Update filter tab counts
 */
function updateFilterCounts() {
    const rows = document.querySelectorAll('.booking-table tbody tr');
    const counts = { all: 0, pending: 0, approved: 0, rejected: 0, 'checked-in': 0 };

    rows.forEach(row => {
        counts.all++;
        const status = row.dataset.status;
        if (counts[status] !== undefined) {
            counts[status]++;
        }
    });

    document.querySelectorAll('.filter-tab').forEach(tab => {
        const status = tab.dataset.status || 'all';
        const countSpan = tab.querySelector('.count');
        if (countSpan && counts[status] !== undefined) {
            countSpan.textContent = counts[status];
        }
    });
}

/**
 * Approve a booking request
 * @param {HTMLElement} btn - The approve button clicked
 */
function approveBooking(btn) {
    showConfirmModal(
        'Approve Booking',
        'Are you sure you want to approve this booking request?',
        () => {
            const row = btn.closest('tr');
            const statusCell = row.querySelector('.status-badge');

            // Show loading state
            btn.classList.add('loading');
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // Update status
                statusCell.className = 'status-badge approved';
                statusCell.innerHTML = '<i class="bi bi-check-circle"></i> Approved';
                row.dataset.status = 'approved';

                // Remove approve/reject buttons
                const actionBtns = row.querySelector('.action-btns');
                const approveBtn = actionBtns.querySelector('.approve');
                const rejectBtn = actionBtns.querySelector('.reject');
                if (approveBtn) approveBtn.remove();
                if (rejectBtn) rejectBtn.remove();

                // Show success message
                showNotification('Booking approved successfully!', 'success');
                updateFilterCounts();
            }, 500);
        }
    );
}

/**
 * Reject a booking request
 * @param {HTMLElement} btn - The reject button clicked
 */
function rejectBooking(btn) {
    showConfirmModal(
        'Reject Booking',
        'Are you sure you want to reject this booking? This action cannot be undone.',
        () => {
            const row = btn.closest('tr');
            const statusCell = row.querySelector('.status-badge');

            // Show loading state
            btn.classList.add('loading');
            btn.disabled = true;

            setTimeout(() => {
                // Update status
                statusCell.className = 'status-badge rejected';
                statusCell.innerHTML = '<i class="bi bi-x-circle"></i> Rejected';
                row.dataset.status = 'rejected';

                // Update payment status
                const paymentCell = row.querySelector('.payment-badge');
                if (paymentCell) {
                    paymentCell.className = 'payment-badge pending';
                    paymentCell.innerHTML = '<i class="bi bi-dash"></i> N/A';
                }

                // Remove action buttons
                const actionBtns = row.querySelector('.action-btns');
                const approveBtn = actionBtns.querySelector('.approve');
                const rejectBtn = actionBtns.querySelector('.reject');
                const messageBtn = actionBtns.querySelector('.message');
                if (approveBtn) approveBtn.remove();
                if (rejectBtn) rejectBtn.remove();
                if (messageBtn) messageBtn.remove();

                showNotification('Booking rejected.', 'warning');
                updateFilterCounts();
            }, 500);
        },
        'danger'
    );
}

// ============================================
// Confirmation Modal
// ============================================

/**
 * Show a confirmation modal
 * @param {string} title - Modal title
 * @param {string} message - Modal message
 * @param {Function} onConfirm - Callback on confirm
 * @param {string} type - Button type (primary, danger)
 */
function showConfirmModal(title, message, onConfirm, type = 'primary') {
    // Remove existing modal
    const existingModal = document.querySelector('.confirm-modal-overlay');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.className = 'confirm-modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.2s ease;
    `;

    const buttonColor = type === 'danger' ?
        'background: linear-gradient(135deg, #ef4444, #dc2626);' :
        'background: linear-gradient(135deg, #1a7f5a, #15684a);';

    modal.innerHTML = `
        <div class="confirm-modal" style="
            background: white;
            border-radius: 20px;
            padding: 32px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            transform: scale(0.9);
            transition: transform 0.2s ease;
        ">
            <h3 style="margin: 0 0 12px; font-size: 1.25rem; color: #1e293b;">${title}</h3>
            <p style="margin: 0 0 24px; color: #64748b; font-size: 14px;">${message}</p>
            <div style="display: flex; gap: 12px;">
                <button class="cancel-btn" style="
                    flex: 1;
                    padding: 12px;
                    border: none;
                    border-radius: 10px;
                    background: #f1f5f9;
                    color: #475569;
                    font-weight: 600;
                    cursor: pointer;
                ">Cancel</button>
                <button class="confirm-btn" style="
                    flex: 1;
                    padding: 12px;
                    border: none;
                    border-radius: 10px;
                    ${buttonColor}
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                ">Confirm</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.confirm-modal').style.transform = 'scale(1)';
    }, 10);

    // Event handlers
    const closeModal = () => {
        modal.style.opacity = '0';
        modal.querySelector('.confirm-modal').style.transform = 'scale(0.9)';
        setTimeout(() => modal.remove(), 200);
    };

    modal.querySelector('.cancel-btn').addEventListener('click', closeModal);
    modal.querySelector('.confirm-btn').addEventListener('click', () => {
        closeModal();
        onConfirm();
    });
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// ============================================
// Add Hostel Form Functions
// ============================================

let roomTypeCount = 2;

/**
 * Add a new room type to the form
 */
function addRoomType() {
    if (roomTypeCount >= CONFIG.maxRoomTypes) {
        showNotification(`Maximum ${CONFIG.maxRoomTypes} room types allowed.`, 'warning');
        return;
    }

    roomTypeCount++;
    const container = document.getElementById('roomTypesContainer');

    if (!container) return;

    const newRoomType = document.createElement('div');
    newRoomType.className = 'room-type-card';
    newRoomType.innerHTML = `
        <div class="room-type-header">
            <span class="room-type-title">Room Type ${roomTypeCount}</span>
            <button type="button" class="remove-room-btn" onclick="removeRoomType(this)">
                <i class="bi bi-trash"></i>
            </button>
        </div>
        <div class="room-type-fields">
            <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Room Name <span class="required">*</span></label>
                <input type="text" class="form-control" placeholder="e.g., Single Room" required>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Price (Rs/month) <span class="required">*</span></label>
                <input type="number" class="form-control" placeholder="e.g., 15000" required min="1000">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Available Rooms <span class="required">*</span></label>
                <input type="number" class="form-control" placeholder="e.g., 5" required min="1">
            </div>
        </div>
    `;
    container.appendChild(newRoomType);

    // Animate the new card
    newRoomType.style.opacity = '0';
    newRoomType.style.transform = 'translateY(-10px)';
    setTimeout(() => {
        newRoomType.style.transition = 'all 0.3s ease';
        newRoomType.style.opacity = '1';
        newRoomType.style.transform = 'translateY(0)';
    }, 10);

    updateFormProgress();
}

/**
 * Remove a room type from the form
 * @param {HTMLElement} btn - The remove button clicked
 */
function removeRoomType(btn) {
    const roomCards = document.querySelectorAll('.room-type-card');
    if (roomCards.length > CONFIG.minRoomTypes) {
        const card = btn.closest('.room-type-card');
        card.style.transition = 'all 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            card.remove();
            roomTypeCount--;
            updateFormProgress();
        }, 300);
    } else {
        showNotification(`You must have at least ${CONFIG.minRoomTypes} room type.`, 'warning');
    }
}

/**
 * Initialize facility checkboxes
 */
function initFacilityCheckboxes() {
    document.querySelectorAll('.facility-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', function (e) {
            if (e.target.tagName !== 'INPUT') {
                const input = this.querySelector('input');
                input.checked = !input.checked;
            }
            this.classList.toggle('checked', this.querySelector('input').checked);
            updateFormProgress();
        });
    });
}

/**
 * Update form progress indicator
 */
function updateFormProgress() {
    const form = document.getElementById('addHostelForm');
    if (!form) return;

    const requiredInputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let filledCount = 0;

    requiredInputs.forEach(input => {
        if (input.value.trim()) filledCount++;
    });

    const progress = Math.round((filledCount / requiredInputs.length) * 100);

    // Update progress bar if exists
    const progressBar = document.querySelector('.form-progress-fill');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }

    const progressText = document.querySelector('.form-progress-text');
    if (progressText) {
        progressText.textContent = `${progress}% complete`;
    }
}

/**
 * Validate form before submission
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} - Whether form is valid
 */
function validateForm(form) {
    const errors = [];

    // Check required fields
    form.querySelectorAll('input[required]').forEach(input => {
        if (!input.value.trim()) {
            errors.push(`${input.previousElementSibling?.textContent || 'Field'} is required`);
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
    });

    // Check email format
    const emailInputs = form.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        if (input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
            errors.push('Please enter a valid email address');
            input.classList.add('is-invalid');
        }
    });

    // Check phone format
    const phoneInputs = form.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        if (input.value && !/^[\d\s\-+()]{10,}$/.test(input.value)) {
            errors.push('Please enter a valid phone number');
            input.classList.add('is-invalid');
        }
    });

    if (errors.length > 0) {
        showNotification(errors[0], 'error');
        return false;
    }

    return true;
}

/**
 * Handle form submission
 */
function initAddHostelForm() {
    const form = document.getElementById('addHostelForm');
    if (form) {
        // Add input listeners for progress tracking
        form.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', updateFormProgress);
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!validateForm(form)) return;

            // Show loading state
            const submitBtn = form.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Submitting...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                showNotification('Hostel submitted for review! You will be notified once approved.', 'success');
                // In production, this would submit to a backend
            }, 1500);
        });
    }
}

// ============================================
// Reviews Management Functions
// ============================================

/**
 * Toggle reply form visibility
 * @param {string} reviewId - The ID of the review
 */
function toggleReplyForm(reviewId) {
    const form = document.getElementById('replyForm-' + reviewId);
    if (form) {
        form.classList.toggle('show');

        // Focus on textarea if shown
        if (form.classList.contains('show')) {
            const textarea = form.querySelector('textarea');
            if (textarea) textarea.focus();
        }
    }
}

/**
 * Submit a reply to a review
 * @param {string} reviewId - The ID of the review
 */
function submitReply(reviewId) {
    const form = document.getElementById('replyForm-' + reviewId);
    const textarea = form.querySelector('textarea');
    const replyText = textarea.value.trim();

    if (!replyText) {
        showNotification('Please enter a reply before submitting.', 'warning');
        textarea.focus();
        return;
    }

    // Show loading
    const submitBtn = form.querySelector('.reply-btn.submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i>';
    submitBtn.disabled = true;

    setTimeout(() => {
        // Create owner reply element
        const ownerReply = document.createElement('div');
        ownerReply.className = 'owner-reply';
        ownerReply.innerHTML = `
            <div class="owner-reply-header">
                <span class="owner-reply-badge">
                    <i class="bi bi-person-badge"></i>
                    Owner Response
                </span>
                <span class="owner-reply-date">Just now</span>
            </div>
            <p class="owner-reply-text">${escapeHtml(replyText)}</p>
        `;

        // Animate and insert reply
        ownerReply.style.opacity = '0';
        ownerReply.style.transform = 'translateY(-10px)';

        const reviewCard = document.getElementById(reviewId);
        const reviewFooter = reviewCard.querySelector('.review-footer');
        reviewCard.insertBefore(ownerReply, reviewFooter);

        setTimeout(() => {
            ownerReply.style.transition = 'all 0.3s ease';
            ownerReply.style.opacity = '1';
            ownerReply.style.transform = 'translateY(0)';
        }, 10);

        // Remove reply button
        const replyBtn = reviewCard.querySelector('.review-action-btn.reply');
        if (replyBtn) replyBtn.remove();

        // Hide and clear form
        form.classList.remove('show');
        textarea.value = '';
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        showNotification('Reply posted successfully!', 'success');
    }, 800);
}

/**
 * Initialize filter pills for reviews
 */
function initFilterPills() {
    document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', function () {
            document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            // In production, this would filter the reviews
            showNotification('Filter applied', 'info');
        });
    });
}

/**
 * Initialize report fake review functionality
 */
function initReportButtons() {
    document.querySelectorAll('.review-action-btn.report').forEach(btn => {
        btn.addEventListener('click', function () {
            showConfirmModal(
                'Report Review',
                'Are you sure you want to report this review as fake? Our team will investigate.',
                () => {
                    showNotification('Review reported. Our team will investigate and get back to you within 48 hours.', 'info');
                    this.innerHTML = '<i class="bi bi-flag-fill"></i> Reported';
                    this.disabled = true;
                    this.style.opacity = '0.6';
                    this.style.cursor = 'not-allowed';
                }
            );
        });
    });
}

// ============================================
// Utility Functions
// ============================================

/**
 * Show a notification message
 * @param {string} message - The message to display
 * @param {string} type - Type of notification (success, warning, error, info)
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification-toast');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-toast notification-${type}`;

    const icons = {
        success: 'bi-check-circle-fill',
        warning: 'bi-exclamation-triangle-fill',
        error: 'bi-x-circle-fill',
        info: 'bi-info-circle-fill'
    };

    notification.innerHTML = `
        <i class="bi ${icons[type] || icons.info}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="bi bi-x"></i>
        </button>
    `;

    // Add styles if not already present
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 20px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                gap: 12px;
                font-weight: 500;
                font-size: 14px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                z-index: 9999;
                animation: slideIn 0.3s ease;
                max-width: 400px;
            }
            .notification-success {
                background: linear-gradient(135deg, #10b981, #34d399);
                color: white;
            }
            .notification-warning {
                background: linear-gradient(135deg, #f59e0b, #fbbf24);
                color: #1e293b;
            }
            .notification-error {
                background: linear-gradient(135deg, #ef4444, #f87171);
                color: white;
            }
            .notification-info {
                background: linear-gradient(135deg, #3b82f6, #60a5fa);
                color: white;
            }
            .notification-close {
                background: rgba(255,255,255,0.2);
                border: none;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                margin-left: 8px;
                flex-shrink: 0;
            }
            .notification-close:hover {
                background: rgba(255,255,255,0.3);
            }
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            .spin {
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Auto-remove after configured duration
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, CONFIG.notificationDuration);
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
    return 'Rs. ' + amount.toLocaleString('en-PK');
}

/**
 * Format date
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Format relative time
 * @param {Date} date - Date to format
 * @returns {string} Relative time string
 */
function formatRelativeTime(date) {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) return formatDate(date);
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
}

// ============================================
// Image Upload Preview (Add Hostel)
// ============================================

function initImageUpload() {
    const imageInput = document.getElementById('imageInput');
    const imagePreviews = document.getElementById('imagePreviews');
    const dropZone = document.querySelector('.image-upload-zone');

    if (imageInput && imagePreviews) {
        // Handle file input change
        imageInput.addEventListener('change', function (e) {
            handleFiles(Array.from(e.target.files));
        });

        // Handle drag and drop
        if (dropZone) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, preventDefaults, false);
            });

            ['dragenter', 'dragover'].forEach(eventName => {
                dropZone.addEventListener(eventName, () => {
                    dropZone.classList.add('drag-over');
                }, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, () => {
                    dropZone.classList.remove('drag-over');
                }, false);
            });

            dropZone.addEventListener('drop', (e) => {
                const files = Array.from(e.dataTransfer.files);
                handleFiles(files);
            }, false);
        }
    }

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleFiles(files) {
        files.forEach(file => {
            // Validate file type
            if (!CONFIG.allowedImageTypes.includes(file.type)) {
                showNotification('Please upload only JPEG, PNG, or WebP images.', 'error');
                return;
            }

            // Validate file size
            if (file.size > CONFIG.maxFileSize) {
                showNotification('File size must be less than 5MB.', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                const preview = document.createElement('div');
                preview.className = 'image-preview';
                preview.innerHTML = `
                    <img src="${e.target.result}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;">
                    <button type="button" class="remove-btn" onclick="removeImagePreview(this)">
                        <i class="bi bi-x"></i>
                    </button>
                `;
                preview.style.opacity = '0';
                preview.style.transform = 'scale(0.8)';
                imagePreviews.appendChild(preview);

                setTimeout(() => {
                    preview.style.transition = 'all 0.3s ease';
                    preview.style.opacity = '1';
                    preview.style.transform = 'scale(1)';
                }, 10);
            };
            reader.readAsDataURL(file);
        });

        updateFormProgress();
    }
}

/**
 * Remove an image preview
 * @param {HTMLElement} btn - Remove button clicked
 */
function removeImagePreview(btn) {
    const preview = btn.closest('.image-preview');
    preview.style.transition = 'all 0.3s ease';
    preview.style.opacity = '0';
    preview.style.transform = 'scale(0.8)';
    setTimeout(() => {
        preview.remove();
        updateFormProgress();
    }, 300);
}

// ============================================
// Search Functionality
// ============================================

function initSearch() {
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function (e) {
            const query = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('.booking-table tbody tr');
            let visibleCount = 0;

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                const isVisible = text.includes(query);
                row.style.display = isVisible ? '' : 'none';
                if (isVisible) visibleCount++;
            });

            // Show empty state if no results
            const emptyState = document.querySelector('.search-empty-state');
            if (visibleCount === 0 && query) {
                if (!emptyState) {
                    const tbody = document.querySelector('.booking-table tbody');
                    const emptyRow = document.createElement('tr');
                    emptyRow.className = 'search-empty-state';
                    emptyRow.innerHTML = `
                        <td colspan="7" style="text-align: center; padding: 40px;">
                            <i class="bi bi-search" style="font-size: 2rem; color: #94a3b8;"></i>
                            <p style="margin: 12px 0 0; color: #64748b;">No results found for "${escapeHtml(query)}"</p>
                        </td>
                    `;
                    tbody.appendChild(emptyRow);
                }
            } else if (emptyState) {
                emptyState.remove();
            }
        }, CONFIG.debounceDelay));
    }
}

/**
 * Debounce function for search
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
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

// ============================================
// Keyboard Navigation
// ============================================

function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        // ESC to close modals
        if (e.key === 'Escape') {
            const modal = document.querySelector('.confirm-modal-overlay');
            if (modal) modal.remove();

            const sidebar = document.getElementById('sidebar');
            if (sidebar?.classList.contains('open')) {
                toggleSidebar();
            }
        }

        // Ctrl+K for search focus
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-box input');
            if (searchInput) searchInput.focus();
        }
    });
}

// ============================================
// Initialize on DOM Ready
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    // Initialize components based on current page
    initFacilityCheckboxes();
    initAddHostelForm();
    initFilterPills();
    initReportButtons();
    initImageUpload();
    initSearch();
    initKeyboardNav();
    initTenantsAction();
    initPaymentActions();

    // Update filter counts on load
    updateFilterCounts();

    // Update form progress on load
    updateFormProgress();

    // Add smooth transitions
    document.querySelectorAll('.stat-card, .review-card, .tenant-card, .content-card').forEach((card, index) => {
        card.style.transition = 'all 0.3s ease';
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Log initialization
    console.log('🏠 WorkNStay AI - Hostel Owner Module initialized');
});

// ============================================
// Export functions for global use
// ============================================

window.toggleSidebar = toggleSidebar;
window.filterBookings = filterBookings;
window.approveBooking = approveBooking;
window.rejectBooking = rejectBooking;
window.addRoomType = addRoomType;
window.removeRoomType = removeRoomType;
window.toggleReplyForm = toggleReplyForm;
window.submitReply = submitReply;
window.removeImagePreview = removeImagePreview;
window.showNotification = showNotification;
window.showConfirmModal = showConfirmModal;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.formatRelativeTime = formatRelativeTime;
window.terminateLease = terminateLease;
window.recordPayment = recordPayment;
window.exportData = exportData;

/**
 * Initialize Tenant specific actions
 */
function initTenantsAction() {
    // Placeholder for future tenant specific logic
}

/**
 * Initialize Payment specific actions
 */
function initPaymentActions() {
    const recordBtn = document.querySelector('.topbar-right .btn-primary');
    if (recordBtn && window.location.pathname.includes('payments.html')) {
        recordBtn.onclick = recordPayment;
    }
}

/**
 * Handle lease termination
 * @param {string} tenantId - ID of the tenant
 */
function terminateLease(tenantId) {
    showConfirmModal('Terminate Lease', 'Are you sure you want to terminate the lease for this tenant? This action cannot be undone.', () => {
        showNotification('Lease termination process started.', 'info');
        // Add actual API call here
    });
}

/**
 * Show Record Payment modal
 */
function recordPayment() {
    showNotification('Opening payment recording interface...', 'info');
    // In a real app, this would open a modal form
}

/**
 * Export data as CSV/PDF
 * @param {string} type - data type to export
 */
function exportData(type) {
    showNotification(`Preparing ${type} export...`, 'success');
}

