document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signinForm');
  const alert = document.getElementById('alert');
  const submitBtn = document.getElementById('submitBtn');

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

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
      showAlert('Vui lòng nhập tên đăng nhập và mật khẩu.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Đang đăng nhập...';

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        window.location.href = '/dashboard.html';
      } else {
        const msg = data.errors?.[0]?.msg || 'Đăng nhập thất bại.';
        showAlert(msg, 'error');
      }
    } catch {
      showAlert('Không thể kết nối đến máy chủ.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Đăng nhập';
    }
  });
});
