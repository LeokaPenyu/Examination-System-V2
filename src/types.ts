export enum UserRole {
  DEC = 'District Exam Coordinator',
  SEC = 'State Exam Coordinator',
  SEBC = 'State Exam Board Chairman'
}

export enum ExamStatus {
  DRAFT = 'Draft',
  PENDING_VERIFICATION = 'Menunggu Pengesahan',
  APPROVED = 'Diluluskan',
  REJECTED = 'Ditolak',
  LOCKED = 'Dikunci',
  EXPIRED = 'Tamat Tempoh',
  SUBMITTED = 'Dihantar',
  COMPLETED = 'Selesai',
  UNLOCK_REQUESTED = 'Menunggu Buka Kunci'
}

export type MembershipCategory = 'Cadet' | 'VAD' | 'Member' | 'Public';

export interface Candidate {
  id: string;
  name: string;
  icNumber: string;
  membershipId: string;
  membershipCategory?: MembershipCategory;
  status: 'Pass' | 'Fail' | 'Absent' | 'Pending';
  isMember?: boolean;
  attendance?: {
    theory: boolean;
    oral: boolean;
    practical: boolean;
  };
  scores?: {
    theory: number | string;
    oral: number | string;
    practical: number | string;
  };
}

export interface Jurulatih {
  id: string;
  name: string;
  icNumber: string;
  address: string;
  warrantNumber: string;
  certExpiryDate?: string;
}

export interface Penyelia {
  id: string;
  name: string;
  icNumber: string;
}

export interface Pemeriksa {
  id: string;
  name: string;
  address: string;
  warrantNumber: string;
  certExpiryDate?: string;
}

export interface ApplicationFormState {
  district: string;
  organizationName: string;
  categoryVAD: boolean;
  categoryPrivate: boolean;
  examAddress: string;
  trainingOfficerName: string;
  trainingOfficerId: string;
  trainingOfficerAddress: string;
  examDate: string;
  subject: string;
  languageBM: boolean;
  languageBI: boolean;
  languageBC: boolean;
  paymentDescription: string;
  attachment?: {
    name: string;
    size: string;
    file?: File;
  };
  candidates: Candidate[];
  jurulatih: Jurulatih[];
  penyelia: Penyelia[];
  pemeriksa: Pemeriksa[];
}

export interface Exam {
  id: string;
  title: string;
  type: string;
  date: string;
  district: string;
  status: ExamStatus;
  candidateCount: number;
  daysRemainingBeforeLock?: number;
}

export enum Language {
  BM = 'BM',
  EN = 'EN'
}

export type ViewType = 'Dashboard' | 'Calon' | 'ExamProfile' | 'ExamSchedule' | 'Jurulatih' | 'Panduan' | 'NewRequest' | 'ExamApplication' | 'CertificateRenewal' | 'AttendanceCertificate' | 'OnlineExam' | 'ExamResults' | 'QuestionBank' | 'Retest' | 'Reports' | 'ProfilDaerah' | 'ProfilSubjek' | 'ProfilPengguna' | 'PerananPengguna' | 'TetapanAm' | 'PeperiksaanMain' | 'ExamPaperGenerator';

export const TRANSLATIONS = {
  [Language.BM]: {
    dashboard: "Papan Pemuka",
    candidates: "Calon",
    exam: "Peperiksaan",
    profile: "Profil Peperiksaan",
    schedule: "Jadual Peperiksaan Pusat",
    trainer: "Jurulatih",
    guide: "Panduan",
    newRequest: "Permohonan Baru",
    welcome: "Selamat Datang ke EASY",
    roleSummary: "Ringkasan pengurusan peperiksaan untuk",
    upcomingExams: "Peperiksaan Akan Datang",
    pendingVerification: "Menunggu Pengesahan",
    completedMonth: "Selesai (Bulan Ini)",
    lockedReports: "Laporan Terkunci",
    details: "Butiran",
    searchPlaceholder: "Cari permohonan, calon atau peperiksaan...",
    back: "Kembali",
    save: "Simpan & Sambung Kemudian",
    submit: "Hantar",
    examApplication: "Permohonan Peperiksaan",
    add: "+ Tambah",
    search: "Cari",
    statusSelect: "Status",
    subjectSelect: "Subjek",
    districtSelect: "Nama Daerah",
    regNoLabel: "No. Pendaftaran",
    examDateRange: "Tarikh Peperiksaan",
    from: "Dari",
    to: "Hingga",
    readyLabel: "Bersedia untuk menyediakan Laporan Ringkas",
    openExaminerLabel: "Permintaan membuka Pemeriksa",
    noHeader: "NO.",
    regNoHeader: "NO. PENDAFTARAN",
    districtHeader: "NAMA DAERAH",
    examDateHeader: "TARIKH PEPERIKSAAN",
    feeHeader: "JUMLAH YURAN(RM)",
    candidateCountHeader: "JUMLAH CALON",
    subjectHeader: "SUBJEK",
    updatedHeader: "DIPERBAHARUI?",
    totalRecords: "Jumlah Rekod",
    first: "Pertama",
    previous: "Sebelumnya",
    next: "Seterusnya",
    last: "Terakhir",
    appTitle: "EASY - Sistem Pentadbiran Peperiksaan",
    mrcsBrand: "Persatuan Bulan Sabit Merah Malaysia",
    registrationTitle: "Pendaftaran Peperiksaan",
    systemSubtitle: "Sistem EASY • Pendaftaran Kursus & Peperiksaan MRCS",
    tabApplication: "Borang Permohonan",
    tabSummary: "Rumusan Peperiksaan",
    tabResult: "Keputusan",
    organizerInfo: "Maklumat Penganjur",
    districtLabel: "Nama Daerah",
    selectDistrict: "Pilih Daerah",
    categoryLabel: "Kategori",
    orgNameLabel: "Nama Organisasi / Unit",
    orgNamePlaceholder: "Contoh: SMK Green Road / Hospital Miri",
    examAddressLabel: "Alamat Peperiksaan",
    examAddressPlaceholder: "Alamat penuh lokasi peperiksaan...",
    officerInfo: "Pegawai Penjaga Latihan",
    officerNameLabel: "Nama Pegawai Penjaga Latihan",
    officerIdLabel: "No. Kad Ahli Pegawai",
    candidateList: "Senarai Calon",
    uploadCsv: "Muat Naik CSV",
    addCandidate: "Tambah Calon",
    noCandidates: "Tiada calon ditambah lagi. Sila tambah secara manual atau muat naik CSV.",
    bil: "Bil",
    fullName: "Nama Penuh (Seperti Dalam IC/Pasport)",
    icNumber: "No. IC / Pasport",
    membershipNumber: "No. Ahli BSMM (Jika Ada)",
    action: "Tindakan",
    feeSummary: "Rumusan Yuran",
    member: "Ahli",
    nonMember: "Bukan Ahli",
    totalPayment: "Jumlah Bayaran",
    languageOptionLabel: "Bahasa Peperiksaan",
    paymentProofLabel: "Bukti Pembayaran",
    uploadReceipt: "Muat Naik Resit (PDF/JPG)",
    paymentDescriptionPlaceholder: "Keterangan bayaran (Contoh: Maybank Receipt - 1234)",
    registrationInstructions: "Arahan Pendaftaran",
    instructionDate: "Tarikh: Permohonan mestilah dihantar sekurang-kurangnya 14 hari sebelum tarikh peperiksaan.",
    instructionFee: "Yuran: RM 2.00 untuk ahli BSMM yang sah, RM 14.00 untuk bukan ahli.",
    instructionCsv: "CSV: Gunakan format standard (Nama, IC, No Ahli) untuk muat naik pukal.",
    moduleLocked: "Modul ini disekat",
    optimizationNotice: "Modul ini sedang dioptimumkan mengikut standard Kerajaan Sarawak dan SAINS.",
    confidentialNotice: "Sulit Sahaja • Sistem Pentadbiran Peperiksaan PBSM (EASY) v1.0 • © 2026 SAINS",
    page: "Halaman",
    examStatus: "Status Peperiksaan",
    viewAll: "Lihat Semua",
    examTitle: "Tajuk Peperiksaan",
    date: "Tarikh",
    statusHeader: "STATUS",
    selectExamType: "Sila pilih jenis peperiksaan untuk diteruskan.",
    examTypeLabel: "Nama (Type of Exam)",
    pilih: "PILIH",
    peperiksaanBerpusatNote: "Nota: Anda boleh memilih dari senarai jatuh untuk Peperiksaan Berpusat yang tarikhnya telah ditetapkan",
    examTypePlaceholder: "-- Sila Pilih Peperiksaan --",
    lockedNoticeTitle: "Peringatan: Laporan Terkunci",
    lockedNoticeDesc: "Peperiksaan EX002 telah tamat 7 hari yang lalu. Rumusan peperiksaan belum dihantar. Sila minta Buka Kunci.",
    requestUnlock: "Minta Buka Kunci",
    quickLinks: "Pautan Pantas",
    downloadGuide: "Muat Turun Panduan",
    summaryForm: "Borang Rumusan",
    statusDraft: "Draf",
    statusPending: "Menunggu Pengesahan",
    statusApproved: "Diluluskan",
    statusRejected: "Ditolak",
    statusLocked: "Dikunci",
    statusCompleted: "Selesai",
    searchExistingCandidate: "Cari Calon Sedia Ada",
    candidateSearchTitle: "Carian Calon",
    select: "Pilih",
    name: "Nama",
    noRecordFound: "Tiada Rekod Diterima",
    close: "Tutup",
    membershipCategory: "Kategori Keahlian",
    delete: "Hapus",
    exampleMembershipNo: "Contoh: SWOT-12345",
    trainerList: "Senarai Jurulatih",
    addTrainer: "Tambah Jurulatih",
    trainerName: "Nama Jurulatih",
    trainerIc: "No. KP/Pasport Jurulatih",
    noWaranTrainer: "No. Waran/No. Jurulatih",
    trainerAddress: "Alamat Jurulatih",
    eksportCsv: "Eksport ke CSV",
    view: "Papar",
    update: "Kemaskini",
    tambahCalon: "Tambah Calon",
    ubahCalon: "Ubah Calon",
    ubahJurulatih: "Ubah Jurulatih",
    padam: "Padam",
    recordCount: "Jumlah Rekod :",
    pageOf: "dari",
    noItemFound: "Tiada rekod dijumpai.",
    saveTrainer: "Simpan Jurulatih",
    saveCandidate: "Simpan Calon"
  },
  [Language.EN]: {
    dashboard: "Dashboard",
    candidates: "Candidates",
    exam: "Examination",
    profile: "Exam Profile",
    schedule: "Exam Schedule",
    trainer: "Trainer",
    guide: "User Guide",
    newRequest: "New Request",
    welcome: "Welcome to EASY",
    roleSummary: "Examination management summary for",
    upcomingExams: "Upcoming Exams",
    pendingVerification: "Pending Verification",
    completedMonth: "Completed (This Month)",
    lockedReports: "Locked Reports",
    details: "Details",
    searchPlaceholder: "Search applications, candidates or exams...",
    back: "Back",
    save: "Save & Continue",
    submit: "Submit Application",
    examApplication: "Exam Application",
    add: "+ Add",
    search: "Search",
    statusSelect: "Status",
    subjectSelect: "Subject",
    districtSelect: "District Name",
    regNoLabel: "Registration No.",
    examDateRange: "Examination Date",
    from: "From",
    to: "To",
    readyLabel: "Ready to provide Brief Report",
    openExaminerLabel: "Request to open Examiner",
    noHeader: "NO.",
    regNoHeader: "REGISTRATION NO.",
    districtHeader: "DISTRICT NAME",
    examDateHeader: "EXAM DATE",
    feeHeader: "TOTAL FEE(RM)",
    candidateCountHeader: "TOTAL CANDIDATES",
    subjectHeader: "SUBJECT",
    updatedHeader: "UPDATED?",
    totalRecords: "Total Records",
    first: "First",
    previous: "Previous",
    next: "Next",
    last: "Last",
    appTitle: "EASY - Exam Administration System",
    mrcsBrand: "Malaysian Red Crescent Society",
    registrationTitle: "Examination Registration",
    systemSubtitle: "EASY System • MRCS Course & Exam Registration",
    tabApplication: "Application Form",
    tabSummary: "Examination Summary",
    tabResult: "Results",
    organizerInfo: "Organizer Information",
    districtLabel: "District Name",
    selectDistrict: "Select District",
    categoryLabel: "Category",
    orgNameLabel: "Organization / Unit Name",
    orgNamePlaceholder: "Example: SMK Green Road / Hospital Miri",
    examAddressLabel: "Examination Address",
    examAddressPlaceholder: "Full address of examination location...",
    officerInfo: "Training Officer In-Charge",
    officerNameLabel: "Officer In-Charge Name",
    officerIdLabel: "Officer Member ID No.",
    candidateList: "Candidate List",
    uploadCsv: "Upload CSV",
    addCandidate: "Add Candidate",
    noCandidates: "No candidates added yet. Please add manually or upload CSV.",
    bil: "No.",
    fullName: "Full Name (As in IC/Passport)",
    icNumber: "IC / Passport No.",
    membershipNumber: "BSMM Member No. (If applicable)",
    action: "Action",
    feeSummary: "Fee Summary",
    member: "Member",
    nonMember: "Non-Member",
    totalPayment: "Total Payment",
    languageOptionLabel: "Examination Language",
    paymentProofLabel: "Proof of Payment",
    uploadReceipt: "Upload Receipt (PDF/JPG)",
    paymentDescriptionPlaceholder: "Payment description (Example: Maybank Receipt - 1234)",
    registrationInstructions: "Registration Instructions",
    instructionDate: "Date: Application must be submitted at least 14 days before the exam date.",
    instructionFee: "Fee: RM 2.00 for valid BSMM members, RM 14.00 for non-members.",
    instructionCsv: "CSV: Use standard format (Name, IC, Member No) for bulk upload.",
    modulePendingTitle: "This module will be activated once your registration is approved.",
    moduleLocked: "Module Locked",
    optimizationNotice: "This module is currently being optimized for the Sarawak Government and SAINS standards.",
    confidentialNotice: "Strictly Confidential • MRCS Examination Administration System (EASY) v1.0 • © 2026 SAINS",
    page: "Page",
    examStatus: "Exam Status",
    viewAll: "View All",
    examTitle: "Exam Title",
    date: "Date",
    statusHeader: "STATUS",
    selectExamType: "Please select exam type to proceed.",
    examTypeLabel: "Name (Type of Exam)",
    pilih: "CHOOSE",
    peperiksaanBerpusatNote: "Note: You can select from the drop-down list for Peperiksaan Berpusat which the date already fixed",
    examTypePlaceholder: "-- Please Select Exam --",
    lockedNoticeTitle: "Notice: Locked Reports",
    lockedNoticeDesc: "Examination EX002 ended 7 days ago. Examination summary not submitted. Please request Unlock.",
    requestUnlock: "Request Unlock",
    quickLinks: "Quick Links",
    downloadGuide: "Download Guide",
    summaryForm: "Summary Form",
    statusDraft: "Draft",
    statusPending: "Pending Verification",
    statusApproved: "Approved",
    statusRejected: "Rejected",
    statusLocked: "Locked",
    statusCompleted: "Completed",
    searchExistingCandidate: "Search Existing Candidate",
    candidateSearchTitle: "Candidate Search",
    select: "Select",
    name: "Name",
    noRecordFound: "No Record Found",
    close: "Close",
    membershipCategory: "Membership Category",
    delete: "Delete",
    exampleMembershipNo: "Example: SWOT-12345",
    trainerList: "Trainer List",
    addTrainer: "Add Trainer",
    trainerName: "Trainer Name",
    trainerIc: "Trainer IC/Passport No.",
    noWaranTrainer: "Warrant No. / Trainer No.",
    trainerAddress: "Trainer Address",
    eksportCsv: "Export to CSV",
    view: "View",
    update: "Update",
    tambahCalon: "Add Candidate",
    ubahCalon: "Edit Candidate",
    ubahJurulatih: "Edit Trainer",
    padam: "Delete",
    recordCount: "Total Records :",
    pageOf: "of",
    noItemFound: "No records found.",
    saveTrainer: "Save Trainer",
    saveCandidate: "Save Candidate"
  }
};
