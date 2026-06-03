import { useState, useEffect } from 'react';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('http://localhost:8080/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Check every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:8080/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // Update local state instantly for better UX
      setNotifications(notifications.map(n => n.ID === id ? { ...n, IsRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.IsRead).length;

  return (
    <div className="position-relative">
      <button 
        className="btn btn-light position-relative p-2 rounded-circle border border-2 shadow-sm"
        onClick={() => setShowDropdown(!showDropdown)}
        style={{ width: '45px', height: '45px', transition: 'all 0.2s' }}
      >
        <i className="bi bi-bell fs-5 text-secondary"></i>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow-sm">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div 
          className="dropdown-menu dropdown-menu-end shadow-lg show p-0 border-0" 
          style={{ 
            position: 'absolute', 
            right: 0, 
            top: '55px', 
            minWidth: '350px',
            maxHeight: '400px',
            overflowY: 'auto',
            zIndex: 1050,
            borderRadius: '12px'
          }}
        >
          <div className="p-3 border-bottom bg-light sticky-top rounded-top d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold">Notifications</h6>
            {unreadCount > 0 && <span className="badge bg-primary rounded-pill">{unreadCount} New</span>}
          </div>
          
          <div className="list-group list-group-flush">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted">
                <i className="bi bi-bell-slash fs-3 d-block mb-2"></i>
                <small>No notifications yet</small>
              </div>
            ) : (
              notifications.map(notif => (
                <div 
                  key={notif.ID} 
                  className={`list-group-item list-group-item-action p-3 border-bottom ${!notif.IsRead ? 'bg-primary bg-opacity-10' : ''}`}
                  onClick={() => !notif.IsRead && handleMarkAsRead(notif.ID)}
                  style={{ cursor: notif.IsRead ? 'default' : 'pointer', transition: 'all 0.2s' }}
                >
                  <div className="d-flex w-100 justify-content-between align-items-start">
                    <div className="me-3">
                      {!notif.IsRead && <span className="p-1 bg-primary border border-light rounded-circle d-inline-block me-2 mt-1"></span>}
                      <span className={!notif.IsRead ? 'fw-bold text-dark' : 'text-secondary'}>
                        {notif.Message}
                      </span>
                    </div>
                  </div>
                  <small className="text-muted d-block mt-2">
                    {new Date(notif.CreatedAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                  </small>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
      {/* Invisible backdrop to close dropdown when clicking outside */}
      {showDropdown && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100" 
          style={{ zIndex: 1040 }}
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </div>
  );
}

export default NotificationBell;
