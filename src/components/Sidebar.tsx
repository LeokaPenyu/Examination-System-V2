import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  UserSquare2, 
  BookOpen, 
  ChevronDown,
  Plus,
  X,
  Settings,
  Award,
  BarChart,
  UserCircle2,
  Shield // ensure Shield is imported
} from 'lucide-react';
import { ViewType, UserRole } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { UserProfileModal, UserProfileData } from './UserProfileModal';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, onClose, role }) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileData>({
    name: 'Ahmad bin Razak',
    email: 'ahmad.razak@example.com',
    bio: 'Pengurus Peperiksaan Negeri',
    avatarUrl: null
  });

  const { t } = useLanguage();

  const menuItems = [
    { id: 'Dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'QuestionBank', icon: BookOpen, label: 'Question Collection' },
    { id: 'ExamPaperGenerator', icon: ClipboardList, label: 'Exam Paper' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div className={`w-72 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div 
          onClick={() => setIsProfileModalOpen(true)}
          className="p-5 border-b border-gray-50 flex items-center justify-between bg-brand-red cursor-pointer hover:bg-brand-red-deep transition-colors"
        >
          <div className="flex items-center gap-3">
            {userProfile.avatarUrl ? (
              <img src={userProfile.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
            ) : (
              <UserCircle2 className="w-10 h-10 text-white" />
            )}
            <div>
              <p className="text-sm font-bold text-white">{userProfile.name}</p>
              <p className="text-[11px] text-red-100 font-medium uppercase tracking-wider">{role}</p>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="lg:hidden p-2 hover:bg-white/10 rounded-full">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

      <nav className="flex-1 px-4 py-4 space-y-0.5 overflow-y-auto custom-scrollbar bg-gray-50/20">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as ViewType)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-[13px] font-bold transition-all relative group ${
              activeView === item.id 
              ? 'bg-blush-rose text-brand-red-deep shadow-sm' 
              : 'text-charcoal/80 hover:bg-gray-50'
            }`}
          >
            {activeView === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-brand-red rounded-r-full" />
            )}
            <item.icon className={`w-[18px] h-[18px] transition-colors ${activeView === item.id ? 'text-brand-red' : 'text-gray-400 group-hover:text-charcoal'}`} />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
    
    <UserProfileModal 
      isOpen={isProfileModalOpen} 
      onClose={() => setIsProfileModalOpen(false)} 
      userData={userProfile} 
      onSave={(data) => setUserProfile(data)} 
    />
    </>
  );
};
