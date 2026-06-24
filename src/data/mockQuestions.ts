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
  },
  {
    desc: 'Apakah tanda utama seseorang sedang mengalami strok?',
    opts: ['Menjerit kesakitan', 'Muka menjadi separuh herot atau lemah', 'Suhu badan naik mendadak', 'Pendarahan pada hidung'],
    ans: 'Muka menjadi separuh herot atau lemah'
  },
  {
    desc: 'Bagaimanakah cara untuk merawat pendarahan hidung?',
    opts: ['Dongakkan kepala mangsa ke belakang', 'Letakkan ais pada dahi', 'Tundukkan kepala mangsa dan picit hidung', 'Sumbat hidung dengan tisu'],
    ans: 'Tundukkan kepala mangsa dan picit hidung'
  },
  {
    desc: 'Dalam rawatan terbakar, apakah yang patut dilakukan dengan segera?',
    opts: ['Sapukan ubat gigi', 'Balut dengan kapas', 'Lalukan kawasan terbakar di bawah air bersih sekurang-kurangnya 10 minit', 'Pecahkan gelembung air'],
    ans: 'Lalukan kawasan terbakar di bawah air bersih sekurang-kurangnya 10 minit'
  },
  {
    desc: 'Apakah tujuan utama bantuan pernafasan (Rescue Breathing)?',
    opts: ['Menghidupkan jantung', 'Membekalkan oksigen ke paru-paru', 'Meredakan tekanan mangsa', 'Memanaskan badan mangsa'],
    ans: 'Membekalkan oksigen ke paru-paru'
  },
  {
    desc: 'Siapakah pengasas pergerakan Palang Merah antarabangsa?',
    opts: ['Florence Nightingale', 'Henry Dunant', 'Clara Barton', 'Louis Pasteur'],
    ans: 'Henry Dunant'
  }
];

const generateMockQuestions = (): Question[] => {
  const generated: Question[] = [];
  let qId = 1;
  ALL_COURSES.forEach(course => {
    ALL_CATEGORIES.forEach(category => {
      // Put 5 mock questions into each category for full example
      MOCK_QUESTIONS_POOL.slice(0, 5).forEach((q) => {
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
