
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800/50 rounded-2xl shadow-2xl flex overflow-hidden">
        {/* Left Side - Illustration */}
        <div className="hidden md:flex w-1/2 p-12 bg-indigo-50 dark:bg-indigo-900/20 items-center justify-center">
            <img src="https://picsum.photos/seed/studying/600/600" alt="Studying illustration" className="max-w-xs object-contain rounded-lg"/>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back!</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Log in to continue your learning journey.</p>
            </div>
            
            <div className="flex justify-center mb-6">
                <button className="px-6 py-2 font-semibold text-white main-gradient-bg-light rounded-full z-10">Login</button>
                <button className="px-6 py-2 font-semibold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-full -ml-2">Sign Up</button>
            </div>
            
            <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input 
                        type="email" 
                        defaultValue="john.doe@example.com"
                        className="mt-1 w-full bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg border-transparent focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                    <input 
                        type="password" 
                        defaultValue="password123"
                        className="mt-1 w-full bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg border-transparent focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="text-right">
                    <a href="#" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Forgot Password?</a>
                </div>
                <div>
                    <button type="submit" className="w-full main-gradient-bg-light text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity">
                        Log In
                    </button>
                </div>
            </form>
             <div className="text-center mt-6">
                <Link to="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-500">
                    <i className="fas fa-arrow-left mr-2"></i> Back to Home
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
