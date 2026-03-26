import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './store';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddParking from './pages/AddParking';
import Checkout from './pages/Checkout';
import CurrentlyParking from './pages/CurrentlyParking';
import EndedParking from './pages/EndedParking';
import UserList from './pages/UserList';
import UserCreate from './pages/UserCreate';
import PlaceList from './pages/PlaceList';
import PlaceCreate from './pages/PlaceCreate';
import CategoryList from './pages/CategoryList';
import CategoryCreate from './pages/CategoryCreate';
import FloorList from './pages/FloorList';
import FloorCreate from './pages/FloorCreate';
import TariffList from './pages/TariffList';
import TariffCreate from './pages/TariffCreate';
import SlotList from './pages/SlotList';
import SlotCreate from './pages/SlotCreate';
import { Toaster } from 'sonner';

function Layout() {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" theme="light" richColors />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/dashboard" element={<Navigate to="/home" replace />} />
          
          {/* Placeholder routes for the rest of the 35 parts */}
          <Route path="/parking/user-create" element={<UserCreate />} />
          <Route path="/parking/user-list" element={<UserList />} />
          <Route path="/parking/places/create" element={<PlaceCreate />} />
          <Route path="/parking/places" element={<PlaceList />} />
          <Route path="/parking/category/create" element={<CategoryCreate />} />
          <Route path="/parking/category" element={<CategoryList />} />
          <Route path="/parking/floors/create" element={<FloorCreate />} />
          <Route path="/parking/floors" element={<FloorList />} />
          <Route path="/parking/tariff/create" element={<TariffCreate />} />
          <Route path="/parking/tariff" element={<TariffList />} />
          <Route path="/parking/slot/create" element={<SlotCreate />} />
          <Route path="/parking/slot" element={<SlotList />} />
          <Route path="/parking/rfid-vehicles/create" element={<div className="page-enter"><h1 className="text-2xl font-bold">Add RFID Vehicle</h1></div>} />
          <Route path="/parking/rfid-vehicles" element={<div className="page-enter"><h1 className="text-2xl font-bold">RFID Vehicle List</h1></div>} />
          <Route path="/parking/rfid-api-endpoint" element={<div className="page-enter"><h1 className="text-2xl font-bold">RFID API Endpoint</h1></div>} />
          <Route path="/parking/parking-crud/create" element={<AddParking />} />
          <Route path="/parking/parking-crud" element={<div className="page-enter"><h1 className="text-2xl font-bold">All Parking List</h1></div>} />
          <Route path="/parking/parking/:id/end" element={<Checkout />} />
          <Route path="/parking/get-current" element={<CurrentlyParking />} />
          <Route path="/parking/get-ended" element={<EndedParking />} />
          <Route path="/parking/reports/summary" element={<div className="page-enter"><h1 className="text-2xl font-bold">Summary Report</h1></div>} />
          <Route path="/parking/reports/details-report" element={<div className="page-enter"><h1 className="text-2xl font-bold">Details Report</h1></div>} />
          <Route path="/parking/reports/slots-report" element={<div className="page-enter"><h1 className="text-2xl font-bold">Slots Report</h1></div>} />
          <Route path="/parking/general-settings" element={<div className="page-enter"><h1 className="text-2xl font-bold">Global Setting</h1></div>} />
          <Route path="/parking/activation" element={<div className="page-enter"><h1 className="text-2xl font-bold">Activation</h1></div>} />
          <Route path="/parking/languages/create" element={<div className="page-enter"><h1 className="text-2xl font-bold">Add Language</h1></div>} />
          <Route path="/parking/languages" element={<div className="page-enter"><h1 className="text-2xl font-bold">All Language</h1></div>} />
          <Route path="/profile" element={<div className="page-enter"><h1 className="text-2xl font-bold">My Profile</h1></div>} />
          <Route path="/logout" element={<LogoutHandler />} />
        </Route>
      </Routes>
    </Router>
  );
}

function LogoutHandler() {
  const { logout } = useAuthStore();
  React.useEffect(() => {
    logout();
  }, [logout]);
  return <Navigate to="/login" replace />;
}
