document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const alert = document.getElementById('alert');
  const submitBtn = document.getElementById('submitBtn');
  let csrfToken = '';

  // Fetch CSRF token
  fetch('/api/csrf-token')
    .then((res) => res.json())
    .then((data) => { csrfToken = data.csrfToken; })
    .catch(() => {});

  function showAlert(message, type) {
    alert.textContent = message;
    alert.className = `alert alert-${type}`;
    alert.style.display = 'block';
  }

  function hideAlert() {
    alert.style.display = 'none';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();

    const fullName = document.getElementById('fullName').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Client-side validation
    if (!fullName || !username || !email || !password || !confirmPassword) {
      showAlert('Vui lòng điền đầy đủ thông tin.', 'error');
      return;
    }

    if (username.length < 3) {
      showAlert('Tên đăng nhập phải có ít nhất 3 ký tự.', 'error');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      showAlert('Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới.', 'error');
      return;
    }

    if (password.length < 6) {
      showAlert('Mật khẩu phải có ít nhất 6 ký tự.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showAlert('Mật khẩu xác nhận không khớp.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Đang đăng ký...';

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify({ fullName, username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        window.location.href = '/dashboard.html';
      } else {
        const msg = data.errors?.[0]?.msg || 'Đăng ký thất bại.';
        showAlert(msg, 'error');
      }
    } catch {
      showAlert('Không thể kết nối đến máy chủ.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Đăng ký';
    }
  });
});
