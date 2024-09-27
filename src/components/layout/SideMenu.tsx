import React from 'react';
import Link from 'next/link';
import { Home, Briefcase, Settings } from 'lucide-react';

const SideMenu: React.FC = () => {
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <nav>
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
              <Home size={20} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/jobs" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
              <Briefcase size={20} />
              <span>Jobs</span>
            </Link>
          </li>
          <li>
            <Link href="/settings" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideMenu;