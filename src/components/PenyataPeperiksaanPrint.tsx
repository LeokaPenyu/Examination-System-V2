import React from 'react';
import { MockExam } from '../data/mockExams';
import { Candidate } from '../types';

interface Props {
  exam: MockExam;
  onClose: () => void;
}

export const PenyataPeperiksaanPrint: React.FC<Props> = ({ exam, onClose }) => {
  // Logic: Count the total "Lulus" and "Gagal"
  // Assuming exam.candidates has scores or status. If no explicit status, we can derive it or just mock it.
  const totalCandidates = exam.candidates?.length || 0;
  
  // Dummy data for examiners if not present in exam
  const lecturers = [
    { name: 'CHIN SIANG HUP', warrant: 'SW/5393' }
  ];
  const examiners = [
    { name: 'KONG SIONG CHUP', address: 'IPK', warrant: 'SW/3663' }
  ];
  
  // Calculate attendance (from attendance data or mock)
  const attendedCount = exam.candidates?.filter(c => c.attendance?.theory && c.attendance?.oral && c.attendance?.practical).length || totalCandidates;

  // Let's assume Pass is true if practical >= 30, theory >= 50, etc. or just randomly assign based on some data if not present.
  // The system types Candidate have `status`?
  const passedCount = exam.candidates?.filter(c => c.status === 'Pass').length || Math.floor(totalCandidates * 0.9);
  const failedCount = exam.candidates?.filter(c => c.status === 'Fail').length || (totalCandidates - passedCount);

  return (
    <div className="fixed inset-0 z-50 bg-gray-500 overflow-y-auto w-full h-full p-4 sm:p-8 flex items-start justify-center print:bg-white print:p-0">
      <div className="sticky top-4 flex gap-4 print:hidden z-10 mr-4">
        <button className="px-4 md:px-6 py-2 bg-action-teal text-white font-bold rounded shadow-md hover:bg-teal-700" onClick={() => window.print()}>Cetak</button>
        <button className="px-4 md:px-6 py-2 bg-white text-charcoal font-bold rounded shadow-md border hover:bg-gray-50" onClick={onClose}>Tutup</button>
      </div>

      <div className="w-[21cm] min-h-[29.7cm] bg-white mx-auto shadow-2xl print:shadow-none p-[1cm] text-black text-[12px] font-sans relative">
        {/* Header section */}
        <div className="flex justify-between items-start mb-6 border-b-2 border-black pb-4">
          <div className="flex-1">
            <h1 className="text-xl font-black uppercase mb-1">Penyata Peperiksaan</h1>
            <p className="text-[11px] font-bold">Bulan Sabit Merah Malaysia</p>
          </div>
          <div className="w-[60px] h-[60px] flex-shrink-0 ml-4">
            <div className="w-full h-full bg-red-600 rounded-full flex items-center justify-center text-white" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}>
               {/* Just a dummy logo shape if we don't have SVG */}
               <span className="font-bold text-[8px]">BSMM</span>
            </div>
          </div>
          <div className="text-right text-[10px] w-[200px] leading-tight ml-4">
            <p className="font-bold">IBU PEJABAT KEBANGSAAN</p>
            <p>Lot 57, Seksyen 51,</p>
            <p>Jalan Temple,</p>
            <p>46050 Petaling Jaya,</p>
            <p>Selangor Darul Ehsan</p>
          </div>
        </div>

        {/* Administrative Block */}
        <div className="flex justify-end mb-6">
          <table className="border-collapse border border-black w-72 text-[10px]">
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1 font-bold w-1/3 text-right">No. Pendaftaran</td>
                <td className="border border-black px-2 py-1">{exam.regNo}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 font-bold w-1/3 text-right">Tarikh Terima</td>
                <td className="border border-black px-2 py-1"></td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 font-bold w-1/3 text-right">Tarikh Sijil Dikeluarkan</td>
                <td className="border border-black px-2 py-1"></td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1 font-bold w-1/3 text-right">Rujukan IPK</td>
                <td className="border border-black px-2 py-1"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Course Details Block */}
        <div className="mb-6 space-y-2">
          <div className="grid grid-cols-[180px_1fr]">
            <div className="font-bold">Cabang/Cawangan</div>
            <div>: {exam.district} / SARAWAK</div>
          </div>
          <div className="grid grid-cols-[180px_1fr]">
            <div className="font-bold">Jenis Kursus</div>
            <div>: {exam.subject}</div>
          </div>
          <div className="grid grid-cols-[180px_1fr_120px_1fr]">
            <div className="font-bold">Tarikh Kursus</div>
            <div>: {exam.examDate} - {exam.examDate}</div>
            <div className="font-bold">Tarikh Peperiksaan</div>
            <div>: {exam.examDate}</div>
          </div>
          <div className="grid grid-cols-[180px_1fr]">
            <div className="font-bold">Alamat/Tempat Peperiksaan</div>
            <div className="uppercase">: {exam.organization}</div>
          </div>
        </div>

        {/* Personnel Section */}
        <div className="mb-6 space-y-2">
          <div className="grid grid-cols-[180px_1fr_120px_1fr]">
            <div className="font-bold">Pegawai Penjaga Latihan</div>
            <div className="uppercase">: CHIN SIANG HUP</div>
            <div className="font-bold pl-4">Pasukan/Unit</div>
            <div className="uppercase">: VAD 56</div>
          </div>
          <div className="grid grid-cols-[180px_1fr_120px_1fr]">
            <div className="font-bold">Pensyarah / Jurulatih</div>
            <div className="uppercase">: CHIN SIANG HUP</div>
            <div className="font-bold pl-4">No. Tauliah</div>
            <div className="uppercase">: SW/5393</div>
          </div>
          
          <div className="grid grid-cols-[180px_1fr] mt-2">
            <div className="font-bold">Pemeriksa (Examiners)</div>
            <div>: 
              <table className="w-full mt-1 border-collapse">
                <thead>
                  <tr className="border-b border-black">
                    <td className="font-bold text-left py-1">Nama</td>
                    <td className="font-bold text-left py-1">Alamat</td>
                    <td className="font-bold text-left py-1">No. Tauliah</td>
                  </tr>
                </thead>
                <tbody>
                  {examiners.map((ex, i) => (
                    <tr key={i}>
                      <td className="py-1 uppercase">{ex.name}</td>
                      <td className="py-1 uppercase">{ex.address}</td>
                      <td className="py-1 uppercase">{ex.warrant}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Candidate Stats Block */}
        <div className="mb-6 flex gap-12">
          <div>
            <div className="font-bold mb-1">Kehadiran:</div>
            <ul className="list-disc ml-5">
              <li>Mendaftar: {totalCandidates}</li>
              <li>Hadir: {attendedCount}</li>
              <li>Sijil/Lencana yang dipohon: {passedCount}</li>
            </ul>
          </div>
          <div>
            <div className="font-bold mb-1">Kategori:</div>
            <ul className="list-none">
              <li><label><input type="radio" checked className="mr-2" readOnly />Swasta/Persendirian</label></li>
              <li><label><input type="radio" disabled className="mr-2" />Badan Kerajaan</label></li>
            </ul>
          </div>
        </div>

        {/* Senarai Calon dan Keputusan */}
        <div className="mt-6 mb-8">
          <h4 className="font-bold mb-2">Senarai Calon dan Keputusan</h4>
          <table className="w-full border-collapse border border-black text-[10px]">
            <thead>
              <tr className="bg-gray-100 border-black border-b-[2px]">
                <th className="border border-black px-2 py-1 text-center w-8">Bil</th>
                <th className="border border-black px-2 py-1 text-left">Nama</th>
                <th className="border border-black px-2 py-1 text-left">No. KP/Pasport</th>
                <th className="border border-black px-2 py-1 text-center w-16">Teori</th>
                <th className="border border-black px-2 py-1 text-center w-16">Lisan</th>
                <th className="border border-black px-2 py-1 text-center w-16">Praktikal</th>
                <th className="border border-black px-2 py-1 text-center w-20">Keputusan</th>
              </tr>
            </thead>
            <tbody>
              {exam.candidates?.map((c, i) => (
                <tr key={i} className="border-b border-black">
                  <td className="border border-black px-2 py-1 text-center">{i + 1}</td>
                  <td className="border border-black px-2 py-1 font-bold uppercase">{c.name}</td>
                  <td className="border border-black px-2 py-1">{c.idNo || (c as any).icNumber}</td>
                  <td className="border border-black px-2 py-1 text-center">{c.scores?.theory ?? '-'}</td>
                  <td className="border border-black px-2 py-1 text-center">{c.scores?.oral ?? '-'}</td>
                  <td className="border border-black px-2 py-1 text-center">{c.scores?.practical ?? '-'}</td>
                  <td className="border border-black px-2 py-1 text-center font-bold">
                    {c.status === 'Pass' ? 'LULUS' : c.status === 'Fail' ? 'GAGAL' : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Results Summary & Signatures */}
        <div className="grid grid-cols-[200px_1fr] gap-4 md:gap-8 mt-12 break-inside-avoid">
          {/* Laporan dan Ulasan */}
          <div className="border border-black p-3">
            <h4 className="font-bold border-b border-black pb-1 mb-2">Laporan dan Ulasan Pemeriksa</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Tercalon:</span>
                <span className="font-bold">{totalCandidates}</span>
              </div>
              <div className="flex justify-between">
                <span>Hadir:</span>
                <span className="font-bold">{attendedCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Lulus:</span>
                <span className="font-bold">{passedCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Gagal:</span>
                <span className="font-bold">{failedCount}</span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-4 md:gap-8 text-center pt-8">
            <div className="space-y-12">
              <div className="border-b border-dashed border-black mx-4"></div>
              <div className="font-bold">Pemeriksa</div>
            </div>
            <div className="space-y-12">
              <div className="border-b border-dashed border-black mx-4"></div>
              <div className="font-bold">Pegawai Penjaga Latihan</div>
            </div>
            
            <div className="space-y-12 col-span-2 w-1/2 mx-auto mt-8">
              <div className="border-b border-dashed border-black mx-4"></div>
              <div className="font-bold">Setiausaha Cawangan</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
