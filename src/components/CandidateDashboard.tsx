import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LogOut, 
  User, 
  Clock, 
  AlertCircle, 
  Award, 
  CheckCircle, 
  Download, 
  Shield, 
  Info, 
  X,
  Wifi,
  Globe,
  Bell,
  FileText,
  Menu,
  ChevronDown,
  ClipboardList,
  LayoutDashboard
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';
import { calculateCandidateFee } from '../utils/feeCalculator';
import { UserProfileModal, UserProfileData } from './UserProfileModal';
import { CandidateExamRoom } from './CandidateExamRoom';

// --- INTERFACES & MOCK DATA ---
interface UserSession {
  name: string;
  sarawakId: string;
  nric: string;
  avatarUrl?: string;
  category: 'Cadet' | 'VAD' | 'Public';
  status: string;
}

interface ExamItem {
  id: string;
  code: string;
  title: string;
  date: string;
  startTime: string; 
  type: 'upcoming' | 'retest' | 'completed';
  retestReason?: string;
  result?: 'Pass' | 'Fail' | 'Absent';
  scoreBreakdown?: {
    name: string;
    pointsEarned: number;
    maxPoints: number;
    percent: number;
  }[];
  totalPercent?: number;
}

const mockUser: UserSession = {
  name: 'Ahmad Faiz Bin Abu',
  sarawakId: 'ahmad.faiz.88',
  nric: '880101-13-5683',
  category: 'VAD',
  status: 'Verified'
};

const populatedExams: ExamItem[] = [
  {
    id: 'e1',
    code: '800/2',
    title: 'Pertolongan Cemas Asas dan CPR',
    date: '2026-05-20',
    startTime: '13:30',
    type: 'upcoming'
  },
  {
    id: 'e2',
    code: 'CBFA1021',
    title: 'Asas Pertolongan Cemas',
    date: '2026-05-18',
    startTime: '09:00',
    type: 'retest',
    retestReason: 'Failed previous exam'
  }
];

const completedExams: ExamItem[] = [
  {
    id: 'e3',
    code: 'CERC1011',
    title: 'Pendidikan Palang Merah dan Bulan Sabit Merah',
    date: '2025-09-10',
    startTime: '10:00',
    type: 'completed',
    result: 'Pass',
    totalPercent: 86,
    scoreBreakdown: [
      { name: 'Category A', pointsEarned: 10, maxPoints: 10, percent: 100 },
      { name: 'Category B', pointsEarned: 8, maxPoints: 10, percent: 80 },
      { name: 'Category C', pointsEarned: 10, maxPoints: 10, percent: 100 },
      { name: 'Category D', pointsEarned: 7, maxPoints: 10, percent: 70 },
      { name: 'Category E', pointsEarned: 8, maxPoints: 10, percent: 80 }
    ]
  }
];

const mockNotifications = [
  { id: 'n1', type: 'info', message: 'Exam tomorrow: Pertolongan Cemas Asas — 13:30', time: '2h ago', read: false },
  { id: 'n2', type: 'warning', message: 'Certificate 800/3 expires in 45 days — Renew now', time: '1d ago', read: false },
  { id: 'n3', type: 'success', message: 'Your application for 800/2 was approved', time: '2d ago', read: true }
];

interface CandidateDashboardProps {
  onLogout: () => void;
}

export const CandidateDashboard: React.FC<CandidateDashboardProps> = ({ onLogout }) => {
  // States
  const [allExams, setAllExams] = useState<ExamItem[]>([...populatedExams, ...completedExams]);
  const [isPopulated, setIsPopulated] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const { t, language, setLanguage, translateContent } = useLanguage();
  const [takingExamId, setTakingExamId] = useState<string | null>(null);
  const [selectedExamResult, setSelectedExamResult] = useState<ExamItem | null>(null);
  
  const [activeView, setActiveView] = useState<'dashboard' | 'upcoming' | 'retest' | 'past'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [examMenuOpen, setExamMenuOpen] = useState(true);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [userProfileData, setUserProfileData] = useState<UserProfileData>({
    name: mockUser.name,
    email: 'ahmad.faiz@example.com',
    bio: 'Candidate Member - ' + mockUser.category,
    avatarUrl: mockUser.avatarUrl || null
  });
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const exams = isPopulated ? allExams : [];
  const upcomingExams = exams.filter(e => e.type === 'upcoming');
  const retestExams = exams.filter(e => e.type === 'retest');
  const historyExams = exams.filter(e => e.type === 'completed');

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { hour12: false });
  };

  const getExamStatus = (examDateStr: string, startTimeStr: string) => {
    return { locked: false, message: 'Exam is currently open (Dev Mode)' };
  };

  const handleAttendExam = (examId: string) => {
    setConnectingId(examId);
    setTimeout(() => {
      setTakingExamId(examId);
      setConnectingId(null);
    }, 1200);
  };

  const handleDownloadCert = (certName: string) => {
    const text = `Certificate of Completion\n\nThis is to certify that you have passed the ${certName} examination.\n\nMalaysian Red Crescent Society`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificate_${certName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderDashboardGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div 
        whileHover={{ scale: 1.02 }}
        onClick={() => setActiveView('upcoming')}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 cursor-pointer hover:border-brand-red transition-all group"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="bg-brand-red/10 p-3 rounded-lg">
            <Clock className="w-6 h-6 text-brand-red" />
          </div>
          <span className="text-3xl font-black text-charcoal group-hover:text-brand-red transition-colors">{upcomingExams.length}</span>
        </div>
        <h3 className="text-lg font-bold text-charcoal mb-1">Upcoming Exam</h3>
        <p className="text-sm text-slate-500">List of exam registered</p>
      </motion.div>

      <motion.div 
        whileHover={{ scale: 1.02 }}
        onClick={() => setActiveView('retest')}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 cursor-pointer hover:border-orange-500 transition-all group"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="bg-orange-50 p-3 rounded-lg">
            <AlertCircle className="w-6 h-6 text-orange-500" />
          </div>
          <span className="text-3xl font-black text-charcoal group-hover:text-orange-500 transition-colors">{retestExams.length}</span>
        </div>
        <h3 className="text-lg font-bold text-charcoal mb-1">Retest</h3>
        <p className="text-sm text-slate-500">Failed exams needing retest</p>
      </motion.div>

      <motion.div 
        whileHover={{ scale: 1.02 }}
        onClick={() => setActiveView('past')}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 cursor-pointer hover:border-brand-red transition-all group"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="bg-slate-100 p-3 rounded-lg">
            <FileText className="w-6 h-6 text-slate-600" />
          </div>
          <span className="text-3xl font-black text-charcoal group-hover:text-brand-red transition-colors">{historyExams.length}</span>
        </div>
        <h3 className="text-lg font-bold text-charcoal mb-1">Past Exam</h3>
        <p className="text-sm text-slate-500">List of exam attended</p>
      </motion.div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-surface-cream text-charcoal overflow-x-hidden w-full">
      
      {/* --- SIDEBAR --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`w-72 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div 
          onClick={() => {
            setIsProfileModalOpen(true);
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
          }}
          className="p-5 border-b border-gray-50 flex items-center justify-between bg-brand-red cursor-pointer hover:bg-brand-red-deep transition-colors"
        >
          <div className="flex items-center gap-3">
            {userProfileData.avatarUrl ? (
              <img src={userProfileData.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
            ) : (
              <User className="w-10 h-10 text-white" />
            )}
            <div>
              <p className="text-sm font-bold text-white leading-tight">{userProfileData.name}</p>
              <p className="text-[11px] text-red-100 font-medium uppercase tracking-wider">Candidate</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-white/10 rounded-full">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-0.5 overflow-y-auto bg-gray-50/20">
          <button
            onClick={() => {
              setActiveView('dashboard');
              if (window.innerWidth < 1024) setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-[13px] font-bold transition-all relative group ${
              activeView === 'dashboard' 
              ? 'bg-blush-rose text-brand-red-deep shadow-sm' 
              : 'text-charcoal/80 hover:bg-gray-50'
            }`}
          >
            {activeView === 'dashboard' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-brand-red rounded-r-full" />}
            <LayoutDashboard className={`w-[18px] h-[18px] transition-colors ${activeView === 'dashboard' ? 'text-brand-red' : 'text-gray-400 group-hover:text-charcoal'}`} />
            Dashboard
          </button>

          <div className="space-y-0.5 mt-2">
            <button
              onClick={() => setExamMenuOpen(!examMenuOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[6px] text-[13px] font-bold transition-all ${
                examMenuOpen ? 'text-charcoal' : 'text-charcoal/80'
              } hover:bg-gray-50 group`}
            >
              <div className="flex items-center gap-3">
                <ClipboardList className={`w-[18px] h-[18px] transition-colors ${examMenuOpen ? 'text-brand-red' : 'text-gray-400 group-hover:text-charcoal'}`} />
                <span>Online Exam</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${examMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {examMenuOpen && (
              <div className="pl-10 space-y-0.5 pb-1">
                <button
                  onClick={() => {
                    setActiveView('upcoming');
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-[6px] text-[12px] font-medium transition-all ${
                    activeView === 'upcoming' 
                    ? 'text-brand-red font-bold bg-gray-50' 
                    : 'text-charcoal/70 hover:text-charcoal hover:bg-gray-50'
                  }`}
                >
                  Upcoming Exam
                </button>
                <button
                  onClick={() => {
                    setActiveView('retest');
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-[6px] text-[12px] font-medium transition-all ${
                    activeView === 'retest' 
                    ? 'text-orange-500 font-bold bg-orange-50/50' 
                    : 'text-charcoal/70 hover:text-charcoal hover:bg-gray-50'
                  }`}
                >
                  Retest
                </button>
                <button
                  onClick={() => {
                    setActiveView('past');
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-[6px] text-[12px] font-medium transition-all ${
                    activeView === 'past' 
                    ? 'text-brand-red font-bold bg-gray-50' 
                    : 'text-charcoal/70 hover:text-charcoal hover:bg-gray-50'
                  }`}
                >
                  Past Exam
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* --- MAIN AREA --- */}
      <main className={`flex-1 min-w-0 ${isSidebarOpen ? 'lg:ml-72' : ''} min-h-screen flex flex-col transition-all duration-300`}>
        {/* HEADER */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-[14px] uppercase tracking-wider text-slate-700 font-bold">MRC Sarawak Branch</h1>
            </div>
            <div id="header-lobby-switcher"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors relative"
              >
                <Bell className="w-[18px] h-[18px]" />
                {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-red rounded-full border border-white"></span>}
              </button>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-brand-red" />
              {formatTime(currentTime)}
            </div>
            <button 
              onClick={onLogout}
              className="flex items-center gap-1.5 text-sm font-bold text-brand-red hover:text-brand-red-deep bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto w-full">
            {takingExamId ? (
              <CandidateExamRoom 
                examId={takingExamId}
                examTitle={allExams.find(e => e.id === takingExamId)?.title || "Peperiksaan"} 
                examCode={allExams.find(e => e.id === takingExamId)?.code || "800/2"}
                candidateName={userProfileData.name}
                candidateNric={mockUser.nric}
                onFinish={(result, score, scoreBreakdown) => {
                  setTakingExamId(null);
                  if (result) {
                    setAllExams(prev => prev.map(e => {
                      if (e.id === takingExamId) {
                        return {
                          ...e,
                          type: result === 'Pass' ? 'completed' : 'retest',
                          result: result,
                          totalPercent: score,
                          scoreBreakdown: scoreBreakdown,
                          retestReason: result === 'Fail' ? 'Did not achieve passing score' : undefined
                        };
                      }
                      return e;
                    }));
                    setActiveView(result === 'Pass' ? 'past' : 'retest');
                  }
                }} 
              />
            ) : selectedExamResult ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-4xl mx-auto space-y-6"
              >
                <div className="bg-white border border-black p-6 md:p-12 space-y-8 text-black rounded-none shadow-sm">
                  <div className="space-y-6">
                    {/* Document Header */}
                    <div className="border-b-2 border-black pb-6 text-center">
                      <h3 className="font-bold text-2xl uppercase tracking-wide text-black">
                        {translateContent('Rumusan Peperiksaan')}
                      </h3>
                      <p className="text-sm text-gray-500 font-mono tracking-widest uppercase mt-2">OFFICIAL EXAMINATION RESULT SLIP</p>
                    </div>

                    {/* Metadata Section - clean left-aligned text format */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm text-black my-8">
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                        <span className="font-bold min-w-[150px] text-gray-700">{translateContent('Nama Calon / Name')}:</span>
                        <span className="uppercase font-bold text-base">{userProfileData.name}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                        <span className="font-bold min-w-[150px] text-gray-700">No. KP / NRIC:</span>
                        <span className="font-mono text-base">{mockUser.nric}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                        <span className="font-bold min-w-[150px] text-gray-700">{translateContent('Kursus / Course')}:</span>
                        <span className="text-base">{selectedExamResult.code} ({selectedExamResult.title})</span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                        <span className="font-bold min-w-[150px] text-gray-700">{translateContent('Tarikh / Date')}:</span>
                        <span className="font-mono text-base">{new Date(selectedExamResult.date).toLocaleDateString('en-GB')}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                        <span className="font-bold min-w-[150px] text-gray-700">{translateContent('Lokasi / Location')}:</span>
                        <span className="text-base">Kuching Chapter, Sarawak</span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="font-bold min-w-[150px] text-gray-700">{translateContent('Keputusan / Status')}:</span>
                        <div className="flex items-center gap-3">
                          <span className="font-bold font-mono text-lg">{selectedExamResult.totalPercent || 86}%</span>
                          {selectedExamResult.result === 'Pass' ? (
                            <span className="px-3 py-1 text-xs font-bold border-2 border-green-700 bg-green-50 text-green-800 rounded-none tracking-wide">
                              LULUS / PASS
                            </span>
                          ) : (
                            <span className="px-3 py-1 text-xs font-bold border-2 border-red-600 bg-red-50 text-red-900 rounded-none tracking-wide">
                              GAGAL / FAIL
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Separator */}
                    <div className="border-t border-black my-8" />

                    {/* Bottom section: Exam Category Summary Table */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-black uppercase tracking-wide">
                        {translateContent('Ringkasan Skor / Score Breakdown')}
                      </h4>

                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border-2 border-black text-sm text-black">
                          <thead className="bg-gray-100 border-b-2 border-black">
                            <tr className="divide-x-2 divide-black text-xs font-bold uppercase tracking-wider text-black">
                              <th className="px-6 py-4 text-left border-black">{translateContent('Kategori / Category Name')}</th>
                              <th className="px-6 py-4 text-center border-black w-[20%]">{translateContent('Mata Diperoleh / Points Earned')}</th>
                              <th className="px-6 py-4 text-center border-black w-[20%]">{translateContent('Mata Maksimum / Max Points')}</th>
                              <th className="px-6 py-4 text-right border-black w-[25%] font-sans">{translateContent('Peratusan / Percentage (%)')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(selectedExamResult.scoreBreakdown || [
                              { name: 'Category A', pointsEarned: 10, maxPoints: 10, percent: 100 },
                              { name: 'Category B', pointsEarned: 8, maxPoints: 10, percent: 80 },
                              { name: 'Category C', pointsEarned: 10, maxPoints: 10, percent: 100 },
                              { name: 'Category D', pointsEarned: 7, maxPoints: 10, percent: 70 },
                              { name: 'Category E', pointsEarned: 8, maxPoints: 10, percent: 80 }
                            ]).map((row) => (
                              <tr key={row.name} className="border-b border-black divide-x-2 divide-black">
                                <td className="px-6 py-4 border-black text-left font-bold text-base">
                                  {row.name}
                                </td>
                                <td className="px-6 py-4 border-black text-center font-mono text-base">{row.pointsEarned}</td>
                                <td className="px-6 py-4 border-black text-center font-mono text-base">{row.maxPoints}</td>
                                <td className="px-6 py-4 border-black text-right font-mono text-zinc-900 text-base">{row.percent}%</td>
                              </tr>
                            ))}
                            <tr className="bg-gray-100 font-bold divide-x-2 divide-black border-t-2 border-black">
                              <td className="px-6 py-4 border-black text-left uppercase text-sm">TOTAL / OVERALL</td>
                              <td className="px-6 py-4 border-black text-center font-mono text-zinc-900 text-base">
                                {(selectedExamResult.scoreBreakdown || []).reduce((sum, item) => sum + item.pointsEarned, 43)}
                              </td>
                              <td className="px-6 py-4 border-black text-center font-mono text-slate-700 text-base">
                                {(selectedExamResult.scoreBreakdown || []).reduce((sum, item) => sum + item.maxPoints, 50)}
                              </td>
                              <td className="px-6 py-4 border-black text-right font-mono text-zinc-900 text-base">{selectedExamResult.totalPercent || 86}%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Print Friendly helper label */}
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider text-center mt-8">
                      📄 {translateContent('Penjana Markah Berkomputer BSMM Sarawak / Computerized Score Slip')}
                    </div>
                  </div>
                </div>

                {/* Footer actions  */}
                <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
                  {selectedExamResult.result === 'Pass' && (
                    <button
                      onClick={() => handleDownloadCert(selectedExamResult.title)}
                      className="bg-action-teal hover:bg-teal-700 text-white font-extrabold text-sm px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow"
                    >
                      <Download className="w-5 h-5" /> {translateContent(' Download Result')}
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedExamResult(null)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all uppercase tracking-wider shadow"
                  >
                    {translateContent('Back')}
                  </button>
                </div>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* DASHBOARD VIEW */}
                  {activeView === 'dashboard' && renderDashboardGrid()}

                  {/* UPCOMING EXAM VIEW */}
                  {activeView === 'upcoming' && (
                    <section>
                      <div className="flex items-center gap-2.5 mb-6">
                        <div className="bg-brand-red/10 p-2 rounded-lg">
                          <Clock className="w-5 h-5 text-brand-red" />
                        </div>
                        <h2 className="text-xl font-bold text-charcoal tracking-tight">Upcoming Exam</h2>
                      </div>
                      
                      {upcomingExams.length > 0 ? (
                        <div className="space-y-5">
                          {upcomingExams.map((exam) => {
                            const timeStatus = getExamStatus(exam.date, exam.startTime);
                            const isLocked = timeStatus.locked;
                            return (
                              <div key={exam.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors">
                                <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">
                                  <div>
                                    <span className="exam-code-disp inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold font-mono tracking-wide border border-slate-200 mb-2">
                                      {exam.code}
                                    </span>
                                    <h3 className="text-lg font-bold text-charcoal mb-1">{exam.title}</h3>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium mt-3">
                                      <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> {new Date(exam.date).toLocaleDateString('en-GB')}</div>
                                      <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> Starts at {exam.startTime} Hours</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-end">
                                    <button 
                                      disabled={isLocked || connectingId === exam.id}
                                      onClick={() => handleAttendExam(exam.id)}
                                      className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all w-full md:w-auto flex items-center justify-center gap-2 ${
                                        isLocked ? 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed' : 
                                        connectingId === exam.id ? 'bg-teal-600 text-white cursor-wait opacity-90' : 
                                        'bg-action-teal hover:bg-teal-700 text-white shadow-sm hover:shadow-md'
                                      }`}
                                    >
                                      {isLocked ? 'Locked' : connectingId === exam.id ? 'Connecting...' : 'Attend Exam'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 border-dashed p-10 text-center flex flex-col items-center">
                          <CheckCircle className="w-10 h-10 text-slate-300 mb-4" />
                          <h3 className="text-lg font-bold text-charcoal mb-1">No Upcoming Exams</h3>
                          <p className="text-sm text-slate-500">You do not have any exams scheduled at the moment.</p>
                        </div>
                      )}
                    </section>
                  )}

                  {/* RETEST EXAM VIEW */}
                  {activeView === 'retest' && (
                    <section>
                      <div className="flex items-center gap-2.5 mb-6">
                        <div className="bg-orange-50 p-2 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-orange-500" />
                        </div>
                        <h2 className="text-xl font-bold text-charcoal tracking-tight">Retest Exam</h2>
                      </div>
                      
                      {retestExams.length > 0 ? (
                        <div className="space-y-5">
                          {retestExams.map((exam) => {
                            const timeStatus = getExamStatus(exam.date, exam.startTime);
                            const isLocked = timeStatus.locked;
                            return (
                              <div key={exam.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:border-orange-300 transition-colors">
                                <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">
                                  <div>
                                    <span className="exam-code-disp inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold font-mono tracking-wide border border-slate-200 mb-2">
                                      {exam.code}
                                    </span>
                                    <h3 className="text-lg font-bold text-charcoal mb-1">{exam.title}</h3>
                                    <p className="text-sm text-red-600 font-medium mb-2">{exam.retestReason || "Failed previous attempt"}</p>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium mt-3">
                                      <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> {new Date(exam.date).toLocaleDateString('en-GB')}</div>
                                      <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> Starts at {exam.startTime} Hours</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-end">
                                    <button 
                                      disabled={isLocked || connectingId === exam.id}
                                      onClick={() => handleAttendExam(exam.id)}
                                      className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all w-full md:w-auto flex items-center justify-center gap-2 ${
                                        isLocked ? 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed' : 
                                        connectingId === exam.id ? 'bg-orange-600 text-white cursor-wait opacity-90' : 
                                        'bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md'
                                      }`}
                                    >
                                      {isLocked ? 'Locked' : connectingId === exam.id ? 'Connecting...' : 'Attend Retest'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 border-dashed p-10 text-center flex flex-col items-center">
                          <CheckCircle className="w-10 h-10 text-slate-300 mb-4" />
                          <h3 className="text-lg font-bold text-charcoal mb-1">No Retest Needed</h3>
                          <p className="text-sm text-slate-500">You do not have any exams scheduled for a retest at the moment.</p>
                        </div>
                      )}
                    </section>
                  )}

                  {/* PAST EXAM VIEW */}
                  {activeView === 'past' && (
                    <section>
                      <div className="flex items-center gap-2.5 mb-6">
                        <div className="bg-slate-100 p-2 rounded-lg">
                          <FileText className="w-5 h-5 text-slate-600" />
                        </div>
                        <h2 className="text-xl font-bold text-charcoal tracking-tight">Past Exam</h2>
                      </div>
                      
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest">
                              <tr>
                                <th className="px-6 py-4">{translateContent('Kursus / Course')}</th>
                                <th className="px-6 py-4">{translateContent('Tarikh / Date')}</th>
                                <th className="px-6 py-4">{translateContent('Keputusan / Result')}</th>
                                <th className="px-6 py-4 text-right">{translateContent('Tindakan / Action')}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {historyExams.length > 0 ? historyExams.map(exam => (
                                <tr key={exam.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-6 py-4">
                                    <div className="font-bold text-charcoal mb-0.5">{exam.title}</div>
                                    <div className="font-mono text-[10px] text-slate-400">{exam.code}</div>
                                  </td>
                                  <td className="px-6 py-4 font-medium">{new Date(exam.date).toLocaleDateString('en-GB')}</td>
                                  <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                      exam.result === 'Pass' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                      {exam.result || 'Pending'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <button 
                                      onClick={() => setSelectedExamResult(exam)}
                                      className="bg-white hover:bg-slate-50 text-action-teal hover:text-teal-700 font-extrabold text-xs px-3.5 py-1.5 rounded-lg border border-slate-200 hover:border-teal-300 transition-all flex items-center justify-end gap-1.5 ml-auto shadow-sm"
                                    >
                                      <FileText className="w-3.5 h-3.5" /> {translateContent('Lihat Keputusan / View Result')}
                                    </button>
                                  </td>
                                </tr>
                              )) : (
                                <tr>
                                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No past exams found</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </section>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>

      <UserProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userData={userProfileData}
        onSave={(data) => {
          setUserProfileData(data);
          setIsProfileModalOpen(false);
        }}
      />
    </div>
  );
};