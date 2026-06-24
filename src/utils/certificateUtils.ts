// Calculate new expiry: always from OLD expiry date + certDuration (typically 3 years)
export function calculateRenewalExpiry(oldExpiryDateStr: string, durationYears = 3): string {
  const oldDate = new Date(oldExpiryDateStr);
  if (isNaN(oldDate.getTime())) return '';
  
  // adding durationYears to the year
  const newDate = new Date(oldDate);
  newDate.setFullYear(newDate.getFullYear() + durationYears);
  return newDate.toISOString().split('T')[0];
}

// Check instructor eligibility
export function isInstructorEligible(expiryDateStr: string, todayStr: string = new Date().toISOString().split('T')[0]): {
  isEligible: boolean;
  isInGracePeriod: boolean;  // expired but within 6 months
  gracePeriodEnd: string;
  message: string;
} {
  const expiryDate = new Date(expiryDateStr);
  const today = new Date(todayStr);

  if (isNaN(expiryDate.getTime())) {
    return {
      isEligible: false,
      isInGracePeriod: false,
      gracePeriodEnd: '',
      message: 'Tarikh luput tidak sah'
    };
  }

  const gracePeriodEndDate = new Date(expiryDate);
  gracePeriodEndDate.setMonth(gracePeriodEndDate.getMonth() + 6);
  
  const isExpired = today > expiryDate;
  const isPastGracePeriod = today > gracePeriodEndDate;

  if (isPastGracePeriod) {
    return {
      isEligible: false,
      isInGracePeriod: false,
      gracePeriodEnd: gracePeriodEndDate.toISOString().split('T')[0],
      message: 'Sijil telah tamat tempoh lebih dari 6 bulan'
    };
  }

  if (isExpired && !isPastGracePeriod) {
    return {
      isEligible: true,
      isInGracePeriod: true,
      gracePeriodEnd: gracePeriodEndDate.toISOString().split('T')[0],
      message: 'Sijil tamat tempoh - pembaharuan diperlukan (dalam tempoh ihsan 6 bulan)'
    };
  }

  return {
    isEligible: true,
    isInGracePeriod: false,
    gracePeriodEnd: '',
    message: 'Sijil sah'
  };
}
