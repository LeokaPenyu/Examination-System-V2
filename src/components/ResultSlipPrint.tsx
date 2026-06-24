import React, { useEffect } from 'react';
import { MockExam } from '../data/mockExams';
import { X, Printer } from 'lucide-react';

interface ResultSlipPrintProps {
  exam: MockExam;
  onClose: () => void;
}

export const ResultSlipPrint: React.FC<ResultSlipPrintProps> = ({ exam, onClose }) => {
  useEffect(() => {
    // Add print styles dynamically
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        @page { size: portrait; margin: 10mm; }
        body * { visibility: hidden; }
        #print-result-slips, #print-result-slips * { visibility: visible; }
        #print-result-slips {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .no-print { display: none !important; }
        .page-break { page-break-after: always; }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-500 overflow-y-auto pt-8 pb-20">
      <div className="max-w-4xl mx-auto mb-4 bg-white p-4 shadow-md flex justify-between items-center rounded no-print">
        <h2 className="font-bold text-[15px]">Cetak Slip - {exam.regNo}</h2>
        <div className="flex gap-2">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-1.5 bg-action-teal text-white rounded shadow-sm hover:bg-teal-700 font-bold text-[13px] uppercase"
          >
            <Printer className="w-4 h-4" /> Cetak
          </button>
          <button 
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-1.5 bg-gray-200 text-charcoal border border-gray-300 rounded shadow-sm hover:bg-gray-300 font-bold text-[13px] uppercase"
          >
            <X className="w-4 h-4" /> Tutup
          </button>
        </div>
      </div>

      <div id="print-result-slips" className="max-w-4xl mx-auto bg-white border border-gray-300 p-4 md:p-8">
        {exam.candidates?.map((candidate, index) => (
          <div key={candidate.id} className="p-4 md:p-8 border border-black h-[140mm] flex flex-col justify-center mb-8 page-break">
            <div className="text-center mb-8">
              <h1 className="text-[28px] font-black uppercase leading-tight">MALAYSIAN RED CRESCENT</h1>
              <h2 className="text-[28px] font-black uppercase leading-tight">(SARAWAK BRANCH)</h2>
              <h3 className="text-[28px] font-black uppercase leading-tight">EXAMINATION RESULT SLIP</h3>
            </div>
            
            <div className="text-center mb-16">
              <h4 className="text-[24px] font-bold">{exam.subject}</h4>
            </div>

            <div className="max-w-2xl mx-auto space-y-4 w-full pl-8">
              <div className="flex">
                <span className="font-bold text-[18px] w-[250px]">Nama Calon</span>
                <span className="font-bold text-[18px] uppercase flex-1">: {candidate.name}</span>
              </div>
              <div className="flex">
                <span className="font-bold text-[18px] w-[250px]">Cabang</span>
                <span className="font-bold text-[18px] uppercase flex-1">: {exam.district}</span>
              </div>
              <div className="flex">
                <span className="font-bold text-[18px] w-[250px]">Tarikh Peperiksaan</span>
                <span className="font-bold text-[18px] flex-1">: {exam.examDate}</span>
              </div>
              <div className="flex">
                <span className="font-bold text-[18px] w-[250px]">Keputusan Peperiksaan</span>
                <span className="font-bold text-[18px] uppercase flex-1">: {candidate.status === 'Pass' ? 'Lulus' : candidate.status === 'Fail' ? 'Gagal' : 'Tidak Hadir'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
