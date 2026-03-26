import React from 'react';
import { useAuthStore } from '../store';
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  Car, 
  Layers, 
  Receipt, 
  Settings, 
  ParkingCircle, 
  BarChart3, 
  Globe, 
  UserCircle, 
  LogOut,
  ChevronDown,
  ChevronRight,
  Plus,
  List
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: { label: string; path: string; icon: React.ElementType }[];
  adminOnly?: boolean;
}

const sidebarItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/home' },
  { 
    label: 'User', 
    icon: Users, 
    adminOnly: true,
    children: [
      { label: 'Add User', path: '/parking/user-create', icon: Plus },
      { label: 'User List', path: '/parking/user-list', icon: List },
    ]
  },
  { 
    label: 'Place', 
    icon: MapPin, 
    adminOnly: true,
    children: [
      { label: 'Add Place', path: '/parking/places/create', icon: Plus },
      { label: 'Place List', path: '/parking/places', icon: List },
    ]
  },
  { 
    label: 'Category', 
    icon: Car, 
    adminOnly: true,
    children: [
      { label: 'Add Category', path: '/parking/category/create', icon: Plus },
      { label: 'Category List', path: '/parking/category', icon: List },
    ]
  },
  { 
    label: 'Floor', 
    icon: Layers, 
    adminOnly: true,
    children: [
      { label: 'Add Floor', path: '/parking/floors/create', icon: Plus },
      { label: 'Floor List', path: '/parking/floors', icon: List },
    ]
  },
  { 
    label: 'Tariff', 
    icon: Receipt, 
    adminOnly: true,
    children: [
      { label: 'Add Tariff', path: '/parking/tariff/create', icon: Plus },
      { label: 'Tariff List', path: '/parking/tariff', icon: List },
    ]
  },
  { 
    label: 'Parking Setup', 
    icon: Settings, 
    adminOnly: true,
    children: [
      { label: 'Add Slot', path: '/parking/slot/create', icon: Plus },
      { label: 'Slot List', path: '/parking/slot', icon: List },
      { label: 'Add RFID Vehicle', path: '/parking/rfid-vehicles/create', icon: Plus },
      { label: 'RFID Vehicle List', path: '/parking/rfid-vehicles', icon: List },
      { label: 'RFID API Endpoint', path: '/parking/rfid-api-endpoint', icon: Globe },
    ]
  },
  { 
    label: 'Parking', 
    icon: ParkingCircle, 
    children: [
      { label: 'Add Parking', path: '/parking/parking-crud/create', icon: Plus },
      { label: 'All parking list', path: '/parking/parking-crud', icon: List },
      { label: 'Currently Parking List', path: '/parking/get-current', icon: List },
      { label: 'Ended Parking List', path: '/parking/get-ended', icon: List },
    ]
  },
  { 
    label: 'Reports', 
    icon: BarChart3, 
    adminOnly: true,
    children: [
      { label: 'Summary Report', path: '/parking/reports/summary', icon: BarChart3 },
      { label: 'Details Report', path: '/parking/reports/details-report', icon: BarChart3 },
      { label: 'Slots Report', path: '/parking/reports/slots-report', icon: BarChart3 },
    ]
  },
  { 
    label: 'Settings', 
    icon: Settings, 
    adminOnly: true,
    children: [
      { label: 'Global Setting', path: '/parking/general-settings', icon: Settings },
      { label: 'Activation', path: '/parking/activation', icon: Settings },
    ]
  },
  { 
    label: 'Language', 
    icon: Globe, 
    adminOnly: true,
    children: [
      { label: 'Add Language', path: '/parking/languages/create', icon: Plus },
      { label: 'All Language', path: '/parking/languages', icon: List },
    ]
  },
  { label: 'My Profile', icon: UserCircle, path: '/profile' },
  { label: 'Go Back', icon: LogOut, path: '/logout' },
];

export default function Sidebar() {
  const { role } = useAuthStore();
  const location = useLocation();
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const toggleExpand = (label: string) => {
    setExpanded(expanded === label ? null : label);
  };

  return (
    <div className="w-64 h-full bg-bg-surface border-r border-border flex flex-col overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
            P
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-text-1">
            Park<span className="text-primary">Nova</span>
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1">
        {sidebarItems.map((item) => {
          if (item.adminOnly && role !== 'admin') return null;

          const isActive = location.pathname === item.path;
          const isExpanded = expanded === item.label;

          if (item.children) {
            return (
              <div key={item.label} className="space-y-1">
                <button
                  onClick={() => toggleExpand(item.label)}
                  className={cn(
                    "w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-200 text-text-2 hover:bg-bg-elevated hover:text-text-1",
                    isExpanded && "bg-primary-dim text-primary"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                {isExpanded && (
                  <div className="pl-9 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                          location.pathname === child.path
                            ? "text-primary font-semibold"
                            : "text-text-3 hover:text-text-2"
                        )}
                      >
                        <child.icon size={14} />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.path || '#'}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-200 relative group",
                isActive
                  ? "bg-primary-dim text-primary font-semibold"
                  : "text-text-2 hover:bg-bg-elevated hover:text-text-1"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
              )}
              <item.icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
