import React from 'react';
import { motion } from 'motion/react';
import { getExamSchedule } from '../utils/examSchedule';

export const OnlineExamModule = () => {
  // Hardcode a date for demonstration
  const todayStr = new Date().toISOString().split('T')[0];
  const { isQuestionsLocked, isPracticalAvailable } = getExamSchedule(todayStr);
  const isLocked = isQuestionsLocked(new Date());
  
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="card shadow-sm border border-gray-100 p-4 md:p-6">
        <h2 className="text-xl font-black text-charcoal mb-4">Peperiksaan Dalam Talian</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`p-4 rounded-xl border ${isLocked ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
            <h3 className="font-bold text-charcoal">Status Soalan Teori</h3>
            <p className={`text-sm ${isLocked ? 'text-amber-600' : 'text-green-600'}`}>
              {isLocked ? 'Dikunci (Buka 13:20)' : 'Dilepaskan'}
            </p>
          </div>
          <div className="p-4 rounded-xl border bg-gray-50 border-gray-200">
            <h3 className="font-bold text-charcoal">Kertas Praktikal</h3>
            <p className="text-sm text-gray-500">
              Sedia untuk dimuat turun 13:00
            </p>
          </div>
        </div>
        <button disabled={isLocked} className="btn-primary w-full disabled:opacity-50">
           Lepaskan Kertas Peperiksaan
        </button>
      </div>
    </motion.div>
  );
};
