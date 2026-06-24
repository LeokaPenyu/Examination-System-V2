import React from 'react';
import { CandidateTable } from './CandidateTable';
import { ApplicationFormState, Candidate } from '../types';
import { MockExam } from '../data/mockExams';
import { useLanguage } from '../context/LanguageContext';
import { ExamStatus } from '../types';
import { isInstructorEligible } from '../utils/certificateUtils';
import { 
  Building2, 
  CheckCircle2,
  ChevronLeft, 
  FileText, 
  Globe, 
  MapPin, 
  Save, 
  Send, 
  Stethoscope, 
  UserSquare2,
  AlertTriangle,
  XCircle,
  UserCheck
} from 'lucide-react';

interface ApplicationFormProps {
  initialExamType?: string | null;
  goBack: () => void;
  onSubmit: (exam: MockExam) => void;
  onSaveDraft: (exam: MockExam) => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ initialExamType, goBack, onSubmit, onSaveDraft }) => {
  const { t } = useLanguage();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [form, setForm] = React.useState<ApplicationFormState>({
    district: '',
    organizationName: '',
    categoryVAD: false,
    categoryPrivate: false,
    examAddress: '',
    trainingOfficerName: '',
    trainingOfficerId: '',
    trainingOfficerAddress: '',
    examDate: '',
    subject: '',
    languageBM: false,
    languageBI: false,
    languageBC: false,
    paymentDescription: '',
    attachment: undefined,
    candidates: [],
    jurulatih: [],
    penyelia: [],
    pemeriksa: [],
  });

  const [confirmDialog, setConfirmDialog] = React.useState<{message: string, onConfirm: () => void} | null>(null);
  const [alertDialog, setAlertDialog] = React.useState<{message: string, onClose?: () => void} | null>(null);

  const [newJurulatih, setNewJurulatih] = React.useState({ name: '', icNumber: '', address: '', warrantNumber: '', certExpiryDate: '' });
  const [newPenyelia, setNewPenyelia] = React.useState({ name: '', icNumber: '' });
  const [newPemeriksa, setNewPemeriksa] = React.useState({ name: '', address: '', warrantNumber: '', certExpiryDate: '' });

  React.useEffect(() => {
    if (initialExamType) {
      if (initialExamType.includes(' - ')) {
        const [date, subject] = initialExamType.split(' - ');
        setForm(prev => ({ ...prev, examDate: date, subject: subject.trim() }));
      } else {
        // "Biasas" are just '700/1' etc based on the array text id from ExamTypeSelection
        // In ExamTypeSelection, it's just '700/1', '700/2', etc. So that is the subject.
        setForm(prev => ({ ...prev, subject: initialExamType }));
      }
    }
  }, [initialExamType]);

  const updateJurulatih = (id: string, field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      jurulatih: prev.jurulatih.map(j => (j && j.id === id) ? { ...j, [field]: value } : j)
    }));
  };
  const addJurulatihRow = () => setForm(prev => ({ ...prev, jurulatih: [...prev.jurulatih, { id: Math.random().toString(36).substr(2, 9), name: '', icNumber: '', address: '', warrantNumber: '', certExpiryDate: '' }] }));
  const removeJurulatih = (id: string) => setForm(prev => ({ ...prev, jurulatih: prev.jurulatih.filter(j => j && j.id !== id) }));

  const updatePenyelia = (id: string, field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      penyelia: prev.penyelia.map(p => (p && p.id === id) ? { ...p, [field]: value } : p)
    }));
  };
  const addPenyeliaRow = () => setForm(prev => ({ ...prev, penyelia: [...prev.penyelia, { id: Math.random().toString(36).substr(2, 9), name: '', icNumber: '' }] }));
  const removePenyelia = (id: string) => setForm(prev => ({ ...prev, penyelia: prev.penyelia.filter(p => p && p.id !== id) }));

  const updatePemeriksa = (id: string, field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      pemeriksa: prev.pemeriksa.map(p => (p && p.id === id) ? { ...p, [field]: value } : p)
    }));
  };
  const addPemeriksaRow = () => setForm(prev => ({ ...prev, pemeriksa: [...prev.pemeriksa, { id: Math.random().toString(36).substr(2, 9), name: '', address: '', warrantNumber: '', certExpiryDate: '' }] }));
  const removePemeriksa = (id: string) => setForm(prev => ({ ...prev, pemeriksa: prev.pemeriksa.filter(p => p && p.id !== id) }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setAlertDialog({ message: 'Saiz fail melebihi 5MB.' });
        return;
      }
      setForm(prev => ({
        ...prev,
        attachment: {
          name: file.name,
          size: `${(file.size / 1024).toFixed(0)} KB`,
          file: file
        }
      }));
    }
  };

  const handleInputChange = (field: keyof ApplicationFormState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const getDistrictCode = (districtName: string): string => {
    const defaultCode = districtName ? districtName.substring(0, 3).toUpperCase() : 'XXX';
    if (!districtName) return defaultCode;

    const mapping: Record<string, string> = {
      'BETONG': 'BTG',
      'BINTULU': 'BTU',
      'CAWANGAN': 'CAW',
      'KAPIT': 'KPT',
      'KUCHING': 'KCH',
      'LIMBANG': 'LBG',
      'LUNDU': 'LDU',
      'MARUDI': 'MRD',
      'MIRI': 'MYY',
      'SAMARAHAN': 'SHN',
    };
    
    const normalized = districtName.toUpperCase().trim();
    return mapping[normalized] || defaultCode;
  };

  const generateNewExam = (status: ExamStatus): MockExam => {
    const id = `EXAM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const districtCode = getDistrictCode(form.district);
    const regNo = `${districtCode}/2026/${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    
    // Map candidates to match ExamSummaryView/MockExam expected format
    const mappedCandidates = form.candidates.map(c => ({
      id: c.id,
      name: c.name,
      idNo: c.icNumber,
      membershipNo: c.membershipId,
      isMember: c.isMember || (c.membershipId ? c.membershipId.trim() !== '' : false),
      attendance: c.attendance || { theory: false, oral: false, practical: false }
    }));

    return {
      id,
      no: Math.floor(Math.random() * 100) + 10,
      regNo,
      district: form.district.toUpperCase() || 'DAERAH',
      date: formattedDate,
      fee: mappedCandidates.reduce((acc, c) => acc + (c.isMember ? 2 : 14), 0),
      candidatesCount: mappedCandidates.length,
      subject: '800/2 - Pertolongan Cemas Asas dan CPR',
      updated: 'Tidak',
      status,
      organization: form.organizationName || 'Organisasi',
      unitName: form.organizationName || 'Unit',
      category: form.categoryPrivate ? 'Private' : (form.categoryVAD ? 'VAD' : 'Unknown'),
      courseStart: '10/05/2026',
      courseEnd: '12/05/2026',
      examDate: formattedDate,
      deadline: '20/05/2026',
      address: form.examAddress || 'Alamat Peperiksaan',
      candidates: mappedCandidates,
      attachment: form.attachment ? {
        name: form.attachment.name,
        size: form.attachment.size
      } : undefined
    };
  };

  const handleSaveDraft = () => {
    if (!form.district || !form.organizationName) {
      setAlertDialog({ message: 'Sila lengkapkan maklumat wajib (Daerah & Nama Organisasi).' });
      return;
    }
    const newExam = generateNewExam(ExamStatus.DRAFT);
    onSaveDraft(newExam);
    setAlertDialog({ message: 'Permohonan telah disimpan sebagai draf.' });
  };

  const handleSubmit = () => {
    const missingFields = [];
    if (!form.district) missingFields.push('Daerah');
    if (!form.organizationName) missingFields.push('Nama Organisasi');
    if (!form.examAddress) missingFields.push('Alamat Peperiksaan');
    if (!form.trainingOfficerName) missingFields.push('Nama Pegawai');

    if (missingFields.length > 0) {
      setAlertDialog({ message: `Sila lengkapkan maklumat berikut: ${missingFields.join(', ')}` });
      return;
    }
    if (form.candidates.length === 0) {
      setAlertDialog({ message: 'Sila tambah sekurang-kurangnya seorang calon.' });
      return;
    }
    setConfirmDialog({
      message: 'Hantar Permohonan ini untuk pengesahan?',
      onConfirm: () => {
        const newExam = generateNewExam(ExamStatus.PENDING_VERIFICATION);
        console.log('Submitting new exam:', newExam);
        onSubmit(newExam);
      }
    });
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-20 px-2 sm:px-4 md:px-0">
      {/* Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-sm w-full mx-auto p-4 md:p-6 space-y-6">
            <h3 className="text-lg font-bold text-charcoal">{confirmDialog.message}</h3>
            <div className="flex gap-3 justify-end pt-4">
              <button 
                onClick={() => setConfirmDialog(null)}
                className="px-4 md:px-6 py-2 border border-gray-200 text-gray-600 bg-gray-50 rounded shadow-sm font-bold text-sm hover:bg-gray-100"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog(null);
                }}
                className="btn-primary shadow-md text-sm justify-center"
              >
                Teruskan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Dialog */}
      {alertDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-sm w-full mx-auto p-4 md:p-6 space-y-6 border-t-4 border-action-teal">
            <h3 className="text-xl font-black text-action-teal uppercase flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6" />
              Notifikasi
            </h3>
            <p className="text-gray-600 font-medium">{alertDialog.message}</p>
            <div className="flex justify-end pt-4">
              <button 
                onClick={() => {
                  if (alertDialog.onClose) alertDialog.onClose();
                  setAlertDialog(null);
                }}
                className="btn-primary shadow-md text-sm px-4 md:px-8 justify-center"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 border-b border-gray-200 pb-4 mb-4">
        <button onClick={goBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
          <ChevronLeft className="w-6 h-6 text-gray-500 group-hover:text-charcoal" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('registrationTitle')}</h1>
          <p className="text-gray-500 text-sm">
            {t('systemSubtitle').split('EASY').map((part, i, arr) => (
              <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 && <span className="notranslate" translate="no">EASY</span>}
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Form Header */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-5">
          <h1 className="text-xl font-bold text-charcoal mb-3">Borang Permohonan untuk Peperiksaan</h1>
          <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500">No. Pendaftaran:</span>
              <span className="font-bold text-charcoal px-2 py-0.5 bg-gray-100 rounded">(Akan dijana)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Status:</span>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-[4px] text-xs font-bold uppercase tracking-wider">Baru</span>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 md:p-8 space-y-10">

          <div className="bg-brand-red/[0.02] border-l-4 border-brand-red shadow-sm border-y border-r border-gray-100 rounded-r-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-red" />
              <h4 className="font-bold text-brand-red text-sm uppercase tracking-widest">{t('registrationInstructions')}</h4>
            </div>
            <ul className="text-xs text-charcoal/70 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 list-disc pl-5 leading-relaxed font-medium">
              <li>{t('instructionDate')}</li>
              <li>{t('instructionFee')}</li>
              <li>{t('instructionCsv')}</li>
            </ul>
          </div>

          {/* Section 1: Maklumat Cawangan */}
          <section className="space-y-4">
            <h2 className="text-[14px] font-bold text-charcoal border-b border-gray-100 pb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-action-teal" />
              1. {t('organizerInfo')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{t('districtLabel')} <span className="text-brand-red">*</span></label>
                <select 
                  value={form.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[6px] text-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 outline-none transition-all font-medium"
                >
                  <option value="">{t('selectDistrict')}</option>
                  <option value="Kuching">Kuching</option>
                  <option value="Sibu">Sibu</option>
                  <option value="Miri">Miri</option>
                  <option value="Bintulu">Bintulu</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{t('categoryLabel')} <span className="text-brand-red">*</span></label>
                <div className="flex flex-wrap gap-4 md:gap-8 items-center px-1 pt-1 h-[40px]">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        name="categoryVAD" 
                        checked={form.categoryVAD}
                        onChange={(e) => handleInputChange('categoryVAD', e.target.checked)}
                        className="w-4 h-4 text-action-teal accent-action-teal rounded cursor-pointer" 
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-600 group-hover:text-charcoal transition-colors">VAD+ Ordinary</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        name="categoryPrivate" 
                        checked={form.categoryPrivate}
                        onChange={(e) => handleInputChange('categoryPrivate', e.target.checked)}
                        className="w-4 h-4 text-action-teal accent-action-teal rounded cursor-pointer" 
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-600 group-hover:text-charcoal transition-colors">Private</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{t('orgNameLabel')} <span className="text-brand-red">*</span></label>
              <input 
                type="text" 
                value={form.organizationName}
                onChange={(e) => handleInputChange('organizationName', e.target.value)}
                placeholder={t('orgNamePlaceholder')} 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[6px] text-sm outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all font-medium" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{t('examAddressLabel')} <span className="text-brand-red">*</span></label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-4 w-4 h-4 text-gray-400 group-focus-within:text-brand-red transition-colors" />
                <textarea 
                  rows={3}
                  value={form.examAddress}
                  onChange={(e) => handleInputChange('examAddress', e.target.value)}
                  placeholder={t('examAddressPlaceholder')} 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-[6px] text-sm outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all font-medium" 
                />
              </div>
            </div>
          </section>

          {/* Section 2: Jurulatih / Pegawai */}
          <section className="space-y-4">
            <h2 className="text-[14px] font-bold text-charcoal border-b border-gray-100 pb-2 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-action-teal" />
              2. {t('officerInfo')} & Maklumat Peperiksaan
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{t('officerNameLabel')} <span className="text-brand-red">*</span></label>
                <div className="relative group">
                  <UserSquare2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-red transition-colors" />
                  <input 
                    type="text" 
                    value={form.trainingOfficerName}
                    onChange={(e) => handleInputChange('trainingOfficerName', e.target.value)}
                    placeholder={t('fullName')} 
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-[6px] text-sm outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all font-medium" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Alamat Pegawai <span className="text-brand-red">*</span></label>
                <textarea 
                  rows={2}
                  value={form.trainingOfficerAddress}
                  onChange={(e) => handleInputChange('trainingOfficerAddress', e.target.value)}
                  placeholder="Alamat Pegawai" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[6px] text-sm outline-none focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all font-medium" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 pt-6 border-t border-gray-100 mt-2">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Tarikh Peperiksaan <span className="text-brand-red">*</span></label>
                 {(!initialExamType || !initialExamType.includes(' - ')) ? (
                   <input 
                     type="date"
                     value={form.examDate}
                     onChange={(e) => handleInputChange('examDate', e.target.value)}
                     min={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                     className="w-full p-3 bg-white border border-gray-200 rounded-[6px] text-sm focus:ring-2 focus:ring-brand-red/10 focus:border-brand-red/30 transition-all font-medium"
                   />
                 ) : (
                   <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[6px] text-sm font-bold text-charcoal">{form.examDate}</div>
                 )}
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Subjek <span className="text-brand-red">*</span></label>
                  <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[6px] text-sm font-bold text-charcoal">{form.subject}</div>
               </div>
            </div>
          </section>

          {/* Section 3: Senarai Calon Table */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h2 className="text-[14px] font-bold text-charcoal flex items-center gap-2">
                <Globe className="w-4 h-4 text-action-teal" />
                3. Senarai Calon
              </h2>
            </div>
            <div className="pt-4">
               <CandidateTable 
                candidates={form.candidates} 
                setCandidates={(candidates) => handleInputChange('candidates', candidates)} 
                examDate={form.examDate}
                subjectCode={form.subject}
              />
            </div>
          </section>

          {/* Section 4: Bahas & Lampiran */}
          <section className="space-y-4 pb-8">
            <h2 className="text-[14px] font-bold text-charcoal border-b border-gray-100 pb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-action-teal" />
              4. Bahasa Peperiksaan & Bukti Pembayaran
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-2">
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Pilihan bahasa dalam peperiksaan <span className="text-brand-red">*</span></label>
                  <div className="flex flex-wrap gap-4 md:gap-6 px-1 items-center">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 accent-action-teal border-gray-300 rounded cursor-pointer" checked={form.languageBM} onChange={(e) => handleInputChange('languageBM', e.target.checked)} />
                      <span className="font-bold text-sm text-charcoal">BM</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 accent-action-teal border-gray-300 rounded cursor-pointer" checked={form.languageBI} onChange={(e) => handleInputChange('languageBI', e.target.checked)} />
                      <span className="font-bold text-sm text-charcoal">BI</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 accent-action-teal border-gray-300 rounded cursor-pointer" checked={form.languageBC} onChange={(e) => handleInputChange('languageBC', e.target.checked)} />
                      <span className="font-bold text-sm text-charcoal">BC</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-3 p-5 bg-gray-50 rounded-[8px] border border-gray-200">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Bilangan Calon</label>
                  <div className="space-y-3 text-sm text-charcoal">
                    <div className="flex justify-between border-b border-gray-200/60 pb-3">
                      <span className="text-gray-500">Jumlah Calon:</span>
                      <span className="font-bold text-base">{form.candidates.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 pl-2 text-xs">• Ahli:</span>
                      <span className="font-bold">{form.candidates.filter(c => c.isMember || (c.membershipId && c.membershipId.trim() !== '')).length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 pl-2 text-xs">• Bukan Ahli:</span>
                      <span className="font-bold">{form.candidates.length - form.candidates.filter(c => c.isMember || (c.membershipId && c.membershipId.trim() !== '')).length}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2 p-5 bg-gray-50/80 rounded-[8px] border border-gray-200 text-xs text-charcoal">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Ringkasan Pembayaran</label>
                    <p className="flex justify-between items-center"><span>Bayaran yuran peperiksaan (Ahli)<br/><span className="text-gray-500 mt-0.5 inline-block">{form.candidates.filter(c => c.isMember || (c.membershipId && c.membershipId.trim() !== '')).length} x RM 2.00 / calon</span></span> <span className="font-bold text-sm">RM {(form.candidates.filter(c => c.isMember || (c.membershipId && c.membershipId.trim() !== '')).length * 2).toFixed(2)}</span></p>
                    <div className="h-px w-full bg-gray-200/50 my-2"></div>
                    <p className="flex justify-between items-center"><span>Bayaran yuran peperiksaan (Bukan Ahli)<br/><span className="text-gray-500 mt-0.5 inline-block">{form.candidates.length - form.candidates.filter(c => c.isMember || (c.membershipId && c.membershipId.trim() !== '')).length} x RM 14.00 / calon</span></span> <span className="font-bold text-sm">RM {((form.candidates.length - form.candidates.filter(c => c.isMember || (c.membershipId && c.membershipId.trim() !== '')).length) * 14).toFixed(2)}</span></p>
                    <div className="border-t border-gray-200/80 pt-3 mt-3 flex justify-between uppercase text-[11px] font-bold items-center">
                      <span>Jumlah bayaran</span> 
                      <span className="text-action-teal text-[15px]">RM {((form.candidates.filter(c => c.isMember || (c.membershipId && c.membershipId.trim() !== '')).length * 2) + ((form.candidates.length - form.candidates.filter(c => c.isMember || (c.membershipId && c.membershipId.trim() !== '')).length) * 14)).toFixed(2)}</span>
                    </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{t('paymentProofLabel')} <span className="text-brand-red">*</span></label>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-[12px] p-4 md:p-6 text-center space-y-3 transition-all cursor-pointer group ${
                      form.attachment 
                        ? 'border-green-300 bg-green-50/30' 
                        : 'border-gray-200 bg-gray-50/50 hover:border-action-teal/40 hover:bg-action-teal/[0.02]'
                    }`}
                  >
                    {form.attachment ? (
                      <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto" />
                    ) : (
                      <FileText className="w-8 h-8 text-gray-300 mx-auto group-hover:text-action-teal group-hover:scale-110 transition-all" />
                    )}
                    <div className="space-y-1">
                      <p className="text-[13px] font-bold text-charcoal">
                        {form.attachment ? form.attachment.name : t('uploadReceipt')}
                      </p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                        {form.attachment ? form.attachment.size : 'PDF, JPG, PNG (MAX 5MB)'}
                      </p>
                    </div>
                  </div>
                  <input 
                    type="text" 
                    placeholder={t('paymentDescriptionPlaceholder')} 
                    value={form.paymentDescription}
                    onChange={(e) => handleInputChange('paymentDescription', e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[6px] text-sm outline-none focus:ring-2 focus:ring-action-teal/10 font-medium" 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Action Buttons at Bottom */}
          <div className="bg-gray-50 border-t border-gray-200 p-4 md:px-8 py-5 flex flex-wrap gap-3 items-center justify-end -mx-6 md:-mx-8 -mb-6 md:-mb-8 mt-10">
            <button 
              onClick={goBack}
              className="w-full md:w-auto px-4 md:px-8 py-3 text-sm font-bold text-gray-400 hover:text-charcoal transition-colors tracking-wide uppercase"
            >
              {t('back')}
            </button>
            <button 
              onClick={handleSaveDraft}
              className="btn-secondary w-full md:w-auto h-12 flex justify-center items-center px-4 md:px-8 text-sm shadow-sm uppercase tracking-wide"
            >
              <Save className="w-4 h-4 mr-2" />
              {t('save')}
            </button>
            <button 
              onClick={handleSubmit}
              className="btn-primary w-full md:w-auto h-12 px-12 flex justify-center items-center shadow-lg shadow-action-teal/10 text-sm uppercase tracking-widest"
            >
              <Send className="w-4 h-4 mr-2" />
              {t('submit')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
