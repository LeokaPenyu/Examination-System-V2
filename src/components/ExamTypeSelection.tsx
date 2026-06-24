import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Pointer } from 'lucide-react';

interface ExamTypeSelectionProps {
  onBack: () => void;
  onSelect: (examType: string) => void;
}

export const ExamTypeSelection: React.FC<ExamTypeSelectionProps> = ({ onBack, onSelect }) => {
  const [examType, setExamType] = useState<'biasa' | 'berpusat' | 'sijil' | ''>('biasa');
  const [selectedSubject, setSelectedSubject] = useState('');

  const berpusatExams = [
    { id: '2016-12-31 - 800/2', text: '2016-12-31 - 800/2' },
    { id: '2017-06-15 - 800/3', text: '2017-06-15 - 800/3' },
  ];

  const biasaExams = [
    { id: '700/1', text: '700/1 - First Aid at Work' },
    { id: '700/2', text: '700/2 - Advanced First Aid' },
    { id: '700/4', text: '700/4 - Basic First Aid' },
  ];

  const handleTypeChange = (type: 'biasa' | 'berpusat' | 'sijil') => {
    setExamType(type);
    setSelectedSubject('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-surface-cream rounded-lg shadow-2xl w-full max-w-[480px] overflow-hidden border border-gray-200"
      >
        {/* Header - Windows 7/Modern Hybrid */}
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 text-white px-4 py-3 flex items-center justify-between border-b-[4px] border-brand-red">
          <h2 className="text-[15px] font-bold tracking-wide">Pilih Peperiksaan</h2>
          <button 
            onClick={onBack}
            className="flex items-center justify-center w-7 h-5 bg-[#C0182A] hover:bg-red-600 border border-white/20 rounded-[2px] transition-colors"
          >
            <X className="w-4 h-4 text-white" strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 md:px-8 py-10 flex flex-col md:flex-row border-b border-gray-200 bg-white">
          <div className="w-full md:w-1/4 md:text-right text-left md:pr-4 mb-2 md:mb-0">
            <label className="text-sm font-bold text-gray-700">
              <span className="text-brand-red mr-1">*</span>Nama:
            </label>
          </div>
          <div className="flex-1 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group" onClick={() => handleTypeChange('biasa')}>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${examType === 'biasa' ? 'border-[#008B8B]' : 'border-gray-300'}`}>
                {examType === 'biasa' && <div className="w-2 h-2 rounded-full bg-[#008B8B]" />}
              </div>
              <span className="text-sm font-medium text-gray-800 group-hover:text-charcoal cursor-pointer">
                Peperiksaan Biasa
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group" onClick={() => handleTypeChange('berpusat')}>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${examType === 'berpusat' ? 'border-[#008B8B]' : 'border-gray-300'}`}>
                {examType === 'berpusat' && <div className="w-2 h-2 rounded-full bg-[#008B8B]" />}
              </div>
              <span className="text-sm font-medium text-gray-800 group-hover:text-charcoal cursor-pointer">
                Peperiksaan Berpusat
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group" onClick={() => handleTypeChange('sijil')}>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${examType === 'sijil' ? 'border-[#008B8B]' : 'border-gray-300'}`}>
                {examType === 'sijil' && <div className="w-2 h-2 rounded-full bg-[#008B8B]" />}
              </div>
              <span className="text-sm font-medium text-gray-800 group-hover:text-charcoal cursor-pointer">
                Pembaharuan Sijil
              </span>
            </label>

            {(examType === 'biasa' || examType === 'berpusat') && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-2">Pilih Kertas Peperiksaan</label>
                <select 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-[6px] text-sm outline-none focus:ring-1 focus:ring-action-teal transition-all text-charcoal shadow-sm"
                >
                  <option value="">-- Sila Pilih --</option>
                  {examType === 'berpusat' 
                    ? berpusatExams.map(ex => <option key={ex.id} value={ex.id}>{ex.text}</option>)
                    : biasaExams.map(ex => <option key={ex.id} value={ex.id}>{ex.text}</option>)
                  }
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-surface-cream px-4 md:px-6 py-4 flex items-center justify-center gap-3">
          <button 
            onClick={onBack}
            className="btn-outline min-w-[100px] shadow-sm text-sm"
          >
            <X className="w-4 h-4" />
            Tutup
          </button>
          <button 
            disabled={!examType || ((examType === 'biasa' || examType === 'berpusat') && !selectedSubject)}
            onClick={() => {
              if (examType === 'sijil') {
                onSelect('sijil');
              } else if (selectedSubject) {
                onSelect(selectedSubject);
              }
            }}
            className={`min-w-[100px] shadow-sm text-sm ${
              examType && (examType === 'sijil' || selectedSubject)
              ? 'btn-primary' 
              : 'bg-gray-300 text-white cursor-not-allowed px-4 py-2 rounded-[6px] font-medium flex items-center justify-center gap-2'
            }`}
          >
            <Pointer className="w-4 h-4 -ml-1 fill-white" />
            Pilih
          </button>
        </div>
      </motion.div>
    </div>
  );
};

