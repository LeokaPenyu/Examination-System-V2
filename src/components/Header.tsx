import React from 'react';
import { UserRole, Language } from '../types';
import { Menu, LogOut, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  onMenuClick: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ role, setRole, onMenuClick, onLogout }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
      <div className="flex items-center gap-4 flex-1">
        <button onClick={onMenuClick} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv9nKB44c6cGGVDzbxCl8ctElibJoYsmXGUg&s" 
              alt="MRCS Logo" 
              className="h-8 object-contain"
            />
            <div className="flex flex-col justify-center">
              <h1 className="text-xl font-bold text-charcoal leading-none mb-0.5 tracking-tight notranslate" translate="no">EASY</h1>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider leading-none">MRC SARAWAK BRANCH</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-6">
        <div className="flex items-center bg-gray-100 p-1 rounded-lg notranslate" translate="no">
          <button 
            onClick={() => setLanguage(Language.BM)}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all notranslate ${
              language === Language.BM 
              ? 'bg-white shadow-sm text-brand-red' 
              : 'text-gray-400 hover:text-charcoal'
            }`}
          >
            BM
          </button>
          <button 
            onClick={() => setLanguage(Language.EN)}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all notranslate ${
              language === Language.EN 
              ? 'bg-white shadow-sm text-brand-red' 
              : 'text-gray-400 hover:text-charcoal'
            }`}
          >
            EN
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-3 lg:pr-6 border-r border-gray-200">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Role Swapper:</span>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="text-sm font-medium bg-gray-50 border border-gray-200 rounded-md px-2 py-1 outline-none cursor-pointer"
          >
            <option value={UserRole.DEC}>DEC (District)</option>
            <option value={UserRole.SEC}>SEC (State)</option>
            <option value={UserRole.SEBC}>SEBC (Chairman)</option>
          </select>
        </div>

        <div className="flex items-center gap-2 lg:gap-3 ml-2">
          <button 
            onClick={onLogout}
            className="text-sm font-bold text-gray-500 hover:text-brand-red transition-colors flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Log Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
