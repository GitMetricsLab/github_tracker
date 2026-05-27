export interface ContributionItem {
  created_at?: string;
  Created?: string;
  [key: string]: any; 
}

export interface PersonaResult {
  personaTitle: string;
  earlyBirdPercent: number;
  nightOwlPercent: number;
  totalCount: number;
}

export function calculateCodingPersona(items: ContributionItem[]): PersonaResult {
  let earlyBirdCount = 0;
  let nightOwlCount = 0;
  let midDayCount = 0;
  let validTimestampsCount = 0;

  items.forEach((item) => {
    const dateString = item.created_at || item.Created;
    if (!dateString) return;

    const date = new Date(dateString);
    
    // 🌟 Uses UTC standard hours directly to bypass local machine timezone conversions
    const hour = date.getUTCHours(); 

    // ☀️ Early Bird Bucket: 5:00 AM to 11:59 AM UTC
    if (hour >= 5 && hour < 12) {
      earlyBirdCount++;
      validTimestampsCount++;
    } 
    // 🦉 Night Owl Bucket: 10:00 PM to 4:59 AM UTC
    else if (hour >= 22 || hour < 5) {
      nightOwlCount++;
      validTimestampsCount++;
    }
    // 🚀 Mid-Day / Afternoon Builder: 12:00 PM to 9:59 PM UTC
    else {
      midDayCount++;
      validTimestampsCount++;
    }
  });

  // Calculate percentages based on the complete global dataset logs
  const earlyBirdPercent = validTimestampsCount > 0 ? Math.round((earlyBirdCount / validTimestampsCount) * 100) : 0;
  const nightOwlPercent = validTimestampsCount > 0 ? Math.round((nightOwlCount / validTimestampsCount) * 100) : 0;
  const midDayPercent = validTimestampsCount > 0 ? Math.round((midDayCount / validTimestampsCount) * 100) : 0;

  // Determine the dominant persona title string rule
  let personaTitle = "Balanced Builder ⚖️";
  
  if (earlyBirdPercent > nightOwlPercent && earlyBirdPercent > midDayPercent) {
    personaTitle = "Early Bird ☀️";
  } else if (nightOwlPercent > earlyBirdPercent && nightOwlPercent > midDayPercent) {
    personaTitle = "Night Owl 🦉";
  } else if (midDayPercent > earlyBirdPercent && midDayPercent > nightOwlPercent) {
    personaTitle = "Productive Peer 🚀";
  }

  return {
    personaTitle,
    earlyBirdPercent,
    nightOwlPercent,
    totalCount: validTimestampsCount
  };
}