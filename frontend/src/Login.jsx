import { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username: username, Password: password })
      });
      if (res.ok) {
        const data = await res.json();
        onLogin(data.token);
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow border-0 rounded-4 overflow-hidden">
            <div className="card-header bg-dark text-white text-center py-4 border-0">
              <h4 className="mb-0 fw-bold">Admin Login</h4>
            </div>
            <div className="card-body p-4 bg-light">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Username</label>
                  <input type="text" className="form-control border-0 shadow-sm" placeholder="admin" value={username} onChange={e => setUsername(e.target.value)} required />
                </div>
                <div className="mb-4">
                  <label className="form-label text-muted small fw-bold">Password</label>
                  <input type="password" className="form-control border-0 shadow-sm" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-sm">Secure Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
