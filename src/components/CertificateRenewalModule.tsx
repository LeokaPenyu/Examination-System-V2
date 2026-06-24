import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';
import { FileText, Save, CheckCircle2, ChevronLeft, Calendar, FileUp, Send, Printer, UserX, UserCheck, Plus, Trash2, X, Search, FileSearch, ArrowLeft, Edit2 } from 'lucide-react';

interface CertificateRenewalModuleProps {
  role: UserRole;
  onBack: () => void;
}

type AppStatus = 'Draf' | 'Dihantar' | 'Semakan Pengerusi' | 'Diluluskan' | 'Ditolak';

let globalSijilApps = [
  { id: 'S-7922', date: '21/05/2026', subject: 'Pembaharuan Sijil Asas', candidates: 12, status: 'Dihantar' },
  { id: 'S-7945', date: '22/05/2026', subject: 'Pembaharuan Sijil CPR', candidates: 5, status: 'Draf' },
  { id: 'S-7946', date: '23/05/2026', subject: 'Pembaharuan Sijil Asas', candidates: 20, status: 'Semakan Pengerusi' },
  { id: 'S-7950', date: '24/05/2026', subject: 'Pembaharuan Sijil Asas', candidates: 15, status: 'Diluluskan' },
];

export const CertificateRenewalModule: React.FC<CertificateRenewalModuleProps> = ({ role, onBack }) => {
  // We use local state to manage this specific application form's state. 
  // For demonstration, we'll auto-adjust the starting status based on the role to show the specific views,
  // or allow the status to transition naturally.
  
  const [applications, setApplications] = useState(globalSijilApps);
  const [currentAppId, setCurrentAppId] = useState<string | null>(null);
  const [viewState, setViewState] = useState<'list' | 'form' | 'summary'>('list');
  const initialStatus: AppStatus = role === UserRole.DEC ? 'Draf' : role === UserRole.SEC ? 'Dihantar' : 'Semakan Pengerusi';
  
  const [status, setStatus] = useState<AppStatus>(initialStatus);
  const [rejectReasonPopup, setRejectReasonPopup] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const [form, setForm] = useState({
    districtName: '',
    unitName: '',
    unitCategory: '',
    courseStart: '',
    courseEnd: '',
    ocName: '',
    ocAddress: '',
  });

  const [instructors, setInstructors] = useState<{ id: string; name: string; address: string; warrantNo: string; }[]>([]);
  
  const [participants, setParticipants] = useState<{ id: string; name: string; ic: string; memberNo: string; expiry: string; pStatus: string; isMember: boolean; }[]>([]);

  const [fileAttached, setFileAttached] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const visibleApplications = applications.filter(app => {
    if (role === UserRole.SEC) return app.status === 'Dihantar';
    if (role === UserRole.DEC) return true;
    if (role === UserRole.SEBC) return app.status === 'Semakan Pengerusi';
    return true;
  });

  useEffect(() => {
    // If role changes dynamically in dev, update initial status
    setStatus(role === UserRole.DEC ? 'Draf' : role === UserRole.SEC ? 'Dihantar' : 'Semakan Pengerusi');
  }, [role]);

  const membersCount = participants.filter(p => p.isMember).length;
  const nonMembersCount = participants.filter(p => !p.isMember).length;
  const totalFee = (membersCount * 10) + (nonMembersCount * 10);

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddInstructor = () => {
    setInstructors(prev => [...prev, { id: Date.now().toString(), name: '', address: '', warrantNo: '' }]);
  };

  const handleUpdateInstructor = (id: string, field: string, value: string) => {
    setInstructors(prev => prev.map(inst => inst.id === id ? { ...inst, [field]: value } : inst));
  };

  const handleRemoveInstructor = (id: string) => {
    setInstructors(prev => prev.filter(inst => inst.id !== id));
  };

  const handleAddParticipant = () => {
    setParticipants(prev => [...prev, { id: Date.now().toString(), name: '', ic: '', memberNo: '', expiry: '', pStatus: 'Menunggu', isMember: false }]);
  };

  const handleUpdateParticipant = (id: string, field: string, value: any) => {
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };
  
  const handleRemoveParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const updateAppStatus = (newStatus: AppStatus) => {
    setStatus(newStatus);
    if (currentAppId) {
      const updated = applications.map(a => a.id === currentAppId ? { ...a, status: newStatus } : a);
      setApplications(updated);
      globalSijilApps = updated;
    } else {
      const newApp = { 
        id: `S-${Math.floor(Math.random() * 9000) + 1000}`, 
        date: new Date().toLocaleDateString('en-GB'), 
        subject: 'Pembaharuan Sijil Asas', 
        candidates: participants.length, 
        status: newStatus 
      };
      const updated = [newApp, ...applications];
      setApplications(updated);
      globalSijilApps = updated;
      setCurrentAppId(newApp.id);
    }
  };

  // Actions
  const handleSaveDraft = () => {
    updateAppStatus('Draf');
    setSuccessMsg('Draf berjaya disimpan.');
    setTimeout(() => {
      setSuccessMsg('');
      setViewState('summary');
    }, 1500);
  };

  const handleHantar = () => {
    updateAppStatus('Semakan Pengerusi');
    setSuccessMsg('Permohonan telah dihantar kepada Pengerusi (SEBC) untuk semakan.');
    setTimeout(() => {
      setSuccessMsg('');
      setViewState('summary');
    }, 1500);
  };

  const handleHantarPengerusi = () => {
    updateAppStatus('Semakan Pengerusi');
    setSuccessMsg('Permohonan dihantar kepada Pengerusi (SEBC).');
    setTimeout(() => {
      setSuccessMsg('');
      setViewState('list');
    }, 1500);
  };

  const handleLulus = () => {
    updateAppStatus('Diluluskan');
    setSuccessMsg('Permohonan Diluluskan.');
    setTimeout(() => {
      setSuccessMsg('');
      setViewState('list');
    }, 1500);
  };

  const handleTolak = () => {
    setRejectReasonPopup(true);
  };

  const confirmTolak = () => {
    updateAppStatus('Ditolak');
    setRejectReasonPopup(false);
    setSuccessMsg('Permohonan telah ditolak.');
    setTimeout(() => {
      setSuccessMsg('');
      setViewState('list');
    }, 1500);
  };

  const renderStatusBadge = () => {
    switch(status) {
      case 'Draf': return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-[4px] text-xs font-bold uppercase tracking-wider">Draf</span>;
      case 'Dihantar': return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-[4px] text-xs font-bold uppercase tracking-wider">Dihantar (Semakan SEC)</span>;
      case 'Semakan Pengerusi': return <span className="bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-[4px] text-xs font-bold uppercase tracking-wider">Semakan Pengerusi</span>;
      case 'Diluluskan': return <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-[4px] text-xs font-bold uppercase tracking-wider">Lulus</span>;
      case 'Ditolak': return <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-[4px] text-xs font-bold uppercase tracking-wider">Ditolak</span>;
      default: return null;
    }
  };

  const isReadOnly = (role === UserRole.DEC && status !== 'Draf' && status !== 'Ditolak') || role === UserRole.SEC || role === UserRole.SEBC;

  if (viewState === 'list') {
    return (
      <div className="space-y-6">
        <div className="bg-brand-red p-4 flex items-center justify-between shadow-md">
          <h2 className="text-white font-bold text-xl flex items-center gap-2">
            Permohonan Pembaharuan Sijil
          </h2>
          {role === UserRole.DEC && (
            <button 
              onClick={() => {
                setStatus('Draf');
                setCurrentAppId(null);
                setForm({
                  districtName: '',
                  unitName: '',
                  unitCategory: '',
                  courseStart: '',
                  courseEnd: '',
                  ocName: '',
                  ocAddress: '',
                });
                setInstructors([]);
                setParticipants([]);
                setFileAttached(false);
                setViewState('form');
              }}
              className="btn-primary shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Tambah Permohonan
            </button>
          )}
        </div>

        <div className="card shadow-sm border-gray-200/60 pb-6 bg-[#fcfcfc]">
          <div className="grid grid-cols-1 gap-y-3">
            <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] items-center gap-4">
              <label className="text-[11px] font-bold text-charcoal text-right">Carian :</label>
              <div className="relative w-[70%]">
                <Search className="w-4 h-4 absolute left-3 top-1.5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Cari ID Permohonan..." 
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-300 rounded text-xs outline-none shadow-sm placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] items-center gap-4">
              <div className="col-start-2 flex gap-3 mt-2">
                <button className="btn-primary text-[11px] py-1.5 px-5 shadow-sm">Cari</button>
                <button className="btn-outline text-[11px] py-1.5 px-5 shadow-sm">Set Semula</button>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm p-0 overflow-hidden border-gray-200/60">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-charcoal text-sm flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-action-teal" />
              {role === UserRole.DEC ? 'Senarai Permohonan Pembaharuan Sijil' : 'Permohonan Pembaharuan Sijil (Menunggu Semakan)'}
            </h3>
            <div className="text-xs text-gray-500 font-medium">Jumlah Rekod: {visibleApplications.length}</div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200">
                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-[60px]">Bil</th>
                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">ID Permohonan</th>
                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tarikh Permohonan</th>
                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest hidden md:table-cell">Subjek</th>
                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Jumlah Calon</th>
                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest hidden sm:table-cell">Status</th>
                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[13px]">
                {visibleApplications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 md:p-8 text-center text-gray-500 bg-white">
                      <div className="flex flex-col items-center gap-3">
                        <FileText className="w-8 h-8 text-gray-300" />
                        <p>Tiada rekod permohonan ditemui.</p>
                      </div>
                    </td>
                  </tr>
                ) : visibleApplications.map((app, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 bg-white transition-colors group cursor-pointer" onClick={() => {
                    setStatus(app.status as AppStatus);
                    setCurrentAppId(app.id);
                    setForm({
                      districtName: 'KUCHING',
                      unitName: 'MIXED GROUP',
                      unitCategory: 'Private',
                      courseStart: '2026-05-12',
                      courseEnd: '2026-05-13',
                      ocName: 'LIM TZE CHIAT',
                      ocAddress: 'BSMM Daerah Stampin',
                    });
                    setInstructors([
                      { id: '1', name: 'Ahmad bin Abu', address: 'Kuching, Sarawak', warrantNo: 'W-001' }
                    ]);
                    setParticipants([
                      { id: '1', name: 'Ali bin Baba', ic: '900101-13-5555', memberNo: 'M-101', expiry: '2026-05-10', pStatus: 'Diterima', isMember: true },
                      { id: '2', name: 'Siti binti Sal', ic: '920202-13-6666', memberNo: '-', expiry: '2026-06-15', pStatus: 'Diterima', isMember: false },
                    ]);
                    setFileAttached(true);
                    setViewState('summary');
                  }}>
                    <td className="p-3 text-gray-400 font-medium">{index + 1}</td>
                    <td className="p-3 font-semibold text-charcoal">{app.id}</td>
                    <td className="p-3 text-gray-600">{app.date}</td>
                    <td className="p-3 text-gray-600 hidden md:table-cell">{app.subject}</td>
                    <td className="p-3 text-gray-600 text-center font-medium bg-gray-50/50">{app.candidates}</td>
                    <td className="p-3 hidden sm:table-cell">
                      <span className={`px-2.5 py-1 rounded-[4px] text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                        app.status === 'Draf' ? 'bg-gray-100 text-gray-600' :
                        app.status === 'Semakan Pengerusi' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        app.status === 'Diluluskan' ? 'bg-green-50 text-green-700 border border-green-200' :
                        'bg-blue-50 border border-blue-200 text-blue-700'
                      }`}>
                        {app.status === 'Semakan Pengerusi' && <UserCheck className="w-3 h-3" />}
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button onClick={(e) => {
                        e.stopPropagation();
                        setStatus(app.status as AppStatus);
                        setCurrentAppId(app.id);
                        // Mock data for existing app
                        setForm({
                          districtName: 'KUCHING',
                          unitName: 'MIXED GROUP',
                          unitCategory: 'Private',
                          courseStart: '2026-05-12',
                          courseEnd: '2026-05-13',
                          ocName: 'LIM TZE CHIAT',
                          ocAddress: 'BSMM Daerah Stampin',
                        });
                        setInstructors([
                          { id: '1', name: 'Ahmad bin Abu', address: 'Kuching, Sarawak', warrantNo: 'W-001' }
                        ]);
                        setParticipants([
                          { id: '1', name: 'Ali bin Baba', ic: '900101-13-5555', memberNo: 'M-101', expiry: '2026-05-10', pStatus: 'Diterima', isMember: true },
                          { id: '2', name: 'Siti binti Sal', ic: '920202-13-6666', memberNo: '-', expiry: '2026-06-15', pStatus: 'Diterima', isMember: false },
                        ]);
                        setFileAttached(true);
                        setViewState('summary');
                      }} className="btn-outline py-1 px-3 text-[11px] font-bold shadow-sm whitespace-nowrap">
                        Lihat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (viewState === 'summary') {
    return (
      <div className="bg-white max-w-[1000px] mx-auto min-h-screen relative pb-32">
        {/* Success Message overlay */}
        <AnimatePresence>
          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 right-4 z-50 bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border border-green-100 shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" />
              {successMsg}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-4 md:p-8 text-[11px] text-gray-800 font-sans leading-relaxed">
          <div className="text-center mb-6">
            <h1 className="font-bold text-sm relative inline-block px-12">
              <span className="absolute left-0 top-1/2 w-8 border-t border-black"></span>
              Borang Permohonan untuk Pembaharuan Sijil
              <span className="absolute right-0 top-1/2 w-8 border-t border-black"></span>
            </h1>
            <div className="w-full border-t border-black mt-1"></div>
          </div>

          <div className="space-y-1.5 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
              <span className="text-gray-500 font-medium text-right pr-4">No. Pendaftaran:</span>
              <span className="font-bold text-sm">STP/2026/0034</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
              <span className="text-gray-500 font-medium text-right pr-4">Status:</span>
              <span>{status}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
              <span className="text-gray-500 font-medium text-right pr-4">Tarikh Akhir Penyerahan:</span>
              <span>23/05/2026</span>
            </div>
          </div>

          <div className="space-y-1.5 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
              <span className="text-gray-500 font-medium text-right pr-4">Nama Daerah:</span>
              <span>{form.districtName}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
              <span className="text-gray-500 font-medium text-right pr-4">Nama Unit/Organisasi:</span>
              <span>{form.unitName}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
              <span className="text-gray-500 font-medium text-right pr-4">Kategori Unit/Organisasi:</span>
              <span>{form.unitCategory}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
              <span className="text-gray-500 font-medium text-right pr-4">Tarikh Mula Kursus:</span>
              <span>{form.courseStart || '12/05/2026'}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
              <span className="text-gray-500 font-medium text-right pr-4">Tarikh Tamat Kursus:</span>
              <span>{form.courseEnd || '13/05/2026'}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
              <span className="text-gray-500 font-medium text-right pr-4">Nama dan Alamat Latihan O/C:</span>
              <span className="uppercase">{form.ocName}, {form.ocAddress}</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-start">
              <span className="text-gray-500 font-medium text-right pr-4 mt-1">Senarai Jurulatih:</span>
              <table className="w-full border-collapse bg-gray-200/50">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left font-bold py-1 px-2">Nama</th>
                    <th className="text-left font-bold py-1 px-2">Alamat</th>
                    <th className="text-left font-bold py-1 px-2">No. Jurulatih/Waran</th>
                  </tr>
                </thead>
                <tbody>
                  {instructors.map((inst, idx) => (
                    <tr key={idx}>
                      <td className="py-1 px-2">{inst.name}</td>
                      <td className="py-1 px-2">{inst.address}</td>
                      <td className="py-1 px-2">{inst.warrantNo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] mb-4">
            <span className="text-gray-500 font-medium text-right pr-4">Subjek:</span>
            <span>800/2 - Pertolongan Cemas Asas, CPR dan AED</span>
          </div>

          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-start">
              <span className="text-gray-500 font-medium text-right pr-4 mt-1">Senarai Peserta:</span>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="border-b border-gray-300 bg-gray-100/50">
                    <th className="text-left font-bold py-1.5 px-3 border-r border-gray-300">Nama</th>
                    <th className="text-center font-bold py-1.5 px-3 border-r border-gray-300">No. KP/Pasport</th>
                    <th className="text-center font-bold py-1.5 px-3 border-r border-gray-300">No. Ahli BSMM</th>
                    <th className="text-center font-bold py-1.5 px-3 border-r border-gray-300">Tarikh Tamat Sijil</th>
                    <th className="text-center font-bold py-1.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p, idx) => (
                    <tr key={idx} className="border-b border-gray-300">
                      <td className="py-1.5 px-3 border-r border-gray-300">{p.name}</td>
                      <td className="py-1.5 px-3 border-r border-gray-300 text-center">{p.ic}</td>
                      <td className="py-1.5 px-3 border-r border-gray-300 text-center">{p.memberNo}</td>
                      <td className="py-1.5 px-3 border-r border-gray-300 text-center">{p.expiry}</td>
                      <td className="py-1.5 px-3 text-center">{p.pStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] mb-6">
            <span className="text-gray-500 font-medium text-right pr-4">Bilangan Peserta:</span>
            <div>
              <div className="mb-1">Jumlah Calon: <span className="font-bold text-sm ml-2">{participants.length}</span></div>
              <ul className="list-disc ml-5 space-y-1">
                <li>Ahli : {membersCount}</li>
                <li>Bukan Ahli : {nonMembersCount}</li>
              </ul>
            </div>
          </div>

          <div className="mb-4">
            Bilangan sijil tamat tempoh diserahkan secara fizikal: <span className="font-bold">0</span>
          </div>

          <div className="bg-[#FFE5E5] p-4 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
              <span className="font-medium text-right pr-4">Pembayaran:</span>
              <div className="space-y-2">
                <div>Bayaran yuran peperiksaan (Ahli) <span className="font-bold">{membersCount}</span> x RM 10/peserta = RM {(membersCount * 10).toFixed(2)}</div>
                <div>Bayaran yuran peperiksaan (Bukan Ahli) <span className="font-bold">{nonMembersCount}</span> x RM 10/peserta = RM {(nonMembersCount * 10).toFixed(2)}</div>
                <div className="mt-3">Jumlah bayaran yuran peperiksaan = <span className="font-bold text-[#C0182A] text-lg">RM {totalFee.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-[9px] text-[#C0182A] text-right font-medium tracking-wide">
            DOKUMEN INI DIJANAKAN OLEH KOMPUTER UNTUK TUJUAN MEMBUAT PEMBAYARAN PEMBAHARUAN SIJIL. RESIT RASMI AKAN DISUSULI SELEPAS PEMBAYARAN DISAHKAN
          </div>

        </div>

        {/* Action Footer locked to bottom of screen in summary mode */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-300 p-2.5 px-4 flex justify-between md:justify-center items-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-40">
          <div className="flex gap-2 max-w-[1000px] w-full mx-auto">
             <button onClick={() => setViewState('list')} className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-[11px] shadow-sm text-charcoal">
               <ArrowLeft className="w-3.5 h-3.5" /> Kembali
             </button>
             <button className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-[11px] shadow-sm text-charcoal">
               <Printer className="w-3.5 h-3.5" /> Cetak
             </button>
             <button className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-[11px] shadow-sm text-charcoal">
               <Printer className="w-3.5 h-3.5" /> Cetak dengan calon
             </button>
             
             {role === UserRole.DEC && (status === 'Draf' || status === 'Ditolak') && (
               <>
                 <button onClick={() => setViewState('form')} className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-[11px] shadow-sm text-charcoal ml-auto">
                   <Edit2 className="w-3.5 h-3.5" /> Ubah
                 </button>
                 <button onClick={() => setViewState('list')} className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-[11px] shadow-sm text-brand-red">
                   <Trash2 className="w-3.5 h-3.5" /> Padam
                 </button>
               </>
             )}

             {role === UserRole.SEC && status === 'Dihantar' && (
               <>
                 <button onClick={handleTolak} className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-[11px] shadow-sm text-brand-red ml-auto">
                   <UserX className="w-3.5 h-3.5" /> Tolak
                 </button>
                 <button onClick={handleHantarPengerusi} className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 rounded bg-white hover:bg-green-50 font-bold text-[11px] shadow-sm text-action-teal">
                   <Send className="w-3.5 h-3.5" /> Hantar kepada Pengerusi
                 </button>
               </>
             )}

             {role === UserRole.SEBC && status === 'Semakan Pengerusi' && (
               <>
                 <button onClick={handleTolak} className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-[11px] shadow-sm text-brand-red ml-auto">
                   <UserX className="w-3.5 h-3.5" /> Tolak
                 </button>
                 <button onClick={handleLulus} className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 rounded bg-white hover:bg-green-50 font-bold text-[11px] shadow-sm text-action-teal">
                   <UserCheck className="w-3.5 h-3.5" /> Luluskan Sijil
                 </button>
               </>
             )}
          </div>
        </div>

        {/* Reject Modal */}
        <AnimatePresence>
          {rejectReasonPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
              >
                <div className="bg-[#ED1C24] p-4 flex items-center justify-between">
                  <h3 className="text-white font-bold text-[15px]">Sebab Penolakan / Pulangan</h3>
                  <button onClick={() => setRejectReasonPopup(false)} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 md:p-6">
                  <p className="text-sm text-gray-600 mb-4">Sila nyatakan sebab permohonan ini dikembalikan atau ditolak. DEC akan menerima maklumat ini.</p>
                  <textarea 
                    rows={4}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Contoh: Lampiran resit kabur, bilangan calon tidak sepadan..."
                    className="w-full border border-gray-300 p-3 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 outline-none transition-colors"
                  ></textarea>
                  <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => setRejectReasonPopup(false)} className="px-4 py-2 border border-gray-300 rounded-[6px] text-gray-600 font-bold text-sm hover:bg-gray-50">
                      Batal
                    </button>
                    <button onClick={confirmTolak} disabled={!rejectReason.trim()} className="btn-danger px-5 py-2 text-sm shadow-sm disabled:opacity-50 transition-colors">
                      Sahkan Penolakan
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1000px] mx-auto pb-24 space-y-6">
      
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setViewState('list')}
          className="flex items-center gap-2 text-gray-500 hover:text-charcoal px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-bold text-sm">Kembali</span>
        </button>
        {successMsg && (
          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border border-green-100 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4" />
            {successMsg}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Form Header */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-5">
          <h1 className="text-xl font-bold text-charcoal mb-3">Borang Permohonan untuk Pembaharuan Sijil</h1>
          <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500">No. Pendaftaran:</span>
              <span className="font-bold text-charcoal px-2 py-0.5 bg-gray-100 rounded">
                {currentAppId ? 'KCH/2026/0019' : '(Akan dijana)'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Status:</span>
              {currentAppId ? renderStatusBadge() : <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-[4px] text-xs font-bold uppercase tracking-wider">Baru</span>}
            </div>
            {currentAppId && (
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500">Tarikh Akhir Penyerahan:</span>
                <span className="font-bold text-charcoal flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gray-500"/> 25/05/2026</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 md:p-6 md:p-8 space-y-10">
          
          {/* Section 1: Org Details */}
          <section className="space-y-4">
            <h2 className="text-[14px] font-bold text-charcoal border-b border-gray-100 pb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-action-teal" />
              1. Butiran Organisasi & Kursus
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Nama Daerah <span className="text-brand-red">*</span></label>
                <input 
                  type="text" 
                  value={form.districtName} 
                  onChange={(e) => handleInputChange('districtName', e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full p-2.5 rounded-[6px] border text-sm font-medium ${isReadOnly ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border-gray-300 focus:ring-1 focus:ring-action-teal'}`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Nama Unit / Organisasi <span className="text-brand-red">*</span></label>
                <input 
                  type="text" 
                  value={form.unitName} 
                  onChange={(e) => handleInputChange('unitName', e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full p-2.5 rounded-[6px] border text-sm font-medium ${isReadOnly ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border-gray-300 focus:ring-1 focus:ring-action-teal'}`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Kategori Unit <span className="text-brand-red">*</span></label>
                <select 
                  value={form.unitCategory} 
                  onChange={(e) => handleInputChange('unitCategory', e.target.value)}
                  disabled={isReadOnly}
                  className={`w-full p-2.5 rounded-[6px] border text-sm font-medium ${isReadOnly ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border-gray-300 focus:ring-1 focus:ring-action-teal'}`}
                >
                  <option value="Private">Private</option>
                  <option value="Government">Kerajaan</option>
                  <option value="NGO">Badan Bukan Kerajaan (NGO)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Tarikh Mula Kursus <span className="text-brand-red">*</span></label>
                <input 
                  type="date" 
                  value={form.courseStart} 
                  onChange={(e) => handleInputChange('courseStart', e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full p-2.5 rounded-[6px] border text-sm font-medium ${isReadOnly ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border-gray-300 focus:ring-1 focus:ring-action-teal'}`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Tarikh Tamat Kursus <span className="text-brand-red">*</span></label>
                <input 
                  type="date" 
                  value={form.courseEnd} 
                  onChange={(e) => handleInputChange('courseEnd', e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full p-2.5 rounded-[6px] border text-sm font-medium ${isReadOnly ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border-gray-300 focus:ring-1 focus:ring-action-teal'}`}
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Nama & Alamat Latihan O/C <span className="text-brand-red">*</span></label>
                <textarea 
                  rows={2}
                  value={form.ocAddress} 
                  onChange={(e) => handleInputChange('ocAddress', e.target.value)}
                  readOnly={isReadOnly}
                  className={`w-full p-2.5 rounded-[6px] border text-sm font-medium leading-relaxed ${isReadOnly ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border-gray-300 focus:ring-1 focus:ring-action-teal'}`}
                />
              </div>
            </div>
          </section>

          {/* Section 2: Instructors */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h2 className="text-[14px] font-bold text-charcoal flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-action-teal" />
                2. Senarai Jurulatih
              </h2>
            </div>
            
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {!isReadOnly && <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center w-10">X</th>}
                    <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-[10px]">Bil.</th>
                    <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nama</th>
                    <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Alamat Dihubungi</th>
                    <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">No. Jurulatih / Waran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {instructors.length === 0 ? (
                    <tr><td colSpan={isReadOnly ? 4 : 5} className="p-4 md:p-6 text-center text-sm text-gray-400">Tiada jurulatih dimasukkan.</td></tr>
                  ) : instructors.map((inst, idx) => (
                    <tr key={inst.id} className="bg-white hover:bg-gray-50/50">
                      {!isReadOnly && (
                        <td className="p-3 text-center">
                          <button onClick={() => handleRemoveInstructor(inst.id)} className="p-1 text-gray-400 hover:text-alert-red rounded-md text-lg font-bold transition-colors">×</button>
                        </td>
                      )}
                      <td className="p-3 text-sm text-gray-400 font-medium">{idx + 1}</td>
                      <td className="p-3">
                        <input type="text" value={inst.name} onChange={e => handleUpdateInstructor(inst.id, 'name', e.target.value)} readOnly={isReadOnly} className={`w-full px-2 py-1.5 rounded text-sm outline-none ${isReadOnly ? 'bg-transparent border-0 px-0' : 'bg-transparent focus:bg-white focus:ring-1 focus:ring-action-teal/40'}`} />
                      </td>
                      <td className="p-3">
                        <input type="text" value={inst.address} onChange={e => handleUpdateInstructor(inst.id, 'address', e.target.value)} readOnly={isReadOnly} className={`w-full px-2 py-1.5 rounded text-sm outline-none ${isReadOnly ? 'bg-transparent border-0 px-0' : 'bg-transparent focus:bg-white focus:ring-1 focus:ring-action-teal/40'}`} />
                      </td>
                      <td className="p-3">
                        <input type="text" value={inst.warrantNo} onChange={e => handleUpdateInstructor(inst.id, 'warrantNo', e.target.value)} readOnly={isReadOnly} className={`w-full px-2 py-1.5 rounded text-sm outline-none ${isReadOnly ? 'bg-transparent border-0 px-0' : 'bg-transparent focus:bg-white focus:ring-1 focus:ring-action-teal/40'}`} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!isReadOnly && (
              <div className="flex items-center mt-2">
                <button onClick={handleAddInstructor} type="button" className="group flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-[4px] bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-bold text-action-teal shadow-sm">
                  <span className="text-action-teal group-hover:scale-110 transition-transform font-black">+</span>
                  Tambah
                </button>
              </div>
            )}
          </section>

          {/* Section 3: Participants */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h2 className="text-[14px] font-bold text-charcoal flex items-center gap-2">
                <FileText className="w-4 h-4 text-action-teal" />
                3. Senarai Peserta
              </h2>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {!isReadOnly && <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center w-10">X</th>}
                    <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-[10px]">Bil.</th>
                    <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nama Peserta</th>
                    <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">No. KP / Pasport</th>
                    <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Ahli?</th>
                    <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">No. Ahli BSMM</th>
                    <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tarikh Tamat Sijil</th>
                    <th className="p-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {participants.length === 0 ? (
                    <tr><td colSpan={isReadOnly ? 7 : 8} className="p-4 md:p-6 text-center text-sm text-gray-400">Tiada peserta.</td></tr>
                  ) : participants.map((p, idx) => (
                    <tr key={p.id} className="bg-white hover:bg-gray-50/50">
                      {!isReadOnly && (
                        <td className="p-3 text-center">
                          <button onClick={() => handleRemoveParticipant(p.id)} className="p-1 text-gray-400 hover:text-alert-red text-lg font-bold rounded transition-colors">×</button>
                        </td>
                      )}
                      <td className="p-3 text-sm text-gray-400 font-medium">{idx + 1}</td>
                      <td className="p-3">
                        <input type="text" value={p.name} onChange={e => handleUpdateParticipant(p.id, 'name', e.target.value)} readOnly={isReadOnly} className={`w-full px-2 py-1.5 rounded text-sm outline-none ${isReadOnly ? 'bg-transparent border-0 px-0' : 'bg-transparent focus:bg-white focus:ring-1 focus:ring-action-teal/40'}`} />
                      </td>
                      <td className="p-3">
                        <input type="text" value={p.ic} onChange={e => handleUpdateParticipant(p.id, 'ic', e.target.value)} readOnly={isReadOnly} className={`w-full px-2 py-1.5 rounded text-sm outline-none ${isReadOnly ? 'bg-transparent border-0 px-0 w-32' : 'bg-transparent focus:bg-white focus:ring-1 focus:ring-action-teal/40 w-32'}`} />
                      </td>
                      <td className="p-3 text-center">
                        <input type="checkbox" checked={p.isMember} onChange={e => handleUpdateParticipant(p.id, 'isMember', e.target.checked)} disabled={isReadOnly} className="w-4 h-4 text-action-teal rounded" />
                      </td>
                      <td className="p-3">
                        <input type="text" value={p.memberNo} onChange={e => handleUpdateParticipant(p.id, 'memberNo', e.target.value)} readOnly={isReadOnly || !p.isMember} className={`w-full px-2 py-1.5 outline-none rounded text-sm ${isReadOnly || !p.isMember ? 'bg-transparent text-gray-500 px-0' : 'bg-transparent focus:bg-white focus:ring-1 focus:ring-action-teal/40'}`} placeholder={!p.isMember ? '-' : ''} />
                      </td>
                      <td className="p-3">
                        <input type="date" value={p.expiry} onChange={e => handleUpdateParticipant(p.id, 'expiry', e.target.value)} readOnly={isReadOnly} className={`w-full px-2 py-1.5 outline-none rounded text-sm leading-none ${isReadOnly ? 'bg-transparent border-0 px-0' : 'bg-transparent focus:bg-white focus:ring-1 focus:ring-action-teal/40'}`} />
                      </td>
                      <td className="p-3">
                        {isReadOnly ? (
                          <span className={`px-2 py-1 rounded text-xs font-bold ${p.pStatus === 'Diterima' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>{p.pStatus}</span>
                        ) : (
                          <select value={p.pStatus} onChange={e => handleUpdateParticipant(p.id, 'pStatus', e.target.value)} className="w-full p-1.5 rounded text-sm outline-none bg-transparent focus:bg-white border-transparent focus:ring-1 focus:ring-action-teal/40">
                            <option value="Menunggu">Menunggu</option>
                            <option value="Diterima">Diterima</option>
                            <option value="Ditolak">Ditolak</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {!isReadOnly && (
              <div className="flex items-center mt-2">
                <button onClick={handleAddParticipant} type="button" className="group flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-[4px] bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-bold text-action-teal shadow-sm">
                  <span className="text-action-teal group-hover:scale-110 transition-transform font-black">+</span>
                  Tambah
                </button>
              </div>
            )}
          </section>

          {/* Section 4: Payment summary */}
          <section className="space-y-4">
            <h2 className="text-[14px] font-bold text-charcoal border-b border-gray-100 pb-2 flex items-center gap-2">
              <FileUp className="w-4 h-4 text-action-teal" />
              4. Pembayaran & Lampiran
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-slate-50 p-5 rounded-xl border border-gray-200">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Ringkasan Yuran</h3>
                
                <div className="space-y-3 text-sm border-b border-gray-200 pb-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ahli ({membersCount} x RM 10.00)</span>
                    <span className="font-semibold text-charcoal">RM {(membersCount * 10).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bukan Ahli ({nonMembersCount} x RM 10.00)</span>
                    <span className="font-semibold text-charcoal">RM {(nonMembersCount * 10).toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-charcoal">Jumlah Bayaran:</span>
                  <span className="text-lg font-black text-[#C0182A]">RM {totalFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-gray-200 flex flex-col justify-center">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Bukti Pembayaran / Resit</h3>
                {!isReadOnly ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-6 flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setFileAttached(true)}>
                    {fileAttached ? (
                      <>
                        <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                        <span className="text-sm font-bold text-charcoal">resit_bayaran_192.pdf</span>
                        <span className="text-xs text-gray-500 mt-1">Klik untuk menukar fail</span>
                      </>
                    ) : (
                      <>
                         <FileUp className="w-8 h-8 text-gray-400 mb-2" />
                         <span className="text-sm font-semibold text-action-teal">Klik atau seret fail ke sini</span>
                         <span className="text-xs text-gray-500 mt-1 max-w-[200px] text-center leading-relaxed">Sila muat naik PDF, JPG, atau PNG (Maksimum 5MB)</span>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="w-10 h-10 rounded bg-red-50 flex items-center justify-center text-red-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-charcoal underline cursor-pointer hover:text-action-teal">resit_pembayaran_sah.pdf</p>
                      <p className="text-xs text-gray-500">1.2 MB • Disemak</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

        </div>

        {/* Action Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 md:px-8 py-5 flex flex-wrap gap-3 items-center justify-end">
          
          {/* DEC Draft View */}
          {role === UserRole.DEC && (status === 'Draf' || status === 'Ditolak') && (
            <>
              <button onClick={onBack} className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-sm shadow-sm text-charcoal mr-auto">
                <ArrowLeft className="w-4 h-4" /> Kembali
              </button>
              <button onClick={handleSaveDraft} className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-sm shadow-sm text-charcoal">
                <Save className="w-4 h-4" /> Simpan Draf
              </button>
              <button disabled={!fileAttached && !isReadOnly} onClick={handleHantar} className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 rounded bg-white hover:bg-green-50 font-bold text-sm shadow-sm text-action-teal disabled:opacity-50">
                <Send className="w-4 h-4" /> Hantar Permohonan
              </button>
            </>
          )}

          {/* SEC View */}
          {role === UserRole.SEC && status === 'Dihantar' && (
            <>
              <button onClick={onBack} className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-sm shadow-sm text-charcoal mr-auto">
                <ArrowLeft className="w-4 h-4" /> Kembali
              </button>
              <button className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-sm shadow-sm text-charcoal">
                <Printer className="w-4 h-4" /> Cetak
              </button>
              <button className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-sm shadow-sm text-charcoal">
                <Printer className="w-4 h-4" /> Cetak dengan calon
              </button>
              <button onClick={handleTolak} className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-sm shadow-sm text-brand-red">
                <UserX className="w-4 h-4" /> Tolak
              </button>
              <button onClick={handleHantarPengerusi} className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 rounded bg-white hover:bg-green-50 font-bold text-sm shadow-sm text-action-teal">
                <Send className="w-4 h-4" /> Hantar kepada Pengerusi
              </button>
            </>
          )}

          {/* Chairman (SEBC) View */}
          {role === UserRole.SEBC && status === 'Semakan Pengerusi' && (
            <>
               <button onClick={onBack} className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-sm shadow-sm text-charcoal mr-auto">
                <ArrowLeft className="w-4 h-4" /> Kembali
              </button>
              <button onClick={handleTolak} className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-sm shadow-sm text-brand-red">
                <UserX className="w-4 h-4" /> Tolak
              </button>
              <button onClick={handleLulus} className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 rounded bg-white hover:bg-green-50 font-bold text-sm shadow-sm text-action-teal">
                <UserCheck className="w-4 h-4" /> Luluskan Sijil
              </button>
            </>
          )}

          {/* Fallback for already processed states for SEC/SEBC */}
          {((role === UserRole.SEC && status !== 'Dihantar') || (role === UserRole.SEBC && status !== 'Semakan Pengerusi') || (role === UserRole.DEC && status !== 'Draf' && status !== 'Ditolak')) && (
             <button onClick={onBack} className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 rounded bg-white hover:bg-gray-50 font-bold text-sm shadow-sm text-charcoal">
               <ArrowLeft className="w-4 h-4" /> Kembali ke Senarai
             </button>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectReasonPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-[#ED1C24] p-4 flex items-center justify-between">
                <h3 className="text-white font-bold text-[15px]">Sebab Penolakan / Pulangan</h3>
                <button onClick={() => setRejectReasonPopup(false)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 md:p-6">
                <p className="text-sm text-gray-600 mb-4">Sila nyatakan sebab permohonan ini dikembalikan atau ditolak. DEC akan menerima maklumat ini.</p>
                <textarea 
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Contoh: Lampiran resit kabur, bilangan calon tidak sepadan..."
                  className="w-full border border-gray-300 p-3 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 outline-none transition-colors"
                ></textarea>
                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={() => setRejectReasonPopup(false)} className="px-4 py-2 border border-gray-300 rounded-[6px] text-gray-600 font-bold text-sm hover:bg-gray-50">
                    Batal
                  </button>
                  <button onClick={confirmTolak} disabled={!rejectReason.trim()} className="btn-danger px-5 py-2 text-sm shadow-sm disabled:opacity-50 transition-colors">
                    Sahkan Penolakan
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
