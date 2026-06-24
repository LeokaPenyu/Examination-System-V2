import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Printer, CheckCircle2 } from 'lucide-react';

export const AttendanceCertificateModule = () => {
  const [location, setLocation] = useState('');
  const [generated, setGenerated] = useState(false);
  const [merged, setMerged] = useState(false);

  const mockCandidates = [
    { name: 'John Doe', ic: '900101-13-5432' },
    { name: 'Siti Aminah', ic: '920202-13-6543' }
  ];

  const handlePrint = () => {
    setGenerated(true);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleMerge = () => {
    setMerged(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="card shadow-sm border border-gray-100 p-4 md:p-6">
        <h2 className="text-xl font-black text-charcoal mb-4">Jana Sijil Kehadiran</h2>
        
        {!generated ? (
          <>
            <div className="mb-4">
              <label className="text-sm font-bold text-gray-500 block mb-2">Lokasi Latihan (Untuk Sijil)</label>
              <select className="w-full p-2 border border-gray-200 rounded-lg text-sm" value={location} onChange={e => setLocation(e.target.value)}>
                <option value="">-- Pilih Lokasi --</option>
                <option value="Ibu Pejabat PBSM Sarawak">Ibu Pejabat PBSM Sarawak</option>
                <option value="Cawangan Kuching">Cawangan Kuching</option>
              </select>
            </div>
            
            <button onClick={handlePrint} disabled={!location} className="btn-primary flex items-center justify-center gap-2 w-full disabled:opacity-50">
              <Printer className="w-4 h-4" />
              Jana & Cetak Sijil ({mockCandidates.length} Calon)
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-success-green/10 p-4 rounded-xl border border-success-green">
              <h3 className="font-bold text-success-green flex gap-2"><CheckCircle2/> Sijil Siap Dijana</h3>
            </div>
            
            {!merged ? (
              <button onClick={handleMerge} className="w-full py-3 bg-action-teal text-white rounded-lg font-bold">
                Gabung Kehadiran ke dalam Sistem (Merge Attendance)
              </button>
            ) : (
              <p className="text-sm text-gray-500 italic">✅ Kehadiran telah berjaya digabungkan.</p>
            )}
            
            <div className="print-only mt-8 space-y-8">
               {mockCandidates.map(c => (
                 <div key={c.ic} className="border-4 border-gray-800 p-12 text-center h-[297mm] w-[210mm] mx-auto bg-white flex flex-col justify-center">
                    <h1 className="text-4xl font-black mb-8">SIJIL KEHADIRAN</h1>
                    <p className="text-xl mb-4">Ini mengesahkan bahawa:</p>
                    <h2 className="text-3xl font-bold mb-4">{c.name}</h2>
                    <p className="text-lg mb-8">IC: {c.ic}</p>
                    <p className="text-xl mb-4">Telah menghadirkan diri di latihan:</p>
                    <h3 className="text-2xl font-bold mb-16">{location}</h3>
                    
                    <div className="mt-16 text-left w-1/2">
                      <div className="border-b-2 border-charcoal pb-2 mb-2 w-64"></div>
                      <p className="font-bold">Pengarah / Pengerusi Cawangan</p>
                      <p>Tarikh: {new Date().toLocaleDateString()}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
