
import React from 'react';
import { NavLink } from 'react-router-dom';
import { SIDEBAR_LINKS } from '../../constants';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const SchoolLogo = () => (
    <div className="flex items-center justify-center h-16 text-white">
        <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18M5.468 18.07A9.003 9.003 0 0112 3.93a9.003 9.003 0 016.532 14.14"></path></svg>
        <span className="ml-2 text-xl font-bold">School ERP</span>
    </div>
);

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 dark:bg-gray-950 text-gray-300 transform transition-transform z-30 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SchoolLogo />
        <nav className="mt-8">
          {SIDEBAR_LINKS.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 hover:bg-gray-700 hover:text-white ${
                  isActive ? 'bg-primary-700 text-white' : ''
                }`
              }
            >
              {link.icon}
              <span className="ml-4">{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
