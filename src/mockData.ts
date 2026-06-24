import { Exam, ExamStatus, UserRole } from './types';

export const MOCK_EXAMS: Exam[] = [
  {
    id: 'EX001',
    title: 'Kursus Pertolongan Cemas Asas',
    type: '800/1',
    date: '2026-05-20',
    district: 'Kuching',
    status: ExamStatus.PENDING_VERIFICATION,
    candidateCount: 25,
  },
  {
    id: 'EX002',
    title: 'Kursus Pertolongan Cemas Lanjutan',
    type: '800/2',
    date: '2026-05-05',
    district: 'Sibu',
    status: ExamStatus.LOCKED,
    candidateCount: 15,
    daysRemainingBeforeLock: 0
  },
  {
    id: 'EX003',
    title: 'Kursus CPR & AED',
    type: '800/4',
    date: '2026-06-15',
    district: 'Miri',
    status: ExamStatus.APPROVED,
    candidateCount: 40,
  }
];

export const ROLE_CONFIG = {
  [UserRole.DEC]: {
    name: 'District Exam Coordinator',
    permissions: ['submit', 'update_report', 'request_unlock'],
  },
  [UserRole.SEC]: {
    name: 'State Exam Coordinator',
    permissions: ['verify', 'print', 'approve_unlock'],
  },
  [UserRole.SEBC]: {
    name: 'State Exam Board Chairman',
    permissions: ['manage_examiners', 'enter_marks'],
  }
};
