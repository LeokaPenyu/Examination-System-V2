import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Edit, Trash2, X, Save, Users, FileDown, Plus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Candidate {
  id: string;
  nama: string;
  noKp: string;
  noAhli: string;
  noSijil: string;
  tarikhTamatSijil: string;
}

const initialData: Candidate[] = [
  { id: '1', nama: 'MIGUEL SILVA', noKp: '970406-13-5288', noAhli: '', noSijil: '', tarikhTamatSijil: '' },
  { id: '2', nama: 'ALICE SANTOS', noKp: '880314-13-5062', noAhli: '', noSijil: '', tarikhTamatSijil: '' },
  { id: '3', nama: 'ARTHUR OLIVEIRA', noKp: '751231-13-5832', noAhli: '', noSijil: '', tarikhTamatSijil: '' },
  { id: '4', nama: 'SOFIA COSTA', noKp: '810905-13-5538', noAhli: '', noSijil: '', tarikhTamatSijil: '' },
  { id: '5', nama: 'HEITOR PEREIRA', noKp: '760823-13-5558', noAhli: '', noSijil: '', tarikhTamatSijil: '' },
  { id: '6', nama: 'LAURA FERREIRA', noKp: '771102-13-5076', noAhli: '', noSijil: '', tarikhTamatSijil: '' },
  { id: '7', nama: 'BERNARDO ALMEIDA', noKp: '690316-13-5552', noAhli: '', noSijil: '', tarikhTamatSijil: '' },
  { id: '8', nama: 'VALENTINA LIMA', noKp: '921101-13-5446', noAhli: '', noSijil: '', tarikhTamatSijil: '' },
  { id: '9', nama: 'DAVI RODRIGUES', noKp: '900924-13-6359', noAhli: '', noSijil: '', tarikhTamatSijil: '' },
  { id: '10', nama: 'HELENA SOUZA', noKp: '800305-13-5332', noAhli: '13-0422-00014330', noSijil: '', tarikhTamatSijil: '' },
];

export const Calon: React.FC = () => {
  const { t } = useLanguage();
  const [data, setData] = useState<Candidate[]>(initialData);
  
  const [filterNama, setFilterNama] = useState('');
  const [filterNoKp, setFilterNoKp] = useState('');
  const [filterNoAhli, setFilterNoAhli] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewCandidate, setViewCandidate] = useState<Candidate | null>(null);

  const handleView = (item: Candidate) => {
    setViewCandidate(item);
    setIsViewModalOpen(true);
  };

  const [formData, setFormData] = useState({
    nama: '',
    noKp: '',
    noAhli: '',
    noSijil: '',
    tarikhTamatSijil: ''
  });

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
  };

  const handleEdit = (item: Candidate) => {
    setEditingId(item.id);
    let formattedDate = '';
    if (item.tarikhTamatSijil) {
      const dateParts = item.tarikhTamatSijil.split('/');
      if (dateParts.length === 3) {
        formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      }
    }
    
    setFormData({
      nama: item.nama,
      noKp: item.noKp,
      noAhli: item.noAhli,
      noSijil: item.noSijil,
      tarikhTamatSijil: formattedDate
    });
    setIsModalOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      nama: '',
      noKp: '',
      noAhli: '',
      noSijil: '',
      tarikhTamatSijil: ''
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.nama || !formData.noKp) {
      return;
    }

    let formattedDate = '';
    if (formData.tarikhTamatSijil) {
      const dateObj = new Date(formData.tarikhTamatSijil);
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      formattedDate = `${day}/${month}/${year}`;
    }

    if (editingId) {
      setData(prev => prev.map(item => item.id === editingId ? {
        ...item,
        nama: formData.nama.toUpperCase(),
        noKp: formData.noKp,
        noAhli: formData.noAhli,
        noSijil: formData.noSijil,
        tarikhTamatSijil: formattedDate
      } : item));
    } else {
      const newId = String(Math.max(...data.map(d => parseInt(d.id, 10)), 0) + 1);
      setData(prev => [...prev, {
        id: newId,
        nama: formData.nama.toUpperCase(),
        noKp: formData.noKp,
        noAhli: formData.noAhli,
        noSijil: formData.noSijil,
        tarikhTamatSijil: formattedDate
      }]);
    }
    setIsModalOpen(false);
  };

  const filteredData = data.filter(item => {
    return (
      item.nama.toLowerCase().includes(filterNama.toLowerCase()) &&
      item.noKp.toLowerCase().includes(filterNoKp.toLowerCase()) &&
      item.noAhli.toLowerCase().includes(filterNoAhli.toLowerCase())
    );
  });

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-sm">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-sm">
        
        {/* Header */}
        <div className="p-4 md:p-6 flex justify-between items-center border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 text-brand-red rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-lg text-gray-900">{t('candidateList')}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleAddNew}
              className="bg-action-teal hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> {t('tambahCalon')}
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
              <FileDown className="w-4 h-4" /> {t('eksportCsv')}
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50 space-y-4 max-w-2xl">
          <div className="flex items-center gap-4">
            <label className="w-32 text-right font-medium text-gray-700 text-xs">{t('name')} :</label>
            <input 
              type="text" 
              value={filterNama}
              onChange={(e) => setFilterNama(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-action-teal focus:border-action-teal bg-white"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-32 text-right font-medium text-gray-700 text-xs">{t('icNumber')} :</label>
            <input 
              type="text" 
              value={filterNoKp}
              onChange={(e) => setFilterNoKp(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-action-teal focus:border-action-teal bg-white"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-32 text-right font-medium text-gray-700 text-xs">{t('membershipNumber')} :</label>
            <input 
              type="text" 
              value={filterNoAhli}
              onChange={(e) => setFilterNoAhli(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-action-teal focus:border-action-teal bg-white"
            />
          </div>
          <div className="flex items-center gap-4 pt-2">
            <div className="w-32"></div>
            <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm text-gray-700">
              <Search className="w-4 h-4 text-action-teal" /> {t('search')}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-6">
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 border-r border-gray-100 text-center w-12">{t('bil')}</th>
                    <th className="px-4 py-3 border-r border-gray-100 text-center uppercase">{t('name')}</th>
                    <th className="px-4 py-3 border-r border-gray-100 text-center uppercase w-48">{t('icNumber')}</th>
                    <th className="px-4 py-3 border-r border-gray-100 text-center uppercase w-48">{t('membershipNumber')}</th>
                    <th className="px-4 py-3 text-center uppercase w-24">{t('action')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white text-center">
                  {filteredData.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 border-r border-gray-50 text-center text-gray-500 font-medium">{index + 1}</td>
                      <td className="px-4 py-3 border-r border-gray-50 text-gray-900">{item.nama}</td>
                      <td className="px-4 py-3 border-r border-gray-50 text-gray-700">{item.noKp}</td>
                      <td className="px-4 py-3 border-r border-gray-50 text-gray-700">{item.noAhli}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => handleView(item)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-action-teal hover:bg-teal-50 transition-colors"
                            title={t('view')}
                          >
                            <Search className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEdit(item)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-action-teal hover:bg-teal-50 transition-colors"
                            title={t('update')}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-alert-red hover:bg-red-50 transition-colors"
                            title={t('padam')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-4 md:py-8 text-center text-gray-500 italic">
                        {t('noItemFound')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="bg-white shadow-xl rounded-xl w-full max-w-lg flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="font-bold text-lg text-gray-900">
                {editingId ? t('ubahCalon') : t('tambahCalon')}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4 md:p-6 bg-white space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('name')} <span className="text-brand-red">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.nama}
                  onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value.toUpperCase() }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-action-teal focus:ring-2 focus:ring-action-teal/20 outline-none transition-all uppercase placeholder:normal-case"
                  placeholder="e.g. AHMAD BIN ABU"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('icNumber')} <span className="text-brand-red">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.noKp}
                  onChange={(e) => setFormData(prev => ({ ...prev, noKp: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-action-teal focus:ring-2 focus:ring-action-teal/20 outline-none transition-all"
                  placeholder="e.g. 900101-13-5000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('membershipNumber')}
                </label>
                <input 
                  type="text" 
                  value={formData.noAhli}
                  onChange={(e) => setFormData(prev => ({ ...prev, noAhli: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-action-teal focus:ring-2 focus:ring-action-teal/20 outline-none transition-all"
                  placeholder="e.g. A001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  No. Sijil
                </label>
                <input 
                  type="text" 
                  value={formData.noSijil}
                  onChange={(e) => setFormData(prev => ({ ...prev, noSijil: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-action-teal focus:ring-2 focus:ring-action-teal/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tarikh Tamat Sijil
                </label>
                <input 
                  type="date" 
                  value={formData.tarikhTamatSijil}
                  onChange={(e) => setFormData(prev => ({ ...prev, tarikhTamatSijil: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-action-teal focus:ring-2 focus:ring-action-teal/20 outline-none transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-8">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 md:px-6 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSave}
                  className="px-4 md:px-6 py-2 bg-action-teal hover:bg-teal-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Save className="w-5 h-5" /> Simpan
                </button>
              </div>
            </div>
            
          </motion.div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && viewCandidate && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="bg-white shadow-xl rounded-xl w-full max-w-4xl flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="px-4 md:px-6 py-4 flex justify-between items-center border-b border-gray-100 bg-gradient-to-r from-gray-800 to-gray-700 text-white">
              <h3 className="font-bold text-base tracking-wide">{t('view')} {t('candidates')}</h3>
              <button 
                onClick={() => setIsViewModalOpen(false)} 
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors rounded-lg border border-white/20 bg-black/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4 md:p-6 bg-gray-50/50 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-y-3 text-sm">
                <div className="text-gray-500 font-medium text-right pr-4">{t('name')}:</div>
                <div className="font-medium text-gray-900">{viewCandidate.nama}</div>
                
                <div className="text-gray-500 font-medium text-right pr-4">{t('icNumber')}:</div>
                <div className="font-medium text-gray-900">{viewCandidate.noKp}</div>
                
                <div className="text-gray-500 font-medium text-right pr-4">{t('membershipNumber')}:</div>
                <div className="font-medium text-gray-900">{viewCandidate.noAhli || '-'}</div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm mt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-center border-collapse text-sm">
                    <thead className="bg-[#f0c2c2] text-gray-900 font-semibold border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 border-r border-[#e5a5a5]">Nama Daerah</th>
                        <th className="px-4 py-3 border-r border-[#e5a5a5]">Kod Subjek</th>
                        <th className="px-4 py-3 border-r border-[#e5a5a5]">Nama Unit/Organisasi</th>
                        <th className="px-4 py-3 border-r border-[#e5a5a5]">No. Sijil</th>
                        <th className="px-4 py-3">Tarikh Tamat Sijil</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 border-r border-gray-100">CAWANGAN</td>
                        <td className="px-4 py-3 border-r border-gray-100">800/2</td>
                        <td className="px-4 py-3 border-r border-gray-100">PPKS</td>
                        <td className="px-4 py-3 border-r border-gray-100">{viewCandidate.noSijil || '-'}</td>
                        <td className="px-4 py-3">{viewCandidate.tarikhTamatSijil || '-'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
