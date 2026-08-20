import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Search, Filter, Download, MoreHorizontal, UserCheck, UserX, User, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import { getErrorMessage } from '../../utils/error';
export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.getAllUsers();
      setUsers(data);
    } catch (err) {
      toast.error('Failed to load students');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await api.toggleUserStatus(userId);
      setUsers(users.map(u => 
        u.id === userId ? { ...u, status: !u.status } : u
      ));
      toast.success('User status updated');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(userId => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : 
                          statusFilter === 'Active' ? user.status === true : user.status === false;
    return matchesSearch && matchesStatus;
  });

  const activeCount = users.filter(u => u.status).length;
  const inactiveCount = users.length - activeCount;

  return (
    <div className="space-y-6 animate-fade-in pb-20 relative z-10">
      
      {/* Header */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 flex flex-col gap-6 relative overflow-hidden">
        {/* Subtle mesh background in corner */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[var(--color-primary)] rounded-full blur-3xl opacity-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <User className="w-6 h-6 text-[var(--color-primary-light)]" /> Students
            </h1>
            <p className="text-slate-400 mt-1">Manage and monitor student accounts</p>
          </div>
          
          <button className="px-4 py-2 bg-white/5 border border-white/10 text-slate-300 font-bold rounded-xl shadow-sm hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-2 text-sm">
            <div className="px-3 py-1.5 bg-white/10 text-white rounded-lg font-medium">Total: <b>{users.length}</b></div>
            <div className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg font-medium">Active: <b>{activeCount}</b></div>
            <div className="px-3 py-1.5 bg-slate-900/50 text-slate-400 border border-white/10 rounded-lg font-medium">Inactive: <b>{inactiveCount}</b></div>
          </div>

          <div className="flex w-full sm:w-auto items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900/50 border border-white/10 rounded-xl focus:outline-none focus:border-[var(--color-primary-light)] text-white transition-colors text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 pl-3 pr-8 bg-slate-900/50 border border-white/10 rounded-xl focus:outline-none focus:border-[var(--color-primary-light)] text-sm font-medium text-slate-300"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-6 py-4 w-12">
                  <input 
                    type="checkbox" 
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-[var(--color-primary-light)] focus:ring-[var(--color-primary-light)]"
                  />
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                // Skeleton Rows
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-5"><div className="w-4 h-4 bg-white/10 rounded"></div></td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-full"></div>
                        <div className="w-32 h-4 bg-white/10 rounded"></div>
                      </div>
                    </td>
                    <td className="px-6 py-5"><div className="w-48 h-4 bg-white/10 rounded"></div></td>
                    <td className="px-6 py-5"><div className="w-20 h-6 bg-white/10 rounded-full"></div></td>
                    <td className="px-6 py-5"><div className="w-24 h-4 bg-white/10 rounded"></div></td>
                    <td className="px-6 py-5"></td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr 
                    key={user.id} 
                    className={`group transition-colors ${selectedUsers.includes(user.id) ? 'bg-indigo-500/20' : 'hover:bg-white/5'}`}
                  >
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-[var(--color-primary-light)] focus:ring-[var(--color-primary-light)]"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold shadow-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-bold text-white group-hover:text-[var(--color-primary-light)] transition-colors">
                          {user.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 font-medium">{user.email}</td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        user.status 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                          : 'bg-white/10 text-slate-400 border-white/20'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${user.status ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></div>
                        {user.status ? 'Active' : 'Inactive'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 font-medium">
                      {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* Simple Actions for now, replace with dropdown component in future */}
                      <button 
                        onClick={() => handleToggleStatus(user.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.status ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/20' : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                        title={user.status ? "Deactivate User" : "Activate User"}
                      >
                        {user.status ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-3">
                      <User className="w-6 h-6 text-slate-500" />
                    </div>
                    <p className="font-medium text-white">No students found</p>
                    <p className="text-sm mt-1">Adjust your search or filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex items-center justify-between text-sm">
          <span className="text-slate-400 font-medium">Showing {filteredUsers.length} results</span>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1.5 border border-white/10 rounded-lg text-slate-500 bg-transparent opacity-50 font-medium">Previous</button>
            <button disabled className="px-3 py-1.5 border border-white/10 rounded-lg text-slate-500 bg-transparent opacity-50 font-medium">Next</button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedUsers.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-glow flex items-center gap-6 z-50 border border-slate-700"
          >
            <span className="font-bold text-sm bg-slate-800 px-3 py-1 rounded-lg">
              {selectedUsers.length} selected
            </span>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 font-bold text-sm rounded-xl transition-colors">
                Deactivate Selected
              </button>
              <button onClick={() => setSelectedUsers([])} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-xl transition-colors">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
