import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield } from 'lucide-react';

interface FrontPageProps {
  onSelectRole: (role: 'coordinator' | 'candidate') => void;
}

export const FrontPage: React.FC<FrontPageProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row overflow-hidden">
      {/* Login Options */}
      <div className="flex-1 p-8 md:p-12 lg:p-16 flex items-center justify-center relative bg-surface">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100"
          >
            <AnimatePresence mode="wait">
              <motion.div 
                key="selection"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-[#F5E6E8] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-[#C0182A]" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                  <p className="text-gray-500">Please select your portal to continue</p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => onSelectRole('coordinator')}
                    className="w-full flex items-center justify-center p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-[#008B8B] hover:text-[#008B8B] transition-all duration-300"
                  >
                    <span className="font-bold">ADMIN</span>
                  </button>

                  <button
                    onClick={() => onSelectRole('candidate')}
                    className="w-full flex items-center justify-center p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-[#C0182A] hover:text-[#C0182A] transition-all duration-300"
                  >
                    <span className="font-bold">Candidate</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 text-center text-xs text-gray-400">
              <p>Secure connection. Data is encrypted and protected.</p>
              <p className="mt-1">© {new Date().getFullYear()} Malaysian Red Crescent Society.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
