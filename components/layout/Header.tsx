import React from 'react';
import { useNavigate } from 'react-router-dom';
import { appState } from '../../data/appState';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
);

const SchoolPlaceholderIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
);

const LogoutIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);


const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const { name, logoUrl } = appState.schoolProfile;
  const navigate = useNavigate();

  const handleLogout = async () => {
      await appState.logout();
      navigate('/');
  };
  
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-gray-500 focus:outline-none lg:hidden"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center">
        <div className="flex items-center focus:outline-none">
          {logoUrl ? (
              <img
                  className="w-8 h-8 rounded-full object-contain bg-gray-200 dark:bg-gray-700"
                  src={logoUrl}
                  alt="School Logo"
              />
          ) : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                  <SchoolPlaceholderIcon className="w-5 h-5"/>
              </div>
          )}
          <span className="ml-2 hidden md:inline font-medium text-gray-800 dark:text-gray-200">{name}</span>
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-4"></div>

        <button 
          onClick={handleLogout}
          className="flex items-center text-sm font-medium text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
          aria-label="Logout"
        >
          <LogoutIcon className="w-5 h-5"/>
          <span className="ml-2 hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
