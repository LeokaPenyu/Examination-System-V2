import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Edit, Save, X } from 'lucide-react';

interface Tetapan {
  id: string;
  name: string;
  value: string;
}

const initialTetapan: Tetapan[] = [
  { id: '1', name: 'Julat tarikh sebelum hari peperiksaan (hari)', value: '9' },
  { id: '2', name: 'Yuran peperiksaan biasa untuk ahli (RM)', value: '0' },
  { id: '3', name: 'Yuran peperiksaan biasa untuk bukan ahli (RM)', value: '14' },
  { id: '4', name: 'Yuran pembaharuan sijil untuk ahli (RM)', value: '10' },
  { id: '5', name: 'Yuran pembaharuan sijil untuk bukan ahli (RM)', value: '10' },
];

export const TetapanAm = () => {
  const [tetapanList, setTetapanList] = useState<Tetapan[]>(initialTetapan);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTetapan, setEditingTetapan] = useState<Tetapan | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleOpenModal = (tetapan: Tetapan) => {
    setEditingTetapan(tetapan);
    setEditValue(tetapan.value);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto border border-gray-300 min-h-[600px] text-black">
      {/* Document Header */}
      <div className="border-b-2 border-black pb-4 mb-6">
        <h1 className="text-xl font-bold uppercase text-center">Rumusan Tetapan Sistem</h1>
      </div>

      {/* Table Section */}
      <div className="mt-4">
        <table className="w-full border-collapse border border-gray-400">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-400 px-4 py-2 text-left">NAMA</th>
              <th className="border border-gray-400 px-4 py-2 text-center w-24">NILAI</th>
              <th className="border border-gray-400 px-4 py-2 text-center w-24">TINDAKAN</th>
            </tr>
          </thead>
          <tbody>
            {tetapanList.map((tetapan) => (
              <tr key={tetapan.id} className="hover:bg-gray-50">
                <td className="border border-gray-400 px-4 py-2">{tetapan.name}</td>
                <td className="border border-gray-400 px-4 py-2 text-center font-bold">{tetapan.value}</td>
                <td className="border border-gray-400 px-4 py-2 text-center">
                  <button 
                    onClick={() => handleOpenModal(tetapan)}
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal - Kept consistent with document-style */}
      {isModalOpen && editingTetapan && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-500 w-full max-w-md p-6">
            <h3 className="font-bold border-b border-black pb-2 mb-4">Kemaskini Nilai</h3>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-1">{editingTetapan.name}</label>
              <input 
                type="text" 
                value={editValue} 
                onChange={e => setEditValue(e.target.value)} 
                className="w-full border border-gray-400 p-2"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-1 border border-gray-400 hover:bg-gray-100">Tutup</button>
              <button onClick={() => { /* logic here */ setIsModalOpen(false); }} className="px-4 py-1 bg-black text-white hover:bg-gray-800">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};