import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Download, FileText, Loader2, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

const dummyDataStatistik = [
  { name: 'P Pendidikan Kesihatan', calon: 120 },
  { name: 'P Pertolongan Cemas', calon: 98 },
  { name: 'P Pendidikan Palang Merah', calon: 86 },
  { name: 'Rawatan Rumah', calon: 65 },
];

const dummyDataKeputusan = [
  { name: 'Jan', lulus: 400, gagal: 240 },
  { name: 'Feb', lulus: 300, gagal: 139 },
  { name: 'Mac', lulus: 200, gagal: 980 },
  { name: 'Apr', lulus: 278, gagal: 390 },
  { name: 'Mei', lulus: 189, gagal: 480 },
  { name: 'Jun', lulus: 239, gagal: 380 },
];

const dummyDataYuran = [
  { name: 'Suku 1', jumlah: 4000 },
  { name: 'Suku 2', jumlah: 3000 },
  { name: 'Suku 3', jumlah: 2000 },
  { name: 'Suku 4', jumlah: 2780 },
];

const dummyDataPembaharuan = [
  { name: 'Kuching', permohonan: 40 },
  { name: 'Sibu', permohonan: 30 },
  { name: 'Miri', permohonan: 20 },
  { name: 'Bintulu', permohonan: 27 },
];

const dummyDataJumlahCalonDaerah = [
  { name: 'Kuching', calon: 5 },
  { name: 'Sibu', calon: 1 },
  { name: 'Miri', calon: 1 },
  { name: 'Bintulu', calon: 3 },
];

export const dummyCandidatesDaerah = [
  // Application APP-001
  { no: 1, appId: 'APP-001', numPendaftaran: 'REG-KCH-001', name: 'Ahmad bin Ali', district: 'Kuching', ic: '900101-13-1234', status: 'Lulus' },
  { no: 2, appId: 'APP-001', numPendaftaran: 'REG-KCH-002', name: 'Siti binti Abu', district: 'Kuching', ic: '920202-13-5678', status: 'Gagal' },
  { no: 3, appId: 'APP-001', numPendaftaran: 'REG-SIB-001', name: 'Wong Ah Kau', district: 'Sibu', ic: '950303-13-9012', status: 'Lulus' },
  { no: 4, appId: 'APP-001', numPendaftaran: 'REG-BIN-001', name: 'Muthu a/l Samy', district: 'Bintulu', ic: '880404-13-3456', status: 'Lulus' },
  // Application APP-002
  { no: 5, appId: 'APP-002', numPendaftaran: 'REG-KCH-003', name: 'Chong Wei Ling', district: 'Kuching', ic: '960505-13-7890', status: 'Lulus' },
  { no: 6, appId: 'APP-002', numPendaftaran: 'REG-KCH-004', name: 'Nurul Huda', district: 'Kuching', ic: '990606-13-1122', status: 'Lulus' },
  { no: 7, appId: 'APP-002', numPendaftaran: 'REG-KCH-005', name: 'Tan Ah Boon', district: 'Kuching', ic: '970707-13-3344', status: 'Lulus' },
  { no: 8, appId: 'APP-002', numPendaftaran: 'REG-MIR-001', name: 'Dayang Sofia', district: 'Miri', ic: '930808-13-5566', status: 'Lulus' },
  { no: 9, appId: 'APP-002', numPendaftaran: 'REG-BIN-002', name: 'John Doe Anak Jimmy', district: 'Bintulu', ic: '910909-13-7788', status: 'Lulus' },
  { no: 10, appId: 'APP-002', numPendaftaran: 'REG-BIN-003', name: 'Grace Lee', district: 'Bintulu', ic: '941010-13-9900', status: 'Lulus' }
];

export const ReportsModule = () => {
  const [selectedReport, setSelectedReport] = useState<string>('Rumusan Keputusan');
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [downloadComplete, setDownloadComplete] = useState<string | null>(null);
  const [selectedDaerahFilter, setSelectedDaerahFilter] = useState<string>('Semua Daerah');

  const handleDownload = (format: string) => {
    setDownloadingFormat(format);
    setDownloadComplete(null);
    
    // Simulate download processing
    setTimeout(() => {
      if ((format === 'Excel' || format === 'CSV') && selectedReport === 'Jumlah Calon Ikut Daerah') {
        const headers = ["No.", "Application ID", "No. Pendaftaran", "Nama Calon", "Daerah", "No IC/Pasport", "Status"];
        // Filter and sort by district to combine them together neatly
        const filteredCandidates = selectedDaerahFilter === 'Semua Daerah' 
          ? [...dummyCandidatesDaerah] 
          : dummyCandidatesDaerah.filter(c => c.district === selectedDaerahFilter);
        
        const sortedCandidates = filteredCandidates.sort((a, b) => a.district.localeCompare(b.district));
        
        const csvContent = [
          headers.join(","),
          ...sortedCandidates.map(c => 
            `"${c.no}","${c.appId}","${c.numPendaftaran}","${c.name}","${c.district}","${c.ic}","${c.status}"`
          )
        ].join("\n");
        
        // Use BOM to force UTF-8 in Excel and ensure proper cell alignment
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        // Both options will download a CSV, which Excel safely opens without warning
        link.setAttribute("download", `Laporan_Calon_Ikut_Daerah.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      setDownloadingFormat(null);
      setDownloadComplete(`Laporan '${selectedReport}' telah dimuat turun dalam format ${format}.`);
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setDownloadComplete(null);
      }, 4000);
    }, 1500);
  };

  const renderChart = () => {
    switch (selectedReport) {
      case 'Rumusan Keputusan':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dummyDataKeputusan} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="lulus" stroke="#28A745" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Lulus" />
              <Line type="monotone" dataKey="gagal" stroke="#ED1C24" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Gagal" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'Pembaharuan Sijil':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dummyDataPembaharuan} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <RechartsTooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
              <Bar dataKey="permohonan" fill="#F5E6E8" stroke="#8B0F1D" radius={[0, 4, 4, 0]} name="Jumlah Permohonan" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'Kutipan Yuran':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dummyDataYuran} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorYuran" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#008B8B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#008B8B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
              <Area type="monotone" dataKey="jumlah" stroke="#008B8B" fillOpacity={1} fill="url(#colorYuran)" name="Jumlah Kutipan (RM)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'Jumlah Calon Ikut Daerah': {
        const filteredData = selectedDaerahFilter === 'Semua Daerah' 
          ? dummyDataJumlahCalonDaerah 
          : dummyDataJumlahCalonDaerah.filter(d => d.name === selectedDaerahFilter);

        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <RechartsTooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }} />
              <Bar dataKey="calon" fill="#7288AE" radius={[4, 4, 0, 0]} name="Jumlah Calon Lengkap" />
            </BarChart>
          </ResponsiveContainer>
        );
      }
      default:
        return null;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="card shadow-sm border border-gray-100 p-4 md:p-6">
        <h2 className="text-xl font-black text-charcoal mb-4 flex gap-2 items-center">
           <BarChart3 className="text-action-teal" />
           Laporan & Statistik
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
           {['Rumusan Keputusan', 'Pembaharuan Sijil', 'Kutipan Yuran', 'Jumlah Calon Ikut Daerah'].map(type => (
             <div 
                key={type} 
                onClick={() => setSelectedReport(type)}
                className={`border p-4 rounded-xl cursor-pointer transition-all ${
                  selectedReport === type 
                  ? 'border-action-teal bg-teal-50 shadow-sm' 
                  : 'border-gray-200 hover:bg-gray-50 hover:border-action-teal'
                }`}
             >
                <FileText className={`w-6 h-6 mb-2 ${selectedReport === type ? 'text-action-teal' : 'text-gray-400'}`} />
                <p className={`font-bold text-sm ${selectedReport === type ? 'text-teal-900' : 'text-charcoal'}`}>{type}</p>
             </div>
           ))}
        </div>

        <div className="mb-8 p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 ml-4 mr-4">
            <h3 className="font-bold text-gray-700">{selectedReport}</h3>
            {selectedReport === 'Jumlah Calon Ikut Daerah' && (
              <select 
                value={selectedDaerahFilter}
                onChange={(e) => setSelectedDaerahFilter(e.target.value)}
                className="mt-2 md:mt-0 p-2 border border-gray-300 rounded focus:ring-action-teal focus:border-action-teal outline-none text-sm"
              >
                <option value="Semua Daerah">Semua Daerah</option>
                <option value="Kuching">Kuching</option>
                <option value="Sibu">Sibu</option>
                <option value="Miri">Miri</option>
                <option value="Bintulu">Bintulu</option>
              </select>
            )}
          </div>
          {renderChart()}
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
             <button 
                onClick={() => handleDownload('PDF')}
                disabled={downloadingFormat !== null}
                className="flex-1 btn-secondary flex items-center justify-center gap-2 hover:bg-white disabled:opacity-50"
             >
               {downloadingFormat === 'PDF' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
               {downloadingFormat === 'PDF' ? 'Memuat turun...' : 'PDF'}
             </button>
             <button 
                onClick={() => handleDownload('CSV')}
                disabled={downloadingFormat !== null}
                className="flex-1 btn-secondary flex items-center justify-center gap-2 hover:bg-white disabled:opacity-50"
             >
               {downloadingFormat === 'CSV' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
               {downloadingFormat === 'CSV' ? 'Memuat turun...' : 'CSV'}
             </button>
             <button 
                onClick={() => handleDownload('Excel')}
                disabled={downloadingFormat !== null}
                className="flex-1 btn-secondary flex items-center justify-center gap-2 hover:bg-white disabled:opacity-50"
             >
               {downloadingFormat === 'Excel' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
               {downloadingFormat === 'Excel' ? 'Memuat turun...' : 'Excel'}
             </button>
          </div>
          
          {downloadComplete && (
            <motion.div 
               initial={{ opacity: 0, y: -10 }} 
               animate={{ opacity: 1, y: 0 }} 
               className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm flex gap-2 items-center"
            >
               <CheckCircle className="w-4 h-4 text-green-600" />
               {downloadComplete}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
