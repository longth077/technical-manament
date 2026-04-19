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
    load();
  }, []);

  const approve = async (id) => {
    await Api.approveUser(id, credential);
    await load();
  };

  const setRole = async (id, role) => {
    await Api.updateUserRole(id, role, credential);
    await load();
  };

  const remove = async (id) => {
    if (!confirm('Delete user?')) return;
    await Api.deleteUser(id, credential);
    await load();
  };

  return (
    <section>
      <h3>Admin user management</h3>
      {error && <p className="error">{error}</p>}
      <h4>Pending approvals</h4>
      <ul>
        {pending.map((u) => (
          <li key={u.id}>{u.username} ({u.email}) <button onClick={() => approve(u.id)}>Approve</button></li>
        ))}
      </ul>
      <h4>All users</h4>
      <table>
        <thead><tr><th>username</th><th>email</th><th>role</th><th>status</th><th>actions</th></tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td><td>{u.email}</td><td>{u.role}</td><td>{u.status}</td>
              <td>
                <select defaultValue={u.role} onChange={(e) => setRole(u.id, e.target.value)}>
                  <option value="admin">admin</option>
                  <option value="user">user</option>
                  <option value="readonly">readonly</option>
                </select>
                <button onClick={() => remove(u.id)} style={{ marginLeft: 8 }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
