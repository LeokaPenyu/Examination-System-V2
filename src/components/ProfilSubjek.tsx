import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Edit, Trash2, Plus, Settings, X, Save, Check } from 'lucide-react';

interface Subjek {
  id: string;
  name: string;
  code: string;
  duration: string;
  languages: string[];
  types: {
    teori: boolean;
    lisan: boolean;
    praktikal: boolean;
  };
}

const initialSubjek: Subjek[] = [
  { id: '1', name: 'Pertolongan Cemas Asas dan CPR', code: '800/2', duration: '14', languages: ['BI', 'BM'], types: { teori: true, lisan: true, praktikal: true } },
  { id: '2', name: 'Pertolongan Cemas Asas, CPR dan AED', code: 'CBFA1021', duration: '14', languages: ['BI', 'BM', 'BC'], types: { teori: true, lisan: true, praktikal: true } },
  { id: '3', name: 'Pendidikan Palang Merah dan Bulan Sabit Merah', code: 'CERC1011', duration: '8', languages: ['BI', 'BM'], types: { teori: true, lisan: false, praktikal: false } },
  { id: '4', name: 'Pendidikan Kesihatan', code: 'CHED1031', duration: '8', languages: ['BI', 'BM'], types: { teori: true, lisan: false, praktikal: false } },
  { id: '5', name: 'Rawatan Rumah', code: 'CHNU1041', duration: '8', languages: ['BI', 'BM'], types: { teori: true, lisan: true, praktikal: true } },
  { id: '6', name: 'PERTOLONGAN CEMAS LANJUTAN, CPR & AED', code: 'PAFA1042', duration: '18 JAM', languages: ['BI', 'BM'], types: { teori: true, lisan: true, praktikal: true } },
  { id: '7', name: 'PENGENALAN PERTOLONGAN CEMAS, CPR & AED', code: 'PIFA 1021', duration: '8 JAM', languages: ['BI', 'BM'], types: { teori: true, lisan: true, praktikal: true } },
];

export const ProfilSubjek = () => {
  const [subjekList, setSubjekList] = useState<Subjek[]>(initialSubjek);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'EN' | 'BM'>('BM');
  
  const [formData, setFormData] = useState({ 
    name: '', 
    code: '',
    duration: '',
    availableFor: { youth: false, vad: false, private: false, gov: false },
    languages: { bc: false, bi: false, bm: false },
    types: { teori: false, lisan: false, praktikal: false },
    scores: { teori: '', lisan: '', praktikal: '' },
    renewal: 'tidak',
    expiry: 'Tiada'
  });

  const handleOpenModal = (subjek?: Subjek) => {
    if (subjek) {
      setEditingId(subjek.id);
      setFormData({
        name: subjek.name,
        code: subjek.code,
        duration: subjek.duration,
        availableFor: { youth: false, vad: false, private: false, gov: false }, // Mock detailed data based on subjek if needed
        languages: { 
          bc: subjek.languages.includes('BC'), 
          bi: subjek.languages.includes('BI'), 
          bm: subjek.languages.includes('BM') 
        },
        types: { ...subjek.types },
        scores: { teori: '', lisan: '', praktikal: '' },
        renewal: 'tidak',
        expiry: 'Tiada'
      });
    } else {
      setEditingId(null);
      setFormData({ 
        name: '', 
        code: '',
        duration: '',
        availableFor: { youth: false, vad: false, private: false, gov: false },
        languages: { bc: false, bi: false, bm: false },
        types: { teori: false, lisan: false, praktikal: false },
        scores: { teori: '', lisan: '', praktikal: '' },
        renewal: 'tidak',
        expiry: 'Tiada'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = () => {
    if (!formData.name || !formData.code) return;

    const langs = [];
    if (formData.languages.bi) langs.push('BI');
    if (formData.languages.bm) langs.push('BM');
    if (formData.languages.bc) langs.push('BC');

    const newSubjekData = {
      name: formData.name,
      code: formData.code,
      duration: formData.duration,
      languages: langs,
      types: formData.types
    };

    if (editingId) {
      setSubjekList(prev => prev.map(s => s.id === editingId ? { ...s, ...newSubjekData } : s));
    } else {
      setSubjekList(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), ...newSubjekData }]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    setSubjekList(prev => prev.filter(s => s.id !== id));
  };

  const handleCheckbox = (group: 'availableFor' | 'languages' | 'types', field: string) => {
    setFormData(prev => ({
      ...prev,
      [group]: {
        ...prev[group],
        [field]: !prev[group][field as keyof typeof prev[typeof group]]
      }
    }));
  };

  const handleScoreChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      scores: {
        ...prev.scores,
        [field]: value
      }
    }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 md:p-6 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 text-brand-red rounded-lg">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-lg text-gray-900">Profil Subjek</h2>
          </div>
          <button 
            onClick={() => handleOpenModal()} 
            className="bg-action-teal text-white px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Tambah Subjek
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-4 md:px-6 py-4 text-center w-12 border-b border-gray-100" rowSpan={2}>No.</th>
                <th className="px-4 md:px-6 py-4 border-b border-gray-100" rowSpan={2}>Nama Subjek</th>
                <th className="px-4 md:px-6 py-4 text-center whitespace-nowrap border-b border-gray-100" rowSpan={2}>Kod Subjek</th>
                <th className="px-4 md:px-6 py-4 text-center whitespace-nowrap border-b border-gray-100" rowSpan={2}>Waktu Subjek</th>
                <th className="px-4 md:px-6 py-4 text-center whitespace-nowrap border-b border-gray-100" rowSpan={2}>Bahasa Subjek</th>
                <th className="px-4 md:px-6 py-2 text-center border-b border-gray-100" colSpan={3}>Jenis Subjek Untuk Peperiksaan</th>
                <th className="px-4 md:px-6 py-4 text-center w-28 border-b border-gray-100" rowSpan={2}>Tindakan</th>
              </tr>
              <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-semibold tracking-wider">
                <th className="px-4 py-2 text-center border-b border-gray-100">Teori</th>
                <th className="px-4 py-2 text-center border-b border-gray-100">Lisan</th>
                <th className="px-4 py-2 text-center border-b border-gray-100">Praktikal</th>
              </tr>
            </thead>
            <tbody>
              {subjekList.map((subjek, index) => (
                <tr key={subjek.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 md:px-6 py-4 text-center font-medium text-gray-500">{index + 1}</td>
                  <td className="px-4 md:px-6 py-4 font-medium text-gray-900">{subjek.name}</td>
                  <td className="px-4 md:px-6 py-4 text-center text-gray-600">{subjek.code}</td>
                  <td className="px-4 md:px-6 py-4 text-center text-gray-600 truncate max-w-[100px]">{subjek.duration}</td>
                  <td className="px-4 md:px-6 py-4 text-center text-gray-600">{subjek.languages.join(', ')}</td>
                  <td className="px-4 py-4 text-center text-green-600">
                    {subjek.types.teori && <Check className="w-4 h-4 mx-auto" />}
                  </td>
                  <td className="px-4 py-4 text-center text-green-600">
                    {subjek.types.lisan && <Check className="w-4 h-4 mx-auto" />}
                  </td>
                  <td className="px-4 py-4 text-center text-green-600">
                    {subjek.types.praktikal && <Check className="w-4 h-4 mx-auto" />}
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => handleOpenModal(subjek)} className="p-2 text-gray-400 hover:text-action-teal hover:bg-teal-50 rounded-lg transition-colors" title="Kemaskini">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(subjek.id)} className="p-2 text-gray-400 hover:text-alert-red hover:bg-red-50 rounded-lg transition-colors" title="Padam">
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
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col my-auto max-h-[96vh] overflow-hidden"
          >
            <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-[15px] text-gray-900">{editingId ? 'Kemaskini Profil Subjek' : 'Tambah Profil Subjek'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 md:p-5 flex-1 flex flex-col bg-white overflow-y-auto custom-scrollbar">
              <div className="flex gap-2 border-b border-gray-100 mb-4 overflow-x-auto">
                <button 
                  className={`px-3 py-1.5 text-xs font-bold border-b-2 transition-colors ${activeTab === 'EN' ? 'border-action-teal text-action-teal' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  onClick={() => setActiveTab('EN')}
                >
                  English
                </button>
                <button 
                  className={`px-3 py-1.5 text-xs font-bold border-b-2 transition-colors ${activeTab === 'BM' ? 'border-action-teal text-action-teal' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  onClick={() => setActiveTab('BM')}
                >
                  B.Malaysia
                </button>
              </div>

              <div className="space-y-4 mb-4 flex-1">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nama Subjek <span className="text-brand-red">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-xs focus:border-action-teal focus:ring-1 focus:ring-action-teal/20 outline-none transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Kod Subjek <span className="text-brand-red">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-xs focus:border-action-teal focus:ring-1 focus:ring-action-teal/20 outline-none transition-all uppercase placeholder:normal-case"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Waktu Subjek <span className="text-brand-red">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-xs focus:border-action-teal focus:ring-1 focus:ring-action-teal/20 outline-none transition-all"
                      placeholder="e.g. 14 JAM"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-md p-3 space-y-3 bg-gray-50/30">
                    <label className="block text-xs font-bold text-gray-700 border-b border-gray-200 pb-2">
                      Subjek Tersedia Untuk <span className="text-brand-red">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={formData.availableFor.youth} onChange={() => handleCheckbox('availableFor', 'youth')} className="rounded text-action-teal focus:ring-action-teal w-3.5 h-3.5 border-gray-300" /> Youth
                      </label>
                      <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={formData.availableFor.vad} onChange={() => handleCheckbox('availableFor', 'vad')} className="rounded text-action-teal focus:ring-action-teal w-3.5 h-3.5 border-gray-300" /> VAD + Ordinary
                      </label>
                      <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={formData.availableFor.private} onChange={() => handleCheckbox('availableFor', 'private')} className="rounded text-action-teal focus:ring-action-teal w-3.5 h-3.5 border-gray-300" /> Private
                      </label>
                      <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={formData.availableFor.gov} onChange={() => handleCheckbox('availableFor', 'gov')} className="rounded text-action-teal focus:ring-action-teal w-3.5 h-3.5 border-gray-300" /> Government
                      </label>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-md p-3 space-y-3 bg-gray-50/30">
                    <label className="block text-xs font-bold text-gray-700 border-b border-gray-200 pb-2">
                      Bahasa Subjek <span className="text-brand-red">*</span>
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={formData.languages.bc} onChange={() => handleCheckbox('languages', 'bc')} className="rounded text-action-teal focus:ring-action-teal w-3.5 h-3.5 border-gray-300" /> BC
                      </label>
                      <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={formData.languages.bi} onChange={() => handleCheckbox('languages', 'bi')} className="rounded text-action-teal focus:ring-action-teal w-3.5 h-3.5 border-gray-300" /> BI
                      </label>
                      <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={formData.languages.bm} onChange={() => handleCheckbox('languages', 'bm')} className="rounded text-action-teal focus:ring-action-teal w-3.5 h-3.5 border-gray-300" /> BM
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-md p-3 space-y-3 bg-gray-50/30">
                    <label className="block text-xs font-bold text-gray-700 border-b border-gray-200 pb-2">
                      Jenis Subjek (Peperiksaan) <span className="text-brand-red">*</span>
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={formData.types.teori} onChange={() => handleCheckbox('types', 'teori')} className="rounded text-action-teal focus:ring-action-teal w-3.5 h-3.5 border-gray-300" /> Teori
                      </label>
                      <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={formData.types.lisan} onChange={() => handleCheckbox('types', 'lisan')} className="rounded text-action-teal focus:ring-action-teal w-3.5 h-3.5 border-gray-300" /> Lisan
                      </label>
                      <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={formData.types.praktikal} onChange={() => handleCheckbox('types', 'praktikal')} className="rounded text-action-teal focus:ring-action-teal w-3.5 h-3.5 border-gray-300" /> Praktikal
                      </label>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-md p-3 space-y-3 bg-gray-50/30">
                    <label className="block text-xs font-bold text-gray-700 border-b border-gray-200 pb-2">
                      Skala Skor Subjek <span className="text-brand-red">*</span>
                    </label>
                    <div className="flex justify-between gap-2">
                      <div className="flex flex-col gap-1 items-center">
                        <span className="text-[10px] uppercase font-bold text-gray-500">Teori</span>
                        <div className="flex items-center gap-1">
                          <input type="text" className="w-10 border border-gray-300 rounded px-1.5 py-1 text-xs text-center outline-none focus:border-action-teal" value={formData.scores.teori} onChange={e => handleScoreChange('teori', e.target.value)} />
                          <span className="text-xs text-gray-400">/100</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 items-center">
                        <span className="text-[10px] uppercase font-bold text-gray-500">Lisan</span>
                        <div className="flex items-center gap-1">
                          <input type="text" className="w-10 border border-gray-300 rounded px-1.5 py-1 text-xs text-center outline-none focus:border-action-teal" value={formData.scores.lisan} onChange={e => handleScoreChange('lisan', e.target.value)} />
                          <span className="text-xs text-gray-400">/40</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 items-center">
                        <span className="text-[10px] uppercase font-bold text-gray-500">Praktikal</span>
                        <div className="flex items-center gap-1">
                          <input type="text" className="w-10 border border-gray-300 rounded px-1.5 py-1 text-xs text-center outline-none focus:border-action-teal" value={formData.scores.praktikal} onChange={e => handleScoreChange('praktikal', e.target.value)} />
                          <span className="text-xs text-gray-400">/60</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Subjek Untuk Pembaharuan <span className="text-brand-red">*</span>
                    </label>
                    <div className="flex items-center gap-4 mt-2">
                      <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                        <input type="radio" name="renewal" checked={formData.renewal === 'ya'} onChange={() => setFormData(prev => ({ ...prev, renewal: 'ya' }))} className="text-action-teal focus:ring-action-teal w-3.5 h-3.5 border-gray-300" /> Ya
                      </label>
                      <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                        <input type="radio" name="renewal" checked={formData.renewal === 'tidak'} onChange={() => setFormData(prev => ({ ...prev, renewal: 'tidak' }))} className="text-action-teal focus:ring-action-teal w-3.5 h-3.5 border-gray-300" /> Tidak
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Tarikh Luput Sijil <span className="text-brand-red">*</span>
                    </label>
                    <select 
                      className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-xs focus:border-action-teal focus:ring-1 focus:ring-action-teal/20 outline-none transition-all bg-white"
                      value={formData.expiry}
                      onChange={(e) => setFormData(prev => ({ ...prev, expiry: e.target.value }))}
                    >
                      <option value="Tiada">Tiada</option>
                      <option value="1 Tahun">1 Tahun</option>
                      <option value="2 Tahun">2 Tahun</option>
                      <option value="3 Tahun">3 Tahun</option>
                    </select>
                  </div>
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
