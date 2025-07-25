// Accounts Page JavaScript Functions

// Global variables
let users = [];
let filteredUsers = [];
let currentPage = 1;
const usersPerPage = 10;
let currentRequestDetails = null;

// Initialize page when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  loadUsers();
  loadPendingRequests();
  const filter = document.getElementById("serviceFilter");
  if (filter) {
    filter.addEventListener("change", applyFilter);
  }
});

// Load users from API
async function loadUsers() {
  try {
    const result = await fetchUsers();
    if (result.status) {
      users = result.users;
    } else {
      users = [];
    }
    applyFilter();
  } catch (error) {
    console.error("Error loading users:", error);
    // Use dummy data for development
    users = [
      {
        id: 1,
        name: "أحمد محمد",
        email: "ahmed@example.com",
        phone: "01234567890",
        userType: "admin",
        status: "active",
        profileImage: null,
        createdAt: "2024-01-15",
      },
      {
        id: 2,
        name: "فاطمة علي",
        email: "fatima@example.com",
        phone: "01987654321",
        userType: "user",
        status: "active",
        profileImage: null,
        createdAt: "2024-01-20",
      },
      {
        id: 3,
        name: "محمد حسن",
        email: "mohamed@example.com",
        phone: "01122334455",
        userType: "moderator",
        status: "inactive",
        profileImage: null,
        createdAt: "2024-01-25",
      },
    ];
    applyFilter();
  }
}

// Load pending registration requests
async function loadPendingRequests() {
  try {
    const requests = await fetchPendingRegistrations();
    console.log("Loaded pending requests:", requests);
  } catch (error) {
    console.error("Error loading pending requests:", error);
  }
}

function applyFilter() {
  const filter = document.getElementById("serviceFilter");
  const value = filter ? filter.value : "all";
  if (value === "normal") {
    filteredUsers = users.filter((u) => u.user_type === "normal");
  } else if (value === "providers") {
    filteredUsers = users.filter((u) => u.user_type !== "normal");
  } else {
    filteredUsers = users.slice();
  }
  displayUsers(filteredUsers);
}

function filterAccounts() {
  applyFilter();
}

// Display users in table
function displayUsers(dataArray = users) {
  const tbody = document.getElementById("accountsTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  const paginatedUsers = dataArray.slice(0, usersPerPage);

  paginatedUsers.forEach((user) => {
    const row = document.createElement("tr");
    const img = user.profile_image || user.logo_image || null;
    const statusText = user.is_approved == 1 ? "معتمد" : "قيد المراجعة";
    row.innerHTML = `
            <td>
                ${img ? `<img src="${img}" class="profile-img" />` : `<div class="profile-placeholder">${getInitials(user.name)}</div>`}
            </td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${getUserTypeText(user.user_type)}</td>
            <td>${statusText}</td>
            <td>${formatDate(user.created_at)}</td>
            <td>${user.last_login ? formatDate(user.last_login) : "-"}</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="viewUser(${user.id})"><i class="fas fa-eye"></i> عرض التفاصيل</button>
                ${user.is_approved == 0 ? `<button class="btn btn-success btn-sm" onclick="approveUser(${user.id})"><i class="fas fa-check"></i> قبول</button>` : ""}
                <button class="btn btn-danger btn-sm" onclick="showDeleteUserModal(${user.id})"><i class="fas fa-trash"></i> حذف</button>
            </td>
        `;
    tbody.appendChild(row);
  });

  updatePagination();
}

// Update pagination controls
function updatePagination() {
  const totalPages = Math.ceil((filteredUsers.length || users.length) / usersPerPage);
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  const pageInfo = document.getElementById("pageInfo");

  if (prevBtn) prevBtn.disabled = currentPage === 1;
  if (nextBtn) nextBtn.disabled = currentPage === totalPages;
  if (pageInfo) pageInfo.textContent = `صفحة ${currentPage} من ${totalPages}`;
}

// Navigate to previous page
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    displayUsers(filteredUsers);
  }
}

// Navigate to next page
function nextPage() {
  const totalPages = Math.ceil((filteredUsers.length || users.length) / usersPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayUsers(filteredUsers);
  }
}

// Show add user modal
function showAddUserModal() {
  document.getElementById("addUserModal").style.display = "block";
}

// Show pending registration requests
async function showPendingRequests() {
  try {
    const requests = await fetchPendingRegistrations();
    const tbody = document.getElementById("pendingRequestsTableBody");

    if (!tbody) {
      console.error("Pending requests table body not found");
      return;
    }

    tbody.innerHTML = "";

    if (requests.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="6" class="text-center">لا توجد طلبات تسجيل معلقة</td></tr>';
    } else {
      requests.forEach((request) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${request.name}</td>
                    <td>${request.email}</td>
                    <td>${request.phone}</td>
                    <td><span class="badge badge-${getBadgeClass(request.userType)}">${getUserTypeText(request.userType)}</span></td>
                    <td>${formatDate(request.requestDate)}</td>
                    <td>
                        <button class="btn btn-info btn-sm" onclick="viewRequestDetails('${request.id}')">
                            <i class="fas fa-eye"></i> عرض التفاصيل
                        </button>
                        <button class="btn btn-success btn-sm" onclick="acceptRequest('${request.id}')">
                            <i class="fas fa-check"></i> قبول
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="rejectRequest('${request.id}')">
                            <i class="fas fa-times"></i> رفض
                        </button>
                    </td>
                `;
        tbody.appendChild(row);
      });
    }

    document.getElementById("registrationRequestModal").style.display = "block";
  } catch (error) {
    console.error("Error showing pending requests:", error);
    alert("حدث خطأ في تحميل طلبات التسجيل");
  }
}

// View request details
async function viewRequestDetails(requestId) {
  try {
    const requests = await fetchPendingRegistrations();
    const request = requests.find((r) => r.id === requestId);

    if (!request) {
      alert("لم يتم العثور على الطلب");
      return;
    }

    currentRequestDetails = request;

    // Update modal content
    document.getElementById("requestUserInitials").textContent = getInitials(
      request.name,
    );
    document.getElementById("requestUserName").textContent = request.name;
    document.getElementById("requestUserEmail").textContent = request.email;

    // Basic information
    const basicInfoContainer = document.getElementById("requestBasicInfo");
    basicInfoContainer.innerHTML = `
            ${createDetailRow("الاسم الكامل", request.name)}
            ${createDetailRow("البريد الإلكتروني", request.email)}
            ${createDetailRow("رقم الهاتف", request.phone)}
            ${createDetailRow("نوع المستخدم", getUserTypeText(request.userType))}
            ${createDetailRow("تاريخ الطلب", formatDate(request.requestDate))}
        `;

    // User type specific information
    const specificInfoContainer = document.getElementById(
      "requestSpecificInfo",
    );
    let specificInfo = "";

    if (request.userType === "driver") {
      specificInfo = `
                ${createDetailRow("رقم الرخصة", request.licenseNumber || "غير محدد")}
                ${createDetailRow("نوع المركبة", request.vehicleType || "غير محدد")}
                ${createDetailRow("رقم المركبة", request.vehicleNumber || "غير محدد")}
            `;
    } else if (request.userType === "vendor") {
      specificInfo = `
                ${createDetailRow("اسم المتجر", request.storeName || "غير محدد")}
                ${createDetailRow("نوع النشاط", request.businessType || "غير محدد")}
                ${createDetailRow("العنوان", request.address || "غير محدد")}
            `;
    } else if (request.userType === "company") {
      specificInfo = `
                ${createDetailRow("اسم الشركة", request.companyName || "غير محدد")}
                ${createDetailRow("السجل التجاري", request.commercialRegister || "غير محدد")}
                ${createDetailRow("العنوان", request.address || "غير محدد")}
            `;
    }

    specificInfoContainer.innerHTML = specificInfo;

    // Document images
    const imageButtonsContainer = document.getElementById(
      "requestImageButtons",
    );
    let imageButtons = "";

    if (request.documents) {
      if (request.documents.nationalId) {
        imageButtons += `<button class="image-btn" onclick="showImage('${request.documents.nationalId}', 'صورة الهوية الوطنية')"><i class="fas fa-id-card"></i> صورة الهوية</button>`;
      }
      if (request.documents.drivingLicense) {
        imageButtons += `<button class="image-btn" onclick="showImage('${request.documents.drivingLicense}', 'صورة رخصة القيادة')"><i class="fas fa-car"></i> رخصة القيادة</button>`;
      }
      if (request.documents.vehicleRegistration) {
        imageButtons += `<button class="image-btn" onclick="showImage('${request.documents.vehicleRegistration}', 'صورة استمارة المركبة')"><i class="fas fa-file-alt"></i> استمارة المركبة</button>`;
      }
      if (request.documents.commercialRegister) {
        imageButtons += `<button class="image-btn" onclick="showImage('${request.documents.commercialRegister}', 'صورة السجل التجاري')"><i class="fas fa-building"></i> السجل التجاري</button>`;
      }
    }

    imageButtonsContainer.innerHTML =
      imageButtons || '<p class="text-muted">لا توجد مستندات مرفقة</p>';

    // Show the modal
    document.getElementById("requestDetailsModal").style.display = "block";
  } catch (error) {
    console.error("Error viewing request details:", error);
    alert("حدث خطأ في عرض تفاصيل الطلب");
  }
}

// Approve current request
async function approveCurrentRequest() {
  if (!currentRequestDetails) {
    alert("لا يوجد طلب محدد للموافقة عليه");
    return;
  }

  try {
    await approveRegistrationRequest(currentRequestDetails.id);
    alert("تم قبول الطلب بنجاح");

    // Close modals and refresh
    closeModal("requestDetailsModal");
    closeModal("registrationRequestModal");
    loadUsers();
  } catch (error) {
    console.error("Error approving request:", error);
    alert("حدث خطأ في قبول الطلب");
  }
}

// Reject current request
async function rejectCurrentRequest() {
  if (!currentRequestDetails) {
    alert("لا يوجد طلب محدد لرفضه");
    return;
  }

  const reason = prompt("يرجى إدخال سبب الرفض (اختياري):");

  try {
    await rejectRegistrationRequest(currentRequestDetails.id, reason);
    alert("تم رفض الطلب بنجاح");

    // Close modals and refresh
    closeModal("requestDetailsModal");
    closeModal("registrationRequestModal");
  } catch (error) {
    console.error("Error rejecting request:", error);
    alert("حدث خطأ في رفض الطلب");
  }
}

// Quick accept request
async function acceptRequest(requestId) {
  try {
    const requests = await fetchPendingRegistrations();
    currentRequestDetails = requests.find((r) => r.id === requestId);
    await approveCurrentRequest();
  } catch (error) {
    console.error("Error accepting request:", error);
    alert("حدث خطأ في قبول الطلب");
  }
}

// Quick reject request
async function rejectRequest(requestId) {
  try {
    const requests = await fetchPendingRegistrations();
    currentRequestDetails = requests.find((r) => r.id === requestId);
    await rejectCurrentRequest();
  } catch (error) {
    console.error("Error rejecting request:", error);
    alert("حدث خطأ في رفض الطلب");
  }
}

// Show rejected requests
function showRejectedRequests() {
  // Implementation for showing rejected requests
  alert("عرض الطلبات المرفوضة - قيد التطوير");
}

// View user details
function viewUser(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) {
    alert("المستخدم غير موجود");
    return;
  }

  const body = document.getElementById("viewUserModalBody");
  if (!body) return;

  let html = "<div class='user-details-grid'>";
  html += createDetailRow("الاسم", user.name || "-");
  html += createDetailRow("البريد الإلكتروني", user.email || "-");
  html += createDetailRow("الجوال", user.phone || "-");
  html += createDetailRow("نوع الحساب", getUserTypeText(user.user_type));
  html += createDetailRow("المحافظة", user.governorate || "-");

  switch (user.user_type) {
    case "real_estate_office":
      html += createDetailRow("اسم المكتب", user.office_name || "-");
      html += createDetailRow("عنوان المكتب", user.office_address || "-");
      break;
    case "real_estate_individual":
      html += createDetailRow("الاسم التجاري", user.agent_name || "-");
      break;
    case "restaurant":
      html += createDetailRow("اسم المطعم", user.restaurant_name || "-");
      if (user.cuisine_types) {
        html += createDetailRow("أنواع المطبخ", user.cuisine_types.join(" , "));
      }
      break;
    case "car_rental_office":
      html += createDetailRow("اسم المكتب", user.office_name || "-");
      break;
    case "driver":
      html += createDetailRow("نوع السيارة", user.car_type || "-");
      html += createDetailRow("موديل السيارة", user.car_model || "-");
      break;
  }
  html += "</div>";

  body.innerHTML = html;
  document.getElementById("viewUserModal").style.display = "block";
}

// Edit user
function editUser(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) {
    alert("المستخدم غير موجود");
    return;
  }

  // Populate edit form with user data
  document.getElementById("editUserId").value = user.id;
  document.getElementById("editUserName").value = user.name;
  document.getElementById("editUserEmail").value = user.email;
  document.getElementById("editUserPhone").value = user.phone;
  document.getElementById("editUserType").value = user.userType;
  document.getElementById("editUserStatus").value = user.status;

  document.getElementById("editUserModal").style.display = "block";
}

// Show delete modal for user
function showDeleteUserModal(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) {
    alert("المستخدم غير موجود");
    return;
  }

  document.getElementById("deleteUserName").textContent = user.name;
  document.getElementById("deleteUserId").value = user.id;
  document.getElementById("deleteUserModal").style.display = "block";
}

// Confirm delete user
async function confirmDeleteUser() {
  const userId = document.getElementById("deleteUserId").value;

  try {
    await deleteUserAPI(userId);
    users = users.filter((u) => u.id != userId);
    applyFilter();
    closeModal("deleteUserModal");
    alert("تم حذف المستخدم بنجاح");
  } catch (error) {
    console.error("Error deleting user:", error);
    alert("حدث خطأ في حذف المستخدم");
  }
}

async function approveUser(userId) {
  if (!confirm("هل تريد قبول هذا الحساب؟")) return;
  try {
    await updateUserStatus(userId, 1);
    const idx = users.findIndex((u) => u.id == userId);
    if (idx !== -1) {
      users[idx].is_approved = 1;
    }
    applyFilter();
    alert("تم اعتماد الحساب بنجاح");
  } catch (error) {
    console.error("Error approving user:", error);
    alert("حدث خطأ في اعتماد الحساب");
  }
}

async function deleteUserAPI(userId) {
  return deleteUser(userId);
}

// Save new user
async function saveUser() {
  const formData = {
    name: document.getElementById("userName").value,
    email: document.getElementById("userEmail").value,
    phone: document.getElementById("userPhone").value,
    userType: document.getElementById("userType").value,
    status: document.getElementById("userStatus").value,
  };

  try {
    const newUser = await addUser(formData);
    users.push(newUser);
    applyFilter();
    closeModal("addUserModal");
    document.getElementById("addUserForm").reset();
    alert("تم إضافة المستخدم بنجاح");
  } catch (error) {
    console.error("Error adding user:", error);
    alert("حدث خطأ في إضافة المستخدم");
  }
}

// Save edited user
async function saveEditedUser() {
  const userId = document.getElementById("editUserId").value;
  const formData = {
    name: document.getElementById("editUserName").value,
    email: document.getElementById("editUserEmail").value,
    phone: document.getElementById("editUserPhone").value,
    userType: document.getElementById("editUserType").value,
    status: document.getElementById("editUserStatus").value,
  };

  try {
    await updateUser(userId, formData);
    const userIndex = users.findIndex((u) => u.id == userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...formData };
    }
    applyFilter();
    closeModal("editUserModal");
    alert("تم تحديث المستخدم بنجاح");
  } catch (error) {
    console.error("Error updating user:", error);
    alert("حدث خطأ في تحديث المستخدم");
  }
}

// Close modal
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
  if (modalId === "requestDetailsModal") {
    currentRequestDetails = null;
  }
}

// Show image in modal
function showImage(imageSrc, title) {
  document.getElementById("imageModalTitle").textContent = title;
  document.getElementById("modalImage").src = imageSrc;
  document.getElementById("imageModal").style.display = "flex";
}

// Helper functions
function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

function createDetailRow(label, value) {
  return `
        <div class="detail-row">
            <span class="detail-label">${label}:</span>
            <span class="detail-value">${value}</span>
        </div>
    `;
}

function formatDate(dateString) {
  if (!dateString) return "غير محدد";
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-SA");
}

function getUserTypeText(userType) {
  const types = {
    admin: "مدير",
    user: "مستخدم",
    normal: "مستخدم",
    moderator: "مشرف",
    driver: "سائق",
    vendor: "تاجر",
    company: "شركة",
    restaurant: "مطعم",
    car_rental_office: "مكتب تأجير",
    real_estate_office: "مكتب عقاري",
    real_estate_individual: "وسيط عقاري",
  };
  return types[userType] || userType;
}

function getBadgeClass(userType) {
  const classes = {
    admin: "primary",
    user: "secondary",
    normal: "secondary",
    moderator: "warning",
    driver: "success",
    vendor: "info",
    company: "primary",
    restaurant: "info",
    car_rental_office: "success",
    real_estate_office: "primary",
    real_estate_individual: "primary",
  };
  return classes[userType] || "secondary";
}

// Close modals when clicking outside
window.onclick = function (event) {
  const modals = [
    "addUserModal",
    "editUserModal",
    "viewUserModal",
    "deleteUserModal",
    "registrationRequestModal",
    "requestDetailsModal",
    "imageModal",
  ];
  modals.forEach((modalId) => {
    const modal = document.getElementById(modalId);
    if (event.target === modal) {
      closeModal(modalId);
    }
  });
};

// Handle escape key to close modals
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    const modals = [
      "addUserModal",
      "editUserModal",
      "viewUserModal",
      "deleteUserModal",
      "registrationRequestModal",
      "requestDetailsModal",
      "imageModal",
    ];
    modals.forEach((modalId) => {
      const modal = document.getElementById(modalId);
      if (
        (modal && modal.style.display === "block") ||
        modal.style.display === "flex"
      ) {
        closeModal(modalId);
      }
    });
  }
});
