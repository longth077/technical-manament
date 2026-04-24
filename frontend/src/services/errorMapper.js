const EXACT_ERROR_MAP = {
  'Username already exists': 'Tên đăng nhập đã tồn tại',
  'Email already exists': 'Email đã tồn tại',
  'Authentication required': 'Yêu cầu xác thực',
  'Invalid credentials': 'Thông tin đăng nhập không đúng',
  'Account is pending approval': 'Tài khoản đang chờ quản trị viên duyệt',
  'Account not approved': 'Tài khoản chưa được duyệt',
  Forbidden: 'Bạn không có quyền thực hiện thao tác này',
  'Not found': 'Không tìm thấy dữ liệu',
  'Internal server error': 'Lỗi máy chủ, vui lòng thử lại',
  'Request failed': 'Yêu cầu thất bại',
};

const PATTERN_ERROR_MAP = [
  { pattern: /networkerror|failed to fetch/i, message: 'Không thể kết nối máy chủ. Vui lòng thử lại.' },
  { pattern: /timeout/i, message: 'Kết nối quá thời gian chờ. Vui lòng thử lại.' },
  { pattern: /unique constraint/i, message: 'Dữ liệu đã tồn tại trong hệ thống.' },
  { pattern: /foreign key constraint/i, message: 'Dữ liệu liên quan không hợp lệ hoặc đang được sử dụng.' },
  { pattern: /invalid/i, message: 'Dữ liệu không hợp lệ.' },
];

export function mapApiErrorMessage(message) {
  const raw = String(message || '').trim();
  if (!raw) return 'Đã xảy ra lỗi. Vui lòng thử lại.';
  if (EXACT_ERROR_MAP[raw]) return EXACT_ERROR_MAP[raw];
  const matched = PATTERN_ERROR_MAP.find((item) => item.pattern.test(raw));
  if (matched) return matched.message;
  return raw;
}
