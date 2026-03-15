import { useState } from 'react';
import { Shield, Search, Filter, Download } from 'lucide-react';

interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  targetLabel: string;
  timestamp: string;
  ipAddress: string;
}

const MOCK_AUDITS: AuditLog[] = [
  { id: '1', adminEmail: 'stfranciscowael@gmail.com', action: 'EXPORT_REPORT', targetType: 'report', targetId: 'rep_123', targetLabel: 'Student Progress CSV', timestamp: '2026-03-15T12:05:00Z', ipAddress: '192.168.1.1' },
  { id: '2', adminEmail: 'wael.hassan@gmail.com', action: 'DELETE_STUDENT', targetType: 'student', targetId: 'stu_991', targetLabel: 'Ali Khan (ali@gmail.com)', timestamp: '2026-03-14T09:12:00Z', ipAddress: '10.0.0.5' },
  { id: '3', adminEmail: 'stfranciscowael@gmail.com', action: 'ADD_TEACHER', targetType: 'teacher', targetId: 'tea_441', targetLabel: 'Omar Saeed (omar@edu.com)', timestamp: '2026-03-13T16:45:00Z', ipAddress: '192.168.1.1' },
];

export const AuditLogView = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Shield className="text-brand-600" size={24} />
            System Audit Log
          </h1>
          <p className="text-slate-500 mt-1 max-w-2xl">
            All administrative actions are permanently and immutably logged to this registry. 
            Logs cannot be modified or deleted.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
             <Download size={16} /> Export CSV
           </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by action, email or target..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
             <Filter size={16} /> Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Administrator</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Action Type</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Target Entity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_AUDITS.map((log) => (
                <tr key={log.id} className="group hover:bg-slate-50 transition-colors text-sm">
                  <td className="px-6 py-4 font-mono text-slate-500 text-xs">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-900">{log.adminEmail}</span>
                    <span className="block text-xs text-slate-400 mt-1">IP: {log.ipAddress}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold tracking-wide ${
                      log.action.includes('DELETE') ? 'bg-red-50 text-red-700' :
                      log.action.includes('ADD') ? 'bg-emerald-50 text-emerald-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-800">{log.targetLabel}</span>
                    <span className="block text-xs text-slate-500 mt-1">Type: {log.targetType}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
