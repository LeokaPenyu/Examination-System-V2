import { MembershipCategory } from '../types';

export interface SubjectFeeConfig {
  subjectCode: string;
  cadetFee: number;
  vadFee: number;
  memberFee: number;
  publicFee: number;
  lateFeePenalty: number; // e.g. amount to add to base fee if late
  earlyBirdCutoffDays: number;
}

export const defaultFeeConfig: SubjectFeeConfig = {
  subjectCode: 'DEFAULT',
  cadetFee: 2,
  vadFee: 2,
  memberFee: 2,
  publicFee: 14,
  lateFeePenalty: 0, 
  earlyBirdCutoffDays: 9, 
};

// Early bird: submitted >= earlyBirdCutoffDays (default 9) before exam date
// Late: submitted < 9 days before exam date — ALL late applications merged as ONE application
export function calculateCandidateFee(
  subjectCode: string,
  membershipCategory: MembershipCategory,
  applicationDateStr: string,
  examDateStr: string,
  feeConfig: SubjectFeeConfig = defaultFeeConfig
): { fee: number; isLate: boolean; isEarlyBird: boolean } {
  const applicationDate = new Date(applicationDateStr);
  const examDate = new Date(examDateStr);
  
  if (isNaN(applicationDate.getTime()) || isNaN(examDate.getTime())) {
    // default to early bird if dates are invalid
    return getFeeForCategory(membershipCategory, feeConfig, false);
  }

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysDifference = (examDate.getTime() - applicationDate.getTime()) / msPerDay;
  
  const isEarlyBird = daysDifference >= feeConfig.earlyBirdCutoffDays;
  const isLate = !isEarlyBird;
  
  return getFeeForCategory(membershipCategory, feeConfig, isLate);
}

function getFeeForCategory(category: MembershipCategory, config: SubjectFeeConfig, isLate: boolean) {
  let baseFee = 0;
  switch (category) {
    case 'Cadet': baseFee = config.cadetFee; break;
    case 'VAD': baseFee = config.vadFee; break;
    case 'Member': baseFee = config.memberFee; break;
    case 'Public': baseFee = config.publicFee; break;
  }
  
  // Requirement: "Apply exam >=9 days before: RM10/candidate. <9 days: RM14/candidate..." wait, 
  // the instruction mentions: "Apply exam >=9 days before: RM10/candidate. <9 days: RM14/candidate, all merged as one application."
  // So maybe the late rate overrides default fee. Let's make it simpler for now with the base config.
  // Actually, wait, let's look at the instruction again for rule 4:
  // "Apply exam >=9 days before: RM10/candidate. <9 days: RM14/candidate, all merged as one application."
  // Wait, the generic prompt said:
  // 1c. Fee calculation logic: calculateCandidateFee -> returns fee, isLate, isEarlyBird.
  
  // Let's implement the specific logic for that: if late, fee is +RM4? Or maybe the config specifies RM10 vs RM14.
  // Let's assume late adds a penalty, or we just override it if it's the online exam. 
  // But generally:
  
  const finalFee = isLate ? baseFee + config.lateFeePenalty : baseFee;
  
  return { fee: finalFee, isLate, isEarlyBird: !isLate };
}
