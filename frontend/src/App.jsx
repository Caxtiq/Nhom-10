import { useState } from 'react';
import UserList from './components/UserList';
import ShiftDashboard from './components/ShiftDashboard';
import ShiftCalendar from './components/ShiftCalendar';
import TaskManagement from './components/TaskManagement';
import Settings from './components/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('shifts');

  return (
    <div className="container-fluid p-0">
      <div className="row g-0 min-vh-100">
        
        {/* Sidebar */}
        <div className="col-md-2 bg-light border-end pt-4 shadow-sm">
          <div className="text-center px-3 mb-4 pb-3 border-bottom">
            <h5 className="fw-bold text-dark mb-0">Shift Management</h5>
          </div>
          <ul className="nav nav-pills flex-column px-3">
            <li className="nav-item mb-2">
              <button 
                className={`nav-link w-100 text-start ${activeTab === 'tasks' ? 'active bg-dark text-white' : 'text-dark hover-bg-light'}`}
                onClick={() => setActiveTab('tasks')}
              >
                <i className="bi bi-list-task me-2"></i> Task Needs (Auto)
              </button>
            </li>
            <li className="nav-item mb-2">
              <button 
                className={`nav-link w-100 text-start ${activeTab === 'calendar' ? 'active bg-dark text-white' : 'text-dark hover-bg-light'}`}
                onClick={() => setActiveTab('calendar')}
              >
                <i className="bi bi-kanban me-2"></i> Calendar Board
              </button>
            </li>
            <li className="nav-item mb-2">
              <button 
                className={`nav-link w-100 text-start ${activeTab === 'shifts' ? 'active bg-dark text-white' : 'text-dark hover-bg-light'}`}
                onClick={() => setActiveTab('shifts')}
              >
                <i className="bi bi-calendar3 me-2"></i> Shift Dashboard
              </button>
            </li>
            <li className="nav-item mb-2">
              <button 
                className={`nav-link w-100 text-start ${activeTab === 'users' ? 'active bg-dark text-white' : 'text-dark hover-bg-light'}`}
                onClick={() => setActiveTab('users')}
              >
                <i className="bi bi-people me-2"></i> Team Members
              </button>
            </li>
            <li className="nav-item mt-4 pt-3 border-top">
              <button 
                className={`nav-link w-100 text-start ${activeTab === 'settings' ? 'active bg-dark text-white' : 'text-dark hover-bg-light'}`}
                onClick={() => setActiveTab('settings')}
              >
                <i className="bi bi-gear me-2"></i> Settings
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="col-md-10 bg-white">
          <div className="p-5">
            <main>
              {activeTab === 'tasks' && <TaskManagement />}
              {activeTab === 'calendar' && <ShiftCalendar />}
              {activeTab === 'shifts' && <ShiftDashboard />}
              {activeTab === 'users' && <UserList />}
              {activeTab === 'settings' && <Settings />}
            </main>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
