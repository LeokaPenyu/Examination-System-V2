import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Settings, Search, ArrowLeft, Edit, Trash2, Save, Check, X } from 'lucide-react';

interface Pengguna {
  id: string;
  userId: string;
  name: string;
  email: string;
  ic: string;
  mobile: string;
  hasRole: boolean;
  agency: string;
  branch: string;
  designation: string;
}

const initialPengguna: Pengguna[] = [
  { id: '1', userId: 'indiana.jones@gmail.com', name: 'INDIANA JONES', email: 'indiana.jones@gmail.com', ic: '860427-52-6133', mobile: '', hasRole: true, agency: 'Bulan Sabit Merah Malaysia', branch: 'SARAWAK', designation: '-' },
  { id: '2', userId: 'tyler.durden@gmail.com', name: 'TYLER DURDEN', email: 'tyler.durden@gmail.com', ic: '800101-13-5555', mobile: '', hasRole: true, agency: 'Bulan Sabit Merah Malaysia', branch: 'SARAWAK', designation: '-' },
  { id: '3', userId: 'katniss.everdeen@gmail.com', name: 'KATNISS EVERDEEN', email: 'katniss.everdeen@gmail.com', ic: '750303-13-5222', mobile: '', hasRole: true, agency: 'Bulan Sabit Merah Malaysia', branch: 'SARAWAK', designation: '-' },
  { id: '4', userId: 'hannibal.lecter@gmail.com', name: 'HANNIBAL LECTER', email: 'hannibal.lecter@gmail.com', ic: '900101-13-5000', mobile: '', hasRole: true, agency: 'Bulan Sabit Merah Malaysia', branch: 'SARAWAK', designation: '-' },
  { id: '5', userId: 'neo@gmail.com', name: 'NEO', email: 'neo@gmail.com', ic: '880101-13-5222', mobile: '', hasRole: true, agency: 'Bulan Sabit Merah Malaysia', branch: 'SARAWAK', designation: '-' },
  { id: '6', userId: 'elle.woods@gmail.com', name: 'ELLE WOODS', email: 'elle.woods@gmail.com', ic: '920101-13-5222', mobile: '', hasRole: false, agency: 'Bulan Sabit Merah Malaysia', branch: 'SARAWAK', designation: '-' },
  { id: '7', userId: 'rocky.balboa@gmail.com', name: 'ROCKY BALBOA', email: 'rocky.balboa@gmail.com', ic: '850101-13-5222', mobile: '', hasRole: true, agency: 'Bulan Sabit Merah Malaysia', branch: 'SARAWAK', designation: '-' },
  { id: '8', userId: 'cruella.devil@gmail.com', name: 'CRUELLA DE VIL', email: 'cruella.devil@gmail.com', ic: '820101-13-1222', mobile: '', hasRole: true, agency: 'Bulan Sabit Merah Malaysia', branch: 'SARAWAK', designation: '-' },
];

export const ProfilPengguna = () => {
  const [view, setView] = useState<'list' | 'view' | 'add' | 'edit'>('list');
  const [penggunaList, setPenggunaList] = useState<Pengguna[]>(initialPengguna);
  const [selectedUser, setSelectedUser] = useState<Pengguna | null>(null);

  // Filters
  const [filterName, setFilterName] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterBulanSabit, setFilterBulanSabit] = useState(true);
  const [filterSarawak, setFilterSarawak] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    authMethod: 'Non-SarawakNet',
    userId: '',
    name: '',
    email: '',
    ic: '',
    mobile: '',
    agency: 'Bulan Sabit Merah Malaysia',
    branch: 'SARAWAK',
    designation: '',
    password: '',
    passwordVerify: ''
  });

  const handleSearch = () => {
    // In a real app, this would trigger an API call.
    // For now we could filter the list, but we'll leave it as is or do simple local filtering if needed.
  };

  const filteredList = penggunaList.filter(user => {
    return (
      user.name.toLowerCase().includes(filterName.toLowerCase()) &&
      user.email.toLowerCase().includes(filterEmail.toLowerCase())
    );
  });

  const handleRowClick = (user: Pengguna) => {
    setSelectedUser(user);
    setView('view');
  };

  const handleAddClick = () => {
    setFormData({
      authMethod: 'Non-SarawakNet',
      userId: '',
      name: '',
      email: '',
      ic: '',
      mobile: '',
      agency: 'Bulan Sabit Merah Malaysia',
      branch: 'SARAWAK',
      designation: '',
      password: '',
      passwordVerify: ''
    });
    setView('add');
  };

  const handleEditClick = () => {
    if (selectedUser) {
      setFormData({
        authMethod: 'Non-SarawakNet',
        userId: selectedUser.userId,
        name: selectedUser.name,
        email: selectedUser.email,
        ic: selectedUser.ic,
        mobile: selectedUser.mobile,
        agency: selectedUser.agency,
        branch: selectedUser.branch,
        designation: selectedUser.designation,
        password: '',
        passwordVerify: ''
      });
      setView('edit');
    }
  };

  const handleSave = () => {
    if (view === 'add') {
      const newUser: Pengguna = {
        id: Math.random().toString(36).substr(2, 9),
        userId: formData.userId,
        name: formData.name,
        email: formData.email,
        ic: formData.ic,
        mobile: formData.mobile,
        agency: formData.agency,
        branch: formData.branch,
        designation: formData.designation,
        hasRole: true
      };
      setPenggunaList(prev => [...prev, newUser]);
    } else if (view === 'edit' && selectedUser) {
      setPenggunaList(prev => prev.map(u => 
        u.id === selectedUser.id ? { ...u, ...formData } : u
      ));
      setSelectedUser({ ...selectedUser, ...formData });
    }
    setView('list');
  };

  const handleDelete = () => {
    if (selectedUser) {
      setPenggunaList(prev => prev.filter(u => u.id !== selectedUser.id));
      setView('list');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-sm">
        
        {/* Header Actions */}
        <div className="p-4 md:p-6 flex justify-between items-center border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 text-brand-red rounded-lg">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-lg text-gray-900">Profil Pengguna</h2>
          </div>
          
          <div className="flex gap-2">
            {view === 'list' && (
              <button onClick={handleAddClick} className="bg-action-teal text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-sm">
                <Plus className="w-4 h-4" /> Tambah Pengguna
              </button>
            )}
            {(view === 'view' || view === 'add' || view === 'edit') && (
              <button onClick={() => setView('list')} className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
                <ArrowLeft className="w-4 h-4 text-gray-500" /> Kembali
              </button>
            )}
            {(view === 'view' || view === 'edit') && view !== 'list' && (
              <>
                <button onClick={handleEditClick} className="bg-white text-action-teal border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-teal-50 transition-colors">
                  <Edit className="w-4 h-4" /> Kemaskini
                </button>
                <button onClick={handleDelete} className="bg-white text-alert-red border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" /> Mansuh
                </button>
              </>
            )}
            {(view === 'add' || view === 'edit') && (
              <button onClick={handleSave} className="bg-action-teal text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-sm">
                <Save className="w-4 h-4" /> Simpan
              </button>
            )}
          </div>
        </div>

        {/* View content based on state */}
        <div className="bg-white">
          
          {/* ----- LIST VIEW ----- */}
          {view === 'list' && (
            <>
              {/* Filter Section */}
              <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50">
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center mb-4">
                  <div className="flex items-center gap-3">
                    <label className="font-medium text-gray-700 text-sm">Name:</label>
                    <input 
                      type="text" 
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 w-64 text-sm outline-none focus:border-action-teal focus:ring-1 focus:ring-action-teal"
                      placeholder="Cari nama..."
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="font-medium text-gray-700 text-sm">Email:</label>
                    <input 
                      type="text" 
                      value={filterEmail}
                      onChange={(e) => setFilterEmail(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 w-64 text-sm outline-none focus:border-action-teal focus:ring-1 focus:ring-action-teal"
                      placeholder="Cari email..."
                    />
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <label className="font-medium text-gray-700 text-sm mt-1">Saring Dari:</label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-800">
                      <input type="checkbox" checked={filterBulanSabit} onChange={() => setFilterBulanSabit(!filterBulanSabit)} className="rounded text-action-teal focus:ring-action-teal w-4 h-4 border-gray-300" />
                      Bulan Sabit Merah Malaysia
                    </label>
                    <div className="flex items-center gap-4 pl-6">
                       <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-800">
                        <input type="checkbox" checked={filterSarawak} onChange={() => setFilterSarawak(!filterSarawak)} className="rounded text-action-teal focus:ring-action-teal w-4 h-4 border-gray-300" />
                        SARAWAK
                      </label>
                      <button onClick={handleSearch} className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-1.5 text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                        <Search className="w-4 h-4 text-action-teal" /> Cari
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pagination Info */}
              <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-white">
                <div className="text-sm text-gray-500 font-medium">
                  Jumlah Rekod: <span className="text-gray-900">{filteredList.length}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <button className="px-3 py-1 border border-gray-200 rounded text-gray-400 cursor-not-allowed hover:bg-gray-50">Pertama</button>
                  <button className="px-3 py-1 border border-gray-200 rounded text-gray-400 cursor-not-allowed hover:bg-gray-50">Sblm</button>
                  <span className="px-2">Hal <input type="text" value="1" className="w-10 border border-gray-300 text-center mx-1 py-1 rounded-md" readOnly /> dari 1</span>
                  <button className="px-3 py-1 border border-gray-200 rounded text-action-teal hover:bg-gray-50">Setrnya</button>
                  <button className="px-3 py-1 border border-gray-200 rounded text-action-teal hover:bg-gray-50">Terakhir</button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold tracking-wider border-b border-gray-100">
                    <tr>
                      <th className="px-4 md:px-6 py-4 text-center w-16">No.</th>
                      <th className="px-4 md:px-6 py-4">Nama User</th>
                      <th className="px-4 md:px-6 py-4">Email</th>
                      <th className="px-4 md:px-6 py-4 text-center w-28">Peranan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.map((user, index) => (
                      <tr 
                        key={user.id} 
                        onClick={() => handleRowClick(user)}
                        className="border-b border-gray-50 hover:bg-blue-50/50 cursor-pointer transition-colors"
                      >
                        <td className="px-4 md:px-6 py-4 text-center font-medium text-gray-500">{index + 1}</td>
                        <td className="px-4 md:px-6 py-4 text-action-teal font-medium uppercase text-sm">{user.name}</td>
                        <td className="px-4 md:px-6 py-4 text-gray-600 text-sm">{user.email}</td>
                        <td className="px-4 md:px-6 py-4 text-center text-gray-700">
                          {user.hasRole ? <Check className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ----- VIEW DETAILS ----- */}
          {view === 'view' && selectedUser && (
            <div className="p-4 md:p-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-10 max-w-4xl">
                 <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">User ID <span className="text-brand-red">*</span></div>
                    <div className="text-gray-900 font-medium">{selectedUser.userId}</div>
                 </div>
                 <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Nama <span className="text-brand-red">*</span></div>
                    <div className="text-gray-900 font-medium uppercase">{selectedUser.name}</div>
                 </div>
                 <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Email <span className="text-brand-red">*</span></div>
                    <div className="text-gray-900 font-medium">{selectedUser.email}</div>
                 </div>
                 <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">No. Pengenalan <span className="text-brand-red">*</span></div>
                    <div className="text-gray-900 font-medium">{selectedUser.ic}</div>
                 </div>
                 <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Mobile No.</div>
                    <div className="text-gray-900 font-medium">{selectedUser.mobile || '-'}</div>
                 </div>
               </div>

               <div className="bg-gray-50 text-gray-700 font-medium px-4 py-3 border border-gray-200 rounded-t-lg mb-0 flex justify-between items-center">
                 <span>Position Listing</span>
                 <span className="flex items-center gap-1 text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded">
                    Default
                 </span>
               </div>

               <div className="overflow-x-auto border border-t-0 border-gray-200 rounded-b-lg">
                 <table className="w-full text-left">
                    <thead className="bg-white text-gray-500 text-xs font-medium border-b border-gray-200 uppercase tracking-wider">
                      <tr>
                        <th className="px-4 md:px-6 py-3 text-center w-16">No.</th>
                        <th className="px-4 md:px-6 py-3">Agency</th>
                        <th className="px-4 md:px-6 py-3">Branch</th>
                        <th className="px-4 md:px-6 py-3">Designation</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      <tr className="border-b border-gray-50 text-sm text-gray-900">
                        <td className="px-4 md:px-6 py-4 text-center text-gray-500">1</td>
                        <td className="px-4 md:px-6 py-4 font-medium">{selectedUser.agency}</td>
                        <td className="px-4 md:px-6 py-4">{selectedUser.branch}</td>
                        <td className="px-4 md:px-6 py-4">{selectedUser.designation}</td>
                      </tr>
                    </tbody>
                 </table>
               </div>
            </div>
          )}

          {/* ----- ADD / EDIT FORM ----- */}
          {(view === 'add' || view === 'edit') && (
            <div className="p-4 md:p-6 max-w-3xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Authentication method <span className="text-brand-red">*</span></label>
                  <label className="flex items-center gap-3">
                    <input type="radio" checked={formData.authMethod === 'Non-SarawakNet'} onChange={() => setFormData({...formData, authMethod: 'Non-SarawakNet'})} className="text-action-teal focus:ring-action-teal border-gray-300" />
                    <span className="font-medium text-gray-700 text-sm">Non-SarawakNet</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">User ID <span className="text-brand-red">*</span></label>
                    <input type="text" value={formData.userId} onChange={e => setFormData({...formData, userId: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-action-teal focus:ring-2 focus:ring-action-teal/20 outline-none transition-all" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Name <span className="text-brand-red">*</span></label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-action-teal focus:ring-2 focus:ring-action-teal/20 outline-none transition-all uppercase" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-brand-red">*</span></label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-action-teal focus:ring-2 focus:ring-action-teal/20 outline-none transition-all" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">No. Pengenalan <span className="text-brand-red">*</span></label>
                    <input type="text" value={formData.ic} onChange={e => setFormData({...formData, ic: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-action-teal focus:ring-2 focus:ring-action-teal/20 outline-none transition-all" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile No.</label>
                    <input type="text" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-action-teal focus:ring-2 focus:ring-action-teal/20 outline-none transition-all" />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Agency <span className="text-brand-red">*</span></label>
                    <div className="font-medium text-gray-900 py-2">{formData.agency}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Branch</label>
                    <div className="font-medium text-gray-900 py-2">{formData.branch}</div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Designation <span className="text-brand-red">*</span></label>
                    <input type="text" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-action-teal focus:ring-2 focus:ring-action-teal/20 outline-none transition-all" />
                  </div>
                </div>

                {view === 'add' && (
                  <div className="border-t border-gray-100 pt-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Password <span className="text-brand-red">*</span></label>
                      <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-action-teal focus:ring-2 focus:ring-action-teal/20 outline-none transition-all" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Password (Verify) <span className="text-brand-red">*</span></label>
                      <input type="password" value={formData.passwordVerify} onChange={e => setFormData({...formData, passwordVerify: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-action-teal focus:ring-2 focus:ring-action-teal/20 outline-none transition-all" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
};
