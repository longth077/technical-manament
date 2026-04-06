document.addEventListener('DOMContentLoaded', async () => {
  const navUsername = document.getElementById('navUsername');
  const welcomeTitle = document.getElementById('welcomeTitle');
  const infoUsername = document.getElementById('infoUsername');
  const infoEmail = document.getElementById('infoEmail');
  const infoFullName = document.getElementById('infoFullName');
  const infoRole = document.getElementById('infoRole');
  const logoutBtn = document.getElementById('logoutBtn');

  // Check authentication
  try {
    const res = await fetch('/api/auth/me');
    if (!res.ok) {
      window.location.href = '/signin.html';
      return;
    }

    const data = await res.json();
    const user = data.user;

    navUsername.textContent = user.fullName;
    welcomeTitle.textContent = `Chào mừng, ${user.fullName}!`;
    infoUsername.textContent = user.username;
    infoEmail.textContent = user.email;
    infoFullName.textContent = user.fullName;
    infoRole.textContent = user.role === 'admin' ? 'Quản trị viên' : 'Người dùng';
  } catch {
    window.location.href = '/signin.html';
  }

  // Logout handler
  logoutBtn.addEventListener('click', async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      window.location.href = '/signin.html';
    }
  });
});
