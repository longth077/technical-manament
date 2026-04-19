import { useEffect, useState } from 'react';
import { Api } from '../services/api';

export default function AdminUsers({ credential }) {
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');
      const [all, pend] = await Promise.all([Api.listUsers(credential), Api.listPendingUsers(credential)]);
      setUsers(all.users || []);
      setPending(pend.users || []);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    let active = true;
    Promise.all([Api.listUsers(credential), Api.listPendingUsers(credential)])
      .then(([all, pend]) => {
        if (!active) return;
        setUsers(all.users || []);
        setPending(pend.users || []);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [credential]);

  const approve = async (id) => {
    try {
      await Api.approveUser(id, credential);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const setRole = async (id, role) => {
    try {
      await Api.updateUserRole(id, role, credential);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa tài khoản này?')) return;
    try {
      await Api.deleteUser(id, credential);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section className="admin-section">
      {error && <div className="error-msg">{error}</div>}

      {/* Pending Approvals */}
      <div className="panel">
        <div className="panel-header">
          <h3>⏳ Chờ duyệt ({pending.length})</h3>
          <button className="btn btn-sm btn-outline" onClick={load}>↻ Làm mới</button>
        </div>
        {pending.length === 0 ? (
          <div className="empty-state">Không có tài khoản nào chờ duyệt</div>
        ) : (
          <ul className="pending-list">
            {pending.map((u) => (
              <li key={u.id} className="pending-item">
                <div className="pending-info">
                  <span className="name">{u.username}</span>
                  <span className="email">{u.email}</span>
                </div>
                <button className="btn btn-sm btn-success" onClick={() => approve(u.id)}>✓ Duyệt</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* All Users Table */}
      <div className="panel">
        <div className="panel-header">
          <h3>👥 Tất cả tài khoản ({users.length})</h3>
        </div>
        {users.length === 0 ? (
          <div className="empty-state">Chưa có tài khoản nào</div>
        ) : (
          <div className="panel-body-flush">
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tên đăng nhập</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 600 }}>{u.username}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'badge-info' : u.role === 'user' ? 'badge-success' : 'badge-warning'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${u.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td>
                        <div className="td-actions">
                          <select
                            className="form-select"
                            defaultValue={u.role}
                            onChange={(e) => setRole(u.id, e.target.value)}
                            style={{ width: 'auto', padding: '0.3rem 0.5rem', fontSize: '0.78rem' }}
                          >
                            <option value="admin">admin</option>
                            <option value="user">user</option>
                            <option value="readonly">readonly</option>
                          </select>
                          <button className="btn btn-sm btn-danger" onClick={() => remove(u.id)}>Xóa</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
