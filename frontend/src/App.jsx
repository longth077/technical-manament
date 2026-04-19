import { useEffect, useMemo, useState } from 'react';
import EntitySection from './components/EntitySection';
import AdminUsers from './components/AdminUsers';
import AdminDataTransfer from './components/AdminDataTransfer';
import { Api } from './services/api';
import './App.css';

const entities = [
  'unit_info', 'overview', 'staff', 'warehouses', 'warehouse_images', 'warehouse_equipment',
  'warehouse_inspections', 'warehouse_access', 'warehouse_handover', 'warehouse_exports',
  'warehouse_imports', 'warehouse_lightning', 'weapons', 'tech_equipment', 'vehicles', 'materials',
];

function App() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('admin');
  const [password, setPassword] = useState('dank4920132018');
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [credential, setCredential] = useState(localStorage.getItem('credential') || '');
  const [user, setUser] = useState(null);
  const [activeEntity, setActiveEntity] = useState('staff');
  const [message, setMessage] = useState('');

  const canEdit = useMemo(() => user && user.role !== 'readonly', [user]);

  const signIn = async () => {
    if (!usernameOrEmail || !password) {
      setMessage('Username/email and password are required');
      return;
    }
    const encoded = btoa(`${usernameOrEmail}:${password}`);
    try {
      const data = await Api.me(encoded);
      setCredential(encoded);
      localStorage.setItem('credential', encoded);
      setUser(data.user);
      setMessage('Signed in');
    } catch (e) {
      setMessage(e.message);
    }
  };

  const signOut = () => {
    localStorage.removeItem('credential');
    setCredential('');
    setUser(null);
  };

  const signup = async () => {
    if (!signupUsername || !signupEmail || !signupPassword || !fullName) {
      setMessage('All signup fields are required');
      return;
    }
    if (signupPassword.length < 8) {
      setMessage('Password must be at least 8 characters');
      return;
    }
    try {
      await Api.signup({ username: signupUsername, email: signupEmail, password: signupPassword, fullName });
      setMessage('Signup created, waiting admin approval');
    } catch (e) {
      setMessage(e.message);
    }
  };

  const restore = async () => {
    if (!credential) return;
    try {
      const data = await Api.me(credential);
      setUser(data.user);
    } catch {
      signOut();
    }
  };

  useEffect(() => { restore(); }, []);

  if (!user) {
    return (
      <main className="app">
        <h1>Technical Management</h1>
        <p>{message}</p>
        <section className="card">
          <h3>Sign in (Basic Authentication)</h3>
          <input placeholder="Username or email" value={usernameOrEmail} onChange={(e) => setUsernameOrEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={signIn}>Sign in</button>
        </section>
        <section className="card">
          <h3>Sign up</h3>
          <input placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <input placeholder="Username" value={signupUsername} onChange={(e) => setSignupUsername(e.target.value)} />
          <input placeholder="Email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
          <button onClick={signup}>Sign up</button>
        </section>
      </main>
    );
  }

  return (
    <main className="app">
      <h1>Technical Management Dashboard</h1>
      <p>{user.fullName} ({user.role})</p>
      <p>{message}</p>
      <button onClick={signOut}>Sign out</button>

      <nav className="tabs">
        {entities.map((entity) => (
          <button key={entity} onClick={() => setActiveEntity(entity)} className={activeEntity === entity ? 'active' : ''}>{entity}</button>
        ))}
      </nav>

      <EntitySection entity={activeEntity} credential={credential} canEdit={canEdit} />

      {user.role === 'admin' && (
        <>
          <AdminUsers credential={credential} />
          <AdminDataTransfer credential={credential} />
        </>
      )}
    </main>
  );
}

export default App;
