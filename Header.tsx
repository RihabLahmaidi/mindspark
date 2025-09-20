
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  
  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  const navLinkClasses = "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200";
  const activeNavLinkClasses = "text-indigo-600 dark:text-indigo-400 font-semibold";

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center space-x-2">
              <i className="fas fa-brain text-2xl main-gradient-text"></i>
              <span className="text-xl font-bold text-gray-800 dark:text-white">MindSpark</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {isLoggedIn ? (
              <>
                <NavLink to="/dashboard" className={({isActive}) => isActive ? activeNavLinkClasses : navLinkClasses}>Dashboard</NavLink>
                <NavLink to="/chat" className={({isActive}) => isActive ? activeNavLinkClasses : navLinkClasses}>Chat Advisor</NavLink>
                <NavLink to="/saved-work" className={({isActive}) => isActive ? activeNavLinkClasses : navLinkClasses}>Saved Work</NavLink>
                <NavLink to="/settings" className={({isActive}) => isActive ? activeNavLinkClasses : navLinkClasses}>Settings</NavLink>
                <NavLink to="/about" className={({isActive}) => isActive ? activeNavLinkClasses : navLinkClasses}>About/Help</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/" className={({isActive}) => isActive ? activeNavLinkClasses : navLinkClasses}>Features</NavLink>
                <NavLink to="/#pricing" className={navLinkClasses}>Pricing</NavLink>
                <NavLink to="/about" className={({isActive}) => isActive ? activeNavLinkClasses : navLinkClasses}>About</NavLink>
              </>
            )}
          </nav>
          
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="relative">
                  <input type="search" placeholder="Search saved work..." className="hidden lg:block bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                  <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hidden lg:block"></i>
                </div>
                <Link to="/dashboard" className="px-4 py-2 text-sm font-medium text-white main-gradient-bg-light rounded-lg hover:opacity-90 transition-opacity">
                  Create New
                </Link>
                <button onClick={() => navigate('/settings')} className="w-9 h-9 rounded-full overflow-hidden">
                    <img src="https://picsum.photos/id/237/100/100" alt="User Avatar" className="w-full h-full object-cover" />
                </button>
              </>
            ) : (
               <>
                <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Login</Link>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-white main-gradient-bg-light rounded-lg hover:opacity-90 transition-opacity">
                  Sign Up
                </Link>
               </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;