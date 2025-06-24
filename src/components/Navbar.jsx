import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText } from 'lucide-react';

const Navbar = () => {
  const [isOnline, setIsOnline] = useState(true);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'text-blue-600 font-semibold flex items-center gap-1'
      : 'text-gray-700 hover:text-blue-600 flex items-center gap-1';

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('http://localhost:3000/');
        setIsOnline(res.ok);
      } catch {
        setIsOnline(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 10000); // auto refresh setiap 10 detik
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between">
        {/* Brand & Status */}
        <div className="flex items-center gap-3 mb-2 md:mb-0">
          <Link
            to="/"
            className="text-lg font-bold text-blue-600 hover:underline transition"
          >
            SanzyPay Admin
          </Link>
          <span
            className={`w-3 h-3 rounded-full ${
              isOnline ? 'bg-green-500' : 'bg-red-500'
            }`}
            title={isOnline ? 'Backend Aktif' : 'Backend Offline'}
          />
          <span className="text-sm text-gray-500">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-6">
          <NavLink to="/" className={navLinkClass}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/transactions" className={navLinkClass}>
            <FileText size={18} /> Transaksi
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
