import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Save, X } from 'lucide-react';

export const RetestModule = () => {
  const [candidates, setCandidates] = useState([
    { id: '1', name: 'Ahmad Albab', status: 'Gagal (Praktikal)' },
    { id: '2', name: 'Siti Nurhaliza', status: 'Gagal (Teori)' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleOpenModal = (candidate: { id: string, name: string, status: string }) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
  };

  const handleSave = () => {
    setSuccessMessage(`Jadual Ujian Semula (Retest) untuk ${selectedCandidate?.name} telah berjaya disimpan.`);
    
    // Remove the candidate from the list
    if (selectedCandidate) {
      setCandidates(prev => prev.filter(c => c.id !== selectedCandidate.id));
    }
    
    setIsModalOpen(false);
    
    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-1.5 rounded-full">
              <Save className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-sm font-medium">{successMessage}</p>
          </div>
          <button onClick={() => setSuccessMessage('')} className="text-green-600 hover:text-green-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="card shadow-sm border border-gray-100 p-4 md:p-6 bg-white rounded-xl">
        <h2 className="text-xl font-bold text-charcoal mb-4">Pengurusan Ujian Semula (Retest)</h2>
        <div className="bg-rose-50 p-4 rounded-xl border border-brand-red/10 mb-6 flex items-center gap-4">
           <Calendar className="text-brand-red" />
           <div>
             <p className="font-bold text-brand-red-deep">Jadualkan Ujian Semula</p>
             <p className="text-sm text-brand-red-deep/70">Pilih calon yang gagal untuk menjadualkan semula ujian</p>
           </div>
        </div>
        
        <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-widest border-y border-gray-200">
            <tr>
              <th className="p-3">Nama Calon</th>
              <th className="p-3">Status Asal</th>
              <th className="p-3">Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {candidates.length > 0 ? (
              candidates.map((candidate) => (
                <tr key={candidate.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-medium text-gray-800">{candidate.name}</td>
                  <td className="p-3 text-brand-red font-bold">{candidate.status}</td>
                  <td className="p-3">
                    <button 
                      onClick={() => handleOpenModal(candidate)}
                      className="bg-action-teal hover:bg-teal-700 transition-colors text-white px-3 py-1.5 text-xs rounded-md font-bold"
                    >
                      Jadual Retest
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-6 text-center text-gray-500 font-medium">
                  Tiada calon yang memerlukan ujian semula buat masa ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Retest Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900">Jadualkan Ujian Semula</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5"/>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Calon</label>
                <div className="p-2 bg-gray-50 text-gray-800 font-medium rounded-md border border-gray-200">
                  {selectedCandidate?.name}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Komponen Yang Gagal</label>
                <div className="p-2 bg-red-50 text-brand-red font-medium rounded-md border border-red-100">
                  {selectedCandidate?.status}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tarikh Retest</label>
                <input type="date" className="w-full p-2 border border-gray-300 rounded-md focus:border-action-teal focus:ring-1 focus:ring-action-teal outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Masa</label>
                <input type="time" className="w-full p-2 border border-gray-300 rounded-md focus:border-action-teal focus:ring-1 focus:ring-action-teal outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                <input type="text" placeholder="Cth: Bilik Seminar 1" className="w-full p-2 border border-gray-300 rounded-md focus:border-action-teal focus:ring-1 focus:ring-action-teal outline-none" />
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-white"
              >
                Batal
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-action-teal text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4"/> Simpan Jadual
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
