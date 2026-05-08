import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employee');
  const [skillLevel, setSkillLevel] = useState(1);
  const [maxWeeklyHours, setMaxWeeklyHours] = useState(40);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/users');
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, skillLevel: parseInt(skillLevel), maxWeeklyHours: parseInt(maxWeeklyHours) })
      });
      setName('');
      setEmail('');
      setSkillLevel(1);
      setMaxWeeklyHours(40);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="row">
      <div className="col-md-4 mb-4">
        <div className="card h-100">
          <div className="card-header">Add New Member</div>
          <div className="card-body">
            <form onSubmit={handleCreate}>
              <div className="mb-3">
                <label className="form-label text-muted small">Full Name</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small">Email Address</label>
                <input 
                  type="email" 
                  className="form-control"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="form-label text-muted small">Role</label>
                <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small">Skill Level (1-5)</label>
                <input 
                  type="number" 
                  className="form-control"
                  value={skillLevel} 
                  onChange={(e) => setSkillLevel(e.target.value)} 
                  min="1" max="5"
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="form-label text-muted small">Max Weekly OT Limit (Hours)</label>
                <input 
                  type="number" 
                  className="form-control"
                  value={maxWeeklyHours} 
                  onChange={(e) => setMaxWeeklyHours(e.target.value)} 
                  min="1" max="100"
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Add Member</button>
            </form>
          </div>
        </div>
      </div>

      <div className="col-md-8">
        <div className="card h-100">
          <div className="card-header">Team Directory</div>
          <div className="card-body p-0 table-responsive">
            {loading ? <div className="p-4 text-center text-muted">Loading...</div> : (
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-4">ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Skill</th>
                    <th>Max Hrs</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.ID}>
                      <td className="px-4 text-muted">#{u.ID}</td>
                      <td className="fw-medium">{u.Name}</td>
                      <td className="text-muted">{u.Email}</td>
                      <td>
                        <span className={`badge ${u.Role === 'admin' ? 'bg-secondary' : 'bg-light text-dark border'}`}>
                          {u.Role}
                        </span>
                      </td>
                      <td>Level {u.SkillLevel || 1}</td>
                      <td>{u.MaxWeeklyHours || 40}h</td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan="4" className="text-center py-4 text-muted">No users found. Add some!</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserList;
