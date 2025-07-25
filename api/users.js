// دالة لإضافة مستخدم جديد
async function addUser(userData) {
    try {
        // الحصول على التوكن من localStorage
        const adminToken = localStorage.getItem('admin_token') || localStorage.getItem('token') || localStorage.getItem('auth_token');
        
        // التحقق من وجود التوكن
        if (!adminToken) {
            throw new Error('لم يتم العثور على توكن المصادقة. يجب تسجيل الدخول أولاً.');
        }

        // إعداد headers للطلب
        const headers = {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        // استدعاء API
        const response = await fetch('http://192.168.1.8:8000/api/users', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(userData)
        });

        // التحقق من حالة الاستجابة
        if (!response.ok) {
            let errorMessage = `خطأ في استجابة الخادم: HTTP ${response.status}`;
            
            if (response.status === 401) {
                errorMessage = 'خطأ في المصادقة: التوكن غير صحيح أو منتهي الصلاحية';
            } else if (response.status === 422) {
                errorMessage = 'بيانات غير صحيحة: تحقق من البيانات المدخلة';
            }
            
            throw new Error(errorMessage);
        }

        // تحليل البيانات
        const data = await response.json();
        
        return {
            status: true,
            message: 'تم إضافة المستخدم بنجاح',
            user: data.user || data
        };
        
    } catch (error) {
        console.error('خطأ في إضافة المستخدم:', error);
        return {
            status: false,
            message: error.message
        };
    }
}

// دالة لجلب بيانات مستخدم مفرد
async function fetchUserById(userId) {
    try {
        const adminToken = localStorage.getItem('admin_token') || localStorage.getItem('token') || localStorage.getItem('auth_token');

        if (!adminToken) {
            throw new Error('لم يتم العثور على توكن المصادقة. يجب تسجيل الدخول أولاً.');
        }

        const headers = {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        const response = await fetch(`http://192.168.1.8:8000/api/users/${userId}`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error(`خطأ في استجابة الخادم: HTTP ${response.status}`);
        }

        const data = await response.json();

        return {
            status: true,
            user: data.user || data
        };

    } catch (error) {
        console.error('خطأ في جلب بيانات المستخدم:', error);
        return {
            status: false,
            message: error.message
        };
    }
}

// دالة لتحديث بيانات المستخدم
async function updateUser(userId, userData) {
    try {
        // الحصول على التوكن من localStorage
        const adminToken = localStorage.getItem('admin_token') || localStorage.getItem('token') || localStorage.getItem('auth_token');
        
        // التحقق من وجود التوكن
        if (!adminToken) {
            throw new Error('لم يتم العثور على توكن المصادقة. يجب تسجيل الدخول أولاً.');
        }

        // إعداد headers للطلب
        const headers = {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        // استدعاء API
        const response = await fetch(`http://192.168.1.8:8000/api/users/${userId}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(userData)
        });

        // التحقق من حالة الاستجابة
        if (!response.ok) {
            let errorMessage = `خطأ في استجابة الخادم: HTTP ${response.status}`;
            
            if (response.status === 401) {
                errorMessage = 'خطأ في المصادقة: التوكن غير صحيح أو منتهي الصلاحية';
            } else if (response.status === 404) {
                errorMessage = 'المستخدم غير موجود';
            } else if (response.status === 422) {
                errorMessage = 'بيانات غير صحيحة: تحقق من البيانات المدخلة';
            }
            
            throw new Error(errorMessage);
        }

        // تحليل البيانات
        const data = await response.json();
        
        return {
            status: true,
            message: 'تم تحديث بيانات المستخدم بنجاح',
            user: data.user || data
        };
        
    } catch (error) {
        console.error('خطأ في تحديث المستخدم:', error);
        return {
            status: false,
            message: error.message
        };
    }
}

// دالة لحذف المستخدم
async function deleteUser(userId) {
    try {
        // الحصول على التوكن من localStorage
        const adminToken = localStorage.getItem('admin_token') || localStorage.getItem('token') || localStorage.getItem('auth_token');
        
        // التحقق من وجود التوكن
        if (!adminToken) {
            throw new Error('لم يتم العثور على توكن المصادقة. يجب تسجيل الدخول أولاً.');
        }

        // إعداد headers للطلب
        const headers = {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        // استدعاء API
        const response = await fetch(`http://192.168.1.8:8000/api/users/${userId}`, {
            method: 'DELETE',
            headers: headers
        });

        // التحقق من حالة الاستجابة
        if (!response.ok) {
            let errorMessage = `خطأ في استجابة الخادم: HTTP ${response.status}`;
            
            if (response.status === 401) {
                errorMessage = 'خطأ في المصادقة: التوكن غير صحيح أو منتهي الصلاحية';
            } else if (response.status === 404) {
                errorMessage = 'المستخدم غير موجود';
            }
            
            throw new Error(errorMessage);
        }

        // تحليل البيانات
        const data = await response.json();
        
        return {
            status: true,
            message: 'تم حذف المستخدم بنجاح'
        };
        
    } catch (error) {
        console.error('خطأ في حذف المستخدم:', error);
        return {
            status: false,
            message: error.message
        };
    }
}

// دالة لجلب طلبات التسجيل المعلقة من التطبيق
async function fetchPendingRegistrations() {
    try {
        // الحصول على التوكن من localStorage
        const adminToken = localStorage.getItem('admin_token') || localStorage.getItem('token') || localStorage.getItem('auth_token');
        
        // التحقق من وجود التوكن
        if (!adminToken) {
            throw new Error('لم يتم العثور على توكن المصادقة. يجب تسجيل الدخول أولاً.');
        }

        // إعداد headers للطلب
        const headers = {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        // استدعاء API
        const response = await fetch('http://192.168.1.8:8000/api/admin/pending-registrations', {
            method: 'GET',
            headers: headers
        });

        // التحقق من حالة الاستجابة
        if (!response.ok) {
            throw new Error(`خطأ في استجابة الخادم: HTTP ${response.status}`);
        }

        // تحليل البيانات
        const data = await response.json();
        
        return {
            status: true,
            requests: data.requests || data
        };
        
    } catch (error) {
        console.error('خطأ في جلب طلبات التسجيل:', error);
        return {
            status: false,
            message: error.message
        };
    }
}

// دالة لقبول طلب التسجيل
async function approveRegistrationRequest(requestId) {
    try {
        // الحصول على التوكن من localStorage
        const adminToken = localStorage.getItem('admin_token') || localStorage.getItem('token') || localStorage.getItem('auth_token');
        
        // التحقق من وجود التوكن
        if (!adminToken) {
            throw new Error('لم يتم العثور على توكن المصادقة. يجب تسجيل الدخول أولاً.');
        }

        // إعداد headers للطلب
        const headers = {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        // استدعاء API
        const response = await fetch(`http://192.168.1.8:8000/api/admin/approve-registration/${requestId}`, {
            method: 'POST',
            headers: headers
        });

        // التحقق من حالة الاستجابة
        if (!response.ok) {
            throw new Error(`خطأ في استجابة الخادم: HTTP ${response.status}`);
        }

        // تحليل البيانات
        const data = await response.json();
        
        return {
            status: true,
            message: 'تم قبول طلب التسجيل بنجاح',
            user: data.user || data
        };
        
    } catch (error) {
        console.error('خطأ في قبول طلب التسجيل:', error);
        return {
            status: false,
            message: error.message
        };
    }
}

// دالة لرفض طلب التسجيل
async function rejectRegistrationRequest(requestId, reason = '') {
    try {
        // الحصول على التوكن من localStorage
        const adminToken = localStorage.getItem('admin_token') || localStorage.getItem('token') || localStorage.getItem('auth_token');
        
        // التحقق من وجود التوكن
        if (!adminToken) {
            throw new Error('لم يتم العثور على توكن المصادقة. يجب تسجيل الدخول أولاً.');
        }

        // إعداد headers للطلب
        const headers = {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        // استدعاء API
        const response = await fetch(`http://192.168.1.8:8000/api/admin/reject-registration/${requestId}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ reason: reason })
        });

        // التحقق من حالة الاستجابة
        if (!response.ok) {
            throw new Error(`خطأ في استجابة الخادم: HTTP ${response.status}`);
        }

        // تحليل البيانات
        const data = await response.json();
        
        return {
            status: true,
            message: 'تم رفض طلب التسجيل',
            request: data.request || data
        };
        
    } catch (error) {
        console.error('خطأ في رفض طلب التسجيل:', error);
        return {
            status: false,
            message: error.message
        };
    }
}

// دالة لتحديث حالة اعتماد المستخدم
async function updateUserStatus(userId, isApproved) {
    try {
        // الحصول على التوكن من localStorage
        const adminToken = localStorage.getItem('admin_token') || localStorage.getItem('token') || localStorage.getItem('auth_token');
        
        // التحقق من وجود التوكن
        if (!adminToken) {
            throw new Error('لم يتم العثور على توكن المصادقة. يجب تسجيل الدخول أولاً.');
        }

        // إعداد headers للطلب
        const headers = {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        // استدعاء API
        const response = await fetch(`http://192.168.1.8:8000/api/users/${userId}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({ is_approved: isApproved })
        });

        // التحقق من حالة الاستجابة
        if (!response.ok) {
            let errorMessage = `خطأ في استجابة الخادم: HTTP ${response.status}`;
            
            if (response.status === 401) {
                errorMessage = 'خطأ في المصادقة: التوكن غير صحيح أو منتهي الصلاحية';
            } else if (response.status === 404) {
                errorMessage = 'المستخدم غير موجود';
            }
            
            throw new Error(errorMessage);
        }

        // تحليل البيانات
        const data = await response.json();
        
        return {
            status: true,
            message: isApproved ? 'تم اعتماد المستخدم بنجاح' : 'تم إلغاء اعتماد المستخدم بنجاح',
            user: data.user || data
        };
        
    } catch (error) {
        console.error('خطأ في تحديث حالة المستخدم:', error);
        return {
            status: false,
            message: error.message
        };
    }
}

// تصدير الدوال للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchUsers,
        fetchUserById,
        addUser,
        updateUser,
        deleteUser,
        updateUserStatus
    };
}

// دالة لإضافة مستخدم جديد للبيانات التجريبية
function addDemoUser(userData) {
    // الحصول على البيانات التجريبية الحالية
    let demoData = getDemoUsers();
    
    // إنشاء ID جديد
    const newId = Math.max(...demoData.users.map(user => user.id), 0) + 1;
    
    // التأكد من أن is_approved هو رقم صحيح (0 أو 1)
    let approvalStatus = 0; // القيمة الافتراضية
    if (userData.is_approved === true || userData.is_approved === 1 || userData.is_approved === '1') {
        approvalStatus = 1;
    } else if (userData.is_approved === false || userData.is_approved === 0 || userData.is_approved === '0') {
        approvalStatus = 0;
    }
    
    // إنشاء المستخدم الجديد
    const newUser = {
        id: newId,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        user_type: userData.user_type,
        is_approved: approvalStatus,
        created_at: new Date().toISOString().split('T')[0],
        last_login: null,
        ...userData,
        is_approved: approvalStatus // التأكد من أن القيمة الصحيحة محفوظة
    };
    
    // إضافة المستخدم الجديد
    demoData.users.push(newUser);
    
    // حفظ البيانات المحدثة في localStorage للاستمرارية
    localStorage.setItem('demoUsers', JSON.stringify(demoData.users));
    
    return {
        status: true,
        message: 'تم إضافة المستخدم بنجاح',
        user: newUser
    };
}

// دالة لتحديث البيانات التجريبية محلياً
function updateDemoUser(userId, userData) {
    // الحصول على البيانات التجريبية الحالية
    let demoData = getDemoUsers();
    
    // البحث عن المستخدم وتحديث بياناته
    const userIndex = demoData.users.findIndex(user => user.id == userId);
    
    if (userIndex !== -1) {
        // التأكد من أن is_approved هو رقم صحيح (0 أو 1) إذا تم تمريره
        let updatedData = { ...userData };
        if (userData.is_approved !== undefined) {
            if (userData.is_approved === true || userData.is_approved === 1 || userData.is_approved === '1') {
                updatedData.is_approved = 1;
            } else if (userData.is_approved === false || userData.is_approved === 0 || userData.is_approved === '0') {
                updatedData.is_approved = 0;
            }
        }
        
        // تحديث البيانات
        demoData.users[userIndex] = {
            ...demoData.users[userIndex],
            ...updatedData,
            id: parseInt(userId) // التأكد من أن ID رقم
        };
        
        // حفظ البيانات المحدثة في localStorage للاستمرارية
        localStorage.setItem('demoUsers', JSON.stringify(demoData.users));
        
        return {
            status: true,
            message: 'تم تحديث بيانات المستخدم بنجاح',
            user: demoData.users[userIndex]
        };
    } else {
        return {
            status: false,
            message: 'المستخدم غير موجود'
        };
    }
}

// دالة لحذف المستخدم من البيانات التجريبية
function deleteDemoUser(userId) {
    try {
        // الحصول على البيانات التجريبية الحالية
        let demoData = getDemoUsers();
        let demoUsers = demoData.users; // تصحيح: استخدام users بدلاً من data
        
        // البحث عن المستخدم
        const userIndex = demoUsers.findIndex(user => user.id == userId);
        
        if (userIndex === -1) {
            return {
                status: false,
                message: 'المستخدم غير موجود'
            };
        }
        
        // حذف المستخدم من المصفوفة
        const deletedUser = demoUsers.splice(userIndex, 1)[0];
        
        // حفظ البيانات المحدثة في localStorage
        localStorage.setItem('demoUsers', JSON.stringify(demoUsers));
        
        return {
            status: true,
            message: 'تم حذف المستخدم بنجاح',
            deleted_user: deletedUser
        };
    } catch (error) {
        console.error('خطأ في حذف المستخدم التجريبي:', error);
        return {
            status: false,
            message: 'حدث خطأ في حذف المستخدم'
        };
    }
}

// دالة لإرجاع بيانات تجريبية للاختبار
function getDemoUsers() {
    // التحقق من وجود بيانات محفوظة في localStorage
    const savedData = localStorage.getItem('demoUsers');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            return {
                status: true,
                users: parsedData
            };
        } catch (error) {
            console.error('خطأ في تحليل البيانات المحفوظة:', error);
        }
    }
    
    const defaultUsers = [
        {
            id: 1,
            name: 'أحمد محمد',
            email: 'ahmed@example.com',
            phone: '0123456789',
            user_type: 'admin',
            is_approved: 1,
            created_at: '2024-01-15',
            last_login: '2024-01-20'
        },
        {
            id: 2,
            name: 'علي السائق',
            email: 'ali.driver@example.com',
            phone: '0123456790',
            user_type: 'driver',
            is_approved: 1,
            created_at: '2024-01-16',
            last_login: '2024-01-19'
        },
        {
            id: 3,
            name: 'مكتب التوصيل السريع',
            email: 'delivery@example.com',
            phone: '0123456791',
            user_type: 'car_rental_office',
            is_approved: 1,
            created_at: '2024-01-17',
            last_login: '2024-01-18'
        },
        {
            id: 4,
            name: 'مطعم الأصالة',
            email: 'restaurant@example.com',
            phone: '0123456792',
            user_type: 'restaurant',
            is_approved: 0,
            created_at: '2024-01-18',
            last_login: null
        },
        {
            id: 5,
            name: 'محمد السمسار',
            email: 'broker@example.com',
            phone: '0123456793',
            user_type: 'real_estate_individual',
            is_approved: 1,
            created_at: '2024-01-19',
            last_login: '2024-01-21'
        },
        {
            id: 6,
            name: 'مكتب العقارات المتميز',
            email: 'realestate@example.com',
            phone: '0123456794',
            user_type: 'real_estate_office',
            is_approved: 1,
            created_at: '2024-01-20',
            last_login: '2024-01-22'
        }
    ];
    
    return {
        status: true,
        users: defaultUsers
    };
}

// دالة لجلب بيانات المستخدمين من API
async function fetchUsers() {
    try {
        // الحصول على التوكن من localStorage
        const adminToken = localStorage.getItem('admin_token') || localStorage.getItem('token') || localStorage.getItem('auth_token');

        // التحقق من وجود التوكن
        if (!adminToken) {
            throw new Error('لم يتم العثور على توكن المصادقة. يجب تسجيل الدخول أولاً.');
        }

        // إعداد headers للطلب
        const headers = {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        // استدعاء API
        const response = await fetch('http://192.168.1.8:8000/api/users', {
            method: 'GET',
            headers: headers
        });

        // التحقق من حالة الاستجابة
        if (!response.ok) {
            let errorMessage = `خطأ في استجابة الخادم: HTTP ${response.status}`;
            
            if (response.status === 401) {
                errorMessage = 'خطأ في المصادقة: التوكن غير صحيح أو منتهي الصلاحية';
            } else if (response.status === 403) {
                errorMessage = 'ليس لديك صلاحية للوصول إلى هذه البيانات';
            } else if (response.status === 404) {
                errorMessage = 'API endpoint غير موجود';
            } else if (response.status >= 500) {
                errorMessage = 'خطأ في الخادم الخارجي';
            }
            
            throw new Error(errorMessage);
        }

        // تحليل البيانات
        const data = await response.json();
        
        // إرجاع البيانات بالتنسيق المطلوب
        return {
            status: true,
            users: data.users || data
        };
        
    } catch (error) {
        console.error('خطأ في جلب بيانات المستخدمين:', error);
        return {
            status: false,
            message: error.message,
            users: []
        };
    }
}

//