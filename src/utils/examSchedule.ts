export function getExamSchedule(examDateStr: string): {
  practicalAvailableAt: string;
  theoryStartsAt: string;
  questionsUnlockAt: string;
  isQuestionsLocked: (now: Date) => boolean;
  isPracticalAvailable: (now: Date) => boolean;
} {
  const examDate = new Date(examDateStr);
  
  if (isNaN(examDate.getTime())) {
    return {
      practicalAvailableAt: '',
      theoryStartsAt: '',
      questionsUnlockAt: '',
      isQuestionsLocked: () => true,
      isPracticalAvailable: () => false
    };
  }
  
  const practicalAvailableAt = new Date(examDate);
  practicalAvailableAt.setHours(13, 0, 0, 0);
  
  const theoryStartsAt = new Date(examDate);
  theoryStartsAt.setHours(13, 30, 0, 0);

  const questionsUnlockAt = new Date(examDate);
  questionsUnlockAt.setHours(13, 20, 0, 0);

  return {
    practicalAvailableAt: practicalAvailableAt.toISOString(),
    theoryStartsAt: theoryStartsAt.toISOString(),
    questionsUnlockAt: questionsUnlockAt.toISOString(),
    isQuestionsLocked: (now: Date) => now < questionsUnlockAt,
    isPracticalAvailable: (now: Date) => now >= practicalAvailableAt
  };
}
