import React from 'react';
import { Layers, Calendar, MonitorPlay, Database, ClipboardList, RefreshCcw } from 'lucide-react';
import { ViewType } from '../types';

interface PeperiksaanMainProps {
  setActiveView: (view: ViewType) => void;
}

export const PeperiksaanMain: React.FC<PeperiksaanMainProps> = ({ setActiveView }) => {
  const menus = [
    { id: 'ExamProfile', icon: Layers, label: 'Profil Peperiksaan' },
    { id: 'ExamSchedule', icon: Calendar, label: 'Jadual Peperiksaan Pusat' },
    { id: 'OnlineExam', icon: MonitorPlay, label: 'Peperiksaan Dalam Talian' },
    { id: 'QuestionBank', icon: Database, label: 'Bank Soalan' },
    { id: 'Retest', icon: RefreshCcw, label: 'Ujian Semula' },
  ];

  return (
    <div className="font-sans w-full">
      <div className="mb-4 flex items-center gap-2 border-b border-gray-200 pb-3">
        <ClipboardList className="w-5 h-5 text-gray-800" />
        <h2 className="text-xl font-bold text-gray-800">Peperiksaan</h2>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {menus.map(menu => (
          <button
            key={menu.id}
            onClick={() => setActiveView(menu.id as ViewType)}
            className="flex flex-col items-center justify-center p-4 bg-white border border-gray-300 hover:border-gray-300 hover:shadow-sm transition-all w-36 h-28 group"
          >
            <menu.icon className="w-8 h-8 text-gray-500 mb-2 group-hover:text-gray-700 transition-colors" />
            <span className="text-[11px] font-medium text-gray-600 text-center leading-tight">{menu.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
