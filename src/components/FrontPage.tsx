import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, User, Shield, BookOpen } from 'lucide-react';

interface FrontPageProps {
  onSelectRole: (role: 'coordinator' | 'candidate') => void;
}

const images = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZhPRLgON_ZGefhAhb-9LLhF3ESDlj-H69i9Hk7DKUueDvuJGpoQItwrZI&s=10",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQndDng65hyIZaSw3u2laAm2OvCyqiHrYQZ1ZwVsXX4HKzh4h8ocrdGKz7l&s=10",
  "https://scontent-sin11-2.xx.fbcdn.net/v/t39.30808-6/696503298_122225244560307027_2939984923364516661_n.jpg?stp=dst-jpg_tt6&cstp=mx764x1080&ctp=s720x720&_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=dpGRkXnwDd4Q7kNvwGmdXQ_&_nc_oc=Adr8nsVFlnUVMeWffeVg11abbd8pYHj_w1Fxk4MpubA4Sra8psrm008pXyFnrP-PhY8&_nc_zt=23&_nc_ht=scontent-sin11-2.xx&_nc_gid=PSeqp1ScW4l_oBLPmxJjmw&_nc_ss=7b289&oh=00_Af-xGXyUOMN--w_QZzBR3js_sioLISQbqmBsdv6px_u4SQ&oe=6A416D55"
];

export const FrontPage: React.FC<FrontPageProps> = ({ onSelectRole }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#FF0052] flex items-center justify-center p-4 sm:p-8 selection:bg-red-100 relative">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-white/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5),0_10px_30px_-5px_rgba(0,0,0,0.3)] border-t border-l border-white/60 overflow-hidden flex flex-col md:flex-row relative z-10 min-h-[500px] hover:shadow-[0_30px_70px_-10px_rgba(0,0,0,0.6),0_15px_40px_-5px_rgba(0,0,0,0.4)] transition-shadow duration-500">
        {/* Left Panel - Advertisement */}
        <div className="hidden md:flex md:w-1/2 relative bg-white border-r border-gray-200 overflow-hidden flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={images[currentImageIndex]}
              alt="Advertisement"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full object-contain p-4"
            />
          </AnimatePresence>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col items-center justify-center bg-white relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-xs flex flex-col items-center relative z-10"
          >
            {/* Logo */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-transparent flex items-center justify-center mb-6 relative">
              <img 
                src="https://api.mrcscommunity.org.my/uploads/event/20241025-5d0jbb-mrcs-logo-roundel.png" 
                alt="MRCS Logo" 
                className="w-full h-full object-contain drop-shadow-sm"
                onError={(e) => {
                  // Fallback if the URL breaks
                  (e.target as HTMLImageElement).src = 'https://mrcscommunity.org.my/images/logo.svg';
                }} 
              />
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8 tracking-tight text-center">Red Crescent</h2>

            <div className="w-full space-y-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectRole('candidate')}
                className="w-full bg-white border border-brand-red text-brand-red hover:bg-red-50 font-bold py-3 px-4 rounded-xl transition-all shadow-sm text-sm sm:text-base flex items-center justify-center gap-3"
              >
                <User className="w-5 h-5" /> Calon / Umum
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectRole('coordinator')}
                className="w-full bg-brand-red hover:bg-brand-red-deep text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm text-sm sm:text-base flex items-center justify-center gap-3"
              >
                <Building2 className="w-5 h-5" /> Admin
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
