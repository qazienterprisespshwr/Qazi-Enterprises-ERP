import React from 'react';
import { User, View } from '../types';
import { NAVIGATION_PERMISSIONS, LOGO_BASE64_URL } from '../constants';
import { DashboardIcon } from './icons/DashboardIcon';
import { InventoryIcon } from './icons/InventoryIcon';
import { OrdersIcon } from './icons/OrdersIcon';
import { CustomersIcon } from './icons/CustomersIcon';
import { PaymentsIcon } from './icons/PaymentsIcon';
import { ReportsIcon } from './icons/ReportsIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { LogoutIcon } from './icons/LogoutIcon';

interface SidebarProps {
  user: User;
  activeView: View;
  setActiveView: (view: View) => void;
  onLogout: () => void;
}

const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  Dashboard: DashboardIcon,
  Inventory: InventoryIcon,
  Orders: OrdersIcon,
  Customers: CustomersIcon,
  Payments: PaymentsIcon,
  Reports: ReportsIcon,
  Settings: SettingsIcon,
};

const NavItem: React.FC<{
  view: View;
  activeView: View;
  setActiveView: (view: View) => void;
}> = ({ view, activeView, setActiveView }) => {
  const Icon = iconMap[view];
  const isActive = activeView === view;
  return (
    <li
      onClick={() => setActiveView(view)}
      className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors ${
        isActive
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {Icon && <Icon className="w-6 h-6 mr-4" />}
      <span className="font-medium">{view}</span>
    </li>
  );
};


const Sidebar: React.FC<SidebarProps> = ({ user, activeView, setActiveView, onLogout }) => {
  const allowedViews = NAVIGATION_PERMISSIONS[user.role] || [];

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
      <div className="flex flex-col items-center mb-8">
        <img src={LOGO_BASE64_URL} alt="Qazi Enterprises" className="w-20 h-20" />
        <h1 className="text-xl font-bold mt-2 text-white">Qazi Enterprises</h1>
      </div>

      <nav className="flex-1">
        <ul>
          {allowedViews.map((view) => (
            <NavItem
              key={view}
              view={view as View}
              activeView={activeView}
              setActiveView={setActiveView}
            />
          ))}
        </ul>
      </nav>

      <div>
        <div className="border-t border-gray-700 pt-4">
          <p className="text-sm font-semibold text-gray-200">{user.username}</p>
          <p className="text-xs text-gray-400">{user.role}</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center p-3 mt-4 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
        >
          <LogoutIcon className="w-6 h-6 mr-4" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
