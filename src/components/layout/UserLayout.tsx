import React from 'react';
import SideMenu from './SideMenu';
import TopMenu from './TopMenu';

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <SideMenu />
      <div className="flex flex-col flex-1">
        <TopMenu />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;