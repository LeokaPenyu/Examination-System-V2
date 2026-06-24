import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { FrontPage } from './components/FrontPage';
import { CandidateDashboard } from './components/CandidateDashboard';
import { UserRole, ViewType, ExamStatus } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from './context/LanguageContext';
import { 
  Building2,
  CheckCircle2
} from 'lucide-react';

import { ApplicationForm } from './components/ApplicationForm';
import { ExamApplicationModule } from './components/ExamApplicationModule';
import { ExamTypeSelection } from './components/ExamTypeSelection';
import { ExamSummaryView } from './components/ExamSummaryView';
import { mockExams as initialExams, MockExam } from './data/mockExams';

import { CertificateRenewalModule } from './components/CertificateRenewalModule';
import { AttendanceCertificateModule } from './components/AttendanceCertificateModule';
import { OnlineExamModule } from './components/OnlineExamModule';
import { ExamResultsEntry } from './components/ExamResultsEntry';
import { QuestionBankModule } from './components/QuestionBankModule';
import { ExamPaperGeneratorModule } from './components/ExamPaperGeneratorModule';
import { RetestModule } from './components/RetestModule';
import { ReportsModule } from './components/ReportsModule';
import { ProfilDaerah } from './components/ProfilDaerah';
import { ProfilSubjek } from './components/ProfilSubjek';
import { Calon } from './components/Calon';
import { Jurulatih } from './components/Jurulatih';
import { ProfilPengguna } from './components/ProfilPengguna';
import { PerananPengguna } from './components/PerananPengguna';
import { TetapanAm } from './components/TetapanAm';
import { JadualPeperiksaan } from './components/JadualPeperiksaan';
import { PeperiksaanMain } from './components/PeperiksaanMain';

export default function App() {
  const { t } = useLanguage();
  const [appMode, setAppMode] = React.useState<'front' | 'coordinator' | 'candidate'>('front');
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  const [activeView, setActiveView] = React.useState<ViewType>('Dashboard');
  const [role, setRole] = React.useState<UserRole>(UserRole.DEC);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(window.innerWidth >= 1024);
  const [examStep, setExamStep] = React.useState<'list' | 'select' | 'form' | 'summary' | 'success'>('list');
  const [selectedExamId, setSelectedExamId] = React.useState<string | null>(null);
  const [selectedExamType, setSelectedExamType] = React.useState<string | null>(null);
  const [submittedExam, setSubmittedExam] = React.useState<MockExam | null>(null);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [isSummaryReadyView, setIsSummaryReadyView] = React.useState(false);
  const [isUnlockListView, setIsUnlockListView] = React.useState(false);
  const [isPendingSubmissionView, setIsPendingSubmissionView] = React.useState(false);
  const [isRejectedView, setIsRejectedView] = React.useState(false);
  const [isVerificationListView, setIsVerificationListView] = React.useState(false);
  const [isPrintListView, setIsPrintListView] = React.useState(false);
  const [viewTitle, setViewTitle] = React.useState<string | undefined>(undefined);
  const [initialModuleTab, setInitialModuleTab] = React.useState<'borang' | 'rumusan' | 'keputusan'>('borang');
  const [initialModuleStatus, setInitialModuleStatus] = React.useState<string>('Semua');
  const [navigationId, setNavigationId] = React.useState(0);
  const [exams, setExams] = React.useState<MockExam[]>(initialExams);

  const handleAddExam = (exam: MockExam) => {
    setExams(prev => [exam, ...prev]);
  };

  const handleUpdateExam = (id: string, updates: Partial<MockExam>) => {
    setExams(prev => prev.map(e => (e && e.id === id) ? { ...e, ...updates } : e));
  };

  // Reset to dashboard when role changes
  React.useEffect(() => {
    setActiveView('Dashboard');
    setExamStep('list');
  }, [role]);

  // Reset step when view changes
  React.useEffect(() => {
    if (activeView !== 'ExamApplication') {
      setIsSummaryReadyView(false);
      setIsPendingSubmissionView(false);
      setIsRejectedView(false);
      setIsVerificationListView(false);
    }
    // Only reset to list if we are not in success or summary mode
    if (activeView === 'ExamApplication' && !isSummaryReadyView && !isPendingSubmissionView && !isRejectedView && !isVerificationListView && examStep !== 'success' && examStep !== 'summary') {
      setExamStep('list');
      setIsEditMode(false);
    }
  }, [activeView]);

  if (appMode === 'front') {
    return (
      <FrontPage onSelectRole={(role) => setAppMode(role)} />
    );
  }

  if (appMode === 'candidate') {
    return (
      <CandidateDashboard onLogout={() => setAppMode('front')} />
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case 'Dashboard':
        return (
          <Dashboard 
            role={role} 
            exams={exams}
            onNavigate={(view) => setActiveView(view as any)}
            onViewExam={(key) => {
              setActiveView('ExamApplication');
              setNavigationId(n => n + 1);
              setIsUnlockListView(false);
              setIsPendingSubmissionView(false);
              setIsRejectedView(false);
              setIsVerificationListView(false);
              setIsPrintListView(false);
              setViewTitle(undefined);
              if (key === 'summary-ready') {
                setIsSummaryReadyView(true);
                setExamStep('list');
                setIsEditMode(false);
                setInitialModuleTab('rumusan');
                setInitialModuleStatus(ExamStatus.APPROVED);
                setViewTitle('Sedia untuk Penyediaan Rumusan Peperiksaan');
              } else if (key === 'menunggu-penyerahan') {
                setActiveView('ExamApplication');
                setIsSummaryReadyView(false);
                setIsPendingSubmissionView(true);
                setInitialModuleTab('rumusan');
                setInitialModuleStatus(ExamStatus.EXPIRED);
                setExamStep('list');
                setViewTitle('Menunggu Penyerahan');
              } else if (key === 'rejected-list') {
                setActiveView('ExamApplication');
                setExamStep('list');
                setIsSummaryReadyView(false);
                setIsPendingSubmissionView(false);
                setIsRejectedView(true);
                setInitialModuleTab('borang');
                setInitialModuleStatus(ExamStatus.REJECTED);
                setViewTitle('Ditolak');
              } else if (key === 'new-application-list') {
                setExamStep('list');
                setIsSummaryReadyView(false);
                setIsVerificationListView(true);
                setIsPrintListView(false);
                setInitialModuleTab('borang');
                setInitialModuleStatus(ExamStatus.PENDING_VERIFICATION);
                setViewTitle('Permohonan Baru Dihantar');
              } else if (key === 'verification-list') {
                // Kept for fallback in case it's triggered from somewhere else
                setExamStep('list');
                setIsSummaryReadyView(false);
                setIsVerificationListView(true);
                setIsPrintListView(false);
                setInitialModuleTab('rumusan');
                setInitialModuleStatus(ExamStatus.SUBMITTED);
                setViewTitle('Sedia untuk Pengesahan Permohonan');
              } else if (key === 'unlock-list') {
                setExamStep('list');
                setIsSummaryReadyView(false);
                setIsUnlockListView(true);
                setIsPrintListView(false);
                setInitialModuleTab('rumusan');
                setInitialModuleStatus(ExamStatus.UNLOCK_REQUESTED);
                setViewTitle('Permintaan Membuka Peperiksaan Terkunci');
              } else if (key === 'personnel-input') {
                setActiveView('ExamApplication');
                setExamStep('list');
                setIsSummaryReadyView(false);
                setIsUnlockListView(false);
                setIsPendingSubmissionView(false);
                setIsRejectedView(false);
                setIsPrintListView(false);
                setInitialModuleTab('rumusan');
                setInitialModuleStatus(ExamStatus.SUBMITTED);
                setViewTitle('Sedia untuk Memasukkan Senarai Pemeriksa');
              } else if (key === 'results-input') {
                setActiveView('ExamApplication');
                setExamStep('list');
                setIsSummaryReadyView(false);
                setIsUnlockListView(false);
                setIsPendingSubmissionView(false);
                setIsRejectedView(false);
                setIsPrintListView(false);
                setInitialModuleTab('keputusan');
                setInitialModuleStatus(ExamStatus.SUBMITTED);
                setViewTitle('Sedia untuk Memasukkan Keputusan');
              } else if (key === 'sedia-cetak-list') {
                setActiveView('ExamApplication');
                setExamStep('list');
                setIsSummaryReadyView(false);
                setIsUnlockListView(false);
                setIsPendingSubmissionView(false);
                setIsRejectedView(false);
                setIsPrintListView(true);
                setInitialModuleTab('keputusan');
                setInitialModuleStatus(ExamStatus.COMPLETED);
                setViewTitle('Sedia untuk Dicetak');
              } else if (key === 'print-list') {
                setActiveView('ExamApplication');
                setExamStep('list');
                setIsSummaryReadyView(false);
                setIsUnlockListView(false);
                setIsPendingSubmissionView(false);
                setIsRejectedView(false);
                setIsPrintListView(true);
                setInitialModuleTab('keputusan');
                setInitialModuleStatus(ExamStatus.COMPLETED);
                setViewTitle('Penyata Peperiksaan');
              } else {
                setSelectedExamId(key);
                setIsEditMode(false);
                setIsSummaryReadyView(false);
                setExamStep('summary');
              }
            }} 
          />
        );
      case 'ExamApplication':
        if (examStep === 'list' || examStep === 'select') {
          return (
            <>
              <ExamApplicationModule 
                key={`module-${navigationId}`}
                role={role}
                exams={exams}
                isSummaryReadyMode={isSummaryReadyView}
                isUnlockRequestMode={isUnlockListView}
                isPendingSubmissionMode={isPendingSubmissionView}
                isRejectedMode={isRejectedView}
                isNewApplicationListMode={initialModuleTab === 'borang' && initialModuleStatus === ExamStatus.PENDING_VERIFICATION}
                isVerificationListMode={isVerificationListView && initialModuleStatus === ExamStatus.SUBMITTED}
                isPrintListMode={isPrintListView}
                isSebcListMode={(initialModuleTab === 'keputusan' || initialModuleTab === 'rumusan') && (initialModuleStatus === ExamStatus.SUBMITTED || initialModuleStatus === ExamStatus.APPROVED)}
                headerTitle={viewTitle}
                initialTab={initialModuleTab}
                initialStatusFilter={initialModuleStatus}
                onTabChange={(tab) => setInitialModuleTab(tab)}
                onStatusFilterChange={(status) => setInitialModuleStatus(status)}
                onAddNew={() => setExamStep('select')} 
                onView={(id) => {
                  setSelectedExamId(id);
                  setIsEditMode(false);
                  setExamStep('summary');
                }}
                onEdit={(id) => {
                  setSelectedExamId(id);
                  setIsEditMode(true);
                  setExamStep('summary');
                }}
                onDelete={(id) => {
                  setExams(prev => prev.filter(e => e.id !== id));
                }}
              />
              {examStep === 'select' && (
                <ExamTypeSelection 
                  onBack={() => setExamStep('list')} 
                  onSelect={(type) => { 
                    setSelectedExamType(type); 
                    if (type === 'sijil') {
                      setActiveView('CertificateRenewal');
                      setExamStep('list'); // Reset step for next time
                    } else {
                      setExamStep('form'); 
                    }
                  }} 
                />
              )}
            </>
          );
        }
        if (examStep === 'summary' && selectedExamId) {
          return (
            <ExamSummaryView 
              role={role}
              exams={exams}
              examId={selectedExamId}
              onBack={() => {
                setExamStep('list');
              }}
              onUpdateExam={handleUpdateExam}
              onUpdateStatus={(id, status) => handleUpdateExam(id, { status })}
              onSuccess={(exam) => {
                setSubmittedExam(exam);
                setExamStep('success');
              }}
              initialEditMode={isEditMode}
              isSummaryReady={isSummaryReadyView}
              initialTab={initialModuleTab}
            />
          );
        }
        if (examStep === 'success' && submittedExam) {
          return (
            <div className="max-w-[480px] mx-auto py-12 px-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white text-center space-y-6 pt-10 pb-6 px-10 shadow-xl border border-gray-200 rounded-lg overflow-hidden relative"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-green-500"></div>
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-green-100">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-charcoal">Penyerahan Berjaya!</h2>
                  <p className="text-gray-500 text-[13px] max-w-sm mx-auto leading-relaxed">
                    {isSummaryReadyView 
                      ? 'Sistem telah menerima Rumusan Peperiksaan anda. Rumusan kini dihantar untuk pengesahan SEC.'
                      : 'Sistem telah menerima permohonan peperiksaan anda. Permohonan kini dihantar untuk pengesahan SEC.'}
                  </p>
                  <div className="mt-4 inline-block bg-blue-50 border border-blue-100 text-blue-800 text-[11px] font-medium py-1.5 px-3 rounded text-left shadow-sm">
                    Sistem akan memaklumkan Penyelaras Peperiksaan Negeri (SEC) di Cawangan.
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded p-4 w-full space-y-3 shadow-inner">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                    <span>No. Pendaftaran</span>
                    <span className="text-charcoal">{submittedExam?.regNo || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                    <span>Status Semasa</span>
                    <span className="text-action-teal px-2 py-0.5 bg-action-teal/10 rounded font-black tracking-wider text-[10px]">DIHANTAR</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-gray-400 pt-2 border-t border-gray-200">
                    <span>Tarikh Hantar: {new Date().toLocaleDateString('ms-MY')}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => {
                      setExamStep('list');
                      setSubmittedExam(null);
                    }}
                    className="w-full flex justify-center items-center gap-2 bg-action-teal hover:bg-teal-700 text-white px-6 py-2 rounded text-[13px] font-bold transition-colors shadow-sm"
                  >
                    Kembali ke Senarai
                  </button>
                </div>
              </motion.div>
            </div>
          );
        }
        return (
          <ApplicationForm 
            initialExamType={selectedExamType}
            goBack={() => setExamStep('select')} 
            onSubmit={(newExam) => {
              const submittedWithCorrectStatus = { ...newExam, status: ExamStatus.PENDING_VERIFICATION };
              handleAddExam(submittedWithCorrectStatus);
              setSubmittedExam(submittedWithCorrectStatus);
              setExamStep('success');
            }}
            onSaveDraft={(newExam) => {
              handleAddExam(newExam);
              setExamStep('list');
              setActiveView('ExamApplication');
            }}
          />
        );
      case 'NewRequest':
        return (
          <ApplicationForm 
            initialExamType={selectedExamType}
            goBack={() => setActiveView('Dashboard')} 
            onSubmit={(newExam) => {
              const submittedWithCorrectStatus = { ...newExam, status: ExamStatus.PENDING_VERIFICATION };
              handleAddExam(submittedWithCorrectStatus);
              setSubmittedExam(submittedWithCorrectStatus);
              setExamStep('success');
              setActiveView('ExamApplication');
            }}
            onSaveDraft={(newExam) => {
              handleAddExam(newExam);
              setActiveView('ExamApplication');
              setExamStep('list');
            }}
          />
        );
      case 'Calon':
        return <Calon />;
      case 'Jurulatih':
        return <Jurulatih />;
      case 'PeperiksaanMain':
        return <PeperiksaanMain setActiveView={setActiveView} />;
      case 'ExamProfile':
      case 'Panduan':
        return (
          <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
            <div className="bg-gray-100 p-8 rounded-full">
              <Building2 className="w-16 h-16 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold">{t(activeView.toLowerCase() as any)} {t('page')}</h2>
            <p className="text-gray-500 max-w-sm">{t('optimizationNotice')}</p>
            <button onClick={() => setActiveView('Dashboard')} className="btn-secondary">{t('back')}</button>
          </div>
        );
      case 'ExamSchedule':
        return <JadualPeperiksaan />;
      case 'CertificateRenewal':
        return <CertificateRenewalModule role={role} onBack={() => setActiveView('ExamApplication')} />;
      case 'AttendanceCertificate':
        return <AttendanceCertificateModule />;
      case 'OnlineExam':
        return <OnlineExamModule />;
      case 'ExamResults':
        return <ExamResultsEntry />;
      case 'QuestionBank':
        return <QuestionBankModule />;
      case 'ExamPaperGenerator':
        return <ExamPaperGeneratorModule />;
      case 'Retest':
        return <RetestModule />;
      case 'Reports':
        return <ReportsModule />;
      case 'ProfilDaerah':
        return <ProfilDaerah />;
      case 'ProfilSubjek':
        return <ProfilSubjek />;
      case 'ProfilPengguna':
        return <ProfilPengguna />;
      case 'PerananPengguna':
        return <PerananPengguna />;
      case 'TetapanAm':
        return <TetapanAm />;
      default:
        return <Dashboard role={role} onViewExam={(id) => console.log('View exam', id)} onNavigate={(view) => setActiveView(view as any)} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-cream text-charcoal overflow-x-hidden">
      <Sidebar 
        activeView={activeView} 
        setActiveView={(view) => {
          setActiveView(view);
          if (window.innerWidth < 1024) setIsSidebarOpen(false);
          if (view === 'ExamApplication') {
            setExamStep('select');
            setIsSummaryReadyView(false);
            setIsPendingSubmissionView(false);
            setIsRejectedView(false);
            setViewTitle(undefined);
            setInitialModuleTab('borang');
            setInitialModuleStatus('Semua');
            setNavigationId(n => n + 1);
          }
        }} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        role={role}
      />
      
      <main className={`flex-1 min-w-0 ${isSidebarOpen ? 'lg:ml-72' : ''} min-h-screen flex flex-col transition-all duration-300`}>
        <Header 
          role={role} 
          setRole={setRole} 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          onLogout={() => setAppMode('front')}
        />
        
        <div className="flex-1 min-w-0 p-4 lg:p-6 overflow-y-auto overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView + role}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <footer className="p-4 text-center border-t border-gray-100 bg-white/50 backdrop-blur-sm">
          <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase flex items-center justify-center gap-4">
            <button 
              onClick={() => setAppMode('front')} 
              className="hover:text-red-700 transition-colors bg-gray-100 px-3 py-1 rounded-full font-bold"
            >
              KEMBALI KE LAMAN UTAMA
            </button>
            {t('confidentialNotice').split('EASY').map((part, i, arr) => (
              <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 && <span className="notranslate" translate="no">EASY</span>}
              </React.Fragment>
            ))}
          </p>
        </footer>
      </main>
    </div>
  );
}
