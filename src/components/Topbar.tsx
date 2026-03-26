import React from 'react';
import { useAppStore, useAuthStore } from '../store';
import { Bell, Search, User } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Topbar() {
  const { user, role } = useAuthStore();
  const { currentPlaceId, setCurrentPlaceId } = useAppStore();
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-[60px] bg-bg-surface border-b border-border px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="h-8 w-px bg-border mx-2" />
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-wider text-text-3 font-bold">Current Page</span>
          <span className="text-sm font-medium text-text-2">Dashboard</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-sm font-mono font-bold text-primary">
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </div>
          <div className="text-[10px] text-text-3 uppercase tracking-tighter">
            {time.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' })}
          </div>
        </div>

        <div className="flex items-center gap-2 bg-bg-elevated rounded-lg px-3 py-1.5 border border-border">
          <span className="text-xs text-text-3 font-medium">Place:</span>
          <select 
            value={currentPlaceId}
            onChange={(e) => setCurrentPlaceId(e.target.value)}
            className="bg-transparent text-xs font-bold text-text-1 outline-none cursor-pointer"
          >
            <option value="all">All Places</option>
            <option value="default">Default Place</option>
            <option value="jinja">Jinja Road</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className={cn(
            "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
            role === 'admin' ? "bg-primary-dim text-primary border-primary/20" : "bg-accent/10 text-accent border-accent/20"
          )}>
            {role}
          </div>
          
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-text-1 leading-none">{user?.name || 'Admin'}</div>
              <div className="text-[10px] text-text-3 mt-1 uppercase tracking-wider">Online</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-primary font-bold">
              {user?.name?.[0] || 'A'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
