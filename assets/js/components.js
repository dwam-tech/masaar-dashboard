// ===== Authentication Check =====
let isRedirecting = false;

function checkAuthentication() {
    // Prevent multiple redirects
    if (isRedirecting) {
        return false;
    }
    
    const token = localStorage.getItem('authToken');
    const currentPage = window.location.pathname;
    
    // If no token and not on login page, redirect to login
    if (!token && !currentPage.includes('login.html')) {
        isRedirecting = true;
        window.location.href = 'login.html';
        return false;
    }
    
    // If token exists and on login page, redirect to dashboard
    if (token && currentPage.includes('login.html')) {
        isRedirecting = true;
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// ===== Header Component =====
function createHeader() {
    return `
        <header class="header">
            <div class="header-right">
                <div class="logo">
                    <i class="fas fa-compass"></i>
                    <span>مسار</span>
                </div>
            </div>
            
            <div class="header-left">
                <div class="user-menu">
                    <i class="fas fa-user-circle"></i>
                    <div class="user-info">
                        <span class="account-name">اسم الحساب</span>
                        <span class="profile-name">أحمد محمد</span>
                    </div>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <button class="logout-btn" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i>
                    تسجيل الخروج
                </button>
            </div>
        </header>
    `;
}

// ===== Sidebar Component =====
function createSidebar() {
    const menuItems = [
        { icon: 'fas fa-tachometer-alt', text: 'لوحة التحكم', href: 'index.html' },
        { icon: 'fas fa-users-cog', text: 'إدارة الحسابات', href: 'accounts.html' },
        { icon: 'fas fa-clipboard-check', text: 'مراجعة الطلبات', href: 'review-orders.html' },
        { icon: 'fas fa-inbox', text: 'استقبال الطلبات', href: 'receive-orders.html' },
        { icon: 'fas fa-shield-alt', text: 'تصاريح أمنية', href: 'security-permits.html' },
        { icon: 'fas fa-eye', text: 'عرض الطلبات', href: 'view-orders.html' },
        { icon: 'fas fa-edit', text: 'التعديل على التطبيق', href: 'app-settings.html' },
        { icon: 'fas fa-comments', text: 'رسائل المستخدمين', href: 'user-messages.html' },
        { icon: 'fas fa-cogs', text: 'الإدارة', href: 'management.html' }
    ];
    
    let menuHTML = '';
    menuItems.forEach(item => {
        const isActive = window.location.pathname.includes(item.href) ? 'active' : '';
        menuHTML += `
            <a href="${item.href}" class="menu-item ${isActive}">
                <i class="${item.icon}"></i>
                ${item.text}
            </a>
        `;
    });
    
    return `
        <aside class="sidebar">
            <nav class="sidebar-menu">
                ${menuHTML}
            </nav>
        </aside>
    `;
}

// ===== Load Components =====
function loadComponents() {
    // Check authentication first
    if (!checkAuthentication()) {
        return;
    }
    
    // Load Header
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.innerHTML = createHeader();
    }
    
    // Load Sidebar
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        sidebarContainer.innerHTML = createSidebar();
    }
    
    // Update user info in header if available
    updateUserInfo();
}

// ===== Utility Functions =====
// Update user info in header
function updateUserInfo() {
    const userData = localStorage.getItem('userData');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            const accountNameElement = document.querySelector('.account-name');
            const profileNameElement = document.querySelector('.profile-name');
            
            if (accountNameElement) {
                // Display account type based on user_type
                let accountType = 'حساب عام';
                if (user.user_type === 'real_estate_office') {
                    accountType = 'مكتب عقاري';
                } else if (user.user_type === 'real_estate_individual') {
                    accountType = 'وسيط عقاري فردي';
                } else if (user.user_type === 'admin') {
                    accountType = 'مدير النظام';
                } else if (user.user_type === 'car_rental_office') {
                    accountType = 'مكتب تأجير سيارات';
                }
                accountNameElement.textContent = accountType;
            }
            
            if (profileNameElement) {
                profileNameElement.textContent = user.name || 'المستخدم';
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    }
}

// Logout function
function logout() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
        // Clear user session and token
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('currentUser');
        // Redirect to login page
        window.location.href = 'login.html';
    }
}

// ===== Initialize Components =====
document.addEventListener('DOMContentLoaded', function() {
    loadComponents();
    
    // Add fade-in animation to main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.classList.add('fade-in');
    }
});

// ===== Mobile Menu Toggle =====
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// ===== Search Functionality =====
function searchFunction(searchTerm) {
    // This function can be customized for each page
    console.log('البحث عن:', searchTerm);
}

// ===== Notification System =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// ===== Loading Spinner =====
function showLoading() {
    const loader = document.createElement('div');
    loader.id = 'loading-spinner';
    loader.innerHTML = `
        <div class="spinner-overlay">
            <div class="spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>جاري التحميل...</p>
            </div>
        </div>
    `;
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.getElementById('loading-spinner');
    if (loader) {
        loader.remove();
    }
}