import React from 'react';
import { 
  Users, 
  MapPin, 
  Car, 
  Layers, 
  Grid, 
  Receipt, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { apiFetch } from '../lib/api-client';

const stats = [
  { label: 'Total Places', value: '12', icon: MapPin, trend: '+2', trendUp: true, color: 'text-cyan', bg: 'bg-cyan/10' },
  { label: 'Total Slots', value: '1,240', icon: Grid, trend: '+45', trendUp: true, color: 'text-violet', bg: 'bg-violet/10' },
  { label: 'Active Users', value: '48', icon: Users, trend: '-3', trendUp: false, color: 'text-orange', bg: 'bg-orange/10' },
  { label: 'Total Earnings', value: '$12,450', icon: Receipt, trend: '+12%', trendUp: true, color: 'text-green', bg: 'bg-green/10' },
];

const parkingData = [
  { name: 'Mon', entries: 45, exits: 38 },
  { name: 'Tue', entries: 52, exits: 48 },
  { name: 'Wed', entries: 48, exits: 42 },
  { name: 'Thu', entries: 61, exits: 55 },
  { name: 'Fri', entries: 75, exits: 68 },
  { name: 'Sat', entries: 92, exits: 85 },
  { name: 'Sun', entries: 88, exits: 82 },
];

const categoryData = [
  { name: 'Car', value: 65, color: '#00F0FF' },
  { name: 'Bike', value: 25, color: '#8B5CF6' },
  { name: 'Truck', value: 10, color: '#F97316' },
];

const recentActivities = [
  { id: 1, type: 'entry', vehicle: 'ABC-1234', time: '10 mins ago', status: 'success' },
  { id: 2, type: 'exit', vehicle: 'XYZ-9876', time: '25 mins ago', status: 'success' },
  { id: 3, type: 'entry', vehicle: 'KDL-5544', time: '45 mins ago', status: 'warning' },
  { id: 4, type: 'exit', vehicle: 'MNO-3322', time: '1 hour ago', status: 'success' },
];

export default function Dashboard() {
  const [stats, setStats] = React.useState([
    { label: 'Total Places', value: '0', icon: MapPin, trend: '+0', trendUp: true, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Slots', value: '0', icon: Grid, trend: '+0', trendUp: true, color: 'text-violet', bg: 'bg-violet/10' },
    { label: 'Active Users', value: '0', icon: Users, trend: '+0', trendUp: true, color: 'text-orange', bg: 'bg-orange/10' },
    { label: 'Total Earnings', value: '$0', icon: Receipt, trend: '+0%', trendUp: true, color: 'text-green', bg: 'bg-green/10' },
  ]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const [places, slots, users, activeSessions] = await Promise.all([
          apiFetch('/api/places'),
          apiFetch('/api/slots'),
          apiFetch('/api/users'),
          apiFetch('/api/parking/sessions/active')
        ]);

        setStats([
          { label: 'Total Places', value: places.length.toString(), icon: MapPin, trend: '+0', trendUp: true, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Total Slots', value: slots.length.toLocaleString(), icon: Grid, trend: '+0', trendUp: true, color: 'text-violet', bg: 'bg-violet/10' },
          { label: 'Active Users', value: users.length.toString(), icon: Users, trend: '+0', trendUp: true, color: 'text-orange', bg: 'bg-orange/10' },
          { label: 'Active Sessions', value: activeSessions.length.toString(), icon: Car, trend: '+0%', trendUp: true, color: 'text-green', bg: 'bg-green/10' },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8 page-enter">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-black text-text-1 tracking-tight">Dashboard Overview</h2>
          <p className="text-text-3">Real-time analytics and management for ParkNova system</p>
        </div>
        <div className="flex items-center gap-3 bg-bg-card border border-border rounded-xl px-4 py-2">
          <Calendar size={18} className="text-primary" />
          <span className="text-sm font-bold text-text-1">{format(new Date(), 'MMMM dd, yyyy')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all group shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                stat.trendUp ? "bg-green/10 text-green" : "bg-red/10 text-red"
              )}>
                {stat.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.trend}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-display font-black text-text-1 tracking-tight">{isLoading ? '...' : stat.value}</h3>
              <p className="text-sm text-text-3 font-medium uppercase tracking-widest">{stat.label}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-text-3">Since last month</span>
              <ArrowUpRight size={14} className="text-text-3 group-hover:text-primary transition-colors" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-bg-card border border-border rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-display font-black text-text-1 tracking-tight">Parking Trends</h3>
              <p className="text-sm text-text-3">Weekly entry and exit statistics</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
                <span className="text-xs font-bold text-text-2">Entries</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-violet shadow-[0_0_8px_var(--color-violet)]" />
                <span className="text-xs font-bold text-text-2">Exits</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={parkingData}>
                <defs>
                  <linearGradient id="colorEntries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="entries" 
                  stroke="#000000" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorEntries)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="exits" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorExits)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-bg-card border border-border rounded-3xl p-8 shadow-xl">
          <h3 className="text-xl font-display font-black text-text-1 tracking-tight mb-2">Vehicle Categories</h3>
          <p className="text-sm text-text-3 mb-8">Distribution of parked vehicles</p>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-3xl font-display font-black text-text-1">100%</div>
              <div className="text-[10px] uppercase tracking-widest text-text-3 font-bold">Total</div>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-bold text-text-2">{item.name}</span>
                </div>
                <span className="text-sm font-black text-text-1">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-bg-card border border-border rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-display font-black text-text-1 tracking-tight">Recent Activity</h3>
            <button className="text-sm font-bold text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110",
                    activity.type === 'entry' ? "bg-green/10 text-green" : "bg-red/10 text-red"
                  )}>
                    {activity.type === 'entry' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  </div>
                  <div>
                    <h4 className="font-mono font-bold text-text-1 tracking-wider uppercase">{activity.vehicle}</h4>
                    <p className="text-xs text-text-3 font-medium uppercase tracking-widest">{activity.type} • {activity.time}</p>
                  </div>
                </div>
                <div className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  activity.status === 'success' ? "bg-green/10 text-green" : "bg-orange/10 text-orange"
                )}>
                  {activity.status === 'success' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                  {activity.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-bg-card border border-border rounded-3xl p-8 shadow-xl">
          <h3 className="text-xl font-display font-black text-text-1 tracking-tight mb-8">System Status</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-bg-base border border-border rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <Grid size={20} />
                </div>
                <span className="text-xs font-bold text-green">Online</span>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-black text-text-1">98.2%</div>
                <div className="text-[10px] uppercase tracking-widest text-text-3 font-bold">Slot Sensors</div>
              </div>
              <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[98.2%]" />
              </div>
            </div>
            <div className="p-6 bg-bg-base border border-border rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-violet/10 text-violet rounded-lg">
                  <Clock size={20} />
                </div>
                <span className="text-xs font-bold text-green">Online</span>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-black text-text-1">1.2s</div>
                <div className="text-[10px] uppercase tracking-widest text-text-3 font-bold">Avg Response</div>
              </div>
              <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-violet w-[85%]" />
              </div>
            </div>
          </div>
          <div className="mt-8 p-6 bg-bg-base border border-border rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange/10 text-orange flex items-center justify-center">
                <AlertCircle size={24} />
              </div>
              <div>
                <h4 className="font-bold text-text-1">Database Backup</h4>
                <p className="text-xs text-text-3">Last backup: 2 hours ago</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-bg-elevated border border-border rounded-lg text-xs font-bold text-text-2 hover:text-primary transition-all">
              Backup Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
