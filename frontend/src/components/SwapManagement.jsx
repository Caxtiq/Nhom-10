import { useState, useEffect } from 'react';

function SwapManagement() {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSwaps();
  }, []);

  const fetchSwaps = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/swaps');
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
        method: 'POST'
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
        method: 'POST'
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
                <th>Requester (User ID)</th>
                <th>Target (User ID)</th>
                <th>Shift ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {swaps.map(s => (
                <tr key={s.ID}>
                  <td className="px-4 fw-medium text-muted">#{s.ID}</td>
                  <td>User #{s.RequesterID}</td>
                  <td>User #{s.TargetUserID}</td>
                  <td>Shift #{s.ShiftID}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-success me-2"
                      onClick={() => handleApprove(s.ID)}
                    >
                      <i className="bi bi-check-circle"></i> Approve
                    </button>
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
    </div>
  );
}

export default SwapManagement;
