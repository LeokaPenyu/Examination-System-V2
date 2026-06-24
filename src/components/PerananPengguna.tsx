import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Trash2, Search, X, Save, Plus, Info } from 'lucide-react';

interface RoleUser {
  id: string;
  name: string;
  recordedAt: string;
}

interface StateRole {
  id: string;
  title: string;
  users: RoleUser[];
}

interface DistrictRole {
  district: string;
  roles: {
    id: string;
    title: string;
    users: RoleUser[];
  }[];
}

const initialRolesData = {
  negeri: [
    {
      id: 'n1',
      title: 'Admin Negeri',
      users: [
        { id: 'u1', name: 'ALBERT EINSTEIN', recordedAt: '15/12/2016 10:28:04 AM' },
        { id: 'u2', name: 'MARIE CURIE', recordedAt: '12/05/2026 10:26:00 AM' }
      ]
    },
    {
      id: 'n2',
      title: 'Penyelaras Peperiksaan Negeri',
      users: [
        { id: 'u3', name: 'ISAAC NEWTON', recordedAt: '21/11/2024 01:17:01 PM' },
        { id: 'u1_dup', name: 'ALBERT EINSTEIN', recordedAt: '13/03/2017 08:09:04 AM' },
        { id: 'u4', name: 'CHARLES DARWIN', recordedAt: '24/05/2019 02:28:20 PM' }
      ]
    },
    {
      id: 'n3',
      title: 'Pengerusi Lembaga Pengarah Peperiksaan Negeri',
      users: [
        { id: 'u1_dup2', name: 'ALBERT EINSTEIN', recordedAt: '15/12/2016 10:28:54 AM' },
        { id: 'u5', name: 'NIKOLA TESLA', recordedAt: '15/12/2016 10:28:47 AM' }
      ]
    }
  ],
  daerah: [
    {
      district: 'BETONG',
      roles: [
        { id: 'd1_1', title: 'Penyelaras Peperiksaan Daerah', users: [] }
      ]
    },
    {
      district: 'BINTULU',
      roles: [
        {
          id: 'd2_1',
          title: 'Penyelaras Peperiksaan Daerah',
          users: [
            { id: 'u6', name: 'GALILEO GALILEI', recordedAt: '15/12/2016 10:30:31 AM' },
            { id: 'u7', name: 'ROSALIND FRANKLIN', recordedAt: '31/05/2025 06:59:13 PM' },
            { id: 'u5_dup', name: 'NIKOLA TESLA', recordedAt: '27/06/2019 12:18:42 PM' }
          ]
        }
      ]
    }
  ]
};

// Mock user list for the modal
const mockSystemUsers = [
  { id: 'sys1', name: 'STEPHEN HAWKING', email: 'stephen.hawking@gmail.com' },
  { id: 'sys2', name: 'ADA LOVELACE', email: 'ada.lovelace@gmail.com' },
  { id: 'sys3', name: 'LOUIS PASTEUR', email: 'louis.pasteur@gmail.com' },
  { id: 'sys4', name: 'GREGOR MENDEL', email: 'gregor.mendel@gmail.com' },
  { id: 'sys5', name: 'DMITRI MENDELEEV', email: 'dmitri.mendeleev@gmail.com' }
];

const parseDateString = (dateStr: string) => {
  if (!dateStr) return 0;
  const parts = dateStr.split(' ');
  if (parts.length < 3) return 0;
  const [datePart, timePart, period] = parts;
  const [day, month, year] = datePart.split('/');
  let [hour, minute, second] = timePart.split(':');
  
  let h = parseInt(hour, 10);
  if (period === 'PM' && h < 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;

  return new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10),
    h,
    parseInt(minute, 10),
    parseInt(second || '0', 10)
  ).getTime();
};

const sortUsers = (users: RoleUser[], sortBy: 'name' | 'recordedAt', sortOrder: 'asc' | 'desc') => {
  return [...users].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'recordedAt') {
      const timeA = parseDateString(a.recordedAt);
      const timeB = parseDateString(b.recordedAt);
      comparison = timeA - timeB;
    }
    return sortOrder === 'desc' ? -comparison : comparison;
  });
};

export const PerananPengguna = () => {
  const [rolesData, setRolesData] = useState(initialRolesData);
  const [showRecordedDate, setShowRecordedDate] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'recordedAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [selectedRoleContext, setSelectedRoleContext] = useState<{ type: 'negeri' | 'daerah', roleId: string, district?: string } | null>(null);
  
  // Filter state in modal
  const [filterName, setFilterName] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  
  // Selected users in modal
  const [selectedUsers, setSelectedUsers] = useState<typeof mockSystemUsers>([]);

  const handleOpenModal = (title: string, type: 'negeri' | 'daerah', roleId: string, district?: string) => {
    setModalTitle(title);
    setSelectedRoleContext({ type, roleId, district });
    setSelectedUsers([]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoleContext(null);
  };

  const handleAddUserToSelection = (user: typeof mockSystemUsers[0]) => {
    if (!selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveUserFromSelection = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
  };

  const handleSaveSelection = () => {
    if (!selectedRoleContext) return;
    
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth()+1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString()}`;
    
    const newRoleUsers = selectedUsers.map(su => ({
      id: Math.random().toString(36).substr(2, 9),
      name: su.name,
      recordedAt: formattedDate
    }));

    if (selectedRoleContext.type === 'negeri') {
      setRolesData(prev => ({
        ...prev,
        negeri: prev.negeri.map(role => 
          role.id === selectedRoleContext.roleId 
            ? { ...role, users: [...role.users, ...newRoleUsers] }
            : role
        )
      }));
    } else if (selectedRoleContext.type === 'daerah') {
      setRolesData(prev => ({
        ...prev,
        daerah: prev.daerah.map(d => 
          d.district === selectedRoleContext.district
            ? {
                ...d,
                roles: d.roles.map(r => 
                  r.id === selectedRoleContext.roleId
                    ? { ...r, users: [...r.users, ...newRoleUsers] }
                    : r
                )
              }
            : d
        )
      }));
    }
    
    handleCloseModal();
  };

  const handleDeleteUser = (type: 'negeri' | 'daerah', roleId: string, userId: string, district?: string) => {
    // skip confirm in iframe
    if (type === 'negeri') {
      setRolesData(prev => ({
        ...prev,
        negeri: prev.negeri.map(role => 
          role.id === roleId
            ? { ...role, users: role.users.filter(u => u.id !== userId) }
            : role
        )
      }));
    } else {
      setRolesData(prev => ({
        ...prev,
        daerah: prev.daerah.map(d => 
          d.district === district
            ? {
                ...d,
                roles: d.roles.map(r => 
                  r.id === roleId
                    ? { ...r, users: r.users.filter(u => u.id !== userId) }
                    : r
                )
              }
            : d
        )
      }));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-sm">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-sm">
        
        {/* Header */}
        <div className="p-4 md:p-6 flex justify-between items-center border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 text-brand-red rounded-lg">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-lg text-gray-900">Peranan Pengguna</h2>
          </div>
        </div>

        {/* Top Controls */}
        <div className="px-4 md:px-6 py-4 flex flex-wrap items-center justify-between border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-medium text-sm">Diatur Mengikut:</span>
              <button 
                onClick={() => setSortBy('name')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${sortBy === 'name' ? 'bg-white shadow-sm border border-gray-200 text-brand-red' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Nama Pengguna
              </button>
              <button 
                onClick={() => setSortBy('recordedAt')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${sortBy === 'recordedAt' ? 'bg-white shadow-sm border border-gray-200 text-brand-red' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Direkod Pada
              </button>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-medium text-sm">Disusun Mengikut:</span>
              <button 
                onClick={() => setSortOrder('asc')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${sortOrder === 'asc' ? 'bg-white shadow-sm border border-gray-200 text-brand-red' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Menaik
              </button>
              <button 
                onClick={() => setSortOrder('desc')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${sortOrder === 'desc' ? 'bg-white shadow-sm border border-gray-200 text-brand-red' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Menurun
              </button>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700 text-sm">
              <input type="checkbox" checked={showRecordedDate} onChange={() => setShowRecordedDate(!showRecordedDate)} className="rounded text-action-teal focus:ring-action-teal w-4 h-4 border-gray-300" /> Papar Tarikh Direkod
            </label>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-6 space-y-6">
          {/* Peringkat Negeri */}
          <div className="border border-gray-200 rounded-xl overflow-x-auto shadow-sm">
            <div className="bg-gray-50 px-5 py-3 font-semibold text-gray-800 flex items-center gap-2 border-b border-gray-200 text-sm">
              Peringkat Negeri <Info className="w-4 h-4 text-action-teal" />
            </div>
            
            <table className="w-full text-left border-collapse text-sm">
              <tbody className="bg-white">
                {rolesData.negeri.map((role, idx) => (
                  <tr key={role.id} className="border-b border-gray-100 last:border-b-0 align-top">
                    <td className="p-5 w-1/3 text-gray-900 border-r border-gray-100 font-medium">{role.title}</td>
                    <td className="p-5">
                      <div className="mb-4">
                         {role.users.length > 0 && <span className="text-gray-500 font-medium mr-2">({role.users.length})</span>}
                         <button 
                           onClick={() => handleOpenModal(`Peringkat Negeri - ${role.title}`, 'negeri', role.id)}
                           className="text-action-teal hover:underline font-medium text-sm flex inline-flex items-center gap-1"
                         ><Plus className="w-4 h-4"/> Tambah Pengguna</button>
                      </div>
                      <div className="space-y-3">
                        {sortUsers(role.users, sortBy, sortOrder).map(user => (
                          <div key={user.id} className="flex justify-between items-start group bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                            <div>
                               <div className="text-gray-900 font-medium uppercase">{user.name}</div>
                               {showRecordedDate && (
                                 <div className="text-gray-500 text-xs mt-1">Direkod Pada: {user.recordedAt}</div>
                               )}
                            </div>
                            <button 
                              onClick={() => handleDeleteUser('negeri', role.id, user.id)}
                              className="text-gray-400 hover:text-alert-red p-1.5 rounded-md hover:bg-red-50 transition-colors"
                              title="Padam"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Peringkat Daerah */}
          <div className="border border-gray-200 rounded-xl overflow-x-auto shadow-sm">
            <div className="bg-gray-50 px-5 py-3 font-semibold text-gray-800 flex items-center gap-2 border-b border-gray-200 text-sm">
              Peringkat Daerah <Info className="w-4 h-4 text-action-teal" />
            </div>
            
            <table className="w-full text-left border-collapse text-sm">
              <tbody className="bg-white">
                {rolesData.daerah.map((d, idx) => (
                  <tr key={d.district} className="border-b border-gray-100 last:border-b-0 align-top">
                    <td className="p-5 w-48 text-gray-900 border-r border-gray-100 uppercase font-bold bg-gray-50/30">{d.district}</td>
                    <td className="p-0">
                       <table className="w-full text-left border-collapse h-full">
                         <tbody>
                            {d.roles.map((role, rIdx) => (
                              <tr key={role.id} className={rIdx < d.roles.length - 1 ? "border-b border-gray-100" : ""}>
                                <td className="p-5 w-1/3 text-gray-700 bg-white align-top border-r border-gray-100 font-medium">
                                  {role.title}
                                </td>
                                <td className="p-5 bg-white align-top">
                                  <div className="mb-4">
                                     {role.users.length > 0 && <span className="text-gray-500 font-medium mr-2">({role.users.length})</span>}
                                     <button 
                                       onClick={() => handleOpenModal(`Peringkat Daerah (${d.district}) - ${role.title}`, 'daerah', role.id, d.district)}
                                       className="text-action-teal hover:underline font-medium text-sm flex inline-flex items-center gap-1"
                                     ><Plus className="w-4 h-4"/> Tambah Pengguna</button>
                                  </div>
                                  <div className="space-y-3">
                                    {sortUsers(role.users, sortBy, sortOrder).map(user => (
                                      <div key={user.id} className="flex justify-between items-start group bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                                        <div>
                                           <div className="text-gray-900 font-medium uppercase">{user.name}</div>
                                           {showRecordedDate && (
                                             <div className="text-gray-500 text-xs mt-1">Direkod Pada: {user.recordedAt}</div>
                                           )}
                                        </div>
                                        <button 
                                          onClick={() => handleDeleteUser('daerah', role.id, user.id, d.district)}
                                          className="text-gray-400 hover:text-alert-red p-1.5 rounded-md hover:bg-red-50 transition-colors"
                                          title="Padam"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            ))}
                         </tbody>
                       </table>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal / Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="bg-white shadow-xl rounded-xl w-full max-w-5xl flex flex-col overflow-hidden h-[90vh] md:h-[85vh]"
          >
            {/* Modal Header */}
            <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
              <h3 className="font-bold text-lg text-gray-900">{modalTitle}</h3>
              <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Content - Split View */}
            <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 bg-gray-50/30 flex-1 min-h-0 overflow-y-auto md:overflow-hidden">
                
              {/* Left Side: Search & User List */}
              <div className="flex-[3] bg-white border border-gray-200 rounded-xl flex flex-col min-h-[500px] md:min-h-0 md:h-full overflow-hidden shadow-sm">
                {/* Search Form */}
                <div className="bg-gray-50 p-5 border-b border-gray-200 text-sm space-y-4 shrink-0">
                   <div className="flex items-center gap-4">
                     <span className="w-16 font-medium text-gray-700">Name:</span>
                     <input type="text" value={filterName} onChange={e => setFilterName(e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-action-teal focus:ring-1 focus:ring-action-teal" placeholder="Cari nama..." />
                   </div>
                   <div className="flex items-center gap-4">
                     <span className="w-16 font-medium text-gray-700">Email:</span>
                     <input type="text" value={filterEmail} onChange={e => setFilterEmail(e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-action-teal focus:ring-1 focus:ring-action-teal" placeholder="Cari email..." />
                   </div>
                   <div className="flex items-start gap-4">
                     <span className="w-16 font-medium text-gray-700 mt-1">Saring Dari:</span>
                     <div className="space-y-2">
                       <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-800 text-sm">
                         <input type="checkbox" defaultChecked className="rounded text-action-teal focus:ring-action-teal border-gray-300 w-4 h-4" /> Bulan Sabit Merah Malaysia
                       </label>
                       <div className="ml-6 flex items-center gap-4">
                          <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-800 text-sm">
                            <input type="checkbox" defaultChecked className="rounded text-action-teal focus:ring-action-teal border-gray-300 w-4 h-4" /> SARAWAK
                          </label>
                          <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-1.5 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm text-gray-700">
                            <Search className="w-4 h-4 text-action-teal" /> Cari
                          </button>
                       </div>
                     </div>
                   </div>
                </div>

                {/* Left Pagination */}
                <div className="flex justify-between items-center p-3 text-sm text-gray-600 border-b border-gray-200 bg-white shrink-0">
                  <div className="font-medium text-gray-500 text-xs">Jumlah Rekod: {mockSystemUsers.filter(u => !selectedUsers.find(su => su.id === u.id)).filter(u => u.name.toLowerCase().includes(filterName.toLowerCase()) && u.email.toLowerCase().includes(filterEmail.toLowerCase())).length}</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button className="px-2 py-1 text-xs border border-gray-200 rounded text-gray-400 cursor-not-allowed">Pertama</button>
                    <button className="px-2 py-1 text-xs border border-gray-200 rounded text-gray-400 cursor-not-allowed">Sblm</button>
                    <span className="text-xs">Hal <input type="text" value="1" className="w-8 border border-gray-300 text-center mx-1 py-0.5 rounded" readOnly /> dari 1</span>
                    <button className="px-2 py-1 text-xs border border-gray-200 rounded text-gray-400 cursor-not-allowed">Setrnya</button>
                    <button className="px-2 py-1 text-xs border border-gray-200 rounded text-gray-400 cursor-not-allowed">Terakhir</button>
                  </div>
                </div>

                {/* Left Table */}
                <div className="flex-1 overflow-y-auto bg-white min-h-0">
                  <table className="w-full text-left border-collapse text-sm">

                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold tracking-wider border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th className="px-4 py-3 border-r border-gray-100 text-center w-12">No.</th>
                        <th className="px-4 py-3 border-r border-gray-100 uppercase">Nama User</th>
                        <th className="px-4 py-3 text-center uppercase w-20">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockSystemUsers
                        .filter(u => !selectedUsers.find(su => su.id === u.id))
                        .filter(u => u.name.toLowerCase().includes(filterName.toLowerCase()) && u.email.toLowerCase().includes(filterEmail.toLowerCase()))
                        .map((user, idx) => (
                        <tr key={user.id} className="border-b border-gray-50 hover:bg-teal-50/30 transition-colors">
                          <td className="px-4 py-3 border-r border-gray-50 text-center text-gray-500 font-medium">{idx + 1}</td>
                          <td className="px-4 py-3 border-r border-gray-50">
                            <div className="font-medium text-gray-900 uppercase">{user.name}</div>
                            <div className="text-gray-500 text-xs mt-0.5">Email: {user.email}</div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button 
                              onClick={() => handleAddUserToSelection(user)}
                              className="p-1.5 rounded-lg text-action-teal hover:bg-teal-50 transition-colors"
                              title="Tambah Pengguna"
                            >
                              <Plus className="w-5 h-5 mx-auto" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Side: Selected Users */}
              <div className="w-full md:w-2/5 border border-gray-200 rounded-xl flex flex-col min-h-[400px] md:min-h-0 md:h-full overflow-hidden shadow-sm bg-white">
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 text-sm font-bold text-gray-800 flex justify-between items-center shrink-0">
                  <span>Selected Users</span>
                  <span className="bg-brand-red text-white text-xs px-2 py-0.5 rounded-full">{selectedUsers.length}</span>
                </div>
                
                {/* Right Table */}
                <div className="flex-1 overflow-y-auto bg-white min-h-0">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold tracking-wider border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th className="px-4 py-3 border-r border-gray-100 text-center w-12">No.</th>
                        <th className="px-4 py-3 border-r border-gray-100 uppercase">Nama User</th>
                        <th className="px-4 py-3 text-center uppercase w-16">Batal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedUsers.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-4 md:px-6 py-12 text-center text-gray-400 font-medium bg-gray-50/50 text-sm">
                            <div className="flex flex-col items-center justify-center">
                              <Info className="w-8 h-8 text-gray-300 mb-2" />
                              Tiada pengguna dipilih
                            </div>
                          </td>
                        </tr>
                      ) : (
                        selectedUsers.map((user, idx) => (
                          <tr key={user.id} className="border-b border-gray-50 hover:bg-red-50/30 transition-colors">
                            <td className="px-4 py-3 border-r border-gray-50 text-center text-gray-500 font-medium">{idx + 1}</td>
                            <td className="px-4 py-3 border-r border-gray-50">
                              <div className="font-medium text-gray-900 uppercase">{user.name}</div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button 
                                onClick={() => handleRemoveUserFromSelection(user.id)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-alert-red hover:bg-red-50 transition-colors"
                              >
                                <X className="w-4 h-4 mx-auto" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
            
            {/* Modal Footer */}
            <div className="px-4 md:px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 shrink-0">
               <button onClick={handleCloseModal} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">
                 Batal
               </button>
               <button onClick={handleSaveSelection} className="px-4 py-2 bg-action-teal text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-sm">
                 <Save className="w-4 h-4" /> Simpan Pilihan
               </button>
            </div>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
};
