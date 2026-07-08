import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Save, CheckCircle, Download, BookOpen, Clock, CalendarDays, Key, FileCheck2, ChevronDown, ChevronRight, Eye, Trash2, Edit, Plus, LayoutList, CalendarClock, ClipboardList, RefreshCcw } from 'lucide-react';
import { sharedQuestions, COURSES_MAP } from '../data/mockQuestions';

export const ExamPaperGeneratorModule = () => {
  type ViewState = 'generate' | 'preview' | 'view-generated' | 'exam-papers-list';
  const [currentView, setCurrentView] = useState<ViewState>('exam-papers-list');
  const [activeTab, setActiveTab] = useState<'generated' | 'upcoming'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // States for generation engine
  const [course, setCourse] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState('');
  const [examDuration, setExamDuration] = useState('');
  const [examiner, setExaminer] = useState('');
  const [paperType, setPaperType] = useState<'Objective' | 'Subjective'>('Objective');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [editingPaperId, setEditingPaperId] = useState<string | null>(null);
  
  // Mock Lists
  const [generatedPapers, setGeneratedPapers] = useState([
    { id: 'GP1', course: 'CHED1031', batchNumber: 'BATCH-2026-01', date: '2026-07-01', generatedAt: '2026-06-18 10:30 AM', time: '09:00', duration: '120', questionCount: 40, examiner: 'Ahmad Razak', paperType: 'Objective', selectedQuestions: sharedQuestions.filter(q => q.course === 'CHED1031').slice(0, 40).map(q => q.id) },
    { id: 'GP2', course: 'CBFA1021', batchNumber: 'BATCH-2026-02', date: '2026-07-15', generatedAt: '2026-06-17 02:15 PM', time: '14:00', duration: '90', questionCount: 25, examiner: 'Siti Nur', paperType: 'Subjective', selectedQuestions: sharedQuestions.filter(q => q.course === 'CBFA1021').slice(0, 25).map(q => q.id) },
  ]);

  const [upcomingExams, setUpcomingExams] = useState([
    { id: 'UE1', course: 'PAFA1042', title: 'Pertolongan Cemas Lanjutan', date: '2026-08-10', candidates: 35, location: 'Kuching Chapter' },
    { id: 'UE2', course: 'VERC1011', title: 'Pendidikan Palang Merah Tinggi', date: '2026-08-20', candidates: 20, location: 'Sibu Chapter' },
  ]);

  const availableCategories = Array.from(new Set(sharedQuestions.filter(q => q.course === course && q.type === paperType).map(q => q.category)));

  const autoSelectQuestions = (category: string, count: number) => {
    const questionsInCategory = sharedQuestions.filter(q => q.course === course && q.type === paperType && q.category === category);
    const questionsToSelect = questionsInCategory.slice(0, count).map(q => q.id);
    
    setSelectedQuestions(prev => {
      // Remove any previously selected questions from this category that match the current paperType
      const prevWithoutCategory = prev.filter(id => {
        const q = sharedQuestions.find(sq => sq.id === id);
        return !(q && q.course === course && q.type === paperType && q.category === category);
      });
      return [...prevWithoutCategory, ...questionsToSelect];
    });
  };

  const toggleQuestionSelection = (qId: string) => {
    setSelectedQuestions(prev => {
      if (prev.includes(qId)) {
        return prev.filter(id => id !== qId);
      }
      return [...prev, qId];
    });
  };

  const generatePaper = () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!course || !batchNumber || !examDate || !examTime || !examDuration || !examiner) {
      setErrorMsg("Sila isi semua maklumat peperiksaan (Course, Batch No, Exam Date, Time, Duration, and Examiner) sebelum menyimpan/menjana kertas peperiksaan.");
      return;
    }

    if (selectedQuestions.length === 0) {
      setErrorMsg("Sila pilih sekurang-kurangnya satu soalan untuk kertas peperiksaan.");
      return;
    }

    setIsGenerated(true);
    setTimeout(() => {
      setIsGenerated(false);
      alert('Successfully generated!');
      setSuccessMsg(`Exam paper saved successfully with ${selectedQuestions.length} questions!`);
      setTimeout(() => setSuccessMsg(''), 3000);
      // Mock saving
      const now = new Date();
      const generatedAt = `${now.toLocaleDateString('en-GB')} ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
      
      if (editingPaperId) {
        setGeneratedPapers(prev => prev.map(p => 
          p.id === editingPaperId ? {
            ...p,
            course,
            batchNumber,
            date: examDate,
            time: examTime,
            duration: examDuration,
            generatedAt,
            questionCount: selectedQuestions.length,
            examiner,
            paperType,
            selectedQuestions
          } : p
        ));
      } else {
        setGeneratedPapers(prev => [
          { 
            id: `GP-${Date.now()}`, 
            course, 
            batchNumber: batchNumber || 'NEW-BATCH', 
            date: examDate || new Date().toISOString().split('T')[0], 
            time: examTime || '',
            duration: examDuration || '',
            generatedAt,
            questionCount: selectedQuestions.length, 
            examiner: examiner || 'Admin',
            paperType,
            selectedQuestions
          },
          ...prev
        ]);
      }
      setCurrentView('exam-papers-list');
    }, 1500);
  };

  const handleCreateNew = () => {
    setCourse('');
    setBatchNumber('');
    setExamDate('');
    setExamTime('');
    setExamDuration('');
    setExaminer('');
    setPaperType('Objective');
    setSelectedQuestions([]);
    setEditingPaperId(null);
    setErrorMsg('');
    setSuccessMsg('');
    setCurrentView('generate');
  };

  const handleGenerateFromUpcoming = (exam: any) => {
    setCourse(exam.course);
    setExamDate(exam.date);
    setBatchNumber(`BATCH-${exam.course}-${exam.id}`);
    setSelectedQuestions([]);
    setEditingPaperId(null);
    setErrorMsg('');
    setSuccessMsg('');
    setCurrentView('generate');
  };

  const handleDeleteGenerated = (id: string) => {
    if (confirm('Are you sure you want to delete this generated exam paper?')) {
      setGeneratedPapers(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleViewGenerated = (paper: any) => {
    setCourse(paper.course);
    setBatchNumber(paper.batchNumber);
    setExamDate(paper.date);
    setExamTime(paper.time || '');
    setExamDuration(paper.duration || '');
    setExaminer(paper.examiner);
    setPaperType(paper.paperType || 'Objective');
    setSelectedQuestions(paper.selectedQuestions || []);
    setEditingPaperId(paper.id);
    setCurrentView('view-generated');
  };

  if (currentView === 'preview' || currentView === 'view-generated') {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-teal-50 text-action-teal rounded-lg">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="font-bold text-xl text-gray-900 tracking-tight">{currentView === 'preview' ? 'Paper Preview' : 'Generated Document View'}</h2>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 text-brand-red p-4 rounded-lg border border-brand-red/20 text-sm font-bold shadow-sm">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-200 text-sm font-bold shadow-sm">
            {successMsg}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative p-6 md:p-8 space-y-6">
          <div className="border-b border-gray-200 pb-4">
             <h3 className="text-xl font-bold text-gray-800">{course ? `${course} - ${COURSES_MAP[course as keyof typeof COURSES_MAP] || ''}` : 'No Course Selected'}</h3>
             <p className="text-sm text-gray-600 mt-2">Batch: {batchNumber || 'N/A'} | Date: {examDate || 'N/A'} | Examiner: {examiner || 'N/A'}</p>
             <p className="text-sm text-gray-600 mt-1">Paper Type: <span className="font-bold">{paperType}</span></p>
             <p className="text-sm text-gray-600 font-bold mt-1">Total Selected Questions: {selectedQuestions.length}</p>
          </div>
          
          <div className="space-y-6">
            {availableCategories.map(cat => {
              const selectedInCat = sharedQuestions.filter(q => q.category === cat && selectedQuestions.includes(q.id));
              if (selectedInCat.length === 0) return null;
              return (
                <div key={cat} className="space-y-3">
                   <h4 className="font-bold text-lg text-brand-red border-b border-rose-100 pb-2">{cat}</h4>
                   <div className="space-y-4">
                     {selectedInCat.map((q, idx) => (
                       <div key={q.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                         <p className="font-medium text-gray-800 text-sm"><span className="mr-2 font-bold">{idx + 1}.</span>{q.description}</p>
                         {q.options && q.options.length > 0 ? (
                           <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm pl-6">
                             {q.options.map((opt, oIdx) => {
                               const isCorrectAnswer = opt === q.answer;
                               return (
                                 <div key={oIdx} className="flex flex-row items-start gap-2">
                                   <span className="font-bold text-gray-500">{String.fromCharCode(65 + oIdx)}.</span>
                                   <span className={isCorrectAnswer ? 'text-green-600 font-bold' : 'text-gray-700'}>
                                     {opt} {isCorrectAnswer && '(Answer)'}
                                   </span>
                                 </div>
                               );
                             })}
                           </div>
                         ) : (
                           <div className="mt-3 text-sm pl-6">
                             <span className="font-bold text-gray-500 block mb-1">Answer Guide:</span>
                             <span className="text-green-600 font-medium whitespace-pre-wrap">{q.answer}</span>
                           </div>
                         )}
                       </div>
                     ))}
                   </div>
                </div>
              );
            })}
          </div>

          <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <button 
              onClick={() => setCurrentView(currentView === 'view-generated' ? 'exam-papers-list' : 'generate')}
              className="px-6 py-3 rounded-lg text-sm font-bold shadow-sm transition-all text-brand-red bg-rose-50 hover:bg-rose-100 border border-brand-red/20 w-full md:w-auto"
            >
               {currentView === 'view-generated' ? 'Back' : 'Back to Editor'}
            </button>
            <div className="flex gap-2 w-full md:w-auto">
              {currentView === 'view-generated' ? (
                <button 
                  onClick={() => setCurrentView('generate')}
                  className="px-6 py-3 rounded-lg text-sm font-bold shadow-sm transition-all text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 flex-1 md:flex-none flex justify-center items-center gap-2"
                >
                  <Edit className="w-4 h-4" /> Edit Content
                </button>
              ) : (
                <button 
                  onClick={generatePaper}
                  disabled={isGenerated || selectedQuestions.length === 0}
                  className={`px-6 py-3 rounded-md text-sm font-bold shadow-sm transition-all flex justify-center items-center gap-2 flex-1 md:flex-none ${
                    isGenerated || selectedQuestions.length === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-[#008B8B] text-white hover:bg-teal-700'
                  }`}
                >
                  {isGenerated ? (
                    <><span className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></span> Generating...</>
                  ) : (
                    <><Save className="w-4 h-4" /> Generate</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (currentView === 'generate') {
    return (
       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
         <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-rose-50 text-brand-red rounded-lg">
               <FileText className="w-6 h-6" />
             </div>
             <h2 className="font-bold text-xl text-gray-900 tracking-tight">Generation of Exam Paper</h2>
           </div>
           <button 
             onClick={() => setCurrentView('exam-papers-list')}
             className="px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
           >
             Cancel
           </button>
         </div>

         {errorMsg && (
           <div className="bg-rose-50 text-brand-red p-4 rounded-lg border border-brand-red/20 text-sm font-bold shadow-sm">
             {errorMsg}
           </div>
         )}
         {successMsg && (
           <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-200 text-sm font-bold shadow-sm">
             {successMsg}
           </div>
         )}

         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
          <div className="p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form elements from previous code */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-action-teal" /> 
                  Exam Details
                </h3>
                
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Course <span className="text-brand-red">*</span></label>
                  <select 
                    className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:border-action-teal focus:ring-1 focus:ring-action-teal/20"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                  >
                    <option value="">-- Select Course --</option>
                    {Object.entries(COURSES_MAP).map(([code, title]) => (
                      <option key={code} value={code}>{code} - {title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Batch Number <span className="text-brand-red">*</span></label>
                  <input 
                    type="text" 
                    placeholder="e.g. BATCH-2024-01"
                    className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:border-action-teal focus:ring-1 focus:ring-action-teal/20"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5"/> Exam Date <span className="text-brand-red">*</span></label>
                    <input 
                      type="date" 
                      className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:border-action-teal focus:ring-1 focus:ring-action-teal/20"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> Exam Time <span className="text-brand-red">*</span></label>
                    <input 
                      type="time" 
                      className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:border-action-teal focus:ring-1 focus:ring-action-teal/20"
                      value={examTime}
                      onChange={(e) => setExamTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Exam Duration (Mins) <span className="text-brand-red">*</span></label>
                    <input 
                      type="number" 
                      placeholder="e.g. 120"
                      className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:border-action-teal focus:ring-1 focus:ring-action-teal/20"
                      value={examDuration}
                      onChange={(e) => setExamDuration(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Examiner / Coordinator <span className="text-brand-red">*</span></label>
                    <input 
                      type="text" 
                      placeholder="Name"
                      className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:border-action-teal focus:ring-1 focus:ring-action-teal/20"
                      value={examiner}
                      onChange={(e) => setExaminer(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Jenis Kertas Soalan (Paper Type)</label>
                  <div className="flex gap-4 bg-gray-50 p-2.5 rounded-md border border-gray-200">
                    <label className="flex items-center gap-2 cursor-pointer flex-1 justify-center p-2 rounded hover:bg-white border border-transparent hover:border-gray-300 transition-all">
                      <input 
                        type="radio" 
                        name="paperType" 
                        value="Objective" 
                        checked={paperType === 'Objective'} 
                        onChange={() => {
                          setPaperType('Objective');
                          setSelectedQuestions([]);
                        }} 
                        className="text-action-teal focus:ring-action-teal"
                      />
                      <span className="text-sm font-medium text-gray-700">Objektif (Aneka Pilihan)</span>
                    </label>
                    <div className="w-px bg-gray-200"></div>
                    <label className="flex items-center gap-2 cursor-pointer flex-1 justify-center p-2 rounded hover:bg-white border border-transparent hover:border-gray-300 transition-all">
                      <input 
                        type="radio" 
                        name="paperType" 
                        value="Subjective" 
                        checked={paperType === 'Subjective'} 
                        onChange={() => {
                          setPaperType('Subjective');
                          setSelectedQuestions([]);
                        }} 
                        className="text-action-teal focus:ring-action-teal"
                      />
                      <span className="text-sm font-medium text-gray-700">Subjektif (Esei / Struktur)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-2 flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-action-teal" /> 
                  Select Questions
                </h3>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-[500px] overflow-y-auto">
                  <p className="text-sm text-gray-600 mb-4 sticky top-0 bg-gray-50 py-2 z-10 border-b border-gray-200 flex justify-between items-center">
                    <span>Select the specific questions to include from each category.</span>
                    {course && availableCategories.length > 0 && (
                      <span className="font-bold text-brand-red">Paper: {paperType}</span>
                    )}
                  </p>
                  
                  <div className="space-y-3">
                    {!course ? (
                      <div className="text-sm text-gray-400 italic">Please select a course to see available questions.</div>
                    ) : availableCategories.length === 0 ? (
                      <div className="text-sm text-gray-400 italic">No categories found in Question Bank for this course.</div>
                    ) : (
                      availableCategories.map(cat => {
                        const questionsInCategory = sharedQuestions.filter(q => q.course === course && q.category === cat && q.type === paperType);
                        if (questionsInCategory.length === 0) return null;
                        const selectedCount = questionsInCategory.filter(q => selectedQuestions.includes(q.id)).length;
                        const isExpanded = expandedCategory === cat;
                        
                        return (
                          <div key={cat} className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
                            <button 
                              onClick={() => setExpandedCategory(isExpanded ? null : cat)}
                              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors text-left"
                            >
                              <div>
                                <span className="font-bold text-sm text-charcoal">{cat}</span>
                                <p className="text-xs text-gray-500 mt-0.5">{selectedCount} / {questionsInCategory.length} Selected</p>
                              </div>
                              <div className="text-gray-400 p-1">
                                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                              </div>
                            </button>
                            
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="border-t border-gray-100"
                                >
                                  <div className="p-3 space-y-2 bg-gray-50/50">
                                    {questionsInCategory.map(q => {
                                      const isSelected = selectedQuestions.includes(q.id);
                                      return (
                                        <label key={q.id} className="flex items-start gap-3 p-2 rounded hover:bg-white cursor-pointer border border-transparent hover:border-gray-200 transition-colors">
                                          <div className="pt-0.5">
                                            <input 
                                              type="checkbox"
                                              checked={isSelected}
                                              onChange={() => toggleQuestionSelection(q.id)}
                                              className="w-4 h-4 rounded text-action-teal focus:ring-action-teal/20 border-gray-300"
                                            />
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-800 line-clamp-2">{q.description}</p>
                                            <div className="flex gap-2 items-center mt-1">
                                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{q.type}</span>
                                              <span className="text-[10px] text-gray-500">Score: {q.score}</span>
                                            </div>
                                          </div>
                                        </label>
                                      );
                                    })}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={() => setCurrentView('preview')}
                    disabled={isGenerated || !course || selectedQuestions.length === 0}
                    className={`px-6 py-3 rounded-md text-sm font-bold shadow-sm transition-all flex items-center gap-2 ${
                      isGenerated || !course || selectedQuestions.length === 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-[#008B8B] text-white hover:bg-teal-700'
                    }`}
                  >
                    <Eye className="w-4 h-4" /> Paper Preview
                  </button>
                </div>

              </div>
            </div>
            
          </div>
        </div>
      </motion.div>
    );
  }

  // EXAM PAPERS LIST VIEW
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-50 text-brand-red rounded-lg">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-gray-900 tracking-tight">Exam Paper</h2>
            <p className="text-sm text-gray-500 mt-0.5">Manage generated papers and pending exams</p>
          </div>
        </div>
        
        <button 
          onClick={handleCreateNew}
          className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Exam Session
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <button
          className={`pb-3 px-2 font-bold text-sm transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'generated' ? 'border-brand-red text-brand-red' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('generated')}
        >
          <LayoutList className="w-4 h-4" />
          Generated Papers
        </button>
        <button
          className={`pb-3 px-2 font-bold text-sm transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'upcoming' ? 'border-brand-red text-brand-red' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('upcoming')}
        >
          <CalendarClock className="w-4 h-4" />
          Upcoming Exams Needs Papers
          <span className="bg-amber-100 text-amber-700 py-0.5 px-2 rounded-full text-[10px] ml-1">{upcomingExams.length}</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {activeTab === 'generated' && (
          <div className="flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="relative w-full max-w-sm">
                <div className="flex items-center border border-gray-300 bg-white rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-action-teal/20 focus-within:border-action-teal transition-all">
                  <BookOpen className="w-4 h-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search by course code, batch ref, exam date..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full bg-transparent border-none outline-none text-sm text-gray-700"
                  />
                </div>
                {/* Suggestions Dropdown */}
                <AnimatePresence>
                  {showSuggestions && searchQuery && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto"
                    >
                      {Array.from<string>(new Set(generatedPapers.map(p => p.course)))
                        .filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((courseOption, idx) => (
                          <div 
                            key={idx}
                            onClick={() => {
                              setSearchQuery(courseOption);
                              setShowSuggestions(false);
                            }}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 text-sm font-bold text-gray-800"
                          >
                            {courseOption}
                          </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Batch Ref</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Exam Date</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Generated At</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Questions</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {generatedPapers.filter(p => !searchQuery || p.course.toLowerCase().includes(searchQuery.toLowerCase()) || p.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) || p.date.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500 text-sm">
                        No generated exam papers found. Create one to get started.
                      </td>
                    </tr>
                  ) : generatedPapers
                    .filter(p => !searchQuery || p.course.toLowerCase().includes(searchQuery.toLowerCase()) || p.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) || p.date.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((paper) => (
                  <tr key={paper.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-sm text-gray-900 border border-gray-200 bg-white shadow-sm inline-block px-2 py-1 rounded">
                        {paper.course}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{COURSES_MAP[paper.course as keyof typeof COURSES_MAP]}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-sm text-gray-800">{paper.batchNumber}</div>
                      <div className="text-xs text-gray-500 mt-0.5">By: {paper.examiner}</div>
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-700">{paper.date}</td>
                    <td className="p-4 text-xs font-mono text-gray-600 bg-gray-50 border-x border-gray-100/50">{paper.generatedAt || 'N/A'}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-md bg-gray-100 text-gray-700 border border-gray-200">
                          {paper.questionCount} Qs
                        </span>
                        <span className="text-[10px] text-gray-500 font-medium">
                          {paper.paperType || 'Objective'}
                        </span>
                      </div>
                    </td>
    <td className="p-4 text-right">
      <div className="flex justify-end gap-1">
        <button 
          onClick={() => handleViewGenerated(paper)}
          className="p-2 text-gray-600 hover:bg-gray-100 hover:text-action-teal rounded-lg transition-colors" 
          title="View"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button 
          onClick={() => {
            setCourse(paper.course);
            setBatchNumber(paper.batchNumber);
            setExamDate(paper.date);
            setExamTime(paper.time || '');
            setExamDuration(paper.duration || '');
            setExaminer(paper.examiner);
            setPaperType((paper.paperType as "Objective" | "Subjective") || 'Objective');
            setSelectedQuestions(paper.selectedQuestions || []);
            setEditingPaperId(paper.id);
            setCurrentView('generate');
          }}
          className="p-2 text-gray-600 hover:bg-gray-100 hover:text-action-teal rounded-lg transition-colors" 
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button 
          onClick={() => handleDeleteGenerated(paper.id)}
          className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors" 
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Exam Date</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Location / Phase</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Candidates</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {upcomingExams.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500 text-sm">
                      No upcoming exams found.
                    </td>
                  </tr>
                ) : upcomingExams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-bold text-gray-800">{exam.date}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-sm text-gray-900 bg-gray-100 border border-gray-200 inline-block px-2 py-0.5 rounded">
                        {exam.course}
                      </div>
                      <div className="text-xs text-gray-600 mt-1 line-clamp-1">{exam.title}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-700">{exam.location}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-gray-800">{exam.candidates}</span>
                        <span className="text-xs text-gray-500">Registered</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleGenerateFromUpcoming(exam)}
                        className="bg-[#008B8B] text-white hover:bg-teal-700 px-3 py-1.5 rounded-md text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                        Generate Paper
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};
