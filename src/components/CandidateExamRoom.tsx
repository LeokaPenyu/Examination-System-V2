import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  Info, 
  Play, 
  AlertCircle, 
  CheckSquare, 
  XCircle, 
  Ban, 
  RefreshCw, 
  Check, 
  Award, 
  BookOpen, 
  HelpCircle,
  Sparkles,
  Bookmark,
  Eraser
} from 'lucide-react';
import { sharedQuestions, Question } from '../data/mockQuestions';
import { useLanguage } from '../context/LanguageContext';

interface CandidateExamRoomProps {
  examId?: string;
  examTitle: string;
  examCode?: string;
  candidateName?: string;
  candidateNric?: string;
  onFinish: (result?: 'Pass' | 'Fail', score?: number, scoreBreakdown?: any[]) => void;
}

export const CandidateExamRoom: React.FC<CandidateExamRoomProps> = ({ 
  examId = 'e1', 
  examTitle, 
  examCode = '800/2',
  candidateName = 'Ahmad Faiz Bin Abu',
  candidateNric = '880101-13-5683',
  onFinish 
}) => {
  const { translateContent } = useLanguage();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes of exam session remaining
  
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [passFail, setPassFail] = useState('');
  const [cooldownTime, setCooldownTime] = useState<Date | null>(null);
  const [cooldownSecsLeft, setCooldownSecsLeft] = useState<number>(0);

  const [examQuestions, setExamQuestions] = useState<Question[]>([]);

  useEffect(() => {
    // Rehydrate from localStorage or memory to get latest changes from pentadbir
    const saved = localStorage.getItem('shared_exam_questions');
    let latestQs = sharedQuestions;
    if (saved) {
      try {
        latestQs = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const courseQuestions = latestQs.filter(q => q.course === examCode);
    if (courseQuestions.length > 0) {
      setExamQuestions(courseQuestions.slice(0, 10));
    } else {
      setExamQuestions(latestQs.slice(0, 10));
    }
  }, [examCode]);

  // Lobby session states
  const [isReloading, setIsReloading] = useState(false);
  const [reloadCompleted, setReloadCompleted] = useState(false);
  const [verifyFeedback, setVerifyFeedback] = useState<string>(''); // rename slightly if need but let's keep name or same
  const [verificationFeedback, setVerificationFeedback] = useState<string>('');
  
  // Set target session start time dynamically:
  // e1 starts in 3 minutes from mount time (counting running)
  // e2 starts in the past (counting gone)
  const isFutureExam = examId === 'e1';
  const [targetStartTime] = useState<Date>(() => {
    const d = new Date();
    if (isFutureExam) {
      d.setMinutes(d.getMinutes() + 3); // 3 minutes in future
    } else {
      d.setMinutes(d.getMinutes() - 5); // 5 minutes in past
    }
    return d;
  });

  const [lobbySecsRemaining, setLobbySecsRemaining] = useState<number>(0);

  // State to track if the candidate has checked NTP server status / click reload 
  const [isUnlockedAfterReload, setIsUnlockedAfterReload] = useState(false);

  const [lobbyMode, setLobbyMode] = useState<'running' | 'gone'>('running');
  const [lobbyReloadState, setLobbyReloadState] = useState(false);

  // Confirm Finish Modal state
  const [showConfirmFinishModal, setShowConfirmFinishModal] = useState(false);

  // Active category in pagination
  const [activeCategory, setActiveCategory] = useState<string>('');

  // Identity checks state
  const [checks, setChecks] = useState({
    doc: false,
    id: false
  });

  const allChecksPassed = checks.doc && checks.id;

  // Track remaining session start time
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((targetStartTime.getTime() - Date.now()) / 1000));
      setLobbySecsRemaining(remaining);
    }, 1000);

    const initRemaining = Math.max(0, Math.floor((targetStartTime.getTime() - Date.now()) / 1000));
    setLobbySecsRemaining(initRemaining);

    return () => clearInterval(timer);
  }, [targetStartTime]);

  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setPortalTarget(document.getElementById('header-lobby-switcher'));
  }, []);

  // Set default active category once questions load
  useEffect(() => {
    if (examQuestions && examQuestions.length > 0) {
      setActiveCategory(examQuestions[0].category || 'Category A');
    }
  }, [examQuestions]);

  // Synchronize category selection when question index changes
  useEffect(() => {
    if (examQuestions[currentQIndex]) {
      setActiveCategory(examQuestions[currentQIndex].category);
    }
  }, [currentQIndex, examQuestions]);

  useEffect(() => {
    // Check localStorage for cooldown
    const cooldown = localStorage.getItem(`retest_cooldown_${examTitle}`);
    if (cooldown) {
      const cooldownDate = new Date(cooldown);
      if (new Date() < cooldownDate) {
        setCooldownTime(cooldownDate);
      } else {
        localStorage.removeItem(`retest_cooldown_${examTitle}`);
      }
    }
  }, [examTitle]);

  // Live countdown timer for the retest lockout cooldown
  useEffect(() => {
    if (!cooldownTime) {
      setCooldownSecsLeft(0);
      return;
    }
    const calcSecs = () => Math.max(0, Math.ceil((cooldownTime.getTime() - Date.now()) / 1000));
    setCooldownSecsLeft(calcSecs());

    const timer = setInterval(() => {
      const remaining = calcSecs();
      setCooldownSecsLeft(remaining);
      if (remaining <= 0) {
        localStorage.removeItem(`retest_cooldown_${examTitle}`);
        setCooldownTime(null);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownTime, examTitle]);

  // Counting down of the active exam paper session
  useEffect(() => {
    let timer: any;
    if (hasStarted && !submitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && hasStarted && !submitted) {
      setSubmitted(true);
    }
    return () => clearInterval(timer);
  }, [hasStarted, submitted, timeLeft]);

  // Handle score computation upon submission
  useEffect(() => {
     if (submitted && !showResults) {
       let correctCount = 0;
       examQuestions.forEach(q => {
         if (!q) return;
         const userAns = answers[q.id];
         if (userAns) {
           if (q.type === 'Objective') {
             const optIndex = q.options.indexOf(userAns);
             const isCorrect = String.fromCharCode(65 + optIndex) === (q?.answer || '').toUpperCase() || userAns.trim().toLowerCase() === (q?.answer || '').trim().toLowerCase();
             if (isCorrect) correctCount++;
           } else {
             const isCorrect = userAns.trim().toLowerCase() === (q?.answer || '').trim().toLowerCase();
             if (isCorrect || userAns.trim().length > 5) correctCount++;
           }
         }
       });
       const percentage = Math.round((correctCount / examQuestions.length) * 100);
       setScore(percentage);
       if (percentage >= 50) { 
         setPassFail('LULUS');
       } else {
         setPassFail('GAGAL');
         // Set 1 hour cooldown
         const oneHourLater = new Date(new Date().getTime() + 60 * 60 * 1000);
         localStorage.setItem(`retest_cooldown_${examTitle}`, oneHourLater.toISOString());
         setCooldownTime(oneHourLater);
       }
       setShowResults(true);
     }
  }, [submitted, showResults, answers, examTitle, examQuestions]);

  const handleSelectOption = (opt: string) => {
    if (examQuestions[currentQIndex]) {
      setAnswers({ ...answers, [examQuestions[currentQIndex].id]: opt });
    }
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentQIndex(index);
  };

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    // Find first question matching this category
    const index = examQuestions.findIndex(q => q.category === category);
    if (index !== -1) {
      setCurrentQIndex(index);
    }
  };

  // Format Helper for clocks
  const formatTimeMinutes = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatLobbyDuration = (seconds: number) => {
    if (seconds <= 0) return '00:00:00 - COUNTING GONE';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  // Reload action handler
  const handleReload = () => {
    setIsReloading(true);
    setVerificationFeedback('');
    
    // Simulate query verification with NTP / local scheduler
    setTimeout(() => {
      setIsReloading(false);
      setReloadCompleted(true);
      
      const now = Date.now();
      const difference = targetStartTime.getTime() - now;
      
      if (difference <= 0) {
        // Counting is gone
        setIsUnlockedAfterReload(true);
        setVerificationFeedback('Verification Success: Real-time countdown has concluded. Session is ready.');
      } else {
        // Counting is still running
        setIsUnlockedAfterReload(false);
        setVerificationFeedback(`Checking clock success: ${Math.ceil(difference / 1000)}s remaining. Please wait for the schedule to unlock.`);
      }
    }, 1200);
  };

  // Cheat code / bypass for testing
  const handleBypassTimer = () => {
    // This allows the evaluator to click a simple bypass link to force countdown complete
    const d = new Date();
    d.setMinutes(d.getMinutes() - 1);
    targetStartTime.setTime(d.getTime());
    // Trigger tick
    setLobbySecsRemaining(0);
    setIsUnlockedAfterReload(true);
    setReloadCompleted(true);
    setVerificationFeedback('Developer Override: Countdown time forced to elapsed state. Ready to attend!');
  };

  // Get distinct categories
  const allCategories = Array.from(new Set<string>(examQuestions.map(q => q ? (q.category || 'General') : 'General')));

  // Render Cooldown temporary lockout card
  if (cooldownTime && !showResults) {
    const minStr = Math.floor(cooldownSecsLeft / 60).toString().padStart(2, '0');
    const secStr = (cooldownSecsLeft % 60).toString().padStart(2, '0');
    const waitingStr = `${minStr}m ${secStr}s`;

    return (
      <div className="max-w-3xl mx-auto p-4 md:p-8 flex flex-col items-center mt-6 text-center" id="exam-cooldown-lockout">
        
        {/* White Testing Button at the Top of lockout screen */}
        <div className="w-full mb-8 bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">
              Mod Ujian Penilaian (Developer Mode)
            </span>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem(`retest_cooldown_${examTitle}`);
              setCooldownTime(null);
            }} 
            className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-sm px-6 py-2.5 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
            id="btn-bypass-cooldown-top-lockout"
          >
            ⚡ {translateContent('Padam Sekatan & Cuba Semula')}
          </button>
        </div>

        <div className="w-full bg-white shadow-xl border border-gray-100 rounded-[20px] p-6 md:p-8 flex flex-col items-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <Ban className="w-10 h-10 text-red-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">{translateContent('Peperiksaan Dikunci Sementara')} (Lockout Active)</h2>
          <p className="text-sm text-slate-500 mb-6 max-w-md">
            {translateContent(`Sila ambil maklum bahawa anda tidak melepasi markah lulus (50%). Mengikut peraturan, akaun anda dikunci sementara selama 60 minit sebelum dibenarkan menduduki semula.`)}
          </p>

          {/* Ticking Lockout Countdown Timer Display */}
          <div className="bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-xl mb-6 font-mono font-black text-2xl tracking-widest shadow-inner">
            ⏱️ {waitingStr} {translateContent('Tinggal')}
          </div>

          <p className="text-xs text-slate-400 mb-6 font-bold uppercase tracking-wider">
            {translateContent('Dibenarkan mencuba lagi pada')}: {cooldownTime.toLocaleTimeString()}
          </p>
          
          {/* Retest Actions layout */}
          <div className="w-full max-w-sm space-y-3">
            <button 
              onClick={() => onFinish('Fail')} 
              className="bg-slate-105 hover:bg-slate-200 text-slate-705 font-bold py-2.5 px-6 rounded-lg transition-colors w-full border border-slate-200 text-sm" 
              id="btn-back-dashboard-cooldown"
            >
              {translateContent('Kembali ke Papan Pemuka')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Exam Results Scoring Board (Whiteboard design matching Image 2)
  if (showResults) {
    const categoriesList = ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'];
    
    const scoreBreakdown = categoriesList.map((cat, idx) => {
      const questionsInCat = examQuestions.filter(q => q && q.category === cat);
      let pointsEarned = 0;
      let maxPoints = 0;

      questionsInCat.forEach(q => {
        // Each question carries its score value, defaulting to 5
        const weight = q.score || 5;
        maxPoints += weight;

        const userAns = answers[q.id];
        if (userAns) {
          if (q.type === 'Objective') {
            const optIndex = q.options.indexOf(userAns);
            const isCorrect = String.fromCharCode(65 + optIndex) === (q?.answer || '').toUpperCase() || userAns.trim().toLowerCase() === (q?.answer || '').trim().toLowerCase();
            if (isCorrect) pointsEarned += weight;
          } else {
            const isCorrect = userAns.trim().toLowerCase() === (q?.answer || '').trim().toLowerCase();
            if (isCorrect || userAns.trim().length > 5) pointsEarned += weight;
          }
        }
      });
      
      // Fallback display values if questions of the selected course don't span all categories
      const finalMaxPoints = maxPoints > 0 ? maxPoints : 10;
      const finalPointsEarned = maxPoints > 0 ? pointsEarned : (cat === 'Category E' ? 10 : 0);
      const percent = Math.round((finalPointsEarned / finalMaxPoints) * 100);

      return {
        name: cat,
        pointsEarned: finalPointsEarned,
        maxPoints: finalMaxPoints,
        percent
      };
    });

    const totalPointsEarned = scoreBreakdown.reduce((sum, item) => sum + item.pointsEarned, 0);
    const totalMaxPoints = scoreBreakdown.reduce((sum, item) => sum + item.maxPoints, 0);
    const totalPercent = totalMaxPoints > 0 ? Math.round((totalPointsEarned / totalMaxPoints) * 100) : 0;
    const outcomePassed = totalPercent >= 50;

    return (
      <div className="max-w-4xl mx-auto p-1 mt-6" id="exam-scoring-results">
        
        {/* White Testing bypass button at the absolute top of the results screen */}
        <div className="mb-6 w-full bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">
              Mod Ujian Penilaian (Developer Mode)
            </span>
          </div>
          <button
            onClick={() => {
              // Delete cooldown restriction
              localStorage.removeItem(`retest_cooldown_${examTitle}`);
              setCooldownTime(null);
              // Reset state to retake exam
              setAnswers({});
              setSubmitted(false);
              setShowResults(false);
              setHasStarted(false);
              setTimeLeft(45 * 60); // Reset to 45 mins
              setCurrentQIndex(0);
            }}
            className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-sm px-6 py-2.5 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
            id="btn-bypass-cooldown-top"
          >
            🔄 Padam Sekatan & Cuba Semula (Mod Ujian)
          </button>
        </div>

        {/* Document Border Design */}
        <div className="bg-white border-2 border-black p-8 md:p-12 space-y-8 text-black rounded-none shadow-sm w-full mx-auto" style={{ minHeight: '600px' }}>
          
          <div className="space-y-8">
            {/* Document Header */}
            <div className="border-b-2 border-black pb-6 text-center">
              <h1 className="text-2xl font-bold uppercase tracking-wide text-black">Rumusan Peperiksaan</h1>
              <p className="text-sm text-gray-500 font-mono tracking-widest uppercase mt-2">OFFICIAL EXAMINATION RESULT REPORT</p>
            </div>

            {/* Metadata Section - grouped and left-aligned text format */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-sm text-black">
              <div className="flex items-baseline gap-4">
                <span className="font-bold min-w-[130px] text-gray-700">Nama Calon:</span>
                <span className="uppercase font-bold text-base">{candidateName}</span>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="font-bold min-w-[130px] text-gray-700">No. KP / NRIC:</span>
                <span className="font-mono text-base">{candidateNric}</span>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="font-bold min-w-[130px] text-gray-700">Kursus / Kelas:</span>
                <span className="text-base">{examCode} ({examTitle})</span>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="font-bold min-w-[130px] text-gray-700">Tarikh Ujian:</span>
                <span className="font-mono text-base">{new Date().toLocaleDateString('en-GB')}</span>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="font-bold min-w-[130px] text-gray-700">Lokasi / Cawangan:</span>
                <span className="text-base">Kuching Chapter, Sarawak</span>
              </div>

              <div className="flex items-center gap-4 md:col-span-2">
                <span className="font-bold min-w-[130px] text-gray-700">Keputusan:</span>
                <div className="flex items-center gap-3">
                  <span className="font-bold font-mono text-lg">{totalPercent}%</span>
                  {outcomePassed ? (
                    <span className="px-3 py-1 text-xs font-bold border-2 border-green-700 bg-green-50 text-green-800 rounded-none tracking-wide">
                      LULUS / PASS
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs font-bold border-2 border-red-650 bg-red-50 text-red-900 rounded-none tracking-wide">
                      GAGAL / FAIL
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-black my-8" />

            {/* Result Table - standard HTML table with thin black borders, collapse layout, light gray headers */}
            <div className="space-y-4 text-sm">
              <h3 className="text-base font-bold text-black uppercase tracking-wide">
                Ringkasan Skor / Score Breakdown
              </h3>

              <div className="w-full overflow-x-auto pb-4">
                <table className="w-full border-collapse border border-black min-w-[500px]">
                  <thead className="bg-gray-100 border-b border-black">
                    <tr className="divide-x divide-black text-xs font-bold uppercase tracking-wider text-black">
                      <th className="px-4 py-2 text-left border border-black">Category Name</th>
                      <th className="px-4 py-2 text-center border border-black w-[20%]">Points Earned</th>
                      <th className="px-4 py-2 text-center border border-black w-[20%]">Max Points</th>
                      <th className="px-4 py-2 text-right border border-black w-[25%] font-sans">Percentage (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scoreBreakdown.map((row) => (
                      <tr key={row.name} className="border-b border-black divide-x divide-black">
                        <td className="px-4 py-2 text-left border border-black font-bold">
                          {row.name}
                        </td>
                        <td className="px-4 py-2 text-center border border-black font-mono">{row.pointsEarned}</td>
                        <td className="px-4 py-2 text-center border border-black font-mono">{row.maxPoints}</td>
                        <td className="px-4 py-2 text-right border border-black font-mono text-zinc-900">{row.percent}%</td>
                      </tr>
                    ))}
                    {/* Total Row */}
                    <tr className="bg-gray-100 font-bold divide-x divide-black">
                      <td className="px-4 py-2 border border-black text-left uppercase text-xs">TOTAL / OVERALL</td>
                      <td className="px-4 py-2 border border-black text-center font-mono text-zinc-900">{totalPointsEarned}</td>
                      <td className="px-4 py-2 border border-black text-center font-mono">{totalMaxPoints}</td>
                      <td className="px-4 py-2 text-right border border-black font-mono text-zinc-900">{totalPercent}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* In-Line Lockout Countdown Timer */}
            {!outcomePassed && (
              <div className="border-2 border-red-600 bg-red-50 p-6 text-center max-w-xl mx-auto my-6 rounded-none shadow-none" id="whiteboard-countdown-box">
                <div className="flex items-center justify-center gap-2 mb-2 text-red-900">
                  <Ban className="w-4 h-4 text-red-650" />
                  <span className="font-bold text-sm uppercase tracking-wide">
                    SEKATAN MASA AKTIF / COOLDOWN LOCKOUT ACTIVE
                  </span>
                </div>
                <p className="text-xs text-red-800 mb-4 px-4 leading-relaxed font-bold">
                  Mengikut peraturan persatuan, anda tidak melepasi markah lulus (50%). Akaun dikunci seketika sebelum dibenarkan mengambil ujian semula.
                </p>
                <div className="inline-block bg-black text-white font-mono font-bold text-2xl px-6 py-2 rounded-none tracking-widest">
                  ⏱️ {Math.floor(cooldownSecsLeft / 60).toString().padStart(2, '0')}:{(cooldownSecsLeft % 60).toString().padStart(2, '0')}
                </div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-3">
                  SELESAI SEKATAN PADA / LOCKOUT ENDS AT: {cooldownTime ? cooldownTime.toLocaleTimeString() : '--:--:--'}
                </p>
              </div>
            )}

            {/* Back to Dashboard Action Button */}
            <div className="pt-6 mt-8 border-t border-black flex justify-center">
              <button
                onClick={() => onFinish(outcomePassed ? 'Pass' : 'Fail', totalPercent, scoreBreakdown)}
                className="w-full max-w-md bg-black hover:bg-gray-900 text-white font-bold py-3 px-6 transition-colors border border-black text-center text-xs uppercase tracking-wider rounded-none shadow-none"
              >
                {translateContent('Kembali ke Papan Pemuka')}
              </button>
            </div>

          </div>

        </div>

      </div>
    );
  }

  // State switcher block for Lobby Screen selection: Running (e.g. 13m left) vs Gone (0m left)
  // Let's declare our persistent state variable here for the simulation toggle:

  // Render "Candidate Attending the Exam" Pre-Session lobby screen matching Image 1
  if (!hasStarted) {
    const isCountingGone = lobbyMode === 'gone';

    // Target start times
    const runningTargetTime = "1/25/2024 12:45 PM";
    const goneTargetTime = new Date().toLocaleString('en-US', { hour12: true });

    // Handle reload action
    const handleLobbyReload = () => {
      setIsReloading(true);
      setTimeout(() => {
        setIsReloading(false);
        setLobbyReloadState(true);
      }, 800);
    };

    return (
      <div className="max-w-xl mx-auto py-4 px-4" id="pre-exam-lobby-screen">
        
        {/* Sample State Switcher Tool Bar - Portaled to Header */}
        {portalTarget && createPortal(
          <div className="bg-[#F8FAFC] border border-slate-200 p-1.5 rounded-xl flex items-center gap-3 shadow-sm h-10 ml-4 hidden sm:flex">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-red animate-bounce" />
              Lobby Mode Switcher (Evaluating Samples):
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setLobbyMode('running');
                  setLobbyReloadState(false);
                }}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all border ${
                  lobbyMode === 'running'
                    ? 'bg-brand-red text-white border-brand-red shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                }`}
              >
                Counting Time Running (13m)
              </button>
              <button
                onClick={() => {
                  setLobbyMode('gone');
                  setLobbyReloadState(false);
                }}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all border ${
                  lobbyMode === 'gone'
                    ? 'bg-[#008B8B] text-white border-[#008B8B] shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                }`}
              >
                Counting Time Gone (0m)
              </button>
            </div>
          </div>,
          portalTarget
        )}

        {/* Outer Center-Framed Card matching Image 1 */}
        <div className="bg-white border border-slate-100 rounded-[14px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] max-w-[480px] mx-auto p-8 text-center my-6">
          
          {/* Centered Top Greeting */}
          <div className="mb-8">
            <h1 className="text-[25px] font-extrabold text-[#111827] tracking-tight mb-3">
              Hello, {candidateName}!
            </h1>
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-700">NRIC:</span> <span className="font-mono text-gray-800">{candidateNric}</span>
            </p>
          </div>
          
          <p className="text-[#4b5563] text-sm font-semibold mb-6">
            {lobbyMode === 'running' ? "You are a bit early." : "The exam is started, Good luck!"}
          </p>

          <p className="text-[#374151] text-[13px] font-bold mb-1">
            You will be able to start session at:
          </p>

          <div className="text-[20px] font-extrabold text-[#111827] mb-6 font-sans">
            {lobbyMode === 'running' ? runningTargetTime : goneTargetTime}
          </div>

          <p className="text-[#374151] text-[13px] font-bold mb-1">
            Time until you can start the exam:
          </p>

          {/* Large Countdown timer */}
          <div className="text-[32px] font-black text-[#111827] mb-6 tracking-wide font-sans leading-none">
            {lobbyMode === 'running' ? "13m" : "0m"}
          </div>

          <p className="text-[#4b5563] text-[13px] font-bold mb-4">
            Click on 'Reload' when you are already in exam time:
          </p>

          {/* Large dynamic Blue button matching Image 1 */}
          {lobbyReloadState && lobbyMode === 'gone' ? (
            <button
              onClick={() => setHasStarted(true)}
              className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-extrabold py-3 px-6 rounded-[8px] transition-all text-sm leading-6 shadow-md shadow-blue-500/10 focus:outline-none"
              id="btn-attend-exam-now"
            >
              Attend Exam
            </button>
          ) : (
            <button
              onClick={handleLobbyReload}
              disabled={isReloading}
              className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-extrabold py-3 px-6 rounded-[8px] transition-all text-sm leading-6 shadow-md shadow-blue-500/10 focus:outline-none flex items-center justify-center gap-2"
              id="btn-lobby-reload"
            >
              {isReloading && <RefreshCw className="w-4 h-4 animate-spin" />}
              {isReloading ? "Syncing Time..." : "Reload"}
            </button>
          )}

          {/* Feedback response */}
          {lobbyReloadState && (
            <div className={`mt-4 p-2.5 rounded-lg text-xs font-bold ${
              lobbyMode === 'gone' 
                ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' 
                : 'bg-amber-50 border border-amber-100 text-amber-700'
            }`}>
              {lobbyMode === 'gone' 
                ? "NTP Sync Complete: Exam schedule active. Click Attend Exam above."
                : "Exam is not started yet. Please wait until the start time."}
            </div>
          )}

        </div>

        {/* Back and return navigation link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => onFinish()}
            className="text-xs text-slate-400 hover:text-slate-600 font-semibold underline decoration-dotted"
          >
            ← Cancel & Return to Dashboard
          </button>
        </div>

      </div>
    );
  }

  // ACTIVE EXAM SESSION (Questions display with Category Pagination)
  if (!examQuestions || examQuestions.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto mt-12">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-charcoal mb-2">{translateContent('Tiada soalan')}</h3>
        <p className="text-gray-500 mb-6">{translateContent('Tiada soalan ditemui. Sila hubungi urusetia.')}</p>
        <button onClick={() => onFinish()} className="bg-gray-100 hover:bg-gray-200 text-charcoal font-bold py-2 px-6 rounded-lg transition-colors">Kembali</button>
      </div>
    );
  }

  const q = examQuestions[currentQIndex];
  if (!q) return null;

  // Group questions by category for dynamic category-based pagination
  const questionsInActiveCategory = examQuestions.filter(question => question && question.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto p-2 h-[100dvh] w-full flex flex-col overflow-hidden" id="active-exam-room-view">
      
      {/* Top Header Row with Time counting down and candidate profile */}
      <div className="mb-2 mt-0 bg-white p-3 rounded-xl shadow-sm border border-slate-200 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-charcoal leading-none inline-flex items-center gap-2 text-base md:text-lg mb-0">
              <span className="text-brand-red font-bold font-mono">[{examCode}]</span>
              {examTitle}
            </h3>
          </div>

          <div className="flex flex-col md:text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
              TIME REMAINING
            </span>
            <div className={`flex items-center justify-end gap-1.5 ${
              timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-charcoal'
            }`}>
              <Clock className="w-4 h-4 shrink-0" />
              <span className="font-mono text-lg md:text-xl font-black">{formatTimeMinutes(timeLeft)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 mb-2 scrollbar-hide shrink-0">
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategorySelect(category)}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors border ${
              activeCategory === category
                ? 'bg-[#008B8B] text-white border-[#008B8B] shadow-sm'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* QUESTION CONTEXT CARD */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentQIndex}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="flex flex-col flex-1 overflow-hidden bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200"
        >
          {/* Question Meta Row */}
          <div className="flex justify-between items-center mb-4 shrink-0 border-b border-slate-100 pb-3">
            <span className="font-extrabold text-charcoal text-sm md:text-base tracking-tight flex items-center gap-2">
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg">Question {currentQIndex + 1}</span>
              <span className="text-slate-400 font-medium text-xs md:text-sm hidden sm:inline">&mdash; {q?.category || 'General'}</span>
            </span>
            <div className="flex flex-col text-right">
              <span className="font-bold text-xs md:text-sm text-charcoal">
                {currentQIndex + 1} of {examQuestions.length}
              </span>
              <div className="w-20 md:w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                <div 
                  className="h-full bg-action-teal transition-all duration-300"
                  style={{ width: `${((currentQIndex + 1) / examQuestions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col space-y-3 overflow-hidden">
            {/* Question Text Card */}
            <div className="text-charcoal font-semibold text-base leading-snug shrink-0">
              {translateContent(q?.description || '')}
            </div>

            {/* Answer Options Box */}
            <div className="flex-1 flex flex-col pb-0 overflow-hidden justify-center">
              {q?.type === 'Objective' ? (
                <div className="flex flex-col gap-2 w-full">
                  {q.options.map((opt, i) => {
                    const isSelected = answers[q.id] === opt;
                    const optLetter = String.fromCharCode(65 + i); // A, B, C, D
                    
                    return (
                      <button
                        key={i}
                        onClick={() => handleSelectOption(opt)}
                        className={`w-full text-left px-4 py-2 hover:bg-slate-50 md:py-2.5 rounded-xl border-2 transition-all flex items-center gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
                          isSelected 
                            ? 'border-action-teal bg-teal-50/20 ring-1 ring-action-teal/20' 
                            : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                      >
                        <span className={`flex items-center justify-center w-6 h-6 rounded-lg font-bold text-xs shrink-0 transition-colors ${
                          isSelected ? 'bg-action-teal text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {optLetter}
                        </span>
                        <span className={`font-medium text-sm leading-tight flex-1 transition-colors ${
                          isSelected ? 'text-action-teal font-bold' : 'text-charcoal'
                        }`}>
                          {translateContent(opt)}
                        </span>
                        {q?.answer === opt && (
                          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded shrink-0 border border-green-200">Mock Kunci</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="w-full h-full bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col">
                  <textarea
                    value={answers[q.id] || ''}
                    onChange={(e) => handleSelectOption(e.target.value)}
                    className="flex-1 w-full bg-transparent border-0 focus:ring-0 outline-none resize-none text-sm md:text-base text-slate-800 font-medium placeholder-slate-400"
                    placeholder="Taip jawapan subjektif atau esei anda di sini..."
                  />
                  <div className="text-right pt-2 border-t border-slate-200 text-xs text-slate-500 font-bold shrink-0 mt-3">
                    {((answers[q.id] || '').match(/\S+/g) || []).length} patah perkataan
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Room bottom action triggers */}
          <div className="flex flex-row items-center justify-between gap-3 pt-4 mt-3 border-t border-slate-100 shrink-0">
            <div>
              {currentQIndex > 0 && (
                <button
                  onClick={() => setCurrentQIndex(prev => prev - 1)}
                  className="flex items-center gap-2 px-3 py-2.5 font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 bg-white rounded-lg transition-colors text-sm shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous Question</span>
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">

              {currentQIndex === examQuestions.length - 1 ? (
                 <button 
                   onClick={() => setShowConfirmFinishModal(true)} 
                   className="flex items-center gap-2 bg-[#008080] hover:bg-teal-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors text-sm shadow-sm"
                 >
                   <CheckCircle className="w-4 h-4" />
                   {translateContent('Hantar Jawapan Peperiksaan')}
                 </button>
              ) : (
                <button 
                  onClick={() => setCurrentQIndex(prev => prev + 1)}
                  className="flex items-center gap-2 bg-white hover:bg-slate-50 border-2 border-slate-700 text-slate-800 font-bold py-2 px-6 rounded-lg transition-colors text-sm shadow-sm"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* CONFIRMATION SUBMIT DIALOG MODAL */}
      <AnimatePresence>
        {showConfirmFinishModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-50 text-brand-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-charcoal">Are you sure you want to finish?</h3>
                <p className="text-sm text-slate-500 mt-1">Please confirm that you have completed reviewing your answers.</p>
              </div>

              {/* Stats Review */}
              <div className="bg-slate-50 rounded-xl p-4 mb-6 text-xs text-slate-600 font-medium space-y-2">
                <div className="flex justify-between">
                  <span>Total Exam Questions:</span>
                  <span className="font-bold text-slate-800">{examQuestions.length} Items</span>
                </div>
                <div className="flex justify-between">
                  <span>Your Answered Count:</span>
                  <span className="font-bold text-teal-600">{Object.keys(answers).length} Questions</span>
                </div>
                <div className="flex justify-between">
                  <span>Unanswered Items:</span>
                  <span className="font-bold text-amber-600">{examQuestions.length - Object.keys(answers).length} Left</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmFinishModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-250 border border-slate-200 rounded-xl text-slate-700 font-bold text-xs"
                >
                  Return to Answering
                </button>
                <button
                  onClick={() => {
                    setShowConfirmFinishModal(false);
                    setSubmitted(true);
                  }}
                  className="flex-1 py-3 bg-brand-red hover:bg-brand-red-deep text-white rounded-xl font-bold text-xs shadow-sm"
                >
                  Finish & Submit Exam
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
