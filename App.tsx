import React, { useState } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Orders from './components/Orders';
import Customers from './components/Customers';
import Payments from './components/Payments';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Invoice from './components/Invoice';
import { User, View, Order } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<View>('Dashboard');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    // Set default view based on role
    switch (loggedInUser.role) {
        case 'Driver':
            setActiveView('Orders');
            break;
        case 'Accountant':
            setActiveView('Payments');
            break;
        default:
            setActiveView('Dashboard');
            break;
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveView('Dashboard');
    setSelectedOrder(null);
  };
  
  const handleViewInvoice = (order: Order) => {
    setSelectedOrder(order);
  }

  const renderContent = () => {
    if (selectedOrder) {
        return <Invoice order={selectedOrder} onBack={() => setSelectedOrder(null)} userRole={user?.role} />;
    }
    switch (activeView) {
      case 'Dashboard':
        return <Dashboard userRole={user?.role} />;
      case 'Inventory':
        return <Inventory userRole={user?.role} />;
      case 'Orders':
        return <Orders onViewInvoice={handleViewInvoice} userRole={user?.role} />;
      case 'Customers':
        return <Customers userRole={user?.role} />;
      case 'Payments':
        return <Payments />;
      case 'Reports':
        return <Reports />;
      case 'Settings':
        return <Settings />;
      default:
        return <Dashboard userRole={user?.role} />;
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar
        user={user}
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={handleLogout}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
