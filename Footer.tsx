
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-[#0B0F19] border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
            <a href="#" className="hover:text-indigo-600">Company</a>
            <a href="#" className="hover:text-indigo-600">Legal</a>
            <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
            <span>Developed by <a href="https://neon-portfolio-revamp.lovable.app/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 underline">Rihab Lahmaidi El Idrissi</a></span>
          </div>
          <div className="flex space-x-6 text-gray-400">
            <a href="#" className="hover:text-indigo-500"><i className="fab fa-twitter"></i></a>
            <a href="#" className="hover:text-indigo-500"><i className="fab fa-linkedin-in"></i></a>
            <a href="#" className="hover:text-indigo-500"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
