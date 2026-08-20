import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Bell, Palette, Save, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentSettings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    theme: 'light',
    emailNotifications: true,
    reminderNotifications: true
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      // In a real app, we'd update the user profile via API here
      setIsSaving(false);
      toast.success("Preferences updated successfully!");
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <User className="w-8 h-8 text-indigo-400" />
            Account Settings
          </h1>
          <p className="text-slate-400 mt-2">Manage your profile and platform preferences.</p>
        </div>
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(79,70,229,0.3)] border border-indigo-500"
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
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'profile' ? 'glass-panel text-white border-white/20' : 'text-slate-400 hover:bg-white/5 hover:text-white border-transparent'
            }`}
          >
            <User className="w-5 h-5" />
            Profile Details
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'preferences' ? 'glass-panel text-white border-white/20' : 'text-slate-400 hover:bg-white/5 hover:text-white border-transparent'
            }`}
          >
            <Palette className="w-5 h-5" />
            Appearance
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'notifications' ? 'glass-panel text-white border-white/20' : 'text-slate-400 hover:bg-white/5 hover:text-white border-transparent'
            }`}
          >
            <Bell className="w-5 h-5" />
            Notifications
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 glass-panel p-8 rounded-3xl border border-white/10 shadow-sm">
          
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Profile Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Display Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed opacity-70"
                  />
                  <p className="text-xs text-slate-400 mt-2">Email address cannot be changed. Contact support for help.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Appearance</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Platform Theme</label>
                  <select
                    value={profile.theme}
                    onChange={(e) => setProfile({...profile, theme: e.target.value})}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 [&>option]:bg-slate-900 [&>option]:text-white"
                  >
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode (Default)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Notification Preferences</h2>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-6 h-6 rounded flex items-center justify-center border transition-colors ${profile.emailNotifications ? 'bg-indigo-600 border-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'bg-slate-800 border-white/20 group-hover:border-white/40'}`}>
                    {profile.emailNotifications && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-slate-300">Email me when a new quiz is published</span>
                  <input type="checkbox" className="hidden" checked={profile.emailNotifications} onChange={() => setProfile({...profile, emailNotifications: !profile.emailNotifications})} />
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-6 h-6 rounded flex items-center justify-center border transition-colors ${profile.reminderNotifications ? 'bg-indigo-600 border-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'bg-slate-800 border-white/20 group-hover:border-white/40'}`}>
                    {profile.reminderNotifications && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-slate-300">Remind me about incomplete assessments</span>
                  <input type="checkbox" className="hidden" checked={profile.reminderNotifications} onChange={() => setProfile({...profile, reminderNotifications: !profile.reminderNotifications})} />
                </label>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
