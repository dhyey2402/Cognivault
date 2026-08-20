import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Settings, Shield, Bell, Save, Check } from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    platformName: 'CogniVault',
    theme: 'dark',
    examShieldStrictness: 'high',
    requireFullscreen: true,
    blockCopyPaste: true,
    alertLowScores: true,
    alertNewRegistrations: false
  });

  useEffect(() => {
    // Load from local storage for now (MVP)
    const savedSettings = localStorage.getItem('admin_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('admin_settings', JSON.stringify(settings));
      setIsSaving(false);
      toast.success("Settings saved successfully!");
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12 relative z-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Settings className="w-8 h-8 text-indigo-400" />
            Platform Settings
          </h1>
          <p className="text-slate-400 mt-2">Configure global preferences and defaults for the learning platform.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : (
            <Save className="w-5 h-5" />
          )}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-2">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'general' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
            }`}
          >
            <Settings className="w-5 h-5" />
            General
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'security' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
            }`}
          >
            <Shield className="w-5 h-5" />
            ExamShield Defaults
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'notifications' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
            }`}
          >
            <Bell className="w-5 h-5" />
            Alerts & Notifications
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 glass-panel p-8 rounded-3xl border border-white/10">
          
          {activeTab === 'general' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">General Configuration</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Platform Name</label>
                  <input
                    type="text"
                    value={settings.platformName}
                    onChange={(e) => setSettings({...settings, platformName: e.target.value})}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Default Theme</label>
                  <select
                    value={settings.theme}
                    onChange={(e) => setSettings({...settings, theme: e.target.value})}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="dark">Dark Mode (Default)</option>
                    <option value="light">Light Mode</option>
                    <option value="system">System Preference</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">ExamShield Defaults</h2>
              <p className="text-slate-400 text-sm mb-6">These settings will be applied by default to all new quizzes created on the platform.</p>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl border border-white/10">
                  <div>
                    <h4 className="text-white font-medium">Require Fullscreen</h4>
                    <p className="text-slate-400 text-sm mt-1">Force students to stay in fullscreen mode during assessments.</p>
                  </div>
                  <button 
                    onClick={() => setSettings({...settings, requireFullscreen: !settings.requireFullscreen})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.requireFullscreen ? 'bg-indigo-500' : 'bg-slate-700'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.requireFullscreen ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl border border-white/10">
                  <div>
                    <h4 className="text-white font-medium">Block Copy & Paste</h4>
                    <p className="text-slate-400 text-sm mt-1">Prevent clipboard actions within the quiz environment.</p>
                  </div>
                  <button 
                    onClick={() => setSettings({...settings, blockCopyPaste: !settings.blockCopyPaste})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.blockCopyPaste ? 'bg-indigo-500' : 'bg-slate-700'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.blockCopyPaste ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Admin Alerts</h2>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-6 h-6 rounded flex items-center justify-center border transition-colors ${settings.alertLowScores ? 'bg-indigo-500 border-indigo-500' : 'bg-slate-900/30 border-white/10 group-hover:border-slate-500'}`}>
                    {settings.alertLowScores && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-slate-300">Alert me when a quiz average score drops below 50%</span>
                  <input type="checkbox" className="hidden" checked={settings.alertLowScores} onChange={() => setSettings({...settings, alertLowScores: !settings.alertLowScores})} />
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-6 h-6 rounded flex items-center justify-center border transition-colors ${settings.alertNewRegistrations ? 'bg-indigo-500 border-indigo-500' : 'bg-slate-900/30 border-white/10 group-hover:border-slate-500'}`}>
                    {settings.alertNewRegistrations && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-slate-300">Daily email summary of new student registrations</span>
                  <input type="checkbox" className="hidden" checked={settings.alertNewRegistrations} onChange={() => setSettings({...settings, alertNewRegistrations: !settings.alertNewRegistrations})} />
                </label>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
