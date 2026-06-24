import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Edit, Trash2, X, Save, CalendarDays, Plus } from 'lucide-react';

interface Jadual {
  id: string;
  kodSubjek: string;
  namaSubjek: string;
  tarikhPeperiksaan: string;
}

const initialData: Jadual[] = [
  { id: '1', kodSubjek: 'CBFA1021', namaSubjek: 'Pertolongan Cemas Asas dan CPR', tarikhPeperiksaan: '26/10/2025' },
  { id: '2', kodSubjek: 'CHED1031', namaSubjek: 'Pendidikan Kesihatan Asas', tarikhPeperiksaan: '26/10/2025' },
  { id: '3', kodSubjek: 'CHNU1041', namaSubjek: 'Rawatan Rumah Asas', tarikhPeperiksaan: '26/10/2025' },
  { id: '4', kodSubjek: 'CERC1011', namaSubjek: 'Pendidikan Palang Merah/Bulan Sabit Merah dan Undang-undang Kemanusiaan Antarabangsa', tarikhPeperiksaan: '26/10/2025' },
  { id: '5', kodSubjek: 'CBFA1021', namaSubjek: 'Pertolongan Cemas Asas dan CPR', tarikhPeperiksaan: '26/10/2025' },
  { id: '6', kodSubjek: 'VBFA1021', namaSubjek: 'Pertolongan Cemas Asas dan CPR', tarikhPeperiksaan: '26/10/2025' },
  { id: '7', kodSubjek: 'VTME1081', namaSubjek: 'Kaedah Mengajar', tarikhPeperiksaan: '26/10/2025' },
  { id: '8', kodSubjek: 'VDRO1051', namaSubjek: 'Bantuan bencana & operasi menyelamat', tarikhPeperiksaan: '26/10/2025' },
  { id: '9', kodSubjek: 'VAAM1061', namaSubjek: 'Pentadbiran dan pengurusan', tarikhPeperiksaan: '26/10/2025' },
  { id: '10', kodSubjek: 'VAFA1072', namaSubjek: 'Pertolongan Cemas Lanjutan & CPR', tarikhPeperiksaan: '26/10/2025' },
];

export const JadualPeperiksaan: React.FC = () => {
  const [tahun, setTahun] = useState('2025');
  const [data, setData] = useState<Jadual[]>(initialData);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    subjek: '',
    tarikhPeperiksaan: ''
  });

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
  };

  const handleEdit = (item: Jadual) => {
    setEditingId(item.id);
    const dateParts = item.tarikhPeperiksaan.split('/');
    const formattedDate = dateParts.length === 3 ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}` : '';
    
    setFormData({
      subjek: `${item.kodSubjek} - ${item.namaSubjek}`,
      tarikhPeperiksaan: formattedDate
    });
    setIsModalOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      subjek: '',
      tarikhPeperiksaan: ''
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.subjek || !formData.tarikhPeperiksaan) {
      // Avoid alert in iframe
      return;
    }

    const subjekParts = formData.subjek.split(' - ');
    const kod = subjekParts[0] || '';
    const nama = subjekParts[1] || formData.subjek;
    
    const dateObj = new Date(formData.tarikhPeperiksaan);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    if (editingId) {
      setData(prev => prev.map(item => item.id === editingId ? {
        ...item,
        kodSubjek: kod,
        namaSubjek: nama,
        tarikhPeperiksaan: formattedDate
      } : item));
    } else {
      const newId = String(Math.max(...data.map(d => parseInt(d.id, 10)), 0) + 1);
      setData(prev => [...prev, {
        id: newId,
        kodSubjek: kod,
        namaSubjek: nama,
        tarikhPeperiksaan: formattedDate
      }]);
    }
    setIsModalOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-sm">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-sm">
        
        {/* Header */}
        <div className="p-4 md:p-6 flex justify-between items-center border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 text-brand-red rounded-lg">
              <CalendarDays className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-lg text-gray-900">Jadual Peperiksaan Pusat</h2>
          </div>
          <button 
            onClick={handleAddNew}
            className="bg-action-teal hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Tambah Jadual
          </button>
        </div>

        {/* Filter Section */}
        <div className="px-4 md:px-6 py-4 flex flex-wrap items-end gap-4 border-b border-gray-100 bg-gray-50/50">
          <div className="space-y-1.5 flex flex-col items-start">
            <label className="font-medium text-gray-700 text-xs">Tahun :</label>
            <select 
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-action-teal focus:border-action-teal w-32"
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm text-gray-700">
            <Search className="w-4 h-4 text-action-teal" /> Cari
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-6">
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 border-r border-gray-100 text-center w-12">No.</th>
                    <th className="px-4 py-3 border-r border-gray-100 uppercase">Kod Subjek</th>
                    <th className="px-4 py-3 border-r border-gray-100 uppercase">Nama Subjek</th>
                    <th className="px-4 py-3 border-r border-gray-100 uppercase text-center w-48 text-action-teal">Tarikh Peperiksaan</th>
                    <th className="px-4 py-3 text-center uppercase w-24">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {data.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 border-r border-gray-50 text-center text-gray-500 font-medium">{index + 1}</td>
                      <td className="px-4 py-3 border-r border-gray-50 text-gray-700">{item.kodSubjek}</td>
                      <td className="px-4 py-3 border-r border-gray-50 text-gray-900">{item.namaSubjek}</td>
                      <td className="px-4 py-3 border-r border-gray-50 text-center font-medium text-gray-700">{item.tarikhPeperiksaan}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleEdit(item)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-action-teal hover:bg-teal-50 transition-colors"
                            title="Kemaskini"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-alert-red hover:bg-red-50 transition-colors"
                            title="Padam"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-4 md:py-8 text-center text-gray-500 italic">
                        Tiada rekod dijumpai.
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
                {editingId ? 'Kemaskini Jadual' : 'Tambah Jadual'}
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
                  Subjek <span className="text-brand-red">*</span>
                </label>
                <select 
                  value={formData.subjek}
                  onChange={(e) => setFormData(prev => ({ ...prev, subjek: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-action-teal focus:ring-2 focus:ring-action-teal/20 outline-none transition-all bg-white"
                >
                  <option value="">-- Sila Pilih --</option>
                  <option value="CBFA1021 - Pertolongan Cemas Asas dan CPR">CBFA1021 - Pertolongan Cemas Asas dan CPR</option>
                  <option value="CHED1031 - Pendidikan Kesihatan Asas">CHED1031 - Pendidikan Kesihatan Asas</option>
                  <option value="CHNU1041 - Rawatan Rumah Asas">CHNU1041 - Rawatan Rumah Asas</option>
                  <option value="800/2 - Pertolongan Cemas Asas, CPR dan AED">800/2 - Pertolongan Cemas Asas, CPR dan AED</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tarikh Peperiksaan <span className="text-brand-red">*</span>
                </label>
                <input 
                  type="date" 
                  value={formData.tarikhPeperiksaan}
                  onChange={(e) => setFormData(prev => ({ ...prev, tarikhPeperiksaan: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-action-teal focus:ring-2 focus:ring-action-teal/20 outline-none transition-all bg-white"
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
    </motion.div>
  );
};
