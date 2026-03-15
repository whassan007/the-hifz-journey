import { useState } from 'react';
import { ShieldCheck, Search, Trash2, ShieldAlert } from 'lucide-react';

interface MockAdmin {
  id: string;
  email: string;
  name: string;
  addedBy: string;
  addedDate: string;
  lastLogin: string;
}

const MOCK_ADMINS: MockAdmin[] = [
  { id: '1', email: 'stfranciscowael@gmail.com', name: 'Wael Hassan', addedBy: 'System', addedDate: '2023-11-01', lastLogin: '2 mins ago' },
  { id: '2', email: 'wael.hassan@gmail.com', name: 'Wael Dev', addedBy: 'stfranciscowael@gmail.com', addedDate: '2024-01-15', lastLogin: '1 week ago' },
  { id: '3', email: '72yamahdy@gmail.com', name: 'Support Admin', addedBy: 'stfranciscowael@gmail.com', addedDate: '2024-02-10', lastLogin: '1 month ago' },
];

export const UsersView = () => {
  const [activeTab, setActiveTab] = useState<'students' | 'teachers' | 'admins'>('admins');
  const [deleteConfirm, setDeleteConfirm] = useState<string>('');
  const [pendingDelete, setPendingDelete] = useState<MockAdmin | null>(null);

  // Active Signed-in admin placeholder
  const activeSessionEmail = 'stfranciscowael@gmail.com'; 

  const handleDelete = () => {
    if (deleteConfirm === 'DELETE') {
      alert(`Deleted ${pendingDelete?.email} from system.`);
      setPendingDelete(null);
      setDeleteConfirm('');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Users</h1>
        <p className="text-slate-500 mt-1">Manage platform access, roles, and administrative whitelists.</p>
      </div>

      <div className="flex bg-slate-200/50 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('students')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'students' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Students
        </button>
        <button 
          onClick={() => setActiveTab('teachers')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'teachers' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Teachers
        </button>
        <button 
          onClick={() => setActiveTab('admins')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'admins' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <ShieldAlert size={14} className={activeTab === 'admins' ? 'text-brand-200' : ''} />
          Administrators
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {activeTab === 'admins' && (
          <>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Find admin by email..." 
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <button className="px-4 py-2 bg-slate-900 text-white border border-slate-900 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
                + Authorise Email
              </button>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Administrator</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Added By</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date Added</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_ADMINS.map(admin => (
                  <tr key={admin.id} className="group hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700">
                          <ShieldCheck size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{admin.name}</p>
                          <p className="text-xs text-slate-500">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 font-medium">{admin.addedBy}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">{admin.addedDate}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-700">{admin.lastLogin}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {admin.email === activeSessionEmail ? (
                          <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-md">Active Session</span>
                        ) : (
                          <button 
                            onClick={() => setPendingDelete(admin)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Revoke access"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {pendingDelete && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Revoke Admin?</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Revoking <span className="font-bold text-slate-700">{pendingDelete.email}</span> will immediately terminate their active session. 
              This cannot be undone. Type DELETE to confirm.
            </p>
            
            <input 
              type="text" 
              placeholder="Type DELETE" 
              className="w-full px-4 py-2 border border-slate-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
            />

            <div className="flex gap-3">
              <button 
                onClick={() => { setPendingDelete(null); setDeleteConfirm(''); }}
                className="flex-1 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                disabled={deleteConfirm !== 'DELETE'}
                onClick={handleDelete}
                className="flex-1 py-2 bg-red-600 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
              >
                Revoke Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
