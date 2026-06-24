import React from 'react';
import { Candidate } from '../types';
import { Plus, Trash2, Upload, Users, Search, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const globalCandidates = [
  { id: '1', nama: 'MIGUEL SILVA', noKp: '970406-13-5288', noAhli: '' },
  { id: '2', nama: 'ALICE SANTOS', noKp: '880314-13-5062', noAhli: '' },
  { id: '3', nama: 'ARTHUR OLIVEIRA', noKp: '751231-13-5832', noAhli: '' },
  { id: '4', nama: 'SOFIA COSTA', noKp: '810905-13-5538', noAhli: '' },
  { id: '5', nama: 'HEITOR PEREIRA', noKp: '760823-13-5558', noAhli: '' },
  { id: '6', nama: 'LAURA FERREIRA', noKp: '771102-13-5076', noAhli: '' },
  { id: '7', nama: 'BERNARDO ALMEIDA', noKp: '690316-13-5552', noAhli: '' },
  { id: '8', nama: 'VALENTINA LIMA', noKp: '921101-13-5446', noAhli: '' },
  { id: '9', nama: 'DAVI RODRIGUES', noKp: '900924-13-6359', noAhli: '' },
  { id: '10', nama: 'HELENA SOUZA', noKp: '800305-13-5332', noAhli: '13-0422-00014330' },
];

interface CandidateTableProps {
  candidates: Candidate[];
  setCandidates: (candidates: Candidate[]) => void;
  examDate?: string;
  subjectCode?: string;
}

export const CandidateTable: React.FC<CandidateTableProps> = ({ candidates, setCandidates, examDate = '', subjectCode = '' }) => {
  const { t } = useLanguage();
  const [isSearchModalOpen, setIsSearchModalOpen] = React.useState(false);
  const [searchName, setSearchName] = React.useState('');
  const [searchIc, setSearchIc] = React.useState('');
  const [searchMembershipId, setSearchMembershipId] = React.useState('');

  const filteredGlobalCandidates = globalCandidates.filter(c => 
    c.nama.toLowerCase().includes(searchName.toLowerCase()) &&
    c.noKp.includes(searchIc) &&
    c.noAhli.includes(searchMembershipId)
  );

  const handleSelectCandidate = (c: typeof globalCandidates[0]) => {
    // Check if candidate is already in the table
    if (candidates.some(existing => existing.icNumber === c.noKp)) {
      alert('Calon ini telah berada dalam senarai.');
      return;
    }
    
    const newCandidate: Candidate = {
      id: Math.random().toString(36).substr(2, 9),
      name: c.nama,
      icNumber: c.noKp,
      membershipId: c.noAhli,
      membershipCategory: c.noAhli ? 'Member' : 'Public',
      status: 'Pending',
      isMember: c.noAhli ? true : false,
      attendance: {
        theory: false,
        oral: false,
        practical: false
      }
    };
    setCandidates([...candidates, newCandidate]);
    setIsSearchModalOpen(false);
    setSearchName('');
    setSearchIc('');
    setSearchMembershipId('');
  };

  const addRow = () => {
    const newCandidate: Candidate = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      icNumber: '',
      membershipId: '',
      status: 'Pending',
      isMember: false,
      attendance: {
        theory: false,
        oral: false,
        practical: false
      }
    };
    setCandidates([...candidates, newCandidate]);
  };

  const removeRow = (id: string) => {
    setCandidates(candidates.filter((c) => c.id !== id));
  };

  const updateCandidate = (id: string, field: keyof Candidate, value: string) => {
    setCandidates(
      candidates.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const newCandidates: Candidate[] = lines
        .slice(1) // Skip header
        .filter((line) => line.trim() !== '')
        .map((line) => {
          const [name, icNumber, membershipId, membershipCategory] = line.split(',').map((s) => s.trim());
          const cat = ['Cadet', 'VAD', 'Member', 'Public'].includes(membershipCategory) ? (membershipCategory as any) : 'Public';
          return {
            id: Math.random().toString(36).substr(2, 9),
            name: name || '',
            icNumber: icNumber || '',
            membershipId: membershipId || '',
            membershipCategory: cat,
            status: 'Pending',
            isMember: (membershipId || '').trim() !== '',
            attendance: {
              theory: false,
              oral: false,
              practical: false
            }
          };
        });
      setCandidates([...candidates, ...newCandidates]);
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  const today = new Date().toISOString().split('T')[0];
  let cadetCount = 0;
  let vadCount = 0;
  let memberCount = 0;
  let publicCount = 0;
  let totalFee = 0;
  
  // Need to import calculateCandidateFee
  // I will add the import next
  candidates.forEach((c) => {
    const cat = c.membershipCategory || 'Public';
    if (cat === 'Cadet') cadetCount++;
    else if (cat === 'VAD') vadCount++;
    else if (cat === 'Member') memberCount++;
    else publicCount++;
    
    // We haven't dynamically imported calculateCandidateFee here but we'll do it via another file edit
    // Instead of importing, let's just do a basic calculation here based on the same rules for simplicity
    
    // Fallback if import is not there
    let baseFee = 2; // Cadet, VAD, Member default 2
    if (cat === 'Public') baseFee = 14;
    
    const msPerDay = 24 * 60 * 60 * 1000;
    const isLate = Math.abs((new Date(examDate).getTime() - new Date(today).getTime()) / msPerDay) < 9;
    
    let isOnlineExam = subjectCode.includes('EXD'); // Just simple check
    
    if (isOnlineExam) {
      if (isLate) baseFee = 14;
      else baseFee = 10;
    }
    
    // For now use default rules
    totalFee += baseFee;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-red/5 rounded-lg border border-brand-red/10">
            <Users className="w-5 h-5 text-brand-red" />
          </div>
          <h3 className="text-sm font-bold text-charcoal tracking-tight">
            {t('candidateList')}
          </h3>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
          <button onClick={() => setIsSearchModalOpen(true)} className="bg-rose-50 border border-brand-red/20 text-brand-red hover:bg-rose-100 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 flex-1 justify-center sm:flex-none h-10 px-5 rounded-[6px] transition-colors">
            <Search className="w-3.5 h-3.5" />
            {t('searchExistingCandidate')}
          </button>
          <label className="bg-rose-50 border border-brand-red/20 text-brand-red hover:bg-rose-100 text-[11px] font-bold uppercase tracking-wider cursor-pointer flex items-center gap-2 flex-1 justify-center sm:flex-none h-10 px-5 rounded-[6px] transition-colors">
            <Upload className="w-3.5 h-3.5" />
            {t('uploadCsv')}
            <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
          </label>
          <button onClick={addRow} className="bg-action-teal hover:bg-teal-700 text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 flex-1 justify-center sm:flex-none h-10 px-5 rounded-[6px] transition-all shadow-sm">
            <Plus className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            {t('addCandidate')}
          </button>
        </div>
      </div>

      {isSearchModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-2xl w-full mx-auto flex flex-col max-h-[90vh]">
            <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-xl">
              <h3 className="font-bold text-lg text-gray-900">{t('candidateSearchTitle')}</h3>
              <button 
                onClick={() => setIsSearchModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 bg-gray-50 border-b border-gray-100 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{t('name')}</label>
                  <input type="text" value={searchName} onChange={e => setSearchName(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-[6px] outline-none focus:border-action-teal" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{t('icNumber')}</label>
                  <input type="text" value={searchIc} onChange={e => setSearchIc(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-[6px] outline-none focus:border-action-teal" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{t('membershipNumber')}</label>
                  <input type="text" value={searchMembershipId} onChange={e => setSearchMembershipId(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-[6px] outline-none focus:border-action-teal" />
                </div>
              </div>
            </div>

            <div className="overflow-auto p-4 bg-white flex-1 min-h-[300px]">
              <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-[10px] uppercase tracking-widest text-gray-500 font-bold border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 w-10">{t('select')}</th>
                    <th className="px-4 py-3">{t('bil')}</th>
                    <th className="px-4 py-3">{t('name')}</th>
                    <th className="px-4 py-3">{t('icNumber')}</th>
                    <th className="px-4 py-3">{t('membershipNumber')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredGlobalCandidates.length > 0 ? (
                    filteredGlobalCandidates.map((c, i) => (
                      <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <input type="radio" name="candidateSelect" onChange={() => handleSelectCandidate(c)} className="w-4 h-4 text-action-teal cursor-pointer" />
                        </td>
                        <td className="px-4 py-3 text-gray-400 font-bold">{i + 1}</td>
                        <td className="px-4 py-3 font-semibold text-charcoal">{c.nama}</td>
                        <td className="px-4 py-3">{c.noKp}</td>
                        <td className="px-4 py-3">{c.noAhli || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-4 md:py-8 text-center text-gray-400 italic">{t('noRecordFound')}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-end gap-3 px-4 md:px-6 py-4 border-t border-gray-100 bg-white">
               <button 
                 onClick={() => setIsSearchModalOpen(false)} 
                 className="px-4 md:px-6 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors shadow-sm"
               >
                 Batal
               </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto border border-gray-100 rounded-[8px] bg-white shadow-sm">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-gray-100/50 text-[10px] uppercase tracking-widest text-gray-500 font-bold border-b border-gray-100">
            <tr>
              <th className="px-3 py-3 w-10 text-center">X</th>
              <th className="px-3 py-3">{t('fullName')}</th>
              <th className="px-3 py-3 w-48">{t('icNumber')}</th>
              <th className="px-3 py-3 w-48">{t('membershipNumber')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {candidates.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 md:px-6 py-12 text-center text-gray-400 text-sm italic font-medium">
                  {t('noCandidates')}
                </td>
              </tr>
            ) : (
              candidates.map((c, index) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => removeRow(c.id)}
                      className="p-1 text-gray-400 hover:text-alert-red rounded-md transition-all font-bold text-lg"
                      title={t('delete')}
                    >
                      ×
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => updateCandidate(c.id, 'name', e.target.value)}
                      placeholder={t('fullName')}
                      className="w-full px-2 py-1.5 text-sm bg-transparent border-none outline-none focus:bg-white focus:ring-1 focus:ring-action-teal/40 rounded transition-all font-semibold text-charcoal"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={c.icNumber}
                      onChange={(e) => updateCandidate(c.id, 'icNumber', e.target.value)}
                      placeholder={t('icNumber')}
                      className="w-full px-2 py-1.5 text-sm bg-transparent border-none outline-none focus:bg-white focus:ring-1 focus:ring-action-teal/40 rounded transition-all font-medium text-charcoal"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={c.membershipId}
                      onChange={(e) => updateCandidate(c.id, 'membershipId', e.target.value)}
                      placeholder={t('exampleMembershipNo')}
                      className="w-full px-2 py-1.5 text-sm bg-transparent border-none outline-none focus:bg-white focus:ring-1 focus:ring-action-teal/40 rounded transition-all font-medium text-charcoal"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
