import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language, TRANSLATIONS } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS[Language.BM]) => string;
  translateContent: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple mock dictionary for demo automatic translation
const MOCK_DICTIONARY: Record<string, { BM: string; EN: string }> = {
  "Apakah prinsip pertama di dalam pergerakan Palang Merah?": {
    BM: "Apakah prinsip pertama di dalam pergerakan Palang Merah?",
    EN: "What is the first principle of the Red Cross movement?"
  },
  "Kemanusiaan": { BM: "Kemanusiaan", EN: "Humanity" },
  "Kesaksamaan": { BM: "Kesaksamaan", EN: "Impartiality" },
  "Keberkecualian": { BM: "Keberkecualian", EN: "Neutrality" },
  "Kebebasan": { BM: "Kebebasan", EN: "Independence" },
  "Berapakah bilangan prinsip asas pergerakan Palang Merah dan Bulan Sabit Merah?": {
    BM: "Berapakah bilangan prinsip asas pergerakan Palang Merah dan Bulan Sabit Merah?",
    EN: "How many fundamental principles are there in the Red Cross and Red Crescent movement?"
  },
  "Identity Verification Required": {
    BM: "Pengesahan Identiti Diperlukan",
    EN: "Identity Verification Required"
  },
  "Please ensure you have your physical MyKad, Pasport, or BSMM Membership Card ready. Online exams require active web camera monitoring and a stable internet connection.": {
    BM: "Sila pastikan anda mempunyai MyKad, Pasport, atau Kad Keahlian BSMM fizikal yang bersedia. Peperiksaan dalam talian memerlukan pemantauan kamera web aktif dan sambungan internet yang stabil.",
    EN: "Please ensure you have your physical MyKad, Pasport, or BSMM Membership Card ready. Online exams require active web camera monitoring and a stable internet connection."
  },
  "Active Registrations": {
    BM: "Pendaftaran Aktif",
    EN: "Active Registrations"
  },
  "System Online": {
    BM: "Sistem Dalam Talian",
    EN: "System Online"
  },
  "Masa yang diperuntukkan adalah 45 minit.": {
    BM: "Masa yang diperuntukkan adalah 45 minit.",
    EN: "The time allocated is 45 minutes."
  },
  "Terdapat 40 soalan objektif yang perlu dijawab.": {
    BM: "Terdapat 40 soalan objektif yang perlu dijawab.",
    EN: "There are 40 objective questions to be answered."
  },
  "Sila pastikan sambungan internet anda stabil.": {
    BM: "Sila pastikan sambungan internet anda stabil.",
    EN: "Please ensure your internet connection is stable."
  },
  "Jangan tutup (close) atau muat semula (refresh) pelayar web web semasa peperiksaan sedang berjalan. Jawapan anda mungkin tidak akan direkodkan.": {
    BM: "Jangan tutup (close) atau muat semula (refresh) pelayar web web semasa peperiksaan sedang berjalan. Jawapan anda mungkin tidak akan direkodkan.",
    EN: "Do not close or refresh the web browser while the exam is running. Your answers may not be recorded."
  },
  "Arahan Penting": {
    BM: "Arahan Penting",
    EN: "Important Instructions"
  },
  "Mula Peperiksaan Sekarang": {
    BM: "Mula Peperiksaan Sekarang",
    EN: "Start Exam Now"
  },
  "Sila baca arahan di bawah sebelum memulakan peperiksaan anda.": {
    BM: "Sila baca arahan di bawah sebelum memulakan peperiksaan anda.",
    EN: "Please read the instructions below before starting your exam."
  },
  "Peperiksaan Selesai": {
    BM: "Peperiksaan Selesai",
    EN: "Exam Completed"
  },
  "Terima kasih kerana melengkapkan peperiksaan. Jawapan anda telah direkodkan. Sila rujuk Penyelaras Peperiksaan untuk maklumat lanjut.": {
    BM: "Terima kasih kerana melengkapkan peperiksaan. Jawapan anda telah direkodkan. Sila rujuk Penyelaras Peperiksaan untuk maklumat lanjut.",
    EN: "Thank you for completing the exam. Your answers have been recorded. Please refer to the Exam Coordinator for further information."
  },
  "Kembali ke Papan Pemuka": {
    BM: "Kembali ke Papan Pemuka",
    EN: "Return to Dashboard"
  },
  "Soalan": {
    BM: "Soalan",
    EN: "Question"
  },
  "Sebelumnya": {
    BM: "Sebelumnya",
    EN: "Previous"
  },
  "Seterusnya": {
    BM: "Seterusnya",
    EN: "Next"
  },
  "Hantar Jawapan": {
    BM: "Hantar Jawapan",
    EN: "Submit Answers"
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(Language.BM);

  const handleSetLanguage = (newLang: Language) => {
    setLanguage(newLang);
    
    // Trigger Google Translate wrapper seamlessly with retry logic
    let retries = 0;
    const triggerTranslate = () => {
        const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (select) {
            select.value = newLang === Language.EN ? 'en' : 'ms';
            select.dispatchEvent(new Event('change'));
        } else if (retries < 20) {
            retries++;
            setTimeout(triggerTranslate, 200);
        }
    };
    triggerTranslate();
  };

  const t = (key: keyof typeof TRANSLATIONS[Language.BM]) => {
    return TRANSLATIONS[language][key] || key;
  };

  // Mock auto translator
  const translateContent = (text: string) => {
    if (!text) return text;
    // Check if we have a direct match in our dictionary
    const dictMatch = MOCK_DICTIONARY[text] || Object.values(MOCK_DICTIONARY).find(v => v.BM === text || v.EN === text);
    if (dictMatch) {
      return dictMatch[language];
    }
    
    // If no match, add a small indicator to show "auto-translation" is active for demo
    if (language === Language.EN && !text.match(/^[0-9]+$/)) {
      // Very basic keyword replacement for demo purposes
      let translated = text
        .replace(/Soalan Tidak Diketahui/gi, "Unknown Question")
        .replace(/Tiada/gi, "None")
        .replace(/Pilihan/gi, "Option")
        .replace(/Disertakan/gi, "Included");
        
      if (translated === text && text.length > 3) {
         // Fake translation suffix if we don't know the phrase
         return text;
      }
      return translated;
    } else if (language === Language.BM && !text.match(/^[0-9]+$/)) {
      let translated = text
        .replace(/Unknown Question/gi, "Soalan Tidak Diketahui")
        .replace(/None/gi, "Tiada")
        .replace(/Option/gi, "Pilihan")
        .replace(/Included/gi, "Disertakan");

      if (translated === text && text.length > 3 && !text.match(/[a-zA-Z]/i) === false) {
         return text;
      }
      return translated;
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, translateContent }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
