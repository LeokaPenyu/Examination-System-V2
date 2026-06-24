import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, Save, User, CheckCircle } from 'lucide-react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export interface UserProfileData {
  name: string;
  email: string;
  bio: string;
  avatarUrl: string | null;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserProfileData;
  onSave: (data: UserProfileData) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, userData, onSave }) => {
  const [formData, setFormData] = useState<UserProfileData>(userData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(userData);
      setErrors({});
      setImageSrc(null);
      setIsCropping(false);
      setSaveSuccess(false);
    }
  }, [isOpen, userData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Nama wajib diisi";
    if (!formData.email.trim()) {
      newErrors.email = "E-mel wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format e-mel tidak sah";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop({
        unit: '%',
        width: 50,
        height: 50,
        x: 25,
        y: 25
      });
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || '');
        setIsCropping(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getCroppedImg = () => {
    if (!completedCrop || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    const base64Image = canvas.toDataURL('image/jpeg');
    setFormData({ ...formData, avatarUrl: base64Image });
    setIsCropping(false);
    setImageSrc(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="user-profile-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col my-8"
          >
          <div className="bg-brand-red p-4 flex justify-between items-center">
            <h2 className="text-white font-bold text-lg">Profil Pengguna</h2>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 md:p-6 overflow-y-auto">
            {saveSuccess ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-800">Profil Dikemaskini!</h3>
                <p className="text-gray-500 mt-2">Maklumat profil anda telah berjaya disimpan.</p>
              </motion.div>
            ) : isCropping && imageSrc ? (
              <div className="flex flex-col items-center">
                <h3 className="font-bold text-charcoal mb-4">Potong Gambar Profil</h3>
                <div className="bg-gray-100 p-2 rounded-lg max-h-[400px] overflow-hidden">
                  <ReactCrop 
                    crop={crop} 
                    onChange={c => setCrop(c)}
                    onComplete={c => setCompletedCrop(c)}
                    aspect={1}
                    circularCrop
                  >
                    <img src={imageSrc} ref={imgRef} className="max-h-[350px] object-contain" alt="Crop preview" />
                  </ReactCrop>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => { setIsCropping(false); setImageSrc(null); }} className="btn-secondary">Batal</button>
                  <button onClick={getCroppedImg} className="btn-primary">Guna Gambar</button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-sm overflow-hidden flex items-center justify-center">
                      {formData.avatarUrl ? (
                        <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-brand-red text-white p-2 rounded-full shadow-md hover:bg-red-700 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    onChange={onSelectFile}
                    className="hidden" 
                  />
                  <p className="text-xs text-gray-500 mt-2">Format disokong: JPG, PNG</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Nama Penuh</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md p-2.5 text-sm outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20`}
                      placeholder="Nama anda"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">E-mel</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md p-2.5 text-sm outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20`}
                      placeholder="e.g. email@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Bio / Peranan</label>
                    <textarea 
                      value={formData.bio}
                      onChange={e => setFormData({...formData, bio: e.target.value})}
                      className="w-full border border-gray-300 rounded-md p-2.5 text-sm outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20"
                      rows={3}
                      placeholder="Maklumat tambahan / bio ringkas"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {!saveSuccess && !isCropping && (
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-xl">
              <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors shadow-sm">
                Batal
              </button>
              <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-action-teal text-white text-sm font-bold rounded-md hover:bg-teal-700 transition-colors shadow-sm">
                <Save className="w-4 h-4" /> Simpan
              </button>
            </div>
          )}
        </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
