import { ExamStatus } from '../types';

export interface MockExam {
  id: string;
  no: number;
  regNo: string;
  district: string;
  date: string;
  fee: number;
  candidatesCount: number;
  subject: string;
  updated: string;
  status: ExamStatus;
  organization: string;
  unitName: string;
  category: string;
  courseStart: string;
  courseEnd: string;
  examDate: string;
  deadline: string;
  address: string;
  officerCount?: number;
  remark?: string;
  applicationLetter?: string;
  supportDoc?: string;
  certReady?: string;
  formA?: string;
  formB?: string;
  candidates: any[];
  examiners?: any[];
  attachment?: {
    name: string;
    size: string;
    url?: string;
  };
  unlockRequestCount?: number;
  unlockPaymentProof?: {
    name: string;
    size: string;
    url?: string;
  };
}

export const mockExams: MockExam[] = [
  {
    id: '1',
    no: 1,
    regNo: 'BTU/2016/0009',
    district: 'BINTULU',
    date: '2016-11-18',
    fee: 4.00,
    candidatesCount: 2,
    subject: '800/2 - Pertolongan Cemas Asas dan CPR',
    updated: 'Ya',
    status: ExamStatus.EXPIRED,
    organization: 'Sekolah SAINS',
    unitName: 'Sekolah SAINS',
    category: 'Private',
    courseStart: '10/11/2016',
    courseEnd: '18/11/2016',
    examDate: '18/11/2016',
    deadline: '25/11/2016',
    address: 'Sekolah SAINS',
    unlockRequestCount: 0,
    candidates: [
      { id: 'c1', name: 'DORY THE FISH', idNo: 'K099012', membershipNo: '123441', isMember: true, attendance: { theory: false, oral: false, practical: false } },
      { id: 'c2', name: 'FELIX THE CAT', idNo: 'K090012', membershipNo: '123442', isMember: true, attendance: { theory: false, oral: false, practical: false } },
    ]
  },
  {
    id: 'unlock-req-sec',
    no: 2,
    regNo: 'KCH/2023/0022',
    district: 'KUCHING',
    date: '2023-04-10',
    fee: 15.00,
    candidatesCount: 5,
    subject: '700/1 - Pendidikan Kesihatan Asas',
    updated: 'Ya',
    status: ExamStatus.UNLOCK_REQUESTED,
    organization: 'MRCS Kuching',
    unitName: 'Unit Kuching 01',
    category: 'NGO',
    courseStart: '01/04/2023',
    courseEnd: '10/04/2023',
    examDate: '10/04/2023',
    deadline: '17/04/2023',
    address: 'HQ Kuching',
    unlockRequestCount: 1,
    candidates: [
      { id: 'c1', name: 'AHMAD BIN ALI', idNo: '950101-13-5555', membershipNo: 'S-12345', isMember: true, attendance: { theory: true, oral: true, practical: true } },
    ]
  },
  {
    id: 'unlock-2nd-dec',
    no: 3,
    regNo: 'MIRI/2020/0011',
    district: 'MIRI',
    date: '2020-08-05',
    fee: 30.00,
    candidatesCount: 10,
    subject: '800/1 - Pertolongan Cemas Asas',
    updated: 'Ya',
    status: ExamStatus.EXPIRED,
    organization: 'Curtin University',
    unitName: 'Curtin Unit 05',
    category: 'Private',
    courseStart: '01/08/2020',
    courseEnd: '05/08/2020',
    examDate: '05/08/2020',
    deadline: '12/08/2020',
    address: 'Lecture Theatre 3',
    unlockRequestCount: 1,
    candidates: [
      { id: 'c1', name: 'SARAH JANE', idNo: '951212-13-4321', membershipNo: 'M-5544', isMember: true, attendance: { theory: true, oral: true, practical: true } },
    ]
  },
  {
    id: '2',
    no: 4,
    regNo: 'KCH/2024/0042',
    district: 'KUCHING',
    date: '2024-03-12',
    fee: 15.00,
    candidatesCount: 10,
    subject: '700/1 - Pendidikan Kesihatan Asas',
    updated: 'Ya',
    status: ExamStatus.PENDING_VERIFICATION,
    organization: 'Malaysian Red Crescent Society',
    unitName: 'Unit Kuching 01',
    category: 'NGO',
    courseStart: '10/03/2024',
    courseEnd: '11/03/2024',
    examDate: '12/03/2024',
    deadline: '19/03/2024',
    address: 'HQ Kuching',
    candidates: [
      { id: 'c1', name: 'ALEX WONG', idNo: '950101-13-5555', membershipNo: 'S-12345', isMember: true, attendance: { theory: false, oral: false, practical: false } },
    ]
  },
  {
    id: '4',
    no: 5,
    regNo: 'SIU/2024/0088',
    district: 'SIBU',
    date: '2024-05-15',
    fee: 50.00,
    candidatesCount: 20,
    subject: '800/2 - Pertolongan Cemas Asas dan CPR',
    updated: 'Ya',
    status: ExamStatus.APPROVED,
    organization: 'SMK Sibu',
    unitName: 'Unit Sibu 02',
    category: 'Government',
    courseStart: '13/05/2024',
    courseEnd: '14/05/2024',
    examDate: '15/05/2024',
    deadline: '22/05/2024',
    address: 'Dewan Sekolah',
    candidates: [
      { id: 'c1', name: 'ALEX WONG', idNo: '980101-13-1111', membershipNo: 'S-9999', isMember: true, attendance: { theory: false, oral: false, practical: false } },
    ]
  },
  {
    id: '6',
    no: 6,
    regNo: 'MIRI/2026/0002',
    district: 'MIRI',
    date: '2026-06-15',
    fee: 100.00,
    candidatesCount: 15,
    subject: '800/1 - Pertolongan Cemas Asas',
    updated: 'Ya',
    status: ExamStatus.SUBMITTED,
    organization: 'SMK Miri Baru',
    unitName: 'Unit Miri 04',
    category: 'Government',
    courseStart: '13/06/2026',
    courseEnd: '14/06/2026',
    examDate: '15/05/2026',
    deadline: '22/05/2026',
    address: 'SMK Miri Hall',
    officerCount: 2,
    remark: 'OK',
    applicationLetter: 'yes',
    supportDoc: 'yes',
    certReady: 'yes',
    formA: 'yes',
    formB: 'no',
    candidates: [
      { id: 'c1', name: 'JANE DOE', idNo: '990101-13-1111', membershipNo: 'S-8888', isMember: true, attendance: { theory: true, oral: true, practical: true } }
    ],
    examiners: []
  },
  {
    id: '7',
    no: 7,
    regNo: 'KCH/2026/0003',
    district: 'KUCHING',
    date: '2026-07-20',
    fee: 150.00,
    candidatesCount: 20,
    subject: '800/3 - Rawatan Asas',
    updated: 'Ya',
    status: ExamStatus.APPROVED,
    organization: 'SMK Kuching Jaya',
    unitName: 'Unit Kuching 05',
    category: 'Government',
    courseStart: '15/07/2026',
    courseEnd: '18/07/2026',
    examDate: '20/07/2026',
    deadline: '27/07/2026',
    address: 'SMK Kuching Hall',
    officerCount: 3,
    remark: 'OK',
    applicationLetter: 'yes',
    supportDoc: 'yes',
    certReady: 'yes',
    formA: 'yes',
    formB: 'no',
    candidates: [
      { id: 'c2', name: 'ALI BIN AHMAD', idNo: '000202-13-2222', membershipNo: 'S-7777', isMember: true, attendance: { theory: false, oral: false, practical: false } }
    ],
    examiners: [
       { id: 'e1', name: 'DR. SITI', role: 'Chief Examiner' }
    ]
  },
  {
    id: '15',
    no: 15,
    regNo: 'SRI/2026/0001',
    district: 'SRI AMAN',
    date: '2026-08-10',
    fee: 120.00,
    candidatesCount: 10,
    subject: '800/1 - Pertolongan Cemas Asas',
    updated: 'Ya',
    status: ExamStatus.REJECTED,
    organization: 'Klinik Sri Aman',
    unitName: 'Unit SA 01',
    category: 'Government',
    courseStart: '01/08/2026',
    courseEnd: '03/08/2026',
    examDate: '10/08/2026',
    deadline: '17/08/2026',
    address: 'Bilik Seminar Sri Aman',
    officerCount: 2,
    remark: 'Dokumen tak lengkap',
    applicationLetter: 'no',
    supportDoc: 'no',
    certReady: 'no',
    formA: 'yes',
    formB: 'no',
    candidates: [
      { id: 'c3', name: 'BUDI BIN KASSIM', idNo: '010303-13-3333', membershipNo: 'S-6666', isMember: true, attendance: { theory: false, oral: false, practical: false } }
    ],
    examiners: []
  },
  {
    id: '8',
    no: 8,
    regNo: 'BTU/2016/0010',
    district: 'BINTULU',
    date: '2016-12-01',
    fee: 4.00,
    candidatesCount: 2,
    subject: '800/2 - Pertolongan Cemas Asas dan CPR',
    updated: 'Ya',
    status: ExamStatus.COMPLETED,
    organization: 'Sekolah SAINS',
    unitName: 'Sekolah SAINS',
    category: 'Private',
    courseStart: '10/11/2016',
    courseEnd: '18/11/2016',
    examDate: '18/11/2016',
    deadline: '25/11/2016',
    address: 'Sekolah SAINS',
    unlockRequestCount: 0,
    candidates: [
      { id: 'c1', name: 'DORY THE FISH', icNumber: 'K099012', membershipId: '123441', status: 'Pass', isMember: true, attendance: { theory: true, oral: true, practical: true }, scores: { theory: 60, oral: 25, practical: 45 } },
      { id: 'c2', name: 'FELIX THE CAT', icNumber: 'K090012', membershipId: '123442', status: 'Fail', isMember: true, attendance: { theory: true, oral: true, practical: true }, scores: { theory: 40, oral: 15, practical: 25 } }
    ]
  }
];
