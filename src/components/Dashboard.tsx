import React, { useState } from "react";
import { UserRole, ExamStatus } from "../types";
import { MockExam } from "../data/mockExams";
import { sharedQuestions } from "../data/mockQuestions";
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  Calendar,
  BarChart3,
  AlertCircle,
  Clock,
  RefreshCcw,
  CheckCircle2,
  Lock,
  Download,
  BookOpen,
  User,
  LayoutList,
  CalendarClock
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface DashboardProps {
  role: UserRole;
  exams: MockExam[];
  onViewExam: (id: string) => void;
  onNavigate?: (view: string) => void;
}

const ActionBtn = ({
  onClick,
  children,
  variant = "default",
}: {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "default" | "primary" | "danger";
}) => {
  const baseStyle =
    "px-3 py-1.5 text-xs font-medium rounded-md shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1";
  const variants = {
    default:
      "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-200",
    primary:
      "bg-action-teal border border-transparent text-white hover:bg-teal-700 focus:ring-action-teal/50",
    danger:
      "bg-brand-red border border-transparent text-white hover:bg-red-700 focus:ring-brand-red/50",
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]}`}>
      {children}
    </button>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({
  role,
  exams,
  onViewExam,
  onNavigate,
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-slate-50 p-4 md:p-6 lg:p-8 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-rose-50 text-brand-red rounded-lg">
             <LayoutList className="w-6 h-6" />
          </div>
          <h2 className="font-bold text-xl text-gray-900 tracking-tight">Admin Dashboard</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Question Collection Card */}
          <div 
            onClick={() => onNavigate && onNavigate('QuestionBank')}
            className="cursor-pointer bg-white border border-slate-200 rounded-xl p-6 hover:border-action-teal transition-all group shadow-sm hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-3xl font-black text-charcoal group-hover:text-action-teal transition-colors">16</span>
            </div>
            <h3 className="text-lg font-bold text-charcoal mb-1">Question Collection</h3>
            <p className="text-sm text-slate-500">Manage and view the repository of exam questions</p>
          </div>

          {/* Upcoming Exam Paper Card */}
          <div 
            onClick={() => onNavigate && onNavigate('ExamPaperGenerator')}
            className="cursor-pointer bg-white border border-slate-200 rounded-xl p-6 hover:border-action-teal transition-all group shadow-sm hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-teal-50 p-3 rounded-lg">
                <CalendarClock className="w-6 h-6 text-action-teal" />
              </div>
              <span className="text-3xl font-black text-charcoal group-hover:text-action-teal transition-colors">2</span>
            </div>
            <h3 className="text-lg font-bold text-charcoal mb-1">Upcoming Exam Paper</h3>
            <p className="text-sm text-slate-500">Manage generated papers and prepare incoming exams</p>
          </div>
        </div>
      </div>
    </div>
  );

  const stats = [
    {
      label: t("pendingVerification"),
      value: "12",
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      label: t("completedMonth"),
      value: "8",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Sijil Tamat Tempoh",
      value: "3",
      icon: AlertCircle,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
    },
    { 
      label: "Calon Retest", 
      value: "5", 
      icon: RefreshCcw, 
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      label: "Laporan Dijana",
      value: "14",
      icon: FileCheck,
      color: "text-charcoal",
      bgColor: "bg-blue-50",
    },
  ];

  const decSummaryReadyCount = exams.filter(
    (e) => e.status === ExamStatus.APPROVED,
  ).length;
  const decPendingSubmissionCount = exams.filter(
    (e) =>
      e.status === ExamStatus.EXPIRED ||
      e.status === ExamStatus.LOCKED ||
      e.status === ExamStatus.UNLOCK_REQUESTED,
  ).length;

  const decRejectedCount = exams.filter(
    (e) => e.status === ExamStatus.REJECTED,
  ).length;

  const secNewApplicationCount = exams.filter(
    (e) => e.status === ExamStatus.PENDING_VERIFICATION,
  ).length;
  const secVerificationCount = exams.filter(
    (e) => e.status === ExamStatus.SUBMITTED,
  ).length;
  const secUnlockRequestCount = exams.filter(
    (e) => e.status === ExamStatus.UNLOCK_REQUESTED,
  ).length;
  const secPrintReadyCount = exams.filter(
    (e) => e.status === ExamStatus.COMPLETED,
  ).length;

  const sebcPersonnelInputCount = exams.filter(
    (e) => e.status === ExamStatus.SUBMITTED,
  ).length;
  const sebcResultsInputCount = exams.filter(
    (e) => e.status === ExamStatus.SUBMITTED,
  ).length;

  const sebcUnlockRequestCount = exams.filter(
    (e) => e.status === ExamStatus.UNLOCK_REQUESTED,
  ).length;

  const decWorklist = [
    {
      id: "menunggu-penyerahan",
      label: "Menunggu Penyerahan",
      count: decPendingSubmissionCount,
      color: "bg-blue-500",
      group: "Pending",
    },
    {
      id: "rejected-list",
      label: "Ditolak",
      count: decRejectedCount,
      color: "bg-red-500",
      group: "Alert",
    },
    {
      id: "summary-ready",
      label: "Sedia untuk Penyediaan Rumusan Peperiksaan",
      count: decSummaryReadyCount,
      color: "bg-[#82c91e]",
      group: "Action",
    },
  ];

  const secWorklist = [
    {
      id: "new-application-list",
      label: "Permohonan Baru Dihantar",
      count: secNewApplicationCount,
      color: "bg-brand-red",
      group: "New",
    },
    {
      id: "unlock-list",
      label: "Permintaan Membuka Pemarkahan (Unlock)",
      count: secUnlockRequestCount,
      color: "bg-orange-500",
      group: "Alert",
    },
    {
      id: "sedia-cetak-list",
      label: "Sedia untuk Dicetak",
      count: secPrintReadyCount,
      color: "bg-action-teal",
      group: "Action",
    },
    {
      id: "print-list",
      label: "Penyata Peperiksaan",
      count: secPrintReadyCount,
      color: "bg-[#3498db]",
      group: "Report",
    },
  ];

  const sebcWorklist = [
    {
      id: "setup",
      label: "Sedia untuk Penyediaan Peperiksaan",
      count: 0,
      color: "bg-[#2D5A8E]",
      group: "Pending",
    },
    {
      id: "personnel-input",
      label: "Sedia untuk memasukkan Senarai Pemeriksa",
      count: sebcPersonnelInputCount,
      color: "bg-[#2D5A8E]",
      group: "Action",
    },
    {
      id: "results-input",
      label: "Sedia untuk memasukkan Keputusan",
      count: sebcResultsInputCount,
      color: "bg-[#2D5A8E]",
      group: "Action",
    },
    {
      id: "unlock-list",
      label: "Permintaan untuk Membuka Peperiksaan Terkunci",
      count: sebcUnlockRequestCount,
      color: "bg-[#f39c12]",
      group: "Alert",
    },
  ];

  const getWorklist = () => {
    if (role === UserRole.DEC) return decWorklist;
    if (role === UserRole.SEC) return secWorklist;
    return sebcWorklist;
  };

  const worklist = getWorklist();

  return (
    <div className="bg-slate-50 p-4 md:p-6 lg:p-8 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden pr-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${stat.bgColor}`}>
                  {React.createElement(stat.icon, {
                    className: `w-5 h-5 ${stat.color}`
                  })}
                </div>
                <span className="text-sm font-medium text-gray-700 leading-snug break-words">
                  {stat.label}
                </span>
              </div>
              <span
                className={`text-xl md:text-2xl font-bold shrink-0 ${stat.color}`}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col xl:grid xl:grid-cols-2 gap-4 md:gap-6 w-full">
          {/* Worklist Panel */}
          <div className="xl:col-span-1 order-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden self-start">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
                <span className="font-semibold text-gray-900 text-sm">
                  Senarai Kerja (Worklist)
                </span>
                <div className="flex items-center gap-4 text-blue-500 font-medium text-xs">
                  <span>Peranan: {role}</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col py-2">
                {worklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onViewExam(item.id)}
                    className="px-5 py-3 border-b border-gray-50 flex justify-between items-center hover:bg-slate-50 cursor-pointer group transition-colors last:border-0"
                  >
                    <div className="flex gap-3 items-center min-w-0 pr-4">
                      <div className="text-gray-400 flex-shrink-0 group-hover:text-action-teal transition-colors flex items-center justify-center">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-700 text-sm group-hover:text-action-teal transition-colors truncate">
                        {item.label}
                      </span>
                    </div>
                    <div className="flex flex-shrink-0 justify-end w-12">
                      <span className="font-bold text-gray-900 border border-gray-100 rounded px-2 py-0.5 text-xs bg-slate-50 w-full text-center">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          {/* Upcoming Exams (Modern Table) */}
          <div className="xl:col-span-2 order-3 xl:order-3 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
                <h3 className="font-semibold text-gray-900 text-sm">
                  Peperiksaan yang Akan Datang
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="bg-[#f8fafc] border-b border-gray-100 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5 font-medium">Kumpulan</th>
                      <th className="px-5 py-3.5 font-medium">Subjek</th>
                      <th className="px-5 py-3.5 font-medium text-right">Tarikh Peperiksaan</th>
                      <th className="px-5 py-3.5 font-medium text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {exams.slice(0, 5).map((exam) => {
                      const parts = exam.examDate.split("/");
                      let desc = "";
                      let isPast = false;
                      if (parts.length === 3) {
                        const exDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                        const today = new Date();
                        const diffTime = Math.ceil((exDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                        desc = diffTime >= 0 ? `${diffTime} hari lagi` : "Selesai";
                        isPast = diffTime < 0;
                      }
                      return (
                        <tr
                          key={exam.id}
                          onClick={() => onViewExam(exam.id)}
                          className="cursor-pointer hover:bg-[#f1f5f9] transition-colors group"
                        >
                          <td className="px-5 py-4 text-gray-600 font-medium whitespace-nowrap">
                            {exam.regNo}
                          </td>
                          <td className="px-5 py-4 text-gray-900 font-medium">
                            {exam.subject}
                          </td>
                          <td className="px-5 py-4 text-gray-600 text-right whitespace-nowrap font-medium">
                            {exam.examDate}
                          </td>
                          <td className="px-5 py-4 flex justify-center whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-[4px] text-[11px] font-bold border ${isPast ? 'bg-gray-50 text-gray-600 border-gray-200' : 'bg-teal-50 text-teal-700 border-teal-100'}`}>
                              {desc}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {exams.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-4 md:py-8 text-center text-gray-400 text-sm">
                          Tiada peperiksaan untuk dipaparkan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          {/* Notice & Quick Links */}
          <div className="xl:col-span-1 order-2 xl:order-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden self-start">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200">
                <span className="font-semibold text-gray-900 text-sm">
                  Notis & Pautan Pantas
                </span>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                {role === UserRole.DEC && (
                  <div className="border border-red-200 bg-red-50 p-4 rounded-lg relative overflow-hidden group shadow-sm">
                    <div className="absolute top-0 right-0 p-1.5 bg-red-200/50 rounded-bl-lg text-red-600">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <h4 className="text-red-700 font-bold text-sm mb-1.5 flex items-center gap-1.5">
                      <Lock className="w-4 h-4" /> Peperiksaan Terkunci
                    </h4>
                    <p className="text-xs text-red-900/80 mb-3 leading-relaxed">
                      {t("lockedNoticeDesc")}
                    </p>
                    <ActionBtn
                      variant="danger"
                      onClick={() => onViewExam("unlock-list")}
                    >
                      {t("requestUnlock")}
                    </ActionBtn>
                  </div>
                )}

                <a 
                  href="/User_Guide.pdf"
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="block hover:bg-slate-50 p-3 -mx-3 rounded-lg transition-colors cursor-pointer group"
                >
                  <h4 className="text-action-teal font-medium text-sm mb-1 flex items-center gap-1.5 group-hover:underline">
                    <Download className="w-4 h-4" /> Garis Panduan Pengguna
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Sila muat turun atau lihat garis panduan terkini untuk sistem <span className="notranslate" translate="no">EASY</span>.
                  </p>
                </a>

                <div className="hover:bg-slate-50 p-3 -mx-3 rounded-lg transition-colors cursor-pointer group">
                  <h4 className="text-success-green font-medium text-sm mb-1 flex items-center gap-1.5 group-hover:underline">
                    <BookOpen className="w-4 h-4" /> Borang Rumusan Peperiksaan
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Borang fizikal untuk kegunaan darurat jika sistem
                    tergendala.
                  </p>
                </div>
              </div>
              <div className="px-5 py-3.5 bg-slate-50/50 border-t border-gray-100 flex justify-between items-center text-xs">
                <button className="flex items-center gap-1 text-gray-500 hover:text-gray-900 font-medium transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Sblm
                </button>
                <span className="text-gray-400 font-medium">1 / 5</span>
                <button className="flex items-center gap-1 text-gray-500 hover:text-gray-900 font-medium transition-colors">
                  Seterusnya <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};
