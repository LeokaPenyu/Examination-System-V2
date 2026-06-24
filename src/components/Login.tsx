import React, { useState } from 'react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('S36231');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin();
    } else {
      setError('Invalid User ID or Password.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      
      {/* Left Side: Full Screen Image */}
      <div className="w-full md:w-[55%] relative hidden md:block">
        <img 
          src="/building.jpg" 
          alt="MRCS Building" 
          onError={(e) => { e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Tawau_sabah_Malaysian-Red-Crescent-01.jpg/1280px-Tawau_sabah_Malaysian-Red-Crescent-01.jpg'; }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Optional overlay for better contrast if needed, but keeping it clean for the building photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full md:w-[45%] flex flex-col justify-center px-4 md:px-8 py-10 sm:px-16 lg:px-24 bg-white relative">
        <div className="w-full max-w-sm mx-auto">
          
          <div className="flex justify-center mb-10 w-full">
            <div className="flex gap-4 items-center">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv9nKB44c6cGGVDzbxCl8ctElibJoYsmXGUg&s" 
                alt="MRCS Logo" 
                className="h-[70px] object-contain"
              />
               <div className="flex flex-col text-[#C0182A] font-bold leading-tight border-l-2 border-[#C0182A] pl-4">
                 <span className="text-[15px] tracking-wide">SISTEM </span>
                 <span className="text-[24px] font-black tracking-tight notranslate" translate="no">EASY</span>
               </div>
            </div>
          </div>

          <div className="flex flex-col flex-grow">
            <h2 className="text-[24px] text-gray-800 mb-8 font-medium font-sans">Sign in <span className="notranslate" translate="no">EASY</span></h2>

            <div className="flex justify-end mb-4">
              <span className="text-[#C0182A] text-[13px] font-medium flex items-center gap-1.5 cursor-pointer hover:underline">
                Sign in with QR 
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3h7v7H3z"></path>
                  <path d="M14 3h7v7h-7z"></path>
                  <path d="M14 14h7v7h-7z"></path>
                  <path d="M3 14h7v7H3z"></path>
                </svg>
              </span>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Username Box */}
              <div className="relative border-[1.5px] border-[#16445B] rounded-[3px] pt-[7px]">
                <label className="absolute -top-[11px] left-3 bg-white px-1 text-[13px] text-[#16445B] font-medium"><span className="notranslate" translate="no">EASY</span> Username:</label>
                <div className="bg-[#EAF1FA] m-[2px] mt-0 h-11 flex items-center">
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-transparent px-4 text-[15px] text-gray-900 outline-none border-none focus:ring-0"
                  />
                </div>
              </div>

              {/* Password Box */}
              <div className="flex items-end pt-3">
                <div className="relative border border-gray-300 border-r-0 rounded-l-[3px] rounded-r-none pt-[7px] flex-grow transition-colors focus-within:border-gray-300">
                  <label className="absolute -top-[11px] left-3 bg-white px-1 text-[13px] text-gray-600 font-medium tracking-wide">Password:</label>
                  <div className="bg-[#EAF1FA] m-[2px] mt-0 mr-0 h-11 flex items-center">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent px-4 text-lg font-mono text-gray-900 outline-none border-none focus:ring-0 pb-1"
                    />
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="bg-[#16445B] w-[65px] h-[52px] flex items-center justify-center rounded-r-[3px] -ml-[1px] relative z-10 border border-[#16445B] hover:bg-[#0e2c3b] transition-colors"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                    {showPassword && (
                      <line x1="3" y1="3" x2="21" y2="21" strokeWidth="2" />
                    )}
                  </svg>
                </button>
              </div>

              {error && (
                <p className="text-brand-red text-sm mt-2 font-medium">{error}</p>
              )}

              <div className="pt-6 flex justify-center">
                <button 
                  type="submit"
                  className="bg-[#16445B] hover:bg-[#0B2536] text-white tracking-[0.08em] font-medium py-3 px-12 rounded-[3px] transition-colors shadow-sm"
                >
                  LOGIN
                </button>
              </div>
            </form>
          </div>
          
          {/* Footer Logo */}
          <div className="flex justify-center mt-16 pt-8 border-t border-gray-100">
            <span className="text-[12px] font-bold text-brand-red uppercase tracking-wider flex items-center opacity-80 gap-1">
              Malaysian Red Crescent
            </span>
          </div>

        </div>
      </div>
      
    </div>
  );
};

