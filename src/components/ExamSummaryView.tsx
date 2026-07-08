import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Printer, 
  Edit3, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Users,
  CreditCard,
  Save,
  Send,
  Calendar,
  Plus,
  Lock,
  Unlock,
  ThumbsUp,
  ThumbsDown,
  X,
  MousePointer2,
  ArrowRight,
  Check
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { MockExam } from '../data/mockExams';
import { ResultSlipPrint } from './ResultSlipPrint';
import { UserRole, ExamStatus } from '../types';

interface Candidate {
  id: string;
  name: string;
  idNo: string;
  membershipNo: string;
  isMember: boolean;
  status?: string;
  attendance?: {
    theory: boolean;
    oral: boolean;
    practical: boolean;
  };
  scores?: {
    theory: number;
    oral: number;
    practical: number;
  };
}

interface ExamSummaryViewProps {
  role: UserRole;
  exams: MockExam[];
  examId: string;
  onBack: () => void;
  onUpdateExam?: (id: string, updates: Partial<MockExam>) => void;
  onUpdateStatus?: (id: string, status: ExamStatus) => void;
  onSuccess?: (exam: MockExam) => void;
  initialEditMode?: boolean;
  isSummaryReady?: boolean;
  initialTab?: 'borang' | 'rumusan' | 'keputusan';
}

import { PenyataPeperiksaanPrint } from './PenyataPeperiksaanPrint';

export const ExamSummaryView: React.FC<ExamSummaryViewProps> = ({ 
  role,
  exams,
  examId, 
  onBack, 
  onUpdateExam,
  onUpdateStatus,
  onSuccess,
  initialEditMode = false,
  isSummaryReady = false,
  initialTab
}) => {
  const { t } = useLanguage();
  
  // Look up data from exams or use default Figure 12 data
  const selectedMock = exams.find(e => e.id === examId) || exams[0];

  const [activeTab, setActiveTab] = useState<'borang' | 'rumusan' | 'keputusan'>(
    initialTab || (selectedMock.status === ExamStatus.DRAFT || selectedMock.status === ExamStatus.PENDING_VERIFICATION || selectedMock.status === ExamStatus.SUBMITTED ? 'borang' : 'rumusan')
  );
  const [isEditable, setIsEditable] = useState(initialEditMode);
  
  const isSummaryReadyFinal = selectedMock.regNo === 'BTU/2016/0009' || isSummaryReady;

  const [localStatus, setLocalStatus] = useState<ExamStatus>(selectedMock.status as ExamStatus);
  const [showNotification, setShowNotification] = useState<{show: boolean, message: string} | null>(null);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [showSlipPrint, setShowSlipPrint] = useState(false);
  const [showSijilModal, setShowSijilModal] = useState(false);
  const [sijilType, setSijilType] = useState('auto');
  const [sijilPrefix, setSijilPrefix] = useState('PCA1');
  const [sijilStart, setSijilStart] = useState('4500');
  const [unlockApproved, setUnlockApproved] = useState(false);
  const [isUnlockRequested, setIsUnlockRequested] = useState(false);
  const [isResultsSubmitted, setIsResultsSubmitted] = useState(localStatus === ExamStatus.COMPLETED);
  const [showSECUnlockDialog, setShowSECUnlockDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{message: string, onConfirm: () => void} | null>(null);
  const [alertDialog, setAlertDialog] = useState<{message: string, onClose?: () => void, buttonText?: string} | null>(null);
  const [newDueDate, setNewDueDate] = useState('2016-11-25');
  const [isSecondUnlock, setIsSecondUnlock] = useState((selectedMock.unlockRequestCount || 0) >= 1);
  const [paymentFile, setPaymentFile] = useState<string | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    selectedMock.candidates?.[0]?.id || ''
  );

  const examData = {
    regNo: selectedMock.regNo,
    status: selectedMock.status,
    deadline: selectedMock.deadline || '28/11/2017',
    district: selectedMock.district,
    organization: selectedMock.organization || 'Sekolah SAINS',
    category: selectedMock.category || 'Private',
    courseStart: selectedMock.courseStart || '23/11/2016',
    courseEnd: selectedMock.courseEnd || '23/11/2016',
    examDate: selectedMock.examDate || selectedMock.date,
    subject: selectedMock.subject,
    address: selectedMock.address || 'Sekolah SAINS',
    attachment: selectedMock.attachment || { name: 'rena-deco-clay-craft-map.png', size: '390 KB' },
    unlockRequestCount: selectedMock.unlockRequestCount || 0,
    candidates: selectedMock.candidates as Candidate[]
  };

  const [candidates, setCandidates] = useState<any[]>(() => {
    return examData.candidates.map(c => {
      const candidate: Candidate = {
        ...c,
        attendance: c.attendance || { theory: false, oral: false, practical: false }
      };

      if (candidate.scores) {
        return {
          ...candidate,
          scores: {
            theory: candidate.scores.theory === 0 ? '' : candidate.scores.theory,
            oral: candidate.scores.oral === 0 ? '' : candidate.scores.oral,
            practical: candidate.scores.practical === 0 ? '' : candidate.scores.practical
          }
        };
      }
      return candidate;
    });
  });
  
  const handleScoreChange = (id: string, type: 'theory' | 'oral' | 'practical', value: string) => {
    // Allows empty string, or parses as number, avoiding padded zeroes
    const parsedValue = value === '' ? '' : parseInt(value, 10);
    const numValue = Number.isNaN(parsedValue as number) ? '' : parsedValue;
    
    setCandidates(prev => prev.map(c => {
      if (c.id === id) {
        const currentScores = c.scores || { theory: '', oral: '', practical: '' };
        const newScores = { ...currentScores, [type]: numValue };
        
        // Calculate status correctly treating empty string as 0 for calculation
        const tScore = newScores.theory === '' ? 0 : Number(newScores.theory);
        const oScore = newScores.oral === '' ? 0 : Number(newScores.oral);
        const pScore = newScores.practical === '' ? 0 : Number(newScores.practical);
        
        const newStatus = (tScore >= 50 && oScore >= 20 && pScore >= 30) ? 'Pass' : 'Fail';
        return { ...c, scores: newScores, status: newStatus };
      }
      return c;
    }));
  };

  const [courseStart, setCourseStart] = useState(examData.courseStart);
  const [courseEnd, setCourseEnd] = useState(examData.courseEnd);
  const [address, setAddress] = useState(examData.address);

  const [jurulatih, setJurulatih] = useState([
    { id: 'j1', name: 'RODNEY AUDI', ic: '800101-10-1001', address: '', waran: '007' }
  ]);
  const [penyelia, setPenyelia] = useState([
    { id: 'p1', name: 'Farid Kamil', ic: 'K801001' }
  ]);
  const [pemeriksa, setPemeriksa] = useState([
    { id: 'pr1', name: 'LUKE', ic: '881201-52-5342', address: 'No 199, JLN ANGSANA, LOWER SUNGAI MAONG', waran: '1' },
    { id: 'pr2', name: 'TERESA', ic: '901212-12-1212', address: '', waran: '3' }
  ]);

  // Sync candidates if examId changes
  React.useEffect(() => {
    setCandidates(examData.candidates);
    setCourseStart(examData.courseStart);
    setCourseEnd(examData.courseEnd);
    setAddress(examData.address);
    setIsEditable(initialEditMode);
    if (examData.candidates && examData.candidates.length > 0) {
      setSelectedCandidateId(examData.candidates[0].id);
    } else {
      setSelectedCandidateId('');
    }
  }, [examId, initialEditMode]);

  const selectedCandidate = React.useMemo(() => {
    return candidates.find(c => c.id === selectedCandidateId) || candidates[0];
  }, [candidates, selectedCandidateId]);

  const currentCandidateScores = React.useMemo(() => {
    if (!selectedCandidate) return { theory: 60, oral: 22, practical: 36, totalScored: 118, totalPercentage: 47, isPass: false };
    
    // Convert scores to numbers, fallback to mock-like defaults if missing
    const theoryScore = selectedCandidate.scores?.theory !== undefined && selectedCandidate.scores?.theory !== '' ? Number(selectedCandidate.scores.theory) : 60;
    const oralScore = selectedCandidate.scores?.oral !== undefined && selectedCandidate.scores?.oral !== '' ? Number(selectedCandidate.scores.oral) : 22;
    const practicalScore = selectedCandidate.scores?.practical !== undefined && selectedCandidate.scores?.practical !== '' ? Number(selectedCandidate.scores.practical) : 36;
    
    const scaledTheory = theoryScore;
    const scaledOral = oralScore <= 40 && oralScore > 0 ? Math.round((oralScore / 40) * 100) : (oralScore === 0 ? 0 : oralScore);
    const scaledPractical = practicalScore <= 60 && practicalScore > 0 ? Math.round((practicalScore / 60) * 50) : (practicalScore === 0 ? 0 : practicalScore);
    
    const totalMax = 250;
    const totalScored = scaledTheory + scaledOral + scaledPractical;
    const totalPercentage = Math.round((totalScored / totalMax) * 100);
    const isPass = selectedCandidate.status === 'Pass' || (scaledTheory >= 50 && oralScore >= 20 && practicalScore >= 30);
    
    return {
      theory: scaledTheory,
      oral: scaledOral,
      practical: scaledPractical,
      totalScored,
      totalPercentage,
      isPass
    };
  }, [selectedCandidate]);

  const triggerNotification = (message: string) => {
    setShowNotification({ show: true, message });
    setTimeout(() => setShowNotification(null), 3000);
  };

  const renderMockupView = () => {
    if (!selectedCandidate) {
      return (
        <div className="p-8 text-center text-black font-bold bg-white border border-black">
          Tiada calon yang berdaftar untuk peperiksaan ini.
        </div>
      );
    }

    const { theory, oral, practical, totalScored, totalPercentage, isPass } = currentCandidateScores;

    return (
      <div className="bg-white border border-black p-8 md:p-12 space-y-8 text-black" id="document-sheet-view">
        {/* Candidate Selector top banner - high contrast, clean select, sharp corners, no shadows */}
        {candidates.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-gray-100 border border-black select-none">
            <span className="font-bold text-black text-xs uppercase tracking-wider">
              Pilih Calon untuk Paparan Keputusan:
            </span>
            <select
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
              className="px-3 py-1 bg-white border border-black font-bold text-xs text-black focus:outline-none"
            >
              {candidates.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name.toUpperCase()} ({c.idNo || (c as any).icNumber || 'Tiada KP'})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Document Header */}
        <div className="border-b-2 border-black pb-4 text-center">
          <h1 className="text-xl font-bold uppercase tracking-wide text-black">Rumusan Peperiksaan</h1>
        </div>

        {/* Metadata Section - grouped and left-aligned text format */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-sm text-black">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
            <span className="font-bold min-w-[180px] text-gray-700">No. Pendaftaran:</span>
            <span className="font-mono uppercase">{examData.regNo}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
            <span className="font-bold min-w-[180px] text-gray-700">Nama Calon:</span>
            <span className="uppercase font-bold">{selectedCandidate.name}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
            <span className="font-bold min-w-[180px] text-gray-700">No. KP / Pasport:</span>
            <span className="font-mono">{selectedCandidate.idNo || (selectedCandidate as any).icNumber || 'Tiada'}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
            <span className="font-bold min-w-[180px] text-gray-700">Kursus / Kod:</span>
            <span>{examData.subject || 'CPR & First Aid (Basic) / FA101'}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
            <span className="font-bold min-w-[180px] text-gray-700">Tarikh Peperiksaan:</span>
            <span className="font-mono">{examData.examDate}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
            <span className="font-bold min-w-[180px] text-gray-700">Cawangan / Lokasi:</span>
            <span className="uppercase">{examData.district || 'Kuala Lumpur'}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
            <span className="font-bold min-w-[180px] text-gray-700">Tarikh Akhir Penyerahan:</span>
            <span className="font-mono">{examData.deadline}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="font-bold min-w-[180px] text-gray-700">Keputusan Keseluruhan:</span>
            <div className="flex items-center gap-2">
              <span className="font-bold font-mono text-base">{totalPercentage}%</span>
              {isPass ? (
                <span className="px-2 py-0.5 text-xs font-bold border border-green-700 bg-green-50 text-green-800">
                  LULUS / PASSED
                </span>
              ) : (
                <span className="px-2 py-0.5 text-xs font-bold border border-red-600 bg-red-50 text-red-900">
                  GAGAL / FAILED
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-black my-4" />

        {/* Result Table - standard HTML table with thin black borders, collapse layout, light gray headers */}
        <div className="my-6 overflow-x-auto">
          <table className="w-full border-collapse border border-black text-sm text-black">
            <thead className="bg-gray-100 border-b border-black">
              <tr className="divide-x divide-black">
                <th className="px-4 py-2 text-left font-bold border border-black">Assessment Module</th>
                <th className="px-4 py-2 text-center font-bold border border-black w-[18%]">Max Score</th>
                <th className="px-4 py-2 text-center font-bold border border-black w-[18%]">Scored</th>
                <th className="px-4 py-2 text-center font-bold border border-black w-[22%]">Percentage (%)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-black divide-x divide-black">
                <td className="px-4 py-2 border border-black text-left">Theory (Multiple Choice)</td>
                <td className="px-4 py-2 border border-black text-center font-mono">100</td>
                <td className="px-4 py-2 border border-black text-center font-bold font-mono">{theory}</td>
                <td className="px-4 py-2 border border-black text-center font-bold font-mono">{theory}%</td>
              </tr>
              <tr className="border-b border-black divide-x divide-black">
                <td className="px-4 py-2 border border-black text-left">Scenario Simulation</td>
                <td className="px-4 py-2 border border-black text-center font-mono">100</td>
                <td className="px-4 py-2 border border-black text-center font-bold font-mono">{oral}</td>
                <td className="px-4 py-2 border border-black text-center font-bold font-mono">{oral}%</td>
              </tr>
              <tr className="border-b border-black divide-x divide-black">
                <td className="px-4 py-2 border border-black text-left">Practical CPR</td>
                <td className="px-4 py-2 border border-black text-center font-mono">50</td>
                <td className="px-4 py-2 border border-black text-center font-bold font-mono">{practical}</td>
                <td className="px-4 py-2 border border-black text-center font-bold font-mono">{practical}%</td>
              </tr>
              <tr className="bg-gray-100 font-bold divide-x divide-black">
                <td className="px-4 py-2 border border-black text-left uppercase">Total / Final</td>
                <td className="px-4 py-2 border border-black text-center font-mono">250</td>
                <td className="px-4 py-2 border border-black text-center font-mono">{totalScored}</td>
                <td className="px-4 py-2 border border-black text-center font-mono">
                  {totalPercentage}% ({isPass ? 'PASSED' : 'FAILED'})
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Fail/Pass Notice Box - high-contrast prompt */}
        <div className="my-6">
          {isPass ? (
            <div className="border border-green-700 bg-green-50 p-6 text-center">
              <h3 className="text-base font-bold text-green-955 uppercase tracking-wide">
                Ujian Lulus. Sila rujuk sijil anda.
              </h3>
            </div>
          ) : (
            <div className="border-2 border-red-600 bg-red-50 p-6 text-center">
              <h3 className="text-base font-bold text-red-900 uppercase tracking-wide">
                Ujian Gagal. Sila retest dalam masa 1 jam.
              </h3>
            </div>
          )}
        </div>

        {/* Attachment Link without decorative colorful icons */}
        {examData.attachment && (
          <div className="text-center text-xs text-gray-600 py-2 border-t border-dotted border-gray-400">
            Attachment:{" "}
            <button 
              type="button"
              onClick={() => setAlertDialog({message: `Membuka fail: ${examData.attachment.name}`})}
              className="text-black font-bold underline hover:text-gray-800"
            >
              {examData.attachment.name}
            </button>
            <span>
              {" "}
              ({examData.attachment.size ? examData.attachment.size.replace(' KB', '') : '390'} KB)
            </span>
          </div>
        )}

        {/* Back to Dashboard Button */}
        <div className="flex justify-center pt-4 border-t border-black">
          <button 
            type="button"
            onClick={onBack}
            className="px-6 py-2 bg-black hover:bg-gray-900 text-white font-bold text-xs uppercase tracking-wider transition-colors border border-black"
          >
            Kembali ke Papan Pemuka
          </button>
        </div>

        {/* Paper right-side footer date */}
        <div className="flex justify-end text-gray-500 font-mono text-[10px] pt-2">
          <span>Generated: {examData.courseEnd || '2024-07-01'}</span>
        </div>
      </div>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    setIsEditable(false);
    if (onUpdateExam) {
      onUpdateExam(examId, {
        candidates,
        courseStart,
        courseEnd,
        address
      });
    }
    triggerNotification('Maklumat berjaya disimpan!');
  };

  const handleSubmit = () => {
    setConfirmDialog({
      message: 'Hantar Rumusan Peperiksaan ini?',
      onConfirm: () => {
        const updatedExam = { ...selectedMock, status: ExamStatus.SUBMITTED };
        if (onUpdateStatus) onUpdateStatus(examId, ExamStatus.SUBMITTED);
        setLocalStatus(ExamStatus.SUBMITTED);
        
        setAlertDialog({
          message: 'Penyerahan Berjaya! Rumusan peperiksaan telah dihantar untuk pengesahan SEC. Sila tunggu maklum balas daripada pihak berkaitan.',
          onClose: () => {
            if (onSuccess) {
              onSuccess(updatedExam);
            } else {
              onBack();
            }
          }
        });
      }
    });
  };

  const handleRenew = () => {
    triggerNotification('Permohonan untuk memperbaharui kursus telah diproses.');
  };

  const [showAddPemeriksaDialog, setShowAddPemeriksaDialog] = useState(false);
  const [selectedPemeriksaId, setSelectedPemeriksaId] = useState('');

  const availablePemeriksaOptions = [
    { id: 'PEM-01', name: 'LUKE', ic: '800101-13-5555', address: 'Kuching', waran: 'W001' },
    { id: 'PEM-02', name: 'LEIA', ic: '810202-13-6666', address: 'Miri', waran: 'W002' },
    { id: 'PEM-03', name: 'HAN', ic: '790303-13-7777', address: 'Bintulu', waran: 'W003' }
  ];

  const handleOpenAddPemeriksa = () => {
    setSelectedPemeriksaId('');
    setShowAddPemeriksaDialog(true);
  };

  const confirmAddPemeriksa = () => {
    const selected = availablePemeriksaOptions.find(p => p.id === selectedPemeriksaId);
    if (selected) {
      setPemeriksa([...pemeriksa, { id: Math.random().toString(), name: selected.name, ic: selected.ic, address: selected.address, waran: selected.waran }]);
    }
    setShowAddPemeriksaDialog(false);
  };

  const addJurulatih = () => setJurulatih([...jurulatih, { id: Math.random().toString(), name: '', ic: '', address: '', waran: '' }]);
  const addPenyelia = () => setPenyelia([...penyelia, { id: Math.random().toString(), name: '', ic: '' }]);
  const addPemeriksa = () => setPemeriksa([...pemeriksa, { id: Math.random().toString(), name: '', ic: '', address: '', waran: '' }]);

  const removeJurulatih = (id: string) => setJurulatih(jurulatih.filter(j => j.id !== id));
  const removePenyelia = (id: string) => setPenyelia(penyelia.filter(p => p.id !== id));
  const removePemeriksa = (id: string) => setPemeriksa(pemeriksa.filter(p => p.id !== id));

  const toInputDate = (dateStr: string) => {
    if (!dateStr || !dateStr.includes('/')) return dateStr;
    const [d, m, y] = dateStr.split('/');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  };

  const fromInputDate = (dateStr: string) => {
    if (!dateStr || !dateStr.includes('-')) return dateStr;
    const [y, m, d] = dateStr.split('-');
    return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
  };

  const toggleAttendance = (candidateId: string, field: keyof NonNullable<Candidate['attendance']>) => {
    if (!isEditable) return;
    setCandidates(prev => {
      const nextCandidates = prev.map(c => {
        if (c.id !== candidateId) return c;
        const currentAttendance = c.attendance || { theory: false, oral: false, practical: false };
        return { 
          ...c, 
          attendance: { 
            ...currentAttendance, 
            [field]: !currentAttendance[field] 
          } 
        };
      });
      return [...nextCandidates];
    });
  };

  const totals = React.useMemo(() => {
    return {
      theory: candidates.filter(c => c.attendance && c.attendance.theory === true).length,
      oral: candidates.filter(c => c.attendance && c.attendance.oral === true).length,
      practical: candidates.filter(c => c.attendance && c.attendance.practical === true).length,
      members: candidates.filter(c => c.isMember).length,
      nonMembers: candidates.filter(c => !c.isMember).length,
      totalCount: candidates.length,
      lang: (selectedMock as any).lang || { bm: 1, bi: 1, bc: 0 }
    };
  }, [candidates, selectedMock]);

  const isExpired = (localStatus === ExamStatus.EXPIRED || localStatus === ExamStatus.UNLOCK_REQUESTED) && !unlockApproved;

  const handleUnlockRequest = () => {
    setShowUnlockDialog(true);
  };

  const confirmUnlock = () => {
    if (isSecondUnlock && !paymentFile) {
      triggerNotification('Sila muat naik Lampiran Pembayaran (DEC).');
      return;
    }

    setShowUnlockDialog(false);
    setIsUnlockRequested(true);
    setLocalStatus(ExamStatus.UNLOCK_REQUESTED);
    const updatedExam = { ...selectedMock, status: ExamStatus.UNLOCK_REQUESTED };
    if (onUpdateStatus) {
      onUpdateStatus(examId, ExamStatus.UNLOCK_REQUESTED);
    }
    setAlertDialog({
      message: 'Berjaya! Permohonan buka kunci telah dihantar kepada SEC.',
      onClose: () => onBack(),
      buttonText: 'Kembali ke Senarai'
    });
  };

  const handleUnlockApprove = () => {
    setShowSECUnlockDialog(true);
  };

  const confirmSECUnlock = () => {
    setShowSECUnlockDialog(false);
    setUnlockApproved(true);
    setLocalStatus(ExamStatus.APPROVED);
    if (onUpdateExam) {
      onUpdateExam(examId, { 
        status: ExamStatus.APPROVED, 
        deadline: newDueDate, 
        unlockRequestCount: (selectedMock.unlockRequestCount || 0) + 1 
      });
    } else if (onUpdateStatus) {
      onUpdateStatus(examId, ExamStatus.APPROVED);
    }
    triggerNotification(`Permohonan telah dibuka kunci. Tarikh akhir baru: ${newDueDate}`);
  };

  const fees = {
    memberTotal: totals.members * 2.00,
    nonMemberTotal: totals.nonMembers * 14.00,
    grandTotal: (totals.members * 2.00) + (totals.nonMembers * 14.00)
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen pb-20 pt-4 font-sans text-slate-800 antialiased">
      {/* Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-sm w-full mx-auto p-4 md:p-6 space-y-6">
            <h3 className="text-lg font-bold text-charcoal">{confirmDialog.message}</h3>
            <div className="flex gap-3 justify-end pt-4">
              <button 
                onClick={() => setConfirmDialog(null)}
                className="px-4 md:px-6 py-2 border border-gray-200 text-gray-600 bg-gray-50 rounded shadow-sm font-bold text-sm hover:bg-gray-100"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog(null);
                }}
                className="px-4 md:px-6 py-2 bg-action-teal text-white rounded shadow-md font-bold text-sm hover:bg-teal-700"
              >
                Teruskan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Dialog */}
      {alertDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-sm w-full mx-auto p-4 md:p-6 space-y-6 border-t-4 border-action-teal">
            <h3 className="text-xl font-black text-action-teal uppercase flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6" />
              Notifikasi
            </h3>
            <p className="text-gray-600 font-medium">{alertDialog.message}</p>
            <div className="flex justify-end pt-4">
              <button 
                onClick={() => {
                  if (alertDialog.onClose) alertDialog.onClose();
                  setAlertDialog(null);
                }}
                className="px-4 md:px-8 py-2 bg-action-teal text-white rounded shadow-md font-bold text-sm hover:bg-teal-700"
              >
                {alertDialog.buttonText || 'Tutup'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Centered Tab Navigation Container - Matches Document Sheet Width (Figure 12 Style) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-4">
        <div className="grid grid-cols-3 bg-[#E5E7EB] border border-slate-400 rounded-t-sm shadow-sm select-none">
          {[
            { id: 'borang', label: 'Borang Permohonan' },
            { id: 'rumusan', label: 'Rumusan Peperiksaan' },
            { id: 'keputusan', label: 'Keputusan' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 px-2 text-center transition-all duration-150 border-r last:border-r-0 border-slate-400 ${
                  isActive 
                    ? 'bg-white text-slate-950 font-extrabold text-xs sm:text-sm md:text-[14px] border-b-2 border-b-transparent shadow-sm' 
                    : 'bg-[#E5E7EB] text-slate-650 font-bold text-[10px] sm:text-xs border-b border-b-slate-400 hover:bg-[#D1D5DB] hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-8 !pt-0">
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-50 border border-green-200 text-green-700 px-4 md:px-6 py-3 rounded-lg shadow-xl flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold">{showNotification.message}</span>
          </motion.div>
        )}

        {activeTab === 'borang' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-white border border-slate-400 border-t-0 p-6 md:p-10 shadow-md rounded-b-sm space-y-8" id="document-sheet-view">
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-x-0 gap-y-1">
              
              <span className="text-[#8B4513] md:text-right text-left pr-4 font-medium">Status:</span>
              <div className="flex items-center gap-2">
                <span className="font-bold">{localStatus}</span>
              </div>
              
              <div className="col-span-2 my-2"></div>

              <span className="text-[#8B4513] md:text-right text-left pr-4 font-medium">Nama Daerah:</span>
              <span className="font-bold uppercase">{examData.district}</span>

              <span className="text-[#8B4513] md:text-right text-left pr-4 font-medium">Nama Unit/Organisasi:</span>
              <span className="font-bold">{examData.organization}</span>

              <span className="text-[#8B4513] md:text-right text-left pr-4 font-medium">Kategori Unit/Organisasi:</span>
              <span className="font-medium">{examData.category}</span>

              <span className="text-[#8B4513] md:text-right text-left pr-4 font-medium">Alamat Peperiksaan:</span>
              <span className="font-medium">{address}</span>

              <span className="text-[#8B4513] md:text-right text-left pr-4 font-medium">Nama dan Alamat Latihan O/C:</span>
              <span className="font-medium">Capten Nemo, Sekolah SAINS</span>

              <span className="text-[#8B4513] md:text-right text-left pr-4 font-medium">Tarikh Peperiksaan:</span>
              <span className="font-medium">{examData.examDate}</span>

              <span className="text-[#8B4513] md:text-right text-left pr-4 font-medium">Subjek:</span>
              <span className="font-medium">{examData.subject}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-4 mt-4">
              <span className="text-gray-400 font-bold md:text-right text-left">Senarai Calon:</span>
              <div className="overflow-x-auto border border-gray-300 rounded-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#D1D5DB]">
                    <tr className="divide-x divide-gray-400">
                      <th className="px-3 py-1.5 text-[11px] font-black text-charcoal">Nama</th>
                      <th className="px-3 py-1.5 text-[11px] font-black text-charcoal">No. KP/Pasport</th>
                      <th className="px-3 py-1.5 text-[11px] font-black text-charcoal">No. Ahli BSMM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {candidates.map((c) => (
                      <tr key={c.id} className="divide-x divide-gray-300">
                        <td className="px-3 py-1.5 font-bold uppercase">{c.name}</td>
                        <td className="px-3 py-1.5">{c.idNo}</td>
                        <td className="px-3 py-1.5">{c.membershipNo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[150px_1fr_1fr] gap-4 mt-4">
              <span className="text-gray-400 font-bold md:text-right text-left pt-1">Bilangan Calon:</span>
              <div className="space-y-0.5">
                <div className="flex gap-4 items-center">
                  <span className="text-gray-500 font-medium">Jumlah Calon :</span>
                  <span className="text-lg font-black">{totals.totalCount}</span>
                </div>
                <div className="pl-4 space-y-0.5">
                  <div className="flex gap-2">
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">Ahli :</span>
                    <span className="font-bold">{totals.members}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">Bukan Ahli :</span>
                    <span className="font-bold">{totals.nonMembers}</span>
                  </div>
                </div>
              </div>
              <div className="md:text-right text-left space-y-1">
                <span className="text-gray-400 font-bold block text-[10px]">Pilihan bahasa dalam peperiksaan:</span>
                <div className="flex justify-end gap-3 font-black text-[10px]">
                  <span>BM : {totals.lang.bm}</span>
                  <span>BI : {totals.lang.bi}</span>
                  <span>BC : {totals.lang.bc}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#FFEFEF] border border-[#FFD0D0] p-4 rounded-sm space-y-1 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-x-4">
                <span className="text-gray-500 md:text-right text-left font-medium">Pembayaran:</span>
                <div className="space-y-1">
                  <p className="font-medium">Bayaran yuran peperiksaan (Ahli) <span className="font-black">{totals.members}</span> x RM 2.00/calon = <span className="font-black">RM {fees.memberTotal.toFixed(0)}</span></p>
                  <p className="font-medium">Bayaran yuran peperiksaan (Bukan Ahli) <span className="font-black">{totals.nonMembers}</span> x RM 14.00/calon = <span className="font-black">RM {fees.nonMemberTotal.toFixed(0)}</span></p>
                  <p className="font-medium pt-1 border-t border-red-100">Jumlah bayaran yuran peperiksaan = <span className="font-black">RM {fees.grandTotal.toFixed(0)}</span></p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-x-4 pt-2">
                <span className="text-gray-500 md:text-right text-left font-medium">Lampiran Pembayaran:</span>
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  <button 
                    onClick={() => setAlertDialog({message: `Membuka fail: ${examData.attachment.name}`})}
                    className="text-charcoal hover:underline font-bold underline decoration-1 underline-offset-4 text-left"
                  >
                    {examData.attachment.name}
                  </button>
                  <span className="text-gray-400 text-[10px]">({examData.attachment.size})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 pt-6 border-t border-gray-300 flex-wrap">
              <button onClick={onBack} className="btn-outline text-[11px] py-1 px-3 shadow-sm">
                <ArrowLeft className="w-3.5 h-3.5" /> Kembali
              </button>
              <button onClick={handlePrint} className="btn-outline text-[11px] py-1 px-3 shadow-sm">
                <Printer className="w-3.5 h-3.5" /> Cetak
              </button>
              
              {role === UserRole.DEC && localStatus === ExamStatus.DRAFT && (
                <button 
                  onClick={() => {
                    setConfirmDialog({
                      message: 'Hantar Permohonan ini untuk pengesahan?',
                      onConfirm: () => {
                        const updatedExam = { ...selectedMock, status: ExamStatus.SUBMITTED };
                        if (onUpdateStatus) onUpdateStatus(examId, ExamStatus.SUBMITTED);
                        setLocalStatus(ExamStatus.SUBMITTED);
                        setAlertDialog({
                          message: 'Penyerahan Berjaya! Borang telah dihantar untuk pengesahan SEC. Sila tunggu maklum balas daripada pihak berkaitan.',
                          onClose: () => {
                            if (onSuccess) {
                              onSuccess(updatedExam);
                            } else {
                              onBack();
                            }
                          }
                        });
                      }
                    });
                  }}
                  className="btn-primary uppercase text-[11px] py-1 px-4 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  {t('submit')}
                </button>
              )}
              
              {role === UserRole.SEC && (localStatus === ExamStatus.PENDING_VERIFICATION) && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      if (onUpdateStatus) onUpdateStatus(examId, ExamStatus.APPROVED);
                      setLocalStatus(ExamStatus.APPROVED);
                      setAlertDialog({
                        message: 'Berjaya! Permohonan telah diluluskan. DEC telah dikemaskini dan akan diberitahu tentang kelulusan ini.',
                        onClose: () => onBack()
                      });
                    }}
                    className="btn-success uppercase text-[11px] py-1 px-3 shadow-sm"
                  >
                    <ThumbsUp className="w-4 h-4 fill-white flex-shrink-0" />
                    Lulus
                  </button>
                  <button 
                    onClick={() => {
                      if (onUpdateStatus) onUpdateStatus(examId, ExamStatus.REJECTED);
                      setLocalStatus(ExamStatus.REJECTED);
                      setAlertDialog({
                        message: 'Permohonan telah ditolak.',
                        onClose: () => onBack()
                      });
                    }}
                    className="btn-danger uppercase text-[11px] py-1 px-3 shadow-sm"
                  >
                    <ThumbsDown className="w-4 h-4 fill-white flex-shrink-0" />
                    Tolak
                  </button>
                </div>
              )}

              {(role === UserRole.SEC || role === UserRole.SEBC) && localStatus === ExamStatus.UNLOCK_REQUESTED && (
                <div className="flex gap-2">
                  <button 
                    onClick={handleUnlockApprove}
                    className="btn-success uppercase text-[11px] py-1 px-3 shadow-sm"
                  >
                    <Unlock className="w-4 h-4 fill-white flex-shrink-0" />
                    Buka Kunci
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

        {activeTab === 'rumusan' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 text-[13px] text-charcoal"
          >
            {/* Locked/Submitted/Ready Worklist Style Header (Figure 14) */}
            {(isExpired || (localStatus as any) === ExamStatus.SUBMITTED || localStatus === ExamStatus.APPROVED) && (
              <div className="border border-gray-300 p-4 mb-4 bg-[#F0F0F0]/50">
                <div className="border-b border-gray-300 pb-2 mb-3">
                  <h3 className="text-xl text-charcoal font-bold">
                    {localStatus === ExamStatus.SUBMITTED 
                      ? 'Rumusan Peperiksaan Telah Dihantar' 
                      : localStatus === ExamStatus.APPROVED
                        ? 'Rumusan Peperiksaan Telah Disahkan'
                        : (localStatus === ExamStatus.EXPIRED || localStatus === ExamStatus.UNLOCK_REQUESTED
                          ? 'Menunggu Penyerahan Rumusan Peperiksaan' 
                          : 'Sedia untuk Penyediaan Rumusan Peperiksaan')
                    }
                  </h3>
                </div>
                <div className="space-y-1">
                  <p className="font-black uppercase text-[11px] text-charcoal">{examData.district}</p>
                  <div className="flex items-center gap-1 text-blue-500 font-bold text-xs">
                    <span className="hover:underline cursor-pointer">{examData.regNo} - {examData.subject.split(' - ')[0]} - {examData.examDate}</span>
                    {isExpired && <span className="text-red-600 leading-none ml-1">(Tamat Tempoh)</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Locked/Submitted Content View (Figure 17 Style) */}
            {(isExpired || localStatus === ExamStatus.UNLOCK_REQUESTED) ? (
              <div className="card text-center py-12 space-y-6 border border-gray-300">
                <p className="text-[13px] font-bold text-charcoal max-w-2xl mx-auto leading-relaxed">
                  {(localStatus as any) === ExamStatus.SUBMITTED 
                    ? 'Rumusan Peperiksaan telah dihantar dan sedang diproses oleh Penyelaras Peperiksaan Negeri (SEC).'
                    : <>Rumusan Peperiksaan menunggu penyerahan oleh Penyelaras Peperiksaan Daerah.<br/>Tarikh akhir penyerahan: <span className="text-red-600">{examData.deadline}</span></>
                  }
                </p>
                {/* The Buka Kunci button */}
                {localStatus === ExamStatus.UNLOCK_REQUESTED && (role === UserRole.SEC || role === UserRole.SEBC) && (
                   <div className="flex justify-center mt-6">
                      <button 
                        onClick={handleUnlockApprove}
                        className="btn-footer flex items-center gap-1.5 px-4 md:px-6 py-1.5 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-sm shadow-sm text-charcoal"
                      >
                        <Unlock className="w-4 h-4 text-charcoal" />
                        Buka Kunci
                      </button>
                   </div>
                )}
                {(localStatus as any) !== ExamStatus.SUBMITTED && role !== UserRole.SEC && role !== UserRole.SEBC && (
                   <div className="flex justify-center mt-6">
                      <button 
                        onClick={handleUnlockRequest}
                        disabled={localStatus === ExamStatus.UNLOCK_REQUESTED}
                        className="btn-footer flex items-center gap-1.5 px-4 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-[11px] shadow-sm text-charcoal disabled:opacity-50"
                      >
                        <Unlock className="w-3 h-3 text-charcoal" />
                        Buka Kunci
                      </button>
                   </div>
                )}
                {/* Status-specific indicators in center (keeping as extra context, but Figure 15 buttons go in footer) */}
                {localStatus === ExamStatus.UNLOCK_REQUESTED && (
                  <div className="flex justify-center mt-4">
                    <div className="flex items-center gap-2 px-4 md:px-6 py-2 bg-orange-50 text-orange-700 border border-orange-200 rounded font-bold text-xs">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Permintaan Menunggu Pengesahan...
                    </div>
                  </div>
                )}
                {(localStatus as any) === ExamStatus.SUBMITTED && (
                   <div className="flex justify-center">
                      <div className="flex items-center gap-2 px-4 md:px-6 py-2 bg-green-50 text-green-700 border border-green-200 rounded font-bold text-xs uppercase">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Telah Dihantar
                      </div>
                   </div>
                )}
              </div>
            ) : (
                             <div className="bg-white border border-slate-400 border-t-0 shadow-md rounded-b-sm p-6 md:p-10 font-sans text-xs tracking-normal text-slate-850 space-y-8" id="document-sheet-view">
                {/* Official General Info List - Colon Aligned */}
                <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-x-0 gap-y-1.5">
                  <span className="text-slate-650 md:text-right text-left pr-3 font-bold">Status:</span>
                  <span className="font-bold text-slate-900 uppercase">{localStatus}</span>
                  
                  <span className="text-slate-650 md:text-right text-left pr-3 font-bold">Tarikh Akhir Penyerahan:</span>
                  <span className="font-bold text-slate-800 font-mono">{examData.deadline}</span>
                  
                  {/* Empty gap line like in original figure */}
                  <div className="col-span-2 h-4"></div>
 
                  <span className="text-slate-650 md:text-right text-left pr-3 font-bold">Nama Daerah:</span>
                  <span className="font-extrabold text-slate-950 uppercase">{examData.district}</span>
 
                  <span className="text-slate-650 md:text-right text-left pr-3 font-bold">Nama Unit/Organisasi:</span>
                  <span className="font-bold text-slate-900">{examData.organization}</span>
 
                  <span className="text-slate-650 md:text-right text-left pr-3 font-bold">Kategori Unit/Organisasi:</span>
                  <span className="font-bold text-slate-800">{examData.category}</span>
 
                  <span className="text-slate-650 md:text-right text-left pr-3 font-bold">Tarikh Mula Kursus:</span>
                  <span className="font-bold text-slate-800 font-mono">{courseStart}</span>
 
                  <span className="text-slate-650 md:text-right text-left pr-3 font-bold">Tarikh Tamat Kursus:</span>
                  <span className="font-bold text-slate-800 font-mono">{courseEnd}</span>
 
                  <span className="text-slate-650 md:text-right text-left pr-3 font-bold">Tarikh Peperiksaan:</span>
                  <span className="font-bold text-slate-800 font-mono">{examData.examDate}</span>
 
                  <span className="text-slate-650 md:text-right text-left pr-3 font-bold">Subjek:</span>
                  <span className="font-bold text-slate-950">{examData.subject}</span>
 
                  <span className="text-slate-650 md:text-right text-left pr-3 font-bold">Alamat Peperiksaan:</span>
                  <span className="font-bold text-slate-800">{address}</span>
                </div>
 
                {/* Personnel Tables - Gray bar headers with no vertical cell borders, matching the printout */}
                <div className="space-y-6 pt-2 border-t border-slate-100">
                  {/* Jurulatih */}
                  <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-x-0 gap-y-2 items-start">
                    <span className="text-slate-650 md:text-right text-left pr-3 font-bold pt-1">Senarai Jurulatih:</span>
                    <div className="space-y-2">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-[#D1D5DB] text-slate-900 font-extrabold border-b border-transparent">
                              <th className="w-[25%] px-3 py-1.5 text-[11px] font-black uppercase tracking-wide">Nama</th>
                              <th className="w-[25%] px-3 py-1.5 text-[11px] font-black uppercase tracking-wide">No. KP/Pasport</th>
                              <th className="w-[30%] px-3 py-1.5 text-[11px] font-black uppercase tracking-wide">Alamat</th>
                              <th className="w-[20%] px-3 py-1.5 text-[11px] font-black uppercase tracking-wide">No. Jurulatih/Waran</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white">
                            {jurulatih.map((j) => (
                              <tr key={j.id} className="text-slate-800">
                                <td className="px-3 py-1.5 flex items-center gap-1.5 border-b border-transparent">
                                  {isEditable && (
                                    <button onClick={() => removeJurulatih(j.id)} className="text-red-500 hover:text-red-700 font-bold px-1" title="Padam">✕</button>
                                  )}
                                  {isEditable ? (
                                    <input 
                                      type="text" 
                                      value={j.name} 
                                      onChange={(e) => setJurulatih(jurulatih.map(item => item.id === j.id ? {...item, name: e.target.value} : item))}
                                      className="border border-slate-300 rounded px-2 py-0.5 uppercase flex-1 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400" 
                                    />
                                  ) : (
                                    <span className="font-extrabold uppercase text-slate-950">{j.name}</span>
                                  )}
                                </td>
                                <td className="px-3 py-1.5 border-b border-transparent">
                                  {isEditable ? (
                                    <input 
                                      type="text" 
                                      value={j.ic} 
                                      onChange={(e) => setJurulatih(jurulatih.map(item => item.id === j.id ? {...item, ic: e.target.value} : item))}
                                      className="border border-slate-300 rounded px-2 py-0.5 w-full bg-white focus:outline-none" 
                                    />
                                  ) : (
                                    <span className="font-bold text-slate-800 font-mono">{j.ic}</span>
                                  )}
                                </td>
                                <td className="px-3 py-1.5 border-b border-transparent">
                                  {isEditable ? (
                                    <input 
                                      type="text" 
                                      value={j.address} 
                                      onChange={(e) => setJurulatih(jurulatih.map(item => item.id === j.id ? {...item, address: e.target.value} : item))}
                                      className="border border-slate-300 rounded px-2 py-0.5 w-full bg-white focus:outline-none" 
                                    />
                                  ) : (
                                    <span className="font-medium text-slate-800">{j.address}</span>
                                  )}
                                </td>
                                <td className="px-3 py-1.5 font-mono font-bold text-slate-800 border-b border-transparent">
                                  {isEditable ? (
                                    <input 
                                      type="text" 
                                      value={j.waran} 
                                      onChange={(e) => setJurulatih(jurulatih.map(item => item.id === j.id ? {...item, waran: e.target.value} : item))}
                                      className="border border-slate-300 rounded px-2 py-0.5 w-full bg-white focus:outline-none" 
                                    />
                                  ) : (
                                    <span>{j.waran}</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                            {jurulatih.length === 0 && !isEditable && (
                              <tr className="text-slate-800 font-bold uppercase">
                                <td className="px-3 py-1.5">Nama</td>
                                <td className="px-3 py-1.5 font-mono">No. KP/Pasport</td>
                                <td className="px-3 py-1.5">Alamat</td>
                                <td className="px-3 py-1.5 font-mono">No. Jurulatih/Waran</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      {isEditable && (
                        <button 
                          onClick={addJurulatih}
                          className="border border-slate-300 px-3 py-1 flex items-center gap-1.5 text-slate-750 font-extrabold text-[11px] rounded bg-white hover:bg-slate-50 shadow-sm transition-all"
                        >
                          <Plus className="w-3 h-3 text-slate-700" /> Tambah Jurulatih
                        </button>
                      )}
                    </div>
                  </div>
 
                  {/* Penyelia */}
                  <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-x-0 gap-y-2 items-start">
                    <span className="text-slate-650 md:text-right text-left pr-3 font-bold pt-1">Senarai Penyelia:</span>
                    <div className="space-y-2">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-[#D1D5DB] text-slate-900 font-extrabold border-b border-transparent">
                              <th className="w-1/2 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide">Nama</th>
                              <th className="w-1/2 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide">No. KP/Pasport</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white">
                            {penyelia.map((p) => (
                              <tr key={p.id} className="text-slate-800">
                                <td className="px-3 py-1.5 flex items-center gap-1.5 border-b border-transparent">
                                  {isEditable && (
                                    <button onClick={() => removePenyelia(p.id)} className="text-red-500 hover:text-red-700 font-bold px-1" title="Padam">✕</button>
                                  )}
                                  {isEditable ? (
                                    <input 
                                      type="text" 
                                      value={p.name} 
                                      onChange={(e) => setPenyelia(penyelia.map(item => item.id === p.id ? {...item, name: e.target.value} : item))}
                                      className="border border-slate-300 rounded px-2 py-0.5 flex-1 bg-white focus:outline-none" 
                                    />
                                  ) : (
                                    <span className="font-extrabold text-slate-950 uppercase">{p.name}</span>
                                  )}
                                </td>
                                <td className="px-3 py-1.5 border-b border-transparent">
                                  {isEditable ? (
                                    <input 
                                      type="text" 
                                      value={p.ic} 
                                      onChange={(e) => setPenyelia(penyelia.map(item => item.id === p.id ? {...item, ic: e.target.value} : item))}
                                      className="border border-slate-300 rounded px-2 py-0.5 w-full bg-white focus:outline-none" 
                                    />
                                  ) : (
                                    <span className="font-bold text-slate-800 font-mono">{p.ic}</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                            {penyelia.length === 0 && !isEditable && (
                              <tr className="text-slate-800 font-bold uppercase">
                                <td className="px-3 py-1.5">Nama</td>
                                <td className="px-3 py-1.5 font-mono">No. KP/Pasport</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      {isEditable && (
                        <button 
                          onClick={addPenyelia}
                          className="border border-slate-300 px-3 py-1 flex items-center gap-1.5 text-slate-750 font-extrabold text-[11px] rounded bg-white hover:bg-slate-50 shadow-sm transition-all"
                        >
                          <Plus className="w-3 h-3 text-slate-700" /> Tambah Penyelia
                        </button>
                      )}
                    </div>
                  </div>
 
                  {/* Senarai Pemeriksa Praktikal */}
                  <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-x-0 gap-y-2 items-start">
                    <span className="text-slate-650 md:text-right text-left pr-3 font-bold pt-1">Senarai Pemeriksa Praktikal:</span>
                    <div className="space-y-2">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-[#D1D5DB] text-slate-900 font-extrabold border-b border-transparent">
                              <th className="w-[30%] px-3 py-1.5 text-[11px] font-black uppercase tracking-wide">Nama</th>
                              <th className="w-[50%] px-3 py-1.5 text-[11px] font-black uppercase tracking-wide">Alamat</th>
                              <th className="w-[20%] px-3 py-1.5 text-[11px] font-black uppercase tracking-wide">No. Jurulatih/Waran</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white">
                            {pemeriksa.map((pr) => (
                              <tr key={pr.id} className="text-slate-800">
                                <td className="px-3 py-1.5 flex items-center gap-1.5 border-b border-transparent">
                                  {isEditable && (
                                    <button onClick={() => removePemeriksa(pr.id)} className="text-red-500 hover:text-red-700 font-bold px-1" title="Padam">✕</button>
                                  )}
                                  {isEditable ? (
                                    <input 
                                      type="text" 
                                      value={pr.name} 
                                      onChange={(e) => setPemeriksa(pemeriksa.map(item => item.id === pr.id ? {...item, name: e.target.value} : item))}
                                      className="border border-slate-300 rounded px-2 py-0.5 uppercase flex-1 bg-white focus:outline-none" 
                                    />
                                  ) : (
                                    <span className="font-extrabold uppercase text-slate-950">{pr.name}</span>
                                  )}
                                </td>
                                <td className="px-3 py-1.5 border-b border-transparent">
                                  {isEditable ? (
                                    <input 
                                      type="text" 
                                      value={pr.address || ''} 
                                      onChange={(e) => setPemeriksa(pemeriksa.map(item => item.id === pr.id ? {...item, address: e.target.value} : item))}
                                      className="border border-slate-300 rounded px-2 py-0.5 w-full bg-white focus:outline-none" 
                                    />
                                  ) : (
                                    <span className="font-medium text-slate-800">{pr.address}</span>
                                  )}
                                </td>
                                <td className="px-3 py-1.5 font-mono font-bold text-slate-800 border-b border-transparent">
                                  {isEditable ? (
                                    <input 
                                      type="text" 
                                      value={pr.waran || ''} 
                                      onChange={(e) => setPemeriksa(pemeriksa.map(item => item.id === pr.id ? {...item, waran: e.target.value} : item))}
                                      className="border border-slate-300 rounded px-2 py-0.5 w-full bg-white focus:outline-none" 
                                    />
                                  ) : (
                                    <span>{pr.waran}</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                            {pemeriksa.length === 0 && !isEditable && (
                              <tr className="text-slate-800 font-bold uppercase">
                                <td className="px-3 py-1.5">Nama</td>
                                <td className="px-3 py-1.5">Alamat</td>
                                <td className="px-3 py-1.5 font-mono">No. Jurulatih/Waran</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      {isEditable && (
                        <button 
                          onClick={role === UserRole.SEBC ? handleOpenAddPemeriksa : addPemeriksa}
                          className="border border-slate-300 px-3 py-1 flex items-center gap-1.5 text-slate-750 font-extrabold text-[11px] rounded bg-white hover:bg-slate-50 shadow-sm transition-all"
                        >
                          <Plus className="w-3 h-3 text-slate-700" /> Tambah Pemeriksa
                        </button>
                      )}
                    </div>
                  </div>
 
                  {/* Senarai Calon with Solid/Thick Dark Grid Lines (Exactly like image!) */}
                  <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-x-0 gap-y-2 items-start">
                    <span className="text-slate-650 md:text-right text-left pr-3 font-bold pt-1">Senarai Calon:</span>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse border-2 border-black">
                        <thead>
                          <tr className="bg-[#D1D5DB] border-b-2 border-black">
                            <th className="px-3 py-2 font-extrabold text-slate-900 border border-black text-[11px]">Nama</th>
                            <th className="px-3 py-2 font-extrabold text-slate-900 border border-black text-[11px]">No. KP/Pasport</th>
                            <th className="px-3 py-2 font-extrabold text-slate-900 border border-black text-[11px]">No. Ahli BSMM</th>
                            <th className="px-1.5 py-2 font-extrabold text-slate-900 text-center w-24 border border-black text-[10px] leading-tight">Kehadiran<br/>(Teori)</th>
                            <th className="px-1.5 py-2 font-extrabold text-slate-900 text-center w-24 border border-black text-[10px] leading-tight">Kehadiran<br/>(Lisan)</th>
                            <th className="px-1.5 py-2 font-extrabold text-slate-900 text-center w-24 border border-black text-[10px] leading-tight">Kehadiran<br/>(Praktikal)</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {candidates.map((c) => (
                            <tr key={c.id}>
                              <td className="px-3 py-1.5 font-extrabold uppercase text-slate-950 border border-black">{c.name}</td>
                              <td className="px-3 py-1.5 text-slate-900 font-mono border border-black font-semibold">{c.idNo}</td>
                              <td className="px-3 py-1.5 text-slate-900 font-mono border border-black font-semibold">{c.membershipNo}</td>
                              {['theory', 'oral', 'practical'].map(type => (
                                <td key={type} className="px-1 py-1.5 text-center border border-black">
                                  <div className="flex items-center justify-center">
                                    <input 
                                      type="checkbox"
                                      checked={c.attendance?.[type as keyof NonNullable<Candidate['attendance']>] || false}
                                      onChange={() => toggleAttendance(c.id, type as any)}
                                      disabled={!isEditable}
                                      className="w-4 h-4 cursor-pointer accent-red-650 focus:ring-0 border-slate-600 rounded-sm"
                                    />
                                  </div>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-slate-50 font-bold">
                            <td colSpan={3} className="px-3 py-2 text-right text-slate-900 border border-black uppercase tracking-wider text-[11px] font-extrabold">Kehadiran</td>
                            <td className="px-1.5 py-2 text-center text-slate-900 border border-black font-mono text-xs font-black">{totals.theory}/{totals.totalCount}</td>
                            <td className="px-1.5 py-2 text-center text-slate-900 border border-black font-mono text-xs font-black">{totals.oral}/{totals.totalCount}</td>
                            <td className="px-1.5 py-2 text-center text-slate-900 border border-black font-mono text-xs font-black">{totals.practical}/{totals.totalCount}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
 
                  {/* Bilangan Calon Row */}
                  <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-x-0 gap-y-2 items-start pt-2">
                    <span className="text-slate-650 md:text-right text-left pr-3 font-bold pt-1">Bilangan Calon:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Left Side: Counts */}
                      <div className="space-y-1 text-xs">
                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-700 font-bold">Jumlah Calon :</span>
                          <span className="text-xl font-black text-slate-950 font-mono">{totals.totalCount}</span>
                        </div>
                        <ul className="pl-4 space-y-1">
                          <li className="flex items-center gap-1.5 text-slate-700 font-medium">
                            <span className="text-slate-400 font-black">•</span>
                            <span>Ahli :</span>
                            <span className="font-extrabold text-slate-900 font-mono">{totals.members}</span>
                          </li>
                          <li className="flex items-center gap-1.5 text-slate-700 font-medium">
                            <span className="text-slate-400 font-black">•</span>
                            <span>Bukan Ahli :</span>
                            <span className="font-extrabold text-slate-900 font-mono">{totals.nonMembers}</span>
                          </li>
                        </ul>
                      </div>
 
                      {/* Right Side: Language details */}
                      <div className="text-xs text-slate-800 flex flex-col items-start sm:items-end">
                        <div className="grid grid-cols-[180px_60px] gap-2 items-start">
                          <span className="text-slate-700 font-bold text-left sm:text-right leading-tight">Pilihan bahasa dalam peperiksaan:</span>
                          <div className="space-y-0.5 font-mono text-slate-950 font-black text-sm">
                            <div className="flex justify-between w-full border-b border-dashed border-slate-200">
                              <span className="text-slate-500 font-bold font-sans text-xs">BM :</span>
                              <span>{totals.lang.bm}</span>
                            </div>
                            <div className="flex justify-between w-full border-b border-dashed border-slate-200">
                              <span className="text-slate-500 font-bold font-sans text-xs">BI :</span>
                              <span>{totals.lang.bi}</span>
                            </div>
                            <div className="flex justify-between w-full">
                              <span className="text-slate-500 font-bold font-sans text-xs">BC :</span>
                              <span>{totals.lang.bc}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pink bottom area - Spans Edge-to-Edge inside the white sheet */}
                <div className="bg-[#FFF5F5] -mx-6 md:-mx-10 -mb-6 md:-mb-10 px-6 md:px-10 py-6 border-t border-red-200 rounded-b-sm space-y-4">
                  {/* Pembayaran Row */}
                  <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-x-0 gap-y-2 items-start text-xs text-slate-800">
                    <span className="text-slate-650 md:text-right text-left pr-3 font-bold pt-0.5">Pembayaran:</span>
                    <div className="space-y-1 flex-1">
                      <p className="font-semibold text-slate-800">
                        Bayaran yuran peperiksaan (Ahli) <span className="font-black font-mono">{totals.members}</span> x RM 2.00/calon = <span className="font-black font-mono">RM {fees.memberTotal.toFixed(2)}</span>
                      </p>
                      <p className="font-semibold text-slate-800">
                        Bayaran yuran peperiksaan (Bukan Ahli) <span className="font-black font-mono">{totals.nonMembers}</span> x RM 14.00/calon = <span className="font-black font-mono">RM {fees.nonMemberTotal.toFixed(2)}</span>
                      </p>
                      <p className="font-black text-red-950 pt-2 border-t border-red-200 flex items-center justify-between max-w-xl">
                        <span>Jumlah bayaran yuran peperiksaan =</span>
                        <span className="text-sm font-mono font-black">RM {fees.grandTotal.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Lampiran Pembayaran Row */}
                  <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-x-0 gap-y-1 items-center text-xs text-slate-800">
                    <span className="text-slate-650 md:text-right text-left pr-3 font-bold">Lampiran Pembayaran:</span>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <button 
                        onClick={() => setAlertDialog({message: `Membuka fail: ${examData.attachment.name}`})}
                        className="text-red-750 hover:text-red-950 hover:underline font-extrabold underline decoration-1 underline-offset-4 text-left font-mono transition-all text-xs"
                      >
                        {examData.attachment.name}
                      </button>
                      <span className="text-slate-500 text-[10px] font-mono font-bold">({examData.attachment.size})</span>
                    </div>
                  </div>
                </div>

              </div>
            )}


            {/* Footer Actions - Flexible based on Role and Mode (Figure 15) */}
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-gray-300 flex-wrap">
                <button 
                  onClick={onBack}
                  className="btn-footer flex items-center gap-1.5 px-4 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-[11px] shadow-sm text-charcoal"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Kembali
                </button>
                
                <button 
                  onClick={handlePrint}
                  className="btn-footer flex items-center gap-1.5 px-4 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-[11px] shadow-sm text-charcoal"
                >
                  <Printer className="w-3 h-3" />
                  Cetak
                </button>

                {/* DEC View Mode Actions */}
                {isEditable && role === UserRole.DEC && (
                  <>
                    <button 
                      onClick={() => {
                        handleSave();
                        triggerNotification('Maklumat berjaya disimpan sebagai draf.');
                      }}
                      className="btn-footer flex items-center gap-1.5 px-4 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-[11px] shadow-sm text-action-teal"
                    >
                      <Save className="w-3 h-3" />
                      Simpan
                    </button>
                    {(isSummaryReadyFinal || localStatus === ExamStatus.APPROVED) && !isExpired && (
                      <button 
                        onClick={handleSubmit}
                        className="flex items-center gap-1.5 px-4 py-1 border border-gray-300 rounded bg-white hover:bg-green-50 font-bold text-[11px] text-action-teal shadow-sm"
                      >
                        <Send className="w-3 h-3" />
                        Hantar Rumusan Peperiksaan
                      </button>
                    )}
                    <button 
                      onClick={() => setIsEditable(false)}
                      className="btn-footer flex items-center gap-1.5 px-4 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-[11px] shadow-sm text-brand-red"
                    >
                      Batal
                    </button>
                  </>
                )}

                {/* SEBC View Mode Actions */}
                {isEditable && role === UserRole.SEBC && (
                  <>
                    <button 
                      onClick={() => {
                        handleSave();
                        triggerNotification('Maklumat berjaya disimpan.');
                      }}
                      className="btn-footer flex items-center gap-1.5 px-4 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-[11px] shadow-sm text-action-teal"
                    >
                      <Save className="w-3 h-3" />
                      Simpan
                    </button>
                    <button 
                      onClick={() => setIsEditable(false)}
                      className="btn-footer flex items-center gap-1.5 px-4 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-[11px] shadow-sm text-brand-red"
                    >
                      Batal
                    </button>
                  </>
                )}

                {!isEditable && role === UserRole.SEBC && (localStatus === ExamStatus.APPROVED || localStatus === ExamStatus.SUBMITTED) && (
                  <button 
                    onClick={() => setIsEditable(true)}
                    className="btn-footer flex items-center gap-1.5 px-4 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-[11px] shadow-sm text-charcoal"
                  >
                    <Edit3 className="w-3 h-3" />
                    Ubah
                  </button>
                )}

                {!isEditable && role === UserRole.DEC && localStatus !== ExamStatus.SUBMITTED && (
                  <>
                    {(isSummaryReadyFinal || initialEditMode || localStatus === ExamStatus.APPROVED) && !isExpired && (
                      <button 
                        onClick={() => setIsEditable(true)}
                        className="btn-footer flex items-center gap-1.5 px-4 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-[11px] shadow-sm text-charcoal"
                      >
                        <Edit3 className="w-3 h-3" />
                        Ubah
                      </button>
                    )}

                    {(isSummaryReadyFinal || localStatus === ExamStatus.APPROVED) && (
                      <>
                        {!isExpired && (
                          <button 
                            onClick={handleSubmit}
                            className="flex items-center gap-1.5 px-4 py-1 border border-gray-300 rounded bg-white hover:bg-green-50 font-bold text-[11px] text-action-teal shadow-sm"
                          >
                            <Send className="w-3 h-3" />
                            Hantar Rumusan Peperiksaan
                          </button>
                        )}

                        <button 
                          onClick={handleRenew}
                          className="btn-footer flex items-center gap-1.5 px-4 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-[11px] shadow-sm text-charcoal"
                        >
                          <FileText className="w-3 h-3" />
                          Memperbaharui Kursus?
                        </button>
                      </>
                    )}
                    {isExpired && localStatus !== ExamStatus.UNLOCK_REQUESTED && (
                      <></>
                    )}
                  </>
                )}
            </div>
      </motion.div>
    )}

      {/* Unlock Dialog */}
      {showUnlockDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl overflow-x-auto border border-gray-200 shadow-2xl w-full max-w-xl"
          >
            <div className="bg-action-teal/10 p-5 border-b border-action-teal/20 flex items-center justify-between">
              <h3 className="font-bold text-action-teal flex items-center gap-2 text-lg">
                <Unlock className="w-5 h-5" />
                Permohonan Buka Kunci
              </h3>
              <button 
                onClick={() => setShowUnlockDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 md:p-6 space-y-6">
              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
                <h4 className="text-blue-800 font-bold mb-2 flex items-center gap-2 text-sm"><FileText className="w-4 h-4"/>Nota Penting</h4>
                <div className="space-y-2 text-blue-800/80 text-sm">
                  <p>Tarikh akhir penyerahan telah lepas, dan anda tidak dibenarkan untuk mengemukakan <em>Exam Return Report</em> sehingga ia dibuka.</p>
                  <p>Permohonan untuk membuka pertama adalah percuma, tetapi anda perlu bayar untuk permohonan yang seterusnya.</p>
                </div>
              </div>

              <div className="text-center py-4 space-y-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-[15px] font-medium text-gray-600">
                  Tarikh akhir penyerahan: <strong className="text-brand-red">{examData.deadline}</strong>
                </p>
                <p className="text-[16px] font-bold text-charcoal">
                  Adakah anda ingin memohon untuk peperiksaan ini dibuka?
                </p>
              </div>

              {isSecondUnlock && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Lampiran Pembayaran</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 flex items-center gap-2 p-2 border border-blue-200 bg-blue-50/30 rounded focus-within:ring-2 focus-within:ring-action-teal/50 focus-within:border-action-teal transition-all">
                       <FileText className="w-5 h-5 text-blue-500 ml-1" />
                       <span className="text-sm text-charcoal truncate flex-1">{paymentFile || 'Tiada fail dipilih'}</span>
                       <label className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm whitespace-nowrap cursor-pointer">
                         Cari Fail...
                         <input 
                           type="file" 
                           className="hidden" 
                           onChange={(e) => setPaymentFile(e.target.files?.[0]?.name || '')} 
                         />
                       </label>
                    </div>
                  </div>
                  <input type="text" placeholder="Sila masukkan deskripsi pembayaran (pilihan)..." className="w-full text-sm p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-action-teal/50 focus:border-action-teal outline-none transition-all mt-2" />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => setShowUnlockDialog(false)}
                  className="px-4 md:px-6 py-2 border border-gray-300 rounded font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm text-sm"
                >
                  Tidak, Kembali
                </button>
                <button 
                  onClick={confirmUnlock}
                  className="flex items-center gap-2 px-4 md:px-6 py-2 bg-action-teal text-white rounded font-bold hover:bg-teal-700 transition-colors shadow-md text-sm"
                >
                  <Unlock className="w-4 h-4" /> Ya, Mohon Buka Kunci
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* SEC Unlock Dialog */}
      {showSECUnlockDialog && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl overflow-x-auto border border-gray-200 shadow-2xl w-full max-w-md"
          >
            <div className="bg-action-teal/10 p-5 border-b border-action-teal/20 flex items-center justify-between">
              <h3 className="font-bold text-action-teal flex items-center gap-2 text-lg">
                <Unlock className="w-5 h-5" />
                Pengesahan Buka Kunci
              </h3>
              <button 
                onClick={() => setShowSECUnlockDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 md:p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-[15px] font-medium text-gray-600">
                  Tarikh akhir penyerahan semasa: <strong className="text-brand-red">{examData.deadline}</strong>
                </p>
                <p className="text-[16px] font-bold text-charcoal">
                  Adakah anda bersetuju untuk membuka semula peperiksaan ini?
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded p-4 flex flex-col items-center justify-center gap-3">
                  <span className="text-sm font-bold text-gray-700">Tetapkan Tarikh Akhir Penyerahan Baru:</span>
                  <div className="relative w-full max-w-[200px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <Calendar className="w-4 h-4 text-action-teal" />
                    </div>
                    <input 
                      type="date" 
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className="pl-10 pr-4 py-2 text-sm font-medium border border-gray-300 rounded focus:ring-2 focus:ring-action-teal/50 focus:border-action-teal w-full text-charcoal shadow-sm" 
                    />
                  </div>
              </div>

              {isSecondUnlock && (
                <div className="bg-blue-50/50 border border-blue-100 rounded p-4 flex flex-col gap-2">
                  <span className="text-gray-600 text-sm font-bold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    Lampiran Pembayaran (DEC)
                  </span>
                  <div className="bg-white p-3 border border-blue-200 rounded flex items-center justify-between shadow-sm">
                      <span className="text-sm text-blue-700 font-medium truncate">
                        {paymentFile || 'resit_pembayaran_123.pdf'}
                      </span>
                      <button className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 font-bold transition-colors">Lihat</button>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => setShowSECUnlockDialog(false)}
                  className="px-4 md:px-6 py-2 border border-gray-300 rounded font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm text-sm"
                >
                  Tutup
                </button>
                <button 
                  onClick={confirmSECUnlock}
                  className="flex items-center gap-2 px-4 md:px-6 py-2 bg-action-teal text-white rounded font-bold hover:bg-teal-700 transition-colors shadow-md text-sm"
                >
                  <Unlock className="w-4 h-4" /> Buka Kunci
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Pemeriksa Dialog */}
      {showAddPemeriksaDialog && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded overflow-hidden shadow-2xl w-full max-w-md border border-gray-300"
          >
            {/* Header matches Figure 25 */}
            <div className="bg-gradient-to-b from-gray-600 to-gray-800 p-2 flex items-center shadow-inner">
              <h3 className="font-bold text-white text-[13px]">
                Tambah Pemeriksa
              </h3>
            </div>
            
            <div className="p-4 bg-white min-h-[140px] relative">
              <div className="flex flex-col gap-2 mb-8 mt-2">
                <div className="flex items-center gap-1">
                  <span className="text-brand-red font-bold text-lg leading-none mt-1">*</span>
                  <span className="font-bold text-charcoal text-[13px] w-14">Nama:</span>
                  <select 
                    className="flex-1 p-1 border border-gray-300 bg-white text-[13px] focus:outline-none focus:ring-1 focus:ring-action-teal shadow-sm"
                    value={selectedPemeriksaId}
                    onChange={(e) => setSelectedPemeriksaId(e.target.value)}
                  >
                    <option value="">-- Sila Pilih --</option>
                    {availablePemeriksaOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 absolute bottom-4 right-4">
                <button 
                  onClick={() => setShowAddPemeriksaDialog(false)}
                  className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 font-medium text-[12px] text-charcoal shadow-sm transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-red-600" /> Tutup
                </button>
                <button 
                  onClick={confirmAddPemeriksa}
                  disabled={!selectedPemeriksaId}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-action-teal hover:bg-teal-700 text-white font-medium text-[12px] shadow-sm disabled:opacity-50 transition-colors"
                >
                  <MousePointer2 className="w-3.5 h-3.5" /> Pilih
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

        {activeTab === 'keputusan' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {!isEditable ? (
              renderMockupView()
            ) : (
              <div className="bg-white border border-black p-8 md:p-12 space-y-8 text-black" id="document-sheet-view">
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-4 mb-1">
                    <span className="text-[13px] font-medium text-gray-500 md:text-right text-left">Status:</span>
                    <span className="text-[13px] text-charcoal">{localStatus === ExamStatus.APPROVED ? 'Rumusan Peperiksaan Telah Dihantar' : examData.status}</span>
                  </div>
                
                <div className="h-6"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-4 mb-1">
                  <span className="text-[13px] font-medium text-gray-500 md:text-right text-left">Nama Daerah:</span>
                  <span className="text-[13px] text-charcoal uppercase">{examData.district}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-4 mb-1">
                  <span className="text-[13px] font-medium text-gray-500 md:text-right text-left">Nama Unit/Organisasi:</span>
                  <span className="text-[13px] text-charcoal">{examData.organization}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-4 mb-1 border-brand-red">
                  <span className="text-[13px] font-medium text-gray-500 md:text-right text-left flex justify-start md:justify-end items-center"><span className="text-brand-red font-bold mr-1">*</span> Tarikh Peperiksaan:</span>
                  <span className="text-[13px] text-charcoal">{examData.examDate}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-4 mb-6">
                  <span className="text-[13px] font-medium text-gray-500 md:text-right text-left">Subjek:</span>
                  <span className="text-[13px] text-charcoal">{examData.subject}</span>
                </div>
              </div>
                
              <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-4">
                  <span className="text-[13px] font-medium text-gray-500 md:text-right text-left flex justify-start md:justify-end items-start mt-2">
                    <span className="text-brand-red font-bold mr-1">*</span>Senarai Calon:
                  </span>
                  <div className="overflow-x-auto border border-gray-300 bg-white">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-[#E5E7EB]">
                    <tr>
                      <th className="px-3 py-2 text-[11px] font-black text-charcoal border-r border-gray-300">Nama</th>
                      <th className="px-3 py-2 text-[11px] font-black text-charcoal border-r border-gray-300">No. KP/Pasport</th>
                      <th className="px-3 py-2 text-[11px] font-black text-charcoal border-r border-gray-300">No. Ahli BSMM</th>
                      <th className="px-3 py-2 text-[11px] font-black text-charcoal border-r border-gray-300 text-center">Skor Teori/100</th>
                      <th className="px-3 py-2 text-[11px] font-black text-charcoal border-r border-gray-300 text-center">Skor Lisan/40</th>
                      <th className="px-3 py-2 text-[11px] font-black text-charcoal border-r border-gray-300 text-center">Skor Praktikal/60</th>
                      <th className="px-3 py-2 text-[11px] font-black text-charcoal text-center">Keputusan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {candidates.map((c) => (
                      <tr key={c.id} className="divide-x divide-gray-300">
                        <td className="px-3 py-2 font-bold uppercase">{c.name}</td>
                        <td className="px-3 py-2 text-sm">{c.idNo || (c as any).icNumber}</td>
                        <td className="px-3 py-2 text-sm">{c.membershipNo || (c as any).membershipId}</td>
                        <td className="px-3 py-2">
                          <input 
                            type="number" 
                            disabled={!isEditable || role !== UserRole.SEBC}
                            placeholder="0"
                            value={c.scores?.theory ?? ''}
                            onChange={(e) => handleScoreChange(c.id, 'theory', e.target.value)}
                            className={`w-full text-center focus:outline-none px-1 py-0.5 disabled:opacity-100 disabled:text-charcoal disabled:bg-transparent tracking-widest [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${isEditable && role === UserRole.SEBC ? 'border border-gray-300 bg-white shadow-sm' : 'bg-transparent'}`}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input 
                            type="number" 
                            disabled={!isEditable || role !== UserRole.SEBC}
                            placeholder="0"
                            value={c.scores?.oral ?? ''}
                            onChange={(e) => handleScoreChange(c.id, 'oral', e.target.value)}
                            className={`w-full text-center focus:outline-none px-1 py-0.5 disabled:opacity-100 disabled:text-charcoal disabled:bg-transparent tracking-widest [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${isEditable && role === UserRole.SEBC ? 'border border-gray-300 bg-white shadow-sm' : 'bg-transparent'}`}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input 
                            type="number" 
                            disabled={!isEditable || role !== UserRole.SEBC}
                            placeholder="0"
                            value={c.scores?.practical ?? ''}
                            onChange={(e) => handleScoreChange(c.id, 'practical', e.target.value)}
                            className={`w-full text-center focus:outline-none px-1 py-0.5 disabled:opacity-100 disabled:text-charcoal disabled:bg-transparent tracking-widest [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${isEditable && role === UserRole.SEBC ? 'border border-gray-300 bg-white shadow-sm' : 'bg-transparent'}`}
                          />
                        </td>
                        <td className="px-3 py-2 text-center text-sm font-bold">
                          {c.status === 'Pass' ? <span className="text-green-600">Lulus</span> : c.status === 'Fail' ? <span className="text-red-600">Gagal</span> : <span className="text-gray-400">-</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
              
            <div className="flex justify-start mt-8 gap-2">
                <button 
                  onClick={onBack}
                  className="flex items-center gap-2 px-4 py-1 border border-gray-300 bg-gray-100 text-charcoal font-medium text-[12px] shadow-sm hover:bg-gray-200 transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Kembali
                </button>
                {role === UserRole.SEBC && !isResultsSubmitted && (
                  <>
                    {!isEditable ? (
                      <button 
                        onClick={() => setIsEditable(true)}
                        className="flex items-center gap-2 px-4 py-1 border border-gray-300 bg-white text-charcoal font-medium text-[12px] shadow-sm hover:bg-gray-50 transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Ubah
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          handleSave();
                          // Keep editable state or trigger a specific save for results
                          setIsEditable(false);
                          triggerNotification('Keputusan telah disimpan.');
                        }}
                        className="flex items-center gap-2 px-4 py-1 border border-gray-300 bg-white text-charcoal font-medium text-[12px] shadow-sm hover:bg-gray-50 transition-all"
                      >
                        <Save className="w-3.5 h-3.5" /> Simpan
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        setConfirmDialog({
                          message: 'Teruskan dengan Pemprosesan Keputusan Selesai?',
                          onConfirm: () => {
                            setIsResultsSubmitted(true);
                            if (onUpdateExam) {
                               onUpdateExam(selectedMock.id, { candidates, status: ExamStatus.COMPLETED });
                            } else if (onUpdateStatus) {
                              onUpdateStatus(selectedMock.id, ExamStatus.COMPLETED);
                            }
                            setLocalStatus(ExamStatus.COMPLETED);
                            triggerNotification('Keputusan telah dikemaskini dan dihantar ke SEC.');
                            setTimeout(() => onBack(), 1500);
                          }
                        });
                      }}
                      className="flex items-center gap-2 px-4 py-1 border border-gray-300 bg-blue-50 text-action-teal font-bold text-[12px] shadow-sm hover:bg-blue-100 transition-all"
                    >
                      <ArrowRight className="w-3.5 h-3.5" /> Pemprosesan Keputusan Selesai
                    </button>
                  </>
                )}
                {isResultsSubmitted && (
                  <div className="flex items-center gap-2">
                    <div className="px-4 py-1 bg-green-50 text-green-700 font-bold border border-green-200 rounded flex items-center gap-2 text-[12px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Keputusan Telah Selesai diproses
                    </div>
                    {role === UserRole.SEC && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setShowSijilModal(true)}
                          className="px-4 py-1 border border-gray-300 bg-action-teal text-white font-bold rounded shadow-md hover:bg-teal-700 transition-all uppercase text-[12px] flex items-center gap-2"
                        >
                          Mengurus Sijil
                        </button>
                        <button 
                          onClick={() => setShowPrint(true)}
                          className="px-4 py-1 border border-gray-300 bg-action-teal text-white font-bold rounded shadow-md hover:bg-teal-700 transition-all uppercase text-[12px] flex items-center gap-2"
                        >
                          Cetak PP
                        </button>
                        <button 
                          onClick={() => setShowSlipPrint(true)}
                          className="px-4 py-1 border border-gray-300 bg-action-teal text-white font-bold rounded shadow-md hover:bg-teal-700 transition-all uppercase text-[12px] flex items-center gap-2"
                        >
                          Cetak Slip
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            )}
          </motion.div>
        )}
      </div>
      
      {showPrint && (
        <PenyataPeperiksaanPrint exam={{...selectedMock, candidates}} onClose={() => setShowPrint(false)} />
      )}

      {showSlipPrint && (
        <ResultSlipPrint exam={{...selectedMock, candidates}} onClose={() => setShowSlipPrint(false)} />
      )}

      {showSijilModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[#E6EFF5] border border-gray-300 w-full max-w-[500px] shadow-2xl">
            <div className="bg-gradient-to-b from-[#4A4A4A] to-[#1A1A1A] px-4 py-2 flex items-center justify-between shadow-sm border-b-2 border-brand-red">
              <h3 className="text-white font-bold text-[14px]">Jenis Sijil</h3>
              <button onClick={() => setShowSijilModal(false)} className="text-white hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 md:p-8">
              <div className="flex gap-4">
                <label className="text-[13px] font-bold text-gray-700 w-24 md:text-right text-left pt-1">Jenis Sijil:</label>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      id="sijil-auto" 
                      name="sijilType" 
                      value="auto" 
                      checked={sijilType === 'auto'}
                      onChange={() => setSijilType('auto')}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="sijil-auto" className="text-[13px] text-charcoal cursor-pointer">
                      Dijana Automatik
                    </label>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <input 
                      type="radio" 
                      id="sijil-manual" 
                      name="sijilType" 
                      value="manual" 
                      checked={sijilType === 'manual'}
                      onChange={() => setSijilType('manual')}
                      className="w-4 h-4 cursor-pointer mt-1"
                    />
                    <div className="space-y-4">
                      <label htmlFor="sijil-manual" className="text-[13px] text-charcoal cursor-pointer block">
                        Pra-cetak oleh ibu pejabat nasional
                      </label>
                      
                      {sijilType === 'manual' && (
                        <div className="flex items-center gap-3">
                          <span className="text-[13px] text-charcoal">Bermula Dari</span>
                          <input 
                            type="text" 
                            value={sijilPrefix}
                            onChange={(e) => setSijilPrefix(e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded shadow-inner text-[13px] focus:outline-action-teal"
                          />
                          <input 
                            type="text" 
                            value={sijilStart}
                            onChange={(e) => setSijilStart(e.target.value)}
                            className="w-24 px-2 py-1 border border-gray-300 rounded shadow-inner text-[13px] focus:outline-action-teal"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#D1D5DB] px-4 py-3 flex justify-end gap-2 border-t border-gray-300">
              <button 
                onClick={() => setShowSijilModal(false)}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-gray-300 font-bold text-[13px] shadow-sm hover:bg-gray-50 text-charcoal"
              >
                <X className="w-4 h-4" /> Tidak
              </button>
              <button 
                onClick={() => {
                  setShowSijilModal(false);
                  triggerNotification('Sijil berjaya dijana dan sedia untuk dicetak.');
                }}
                className="flex items-center gap-1.5 px-4 md:px-6 py-1.5 bg-white border border-gray-300 font-bold text-[13px] shadow-sm hover:bg-green-50 text-action-teal"
              >
                <Check className="w-4 h-4" /> Ya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
