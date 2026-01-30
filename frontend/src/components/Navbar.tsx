import { Building2, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Building2 className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Portal Municipal</h1>
              <p className="text-xs text-gray-500">Intranet Corporativa</p>
            </div>
          </Link>

          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogIn className="w-5 h-5" />
            <span className="font-medium">Login</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
