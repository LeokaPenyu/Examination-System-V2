export interface Question {
  id: string;
  course: string;
  category: string;
  type: 'Objective' | 'Subjective';
  description: string;
  options: string[];
  answer: string;
  score: number;
}

export const COURSES_MAP: Record<string, string> = {
  'CERC1011': 'PENDIDIKAN PALANG MERAH DAN BULAN SABIT MERAH',
  'CBFA1021': 'PERTOLONGAN CEMAS ASAS, CPR DAN AED',
  'CHED1031': 'PENDIDIKAN KESIHATAN',
  'CHNU1041': 'RAWATAN RUMAH',
  'VERC1011': 'PENDIDIKAN PALANG MERAH DAN BULAN SABIT MERAH',
  'VBFA1021': 'PERTOLONGAN CEMAS ASAS, CPR DAN AED',
  'VHED1031': 'PENDIDIKAN KESIHATAN',
  'VHNU1041': 'RAWATAN RUMAH',
  'VDRO1051': 'BANTUAN BENCANA DAN OPERASI MENYELAMAT',
  'VAAM1061': 'PENTADBIRAN DAN PENGURUSAN',
  'VAFA1072': 'PERTOLONGAN CEMAS LANJUTAN, CPR DAN AED',
  'VTME1081': 'KAEDAH MENGAJAR',
  'VBLS1091': 'SOKONGAN HAYAT ASAS',
  'VIHL1102': 'UNDANG-UNDANG KEMANUSIAAN ANTARABANGSA',
  'PBFA1031': 'PERTOLONGAN CEMAS ASAS, CPR DAN AED',
  'PAFA1042': 'PERTOLONGAN CEMAS LANJUTAN, CPR DAN AED'
};

const ALL_COURSES = Object.keys(COURSES_MAP);
const ALL_CATEGORIES = ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'];

const MOCK_QUESTIONS_POOL = [
  {
    desc: 'Berapakah nisbah mampatan dada dan hembusan nafas dalam CPR untuk orang dewasa?',
    opts: ['15:2', '30:2', '30:1', '15:1'],
    ans: '30:2'
  },
  {
    desc: 'Apakah langkah pertama yang perlu dilakukan apabila melihat mangsa yang tidak sedarkan diri?',
    opts: ['Terus buat CPR', 'Periksa pernafasan mangsa', 'Pastikan kawasan persekitaran selamat', 'Panggil ambulans segera'],
    ans: 'Pastikan kawasan persekitaran selamat'
  },
  {
    desc: 'Apakah fungsi utama pembalut segi tiga (triangular bandage) dalam pertolongan cemas?',
    opts: ['Untuk mengikat peralatan', 'Sebagai anduh untuk menyokong lengan', 'Untuk menutup mata', 'Sebagai selimut mangsa'],
    ans: 'Sebagai anduh untuk menyokong lengan'
  },
  {
    desc: 'Berapakah suhu normal badan manusia yang sihat?',
    opts: ['36.5°C - 37.5°C', '35.0°C - 36.0°C', '38.0°C - 39.0°C', '34.0°C - 35.5°C'],
    ans: '36.5°C - 37.5°C'
  },
  {
    desc: 'Antara berikut, yang manakah merupakan prinsip asas Palang Merah dan Bulan Sabit Merah?',
    opts: ['Kekuatan', 'Kemanusiaan', 'Keberanian', 'Kegigihan'],
    ans: 'Kemanusiaan'
  }
];

const MOCK_SUBJECTIVE_POOL = [
  {
    desc: 'Jelaskan tiga langkah keselamatan sebelum memulakan CPR ke atas mangsa.',
    opts: [],
    ans: '1. Pastikan persekitaran selamat.\n2. Pakai sarung tangan jika ada.\n3. Tepuk bahu mangsa dan tanya khabar untuk periksa tindak balas.'
  },
  {
    desc: 'Terangkan perbezaan antara balutan dan anduh.',
    opts: [],
    ans: 'Balutan digunakan untuk menutup luka dan menyerap darah, manakala anduh digunakan untuk menyokong dan merehatkan anggota badan yang tercedera.'
  },
  {
    desc: 'Bincangkan kepentingan Prinsip Kemanusiaan dalam Palang Merah.',
    opts: [],
    ans: 'Prinsip Kemanusiaan memastikan bantuan diberikan kepada sesiapa sahaja tanpa diskriminasi, mengutamakan keselamatan dan mengurangkan penderitaan manusia.'
  },
  {
    desc: 'Senaraikan 4 barangan wajib di dalam peti pertolongan cemas.',
    opts: [],
    ans: '1. Pembalut segi tiga\n2. Kain kasa steril\n3. Plaster\n4. Gunting'
  },
  {
    desc: 'Apakah tindakan segera jika mangsa tercekik tetapi masih sedar?',
    opts: [],
    ans: 'Lakukan Heimlich Maneuver (tujah abdomen) untuk mengeluarkan objek yang menyekat saluran pernafasan.'
  }
];

const generateMockQuestions = (): Question[] => {
  const generated: Question[] = [];
  let qId = 1;
  ALL_COURSES.forEach(course => {
    ALL_CATEGORIES.forEach(category => {
      // 5 Objective questions
      MOCK_QUESTIONS_POOL.forEach((q) => {
        generated.push({
          id: `q${qId++}`,
          course,
          category,
          type: 'Objective',
          description: q.desc,
          options: q.opts,
          answer: q.ans,
          score: 5
        });
      });
      // 5 Subjective questions
      MOCK_SUBJECTIVE_POOL.forEach((q) => {
        generated.push({
          id: `q${qId++}`,
          course,
          category,
          type: 'Subjective',
          description: q.desc,
          options: q.opts,
          answer: q.ans,
          score: 10
        });
      });
    });
  });
  return generated;
};

const getInitialQuestions = (): Question[] => {
  const saved = localStorage.getItem('shared_exam_questions');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Force regeneration to reflect latest changes
      if (parsed.length !== ALL_COURSES.length * ALL_CATEGORIES.length * 5) {
         const newlyGenerated = generateMockQuestions();
         localStorage.setItem('shared_exam_questions', JSON.stringify(newlyGenerated));
         return newlyGenerated;
      }
      return parsed;
    } catch (e) {
      console.error('Failed to parse questions from storage', e);
    }
  }
  const newlyGenerated = generateMockQuestions();
  localStorage.setItem('shared_exam_questions', JSON.stringify(newlyGenerated));
  return newlyGenerated;
};

export let sharedQuestions: Question[] = getInitialQuestions();

export const updateSharedQuestions = (newQuestions: Question[]) => {
  sharedQuestions = newQuestions;
  localStorage.setItem('shared_exam_questions', JSON.stringify(newQuestions));
};
