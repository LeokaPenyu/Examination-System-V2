import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Edit, Trash2, Plus, Settings, X, Save } from 'lucide-react';

interface Daerah {
  id: string;
  name: string;
  code: string;
}

const initialDaerah: Daerah[] = [
  { id: '1', name: 'BETONG', code: 'BTG' },
  { id: '2', name: 'BINTULU', code: 'BTU' },
  { id: '3', name: 'CAWANGAN', code: 'CAW' },
  { id: '4', name: 'KAPIT', code: 'KPT' },
  { id: '5', name: 'KUCHING', code: 'KCH' },
  { id: '6', name: 'LIMBANG', code: 'LBG' },
  { id: '7', name: 'LUNDU', code: 'LDU' },
  { id: '8', name: 'MARUDI', code: 'MRD' },
  { id: '9', name: 'MIRI', code: 'MYY' },
  { id: '10', name: 'SAMARAHAN', code: 'SHN' },
];

export const ProfilDaerah = () => {
  const [daerahList, setDaerahList] = useState<Daerah[]>(initialDaerah);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'EN' | 'BM'>('BM');
  const [formData, setFormData] = useState({ name: '', code: '' });

  const handleOpenModal = (daerah?: Daerah) => {
    if (daerah) {
      setEditingId(daerah.id);
      setFormData({ name: daerah.name, code: daerah.code });
    } else {
      setEditingId(null);
      setFormData({ name: '', code: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    if (!formData.name || !formData.code) return;

    if (editingId) {
      setDaerahList(prev => prev.map(d => d.id === editingId ? { ...d, ...formData } : d));
    } else {
      const newDaerah: Daerah = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        code: formData.code
      };
      setDaerahList(prev => [...prev, newDaerah]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    setDaerahList(prev => prev.filter(d => d.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 text-brand-red rounded-lg">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-lg text-gray-900">Profil Daerah</h2>
          </div>
          <button 
            onClick={() => handleOpenModal()} 
            className="bg-action-teal text-white px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Tambah Daerah
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-4 md:px-6 py-4 text-center w-16">No.</th>
                <th className="px-4 md:px-6 py-4">Nama Daerah</th>
                <th className="px-4 md:px-6 py-4 text-center">Kod Daerah</th>
                <th className="px-4 md:px-6 py-4 text-center w-28">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {daerahList.map((daerah, index) => (
                <tr key={daerah.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 md:px-6 py-4 text-center font-medium text-gray-500">{index + 1}</td>
                  <td className="px-4 md:px-6 py-4 font-medium text-gray-900">{daerah.name}</td>
                  <td className="px-4 md:px-6 py-4 text-center text-gray-600">{daerah.code}</td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => handleOpenModal(daerah)} className="p-2 text-gray-400 hover:text-action-teal hover:bg-teal-50 rounded-lg transition-colors" title="Kemaskini">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(daerah.id)} className="p-2 text-gray-400 hover:text-alert-red hover:bg-red-50 rounded-lg transition-colors" title="Padam">
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col"
          >
            <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900">{editingId ? 'Kemaskini Profil Daerah' : 'Tambah Profil Daerah'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 md:p-6 flex-1 flex flex-col">
              <div className="flex gap-2 border-b border-gray-100 mb-6 overflow-x-auto">
                <button 
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'EN' ? 'border-action-teal text-action-teal' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  onClick={() => setActiveTab('EN')}
                >
                  English
                </button>
                <button 
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'BM' ? 'border-action-teal text-action-teal' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  onClick={() => setActiveTab('BM')}
                >
                  B.Malaysia
                </button>
              </div>

              <div className="space-y-5 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nama Daerah <span className="text-brand-red">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-action-teal focus:ring-2 focus:ring-action-teal/20 outline-none transition-all"
                    placeholder="e.g. KUCHING"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Kod Daerah <span className="text-brand-red">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={formData.code}
                    maxLength={3}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-action-teal focus:ring-2 focus:ring-action-teal/20 outline-none transition-all uppercase placeholder:normal-case"
                    placeholder="e.g. KCH"
                  />
                  <p className="text-amber-600 text-xs mt-2 flex items-center gap-1">
                    Nota: Perubahan pada Kod Daerah akan menetap semula nombor pendaftaran.
                  </p>
                </div>
              </div>

              <div className="mt-auto flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button onClick={handleCloseModal} className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                  Batal
                </button>
                <button onClick={handleSave} className="px-4 py-2 bg-action-teal hover:bg-teal-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
                  <Save className="w-4 h-4" /> Simpan
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
