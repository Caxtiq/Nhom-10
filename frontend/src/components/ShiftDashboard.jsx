import { useState, useEffect } from 'react';

function ShiftDashboard() {
  const [shifts, setShifts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [userId, setUserId] = useState('');
  const [locationId, setLocationId] = useState('1'); 
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [shiftsRes, usersRes] = await Promise.all([
        fetch('http://localhost:8080/api/shifts'),
        fetch('http://localhost:8080/api/users')
      ]);
      const shiftsData = await shiftsRes.json();
      const usersData = await usersRes.json();
      
      if (Array.isArray(shiftsData)) setShifts(shiftsData);
      if (Array.isArray(usersData)) setUsers(usersData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:8080/api/shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          UserID: parseInt(userId), 
          LocationID: parseInt(locationId),
          StartTime: new Date(startTime).toISOString(),
          EndTime: new Date(endTime).toISOString(),
          Status: 'scheduled'
        })
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const getUserName = (id) => {
    const user = users.find(u => u.ID === id);
    return user ? user.Name : `User #${id}`;
  };

  return (
    <div className="row">
      <div className="col-md-4 mb-4">
        <div className="card h-100">
          <div className="card-header">Schedule Shift</div>
          <div className="card-body">
            <form onSubmit={handleSchedule}>
              <div className="mb-3">
                <label className="form-label text-muted small">Employee</label>
                <select className="form-select" value={userId} onChange={(e) => setUserId(e.target.value)} required>
                  <option value="" disabled>Select Employee</option>
                  {users.map(u => (
                    <option key={u.ID} value={u.ID}>{u.Name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small">Start Time</label>
                <input 
                  type="datetime-local" 
                  className="form-control"
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="form-label text-muted small">End Time</label>
                <input 
                  type="datetime-local" 
                  className="form-control"
                  value={endTime} 
                  onChange={(e) => setEndTime(e.target.value)} 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Assign Shift</button>
            </form>
          </div>
        </div>
      </div>

      <div className="col-md-8">
        <div className="card h-100">
          <div className="card-header">Upcoming Shifts</div>
          <div className="card-body p-0 table-responsive">
            {loading ? <div className="p-4 text-center text-muted">Loading...</div> : (
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-4">Employee</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {shifts.map(s => (
                    <tr key={s.ID}>
                      <td className="px-4 fw-medium">{getUserName(s.UserID)}</td>
                      <td className="text-muted">{new Date(s.StartTime).toLocaleString()}</td>
                      <td className="text-muted">{new Date(s.EndTime).toLocaleString()}</td>
                      <td>
                        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">
                          {s.Status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {shifts.length === 0 && (
                     <tr><td colSpan="4" className="text-center py-4 text-muted">No shifts scheduled yet.</td></tr>
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

export default ShiftDashboard;
