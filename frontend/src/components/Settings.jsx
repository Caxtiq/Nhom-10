import { useState, useEffect } from 'react';

function Settings() {
  const [hours, setHours] = useState(8);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/settings');
      const data = await res.json();
      if (data && data.MaxShiftHours) {
        const total = data.MaxShiftHours;
        const h = Math.floor(total);
        const m = Math.floor((total - h) * 60);
        // Use rounding to avoid floating point precision issues like 59.99999
        const s = Math.round((total - h - m / 60) * 3600);
        
        setHours(h);
        setMinutes(m);
        setSeconds(s);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Calculate total hours
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    const totalHours = h + (m / 60) + (s / 3600);

    try {
      await fetch('http://localhost:8080/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ MaxShiftHours: totalHours })
      });
      alert('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading settings...</div>;

  return (
    <div className="row">
      <div className="col-md-6 offset-md-3">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white fw-bold py-3">
            System Configuration
          </div>
          <div className="card-body">
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label className="form-label fw-medium">Max Shift Duration</label>
                <div className="d-flex gap-2">
                  <div className="input-group">
                    <input 
                      type="number" 
                      className="form-control text-center" 
                      value={hours} 
                      onChange={(e) => setHours(e.target.value)}
                      min="0"
                      max="24"
                      required 
                    />
                    <span className="input-group-text">HH</span>
                  </div>
                  <div className="input-group">
                    <input 
                      type="number" 
                      className="form-control text-center" 
                      value={minutes} 
                      onChange={(e) => setMinutes(e.target.value)}
                      min="0"
                      max="59"
                      required 
                    />
                    <span className="input-group-text">MM</span>
                  </div>
                  <div className="input-group">
                    <input 
                      type="number" 
                      className="form-control text-center" 
                      value={seconds} 
                      onChange={(e) => setSeconds(e.target.value)}
                      min="0"
                      max="59"
                      required 
                    />
                    <span className="input-group-text">SS</span>
                  </div>
                </div>
                <div className="form-text mt-2">
                  The Auto-Scheduling Engine will automatically split tasks longer than this duration into multiple shifts.
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={saving}>
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
