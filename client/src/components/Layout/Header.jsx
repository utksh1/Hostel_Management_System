import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bed,
  Users,
  FileText,
  CreditCard
} from 'lucide-react';

const Header = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Rooms', href: '/rooms', icon: Bed },
    { name: 'Students', href: '/students', icon: Users, adminOnly: true },
    { name: 'Payments', href: '/payments', icon: CreditCard },
    { name: 'Reports', href: '/reports', icon: FileText, adminOnly: true },
  ];

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-secondary-200">
          <h1 className="text-xl font-bold text-secondary-900">HostelMS</h1>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              if (item.adminOnly && !isAdmin) return null;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="group flex items-center px-3 py-2 text-sm font-medium text-secondary-700 rounded-md hover:bg-secondary-100 hover:text-secondary-900 transition-colors duration-200"
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3 text-secondary-500 group-hover:text-secondary-700" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-secondary-200">
            <Link
              to="/settings"
              className="group flex items-center px-3 py-2 text-sm font-medium text-secondary-700 rounded-md hover:bg-secondary-100 hover:text-secondary-900 transition-colors duration-200"
              onClick={() => setSidebarOpen(false)}
            >
              <Settings className="w-5 h-5 mr-3 text-secondary-500 group-hover:text-secondary-700" />
              Settings
            </Link>
            
            <button
              onClick={handleLogout}
              className="w-full group flex items-center px-3 py-2 text-sm font-medium text-secondary-700 rounded-md hover:bg-secondary-100 hover:text-secondary-900 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5 mr-3 text-secondary-500 group-hover:text-secondary-700" />
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b border-secondary-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="lg:hidden -m-2.5 p-2.5 text-secondary-700"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Page title will be passed as children */}
            </div>
            
            <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
              <div className="flex items-center gap-x-2">
                <div className="text-sm">
                  <p className="font-medium text-secondary-900">{user?.name}</p>
                  <p className="text-secondary-500 capitalize">{user?.role}</p>
                </div>
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Header;