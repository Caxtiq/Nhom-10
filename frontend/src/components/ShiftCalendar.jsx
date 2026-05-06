import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

function ShiftCalendar() {
  const [shifts, setShifts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 5 seconds since backend is auto-scheduling
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [shiftsRes, usersRes] = await Promise.all([
        fetch('http://localhost:8080/api/shifts'),
        fetch('http://localhost:8080/api/users')
      ]);
      const shiftsData = await shiftsRes.json();
      const usersData = await usersRes.json();
      
      if (Array.isArray(usersData)) setUsers(usersData);
      
      if (Array.isArray(shiftsData)) {
        // Map shifts to React-Big-Calendar format
        const events = shiftsData.map(s => {
          const user = usersData.find(u => u.ID === s.UserID);
          const userName = user ? user.Name : `User #${s.UserID}`;
          return {
            title: `${userName} - ${s.Notes || 'Shift'}`,
            start: new Date(s.StartTime),
            end: new Date(s.EndTime),
            resource: s,
          };
        });
        setShifts(events);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="card-header d-flex justify-content-between align-items-center bg-white border-bottom py-3">
        <span className="fw-bold">Interactive Calendar Board</span>
        <div>
          <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2">
            <div className="spinner-grow spinner-grow-sm me-2" role="status" style={{width: '0.7rem', height: '0.7rem'}}>
              <span className="visually-hidden">Loading...</span>
            </div>
            Auto-Scheduler Running
          </span>
        </div>
      </div>
      <div className="card-body p-3" style={{ height: '70vh' }}>
        {loading && shifts.length === 0 ? <div className="p-4 text-center text-muted">Loading calendar...</div> : (
          <Calendar
            localizer={localizer}
            events={shifts}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            defaultView="week"
            views={['month', 'week', 'day']}
            step={30}
            showMultiDayTimes
          />
        )}
      </div>
    </div>
  );
}

export default ShiftCalendar;
