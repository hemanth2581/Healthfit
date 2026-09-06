import { ActivityLevel, Goal } from '@/types/health';

export interface SleepRecommendation {
  targetHours: number;
  targetMinutes: number;
  recommendedBedtime: string; // "10:30 PM"
  recommendedWakeTime: string; // "6:30 AM"
  sleepCycles: number; // 90-minute sleep cycles (typically 5 cycles)
  recoveryScoreMultiplier: number;
  windDownProtocol: {
    time: string;
    step: string;
    description: string;
  }[];
  tips: string[];
}

export function generateSleepRecommendation(
  age: number,
  activityLevel: ActivityLevel,
  goal: Goal,
  preferredWakeTime: string = '06:30'
): SleepRecommendation {
  // Adult baseline: 7.5 to 8.5 hours depending on recovery demands
  let targetHours = 8.0;

  if (activityLevel === 'very_active' || activityLevel === 'extremely_active' || goal === 'gain_weight') {
    targetHours = 8.5; // Additional recovery window
  } else if (age >= 65) {
    targetHours = 7.5;
  }

  const targetMinutes = Math.round(targetHours * 60);
  const sleepCycles = Math.round(targetMinutes / 90);

  // Parse preferred wake time
  const [wakeH, wakeM] = preferredWakeTime.split(':').map(Number);
  const wakeTotalMinutes = wakeH * 60 + wakeM;

  // Add 15 minutes for sleep latency (time to fall asleep)
  let bedtimeMinutes = wakeTotalMinutes - targetMinutes - 15;
  if (bedtimeMinutes < 0) {
    bedtimeMinutes += 24 * 60;
  }

  const bedH24 = Math.floor(bedtimeMinutes / 60);
  const bedM = bedtimeMinutes % 60;

  const formatTime12h = (h24: number, m: number) => {
    const period = h24 >= 12 ? 'PM' : 'AM';
    const h12 = h24 % 12 || 12;
    const mStr = String(m).padStart(2, '0');
    return `${h12}:${mStr} ${period}`;
  };

  const recommendedBedtime = formatTime12h(bedH24, bedM);
  const recommendedWakeTime = formatTime12h(wakeH, wakeM);

  const windDownProtocol = [
    {
      time: '60 min before bed',
      step: 'Screens & Blue Light Off',
      description: 'Switch off TVs and phone screens or use warm blue-light filters to protect melatonin.',
    },
    {
      time: '45 min before bed',
      step: 'Cool Down Bedroom',
      description: 'Optimal sleep room temperature is 18–20°C (65–68°F) for deep NREM stages.',
    },
    {
      time: '30 min before bed',
      step: 'Light Reading / Journaling',
      description: 'Relax parasympathetic nervous system with breathwork or light reading.',
    },
    {
      time: '10 min before bed',
      step: 'Total Darkness & Zero Noise',
      description: 'Ensure blackout curtains or an eye mask for uninterrupted circadian rhythm.',
    },
  ];

  const tips = [
    'Maintain a consistent wake-up time, even on weekends.',
    'Get 10–15 minutes of natural sunlight within 30 minutes of waking.',
    'Avoid caffeine 8 hours before your recommended bedtime.',
    'Keep dinners light and at least 2.5 hours before lying down.',
  ];

  return {
    targetHours,
    targetMinutes,
    recommendedBedtime,
    recommendedWakeTime,
    sleepCycles,
    recoveryScoreMultiplier: 1.0,
    windDownProtocol,
    tips,
  };
}
