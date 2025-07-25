// Check if user is already logged in
document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("authToken");
  if (token) {
    // Redirect to dashboard if already logged in
    window.location.href = "index.html";
  }
});

// Toggle password visibility
function togglePassword() {
  const passwordInput = document.getElementById("password");
  const passwordIcon = document.getElementById("passwordIcon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    passwordIcon.classList.remove("fa-eye");
    passwordIcon.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    passwordIcon.classList.remove("fa-eye-slash");
    passwordIcon.classList.add("fa-eye");
  }
}

// Show error message
function showError(message) {
  const errorDiv = document.getElementById("errorMessage");
  const errorText = document.getElementById("errorText");
  const successDiv = document.getElementById("successMessage");

  successDiv.classList.remove("show");
  errorText.textContent = message;
  errorDiv.classList.add("show");

  // Auto hide after 5 seconds
  setTimeout(() => {
    errorDiv.classList.remove("show");
  }, 5000);
}

// Show success message
function showSuccess(message) {
  const successDiv = document.getElementById("successMessage");
  const successText = document.getElementById("successText");
  const errorDiv = document.getElementById("errorMessage");

  errorDiv.classList.remove("show");
  successText.textContent = message;
  successDiv.classList.add("show");
}

// Clear form errors
function clearErrors() {
  const inputs = document.querySelectorAll(".form-input");
  inputs.forEach((input) => {
    input.classList.remove("error");
  });
  document.getElementById("errorMessage").classList.remove("show");
}

// Set loading state
function setLoading(loading) {
  const loginBtn = document.getElementById("loginBtn");
  const btnLoading = document.getElementById("btnLoading");
  const btnText = document.getElementById("btnText");

  if (loading) {
    loginBtn.disabled = true;
    btnLoading.classList.add("show");
    btnText.textContent = "جاري تسجيل الدخول...";
  } else {
    loginBtn.disabled = false;
    btnLoading.classList.remove("show");
    btnText.textContent = "تسجيل الدخول";
  }
}

// Validate form
function validateForm(email, password) {
  let isValid = true;

  // Clear previous errors
  clearErrors();

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    document.getElementById("email").classList.add("error");
    showError("يرجى إدخال البريد الإلكتروني");
    isValid = false;
  } else if (!emailRegex.test(email)) {
    document.getElementById("email").classList.add("error");
    showError("يرجى إدخال بريد إلكتروني صحيح");
    isValid = false;
  }

  // Validate password
  if (!password) {
    document.getElementById("password").classList.add("error");
    if (isValid) showError("يرجى إدخال كلمة المرور");
    isValid = false;
  } else if (password.length < 6) {
    document.getElementById("password").classList.add("error");
    if (isValid) showError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    isValid = false;
  }

  return isValid;
}

// Handle login
async function handleLogin(email, password) {
  try {
    setLoading(true);

    const data = await apiPost("/login", { email, password });

    if (data.status === true) {
      // Save token and user data in multiple formats for compatibility
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user));

      // Show success message
      showSuccess(data.message || "تم تسجيل الدخول بنجاح");

      // Redirect to dashboard after 1 second
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } else {
      showError(data.message || "فشل في تسجيل الدخول");
    }
  } catch (error) {
    console.error("Login error:", error);
    showError("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
  } finally {
    setLoading(false);
  }
}

// Form submission
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (validateForm(email, password)) {
    handleLogin(email, password);
  }
});

// Real-time validation
document.getElementById("email").addEventListener("input", function () {
  this.classList.remove("error");
});

document.getElementById("password").addEventListener("input", function () {
  this.classList.remove("error");
});

// Handle Enter key
document.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    document.getElementById("loginForm").dispatchEvent(new Event("submit"));
  }
});
