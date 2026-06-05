import { useState, useEffect } from 'react';

function SwapManagement() {
  const [swaps, setSwaps] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignModalData, setAssignModalData] = useState(null);

  useEffect(() => {
    fetchSwaps();
    fetchUsers();
  }, []);

  const getHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/users', { headers: getHeaders() });
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSwaps = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/swaps', { headers: getHeaders() });
      const data = await res.json();
      if (Array.isArray(data)) setSwaps(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/swaps/${id}/approve`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (!res.ok) {
        const errData = await res.json();
        alert(`Approval Failed: ${errData.error}`);
        return;
      }
      alert('Swap approved successfully!');
      fetchSwaps();
    } catch (err) {
      console.error(err);
      alert('An error occurred while approving.');
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/swaps/${id}/reject`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (!res.ok) {
        const errData = await res.json();
        alert(`Rejection Failed: ${errData.error}`);
        return;
      }
      alert('Swap rejected.');
      fetchSwaps();
    } catch (err) {
      console.error(err);
      alert('An error occurred while rejecting.');
    }
  };

  const handleAssign = async (id, targetUserId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/swaps/${id}/assign`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ TargetUserID: parseInt(targetUserId) })
      });
      if (!res.ok) {
        const errData = await res.json();
        alert(`Assignment Failed: ${errData.error}`);
        return;
      }
      alert('Swap assigned successfully!');
      setAssignModalData(null);
      fetchSwaps();
    } catch (err) {
      console.error(err);
      alert('An error occurred while assigning.');
    }
  };

  const getUserName = (id) => {
    const user = users.find(u => u.ID === id);
    return user ? user.Username : `User #${id}`;
  };

  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
        <div>
          <h5 className="fw-bold mb-0">Shift Swap Requests</h5>
          <small className="text-muted">The Rule Engine will validate approvals against 11-hour rest and OT rules.</small>
        </div>
        <button className="btn btn-outline-secondary btn-sm" onClick={fetchSwaps}>
          <i className="bi bi-arrow-clockwise"></i> Refresh
        </button>
      </div>
      <div className="card-body p-0 table-responsive">
        {loading ? <div className="p-4 text-center text-muted">Loading requests...</div> : (
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="px-4">Swap ID</th>
                <th>Requester</th>
                <th>Target</th>
                <th>Shift ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {swaps.map(s => (
                <tr key={s.ID}>
                  <td className="px-4 fw-medium text-muted">#{s.ID}</td>
                  <td>{getUserName(s.RequesterID)}</td>
                  <td>
                    {s.TargetUserID === 0 ? (
                      <span className="badge bg-warning text-dark">Admin Assignment Needed</span>
                    ) : (
                      getUserName(s.TargetUserID)
                    )}
                  </td>
                  <td>Shift #{s.ShiftID}</td>
                  <td>
                    {s.TargetUserID === 0 ? (
                      <button 
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => setAssignModalData(s.ID)}
                      >
                        <i className="bi bi-person-plus"></i> Assign
                      </button>
                    ) : (
                      <button 
                        className="btn btn-sm btn-success me-2"
                        onClick={() => handleApprove(s.ID)}
                      >
                        <i className="bi bi-check-circle"></i> Approve
                      </button>
                    )}
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleReject(s.ID)}
                    >
                      <i className="bi bi-x-circle"></i> Reject
                    </button>
                  </td>
                </tr>
              ))}
              {swaps.length === 0 && (
                <tr><td colSpan="5" className="text-center py-5 text-muted">No pending swap requests found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {assignModalData && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Assign Replacement</h5>
                <button type="button" className="btn-close" onClick={() => setAssignModalData(null)}></button>
              </div>
              <div className="modal-body">
                <p>Select a user to take over Shift #{swaps.find(s => s.ID === assignModalData)?.ShiftID}:</p>
                <select id="userSelect" className="form-select">
                  <option value="">-- Choose User --</option>
                  {users.map(u => (
                    <option key={u.ID} value={u.ID}>{u.Name} ({u.Role})</option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setAssignModalData(null)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={() => {
                  const targetId = document.getElementById('userSelect').value;
                  if (!targetId) return;
                  handleAssign(assignModalData, targetId);
                }}>Confirm Assignment</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SwapManagement;
