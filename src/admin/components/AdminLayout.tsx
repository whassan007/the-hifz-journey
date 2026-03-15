import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, BarChart3, Users, BookOpen, 
  ShieldAlert, LogOut 
} from 'lucide-react';
import type { AdminSession } from '../AdminApp';

interface AdminLayoutProps {
  session: AdminSession;
  onLogout: () => void;
}

export const AdminLayout = ({ session, onLogout }: AdminLayoutProps) => {
  const routes = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Student Progress', icon: BarChart3, path: '/analytics/students' },
    { label: 'Verse Difficulty', icon: BookOpen, path: '/analytics/verses' },
    { label: 'Users', icon: Users, path: '/users' },
    { label: 'Audit Log', icon: ShieldAlert, path: '/audit' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 md:flex-row flex-col">
      {/* Sidebar */}
      <aside className="md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 overflow-y-auto">
        <div className="p-6 border-b border-white/10 shrink-0">
           <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shrink-0">H</div>
             Hifz Admin
           </h2>
        </div>

        <div className="p-4 flex items-center gap-3 border-b border-white/10 mx-2 my-2 rounded-xl bg-white/5 shrink-0">
          {session.picture ? (
            <img src={session.picture} alt="" className="w-10 h-10 rounded-full bg-slate-800" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold">{session.name.charAt(0)}</div>
          )}
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{session.name}</p>
            <p className="text-xs text-slate-400 truncate">{session.email}</p>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {routes.map(r => (
            <NavLink
              key={r.path}
              to={r.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors text-sm ${
                  isActive ? 'bg-brand-500 text-white' : 'hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <r.icon size={18} />
              {r.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mt-auto mb-4 border-t border-white/10 shrink-0">
          <button 
            onClick={onLogout}
            className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-slate-50 min-h-0 relative">
        <div className="mx-auto max-w-7xl p-8 pb-32">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
