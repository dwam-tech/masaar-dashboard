// ===== Main Application JavaScript =====

// ===== Global Variables =====
let currentUser = {
    name: 'أحمد محمد',
    role: 'مدير النظام',
    avatar: 'assets/images/user-avatar.png'
};

// ===== Dashboard Data =====
let dashboardData = {
    totalUsers: 1245,
    newOrders: 89,
    completedOrders: 567,
    securityPermits: 23
};

// ===== Initialize Application =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadDashboardData();
});

function initializeApp() {
    // Initialize tooltips
    initializeTooltips();
    
    // Setup responsive behavior
    setupResponsive();
    
    // Load user preferences
    loadUserPreferences();
}



// ===== Event Listeners =====
function setupEventListeners() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
    
    // Click outside to close mobile menu
    document.addEventListener('click', function(e) {
        const sidebar = document.querySelector('.sidebar');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (sidebar && !sidebar.contains(e.target) && !menuToggle?.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
}

// ===== Dashboard Functions =====
function loadDashboardData() {
    // Simulate API call to load dashboard data
    updateDashboardCards();
    loadRecentActivity();
    updateCharts();
}

function updateDashboardCards() {
    const cards = document.querySelectorAll('.dashboard-card');
    const data = [dashboardData.totalUsers, dashboardData.newOrders, dashboardData.completedOrders, dashboardData.securityPermits];
    
    cards.forEach((card, index) => {
        const numberElement = card.querySelector('.card-number');
        if (numberElement && data[index]) {
            animateNumber(numberElement, 0, data[index], 2000);
        }
    });
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (end - start) * progress);
        
        element.textContent = current.toLocaleString('ar-SA');
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

function loadRecentActivity() {
    // This would typically load from an API
    const activities = [
        {
            icon: 'fas fa-user-plus',
            text: 'تم إضافة مستخدم جديد: أحمد محمد',
            time: 'منذ 5 دقائق'
        },
        {
            icon: 'fas fa-shopping-bag',
            text: 'طلب جديد من العميل: سارة أحمد',
            time: 'منذ 15 دقيقة'
        },
        {
            icon: 'fas fa-check',
            text: 'تم اعتماد تصريح أمني جديد',
            time: 'منذ 30 دقيقة'
        }
    ];
    
    // Update activity list if it exists
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.text}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }
}

// ===== Search Functionality =====
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const searchResults = document.querySelector('.search-results');
    
    if (searchTerm.length > 2) {
        // Simulate search results
        const results = [
            { title: 'إدارة الحسابات', url: 'accounts.html' },
            { title: 'مراجعة الطلبات', url: 'review-orders.html' },
            { title: 'تصاريح أمنية', url: 'security-permits.html' }
        ].filter(item => item.title.includes(searchTerm));
        
        if (searchResults) {
            searchResults.innerHTML = results.map(result => `
                <a href="${result.url}" class="search-result-item">
                    <i class="fas fa-search"></i>
                    ${result.title}
                </a>
            `).join('');
            searchResults.style.display = 'block';
        }
    } else if (searchResults) {
        searchResults.style.display = 'none';
    }
}

// ===== Form Handling =====
function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    showLoading();
    
    // Simulate form submission
    setTimeout(() => {
        hideLoading();
        showNotification('تم حفظ البيانات بنجاح', 'success');
        form.reset();
    }, 1500);
}

// ===== Responsive Behavior =====
function setupResponsive() {
    window.addEventListener('resize', function() {
        const sidebar = document.querySelector('.sidebar');
        if (window.innerWidth > 768 && sidebar) {
            sidebar.classList.remove('active');
        }
    });
}

// ===== Tooltips =====
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.getAttribute('data-tooltip');
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// ===== User Preferences =====
function loadUserPreferences() {
    const preferences = localStorage.getItem('userPreferences');
    if (preferences) {
        const prefs = JSON.parse(preferences);
        // Apply user preferences
        if (prefs.theme) {
            document.body.setAttribute('data-theme', prefs.theme);
        }
    }
}

function saveUserPreferences(preferences) {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
}

// ===== Charts and Data Visualization =====
function updateCharts() {
    // This would integrate with a charting library like Chart.js
    // For now, we'll just log that charts would be updated
    console.log('تحديث الرسوم البيانية...');
}

// ===== Export Functions =====
function exportData(format = 'excel') {
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        showNotification(`تم تصدير البيانات بصيغة ${format} بنجاح`, 'success');
    }, 2000);
}

// ===== Print Functions =====
function printPage() {
    window.print();
}

// ===== Utility Functions =====
function formatDate(date) {
    return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR'
    }).format(amount);
}

// ===== Error Handling =====
window.addEventListener('error', function(e) {
    console.error('خطأ في التطبيق:', e.error);
    showNotification('حدث خطأ غير متوقع', 'error');
});

// ===== Performance Monitoring =====
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`تم تحميل الصفحة في ${Math.round(loadTime)} مللي ثانية`);
});