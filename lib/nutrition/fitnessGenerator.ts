import { ActivityLevel, Goal, WorkoutPreference } from '@/types/health';
import { DailyWorkout } from '@/types/nutrition';

export function generateWeeklyWorkouts(
  activityLevel: ActivityLevel,
  goal: Goal,
  workoutPreference: WorkoutPreference = 'mixed'
): Record<string, DailyWorkout> {
  const level: DailyWorkout['level'] =
    activityLevel === 'sedentary' || activityLevel === 'lightly_active'
      ? 'Beginner'
      : activityLevel === 'moderately_active'
      ? 'Intermediate'
      : 'Advanced';

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const routines: Record<string, DailyWorkout> = {};

  if (level === 'Beginner') {
    routines['Monday'] = {
      title: 'Full Body Activation & Mobility',
      focus: 'Foundational strength & posture',
      level: 'Beginner',
      durationMinutes: 30,
      estimatedBurnCalories: 160,
      exercises: [
        { name: 'Cat-Cow & Arm Swings', duration: '3 mins', notes: 'Dynamic joint warm-up' },
        { name: 'Bodyweight Box Squats', sets: 3, reps: '10-12 reps', restSeconds: 60 },
        { name: 'Incline Wall / Desk Push-ups', sets: 3, reps: '8-10 reps', restSeconds: 60 },
        { name: 'Glute Bridges', sets: 3, reps: '12 reps', restSeconds: 45 },
        { name: 'Plank Hold on Knees', sets: 3, reps: '20-30 secs', restSeconds: 45 },
      ],
      cooldown: '5 mins hamstring and chest stretches',
    };

    routines['Tuesday'] = {
      title: 'Low-Impact Brisk Walk & Step Builder',
      focus: 'Cardiovascular conditioning',
      level: 'Beginner',
      durationMinutes: 35,
      estimatedBurnCalories: 180,
      exercises: [
        { name: 'Outdoor / Treadmill Brisk Walk', duration: '30 mins', notes: 'Maintain steady pace at 4.5-5.0 km/h' },
        { name: 'Calf & Ankle Mobility Circles', duration: '5 mins', notes: 'Relieve lower leg tightness' },
      ],
    };

    routines['Wednesday'] = {
      title: 'Active Recovery & Core Alignment',
      focus: 'Joint mobility & flexibility',
      level: 'Beginner',
      durationMinutes: 25,
      estimatedBurnCalories: 120,
      exercises: [
        { name: 'Bird-Dog Core Reaches', sets: 3, reps: '10 per side', restSeconds: 45 },
        { name: 'Dead Bug Holds', sets: 3, reps: '8 per side', restSeconds: 45 },
        { name: 'Child Pose to Cobra Flow', sets: 3, reps: '6 slow reps', restSeconds: 45 },
        { name: 'Seated Spine Twists', duration: '5 mins' },
      ],
    };

    routines['Thursday'] = {
      title: 'Lower Body & Core Strength',
      focus: 'Leg endurance & balance',
      level: 'Beginner',
      durationMinutes: 30,
      estimatedBurnCalories: 170,
      exercises: [
        { name: 'Reverse Lunges (Assisted)', sets: 3, reps: '8 per leg', restSeconds: 60 },
        { name: 'Step-ups onto Chair/Stair', sets: 3, reps: '10 per leg', restSeconds: 60 },
        { name: 'Standing Calf Raises', sets: 3, reps: '15 reps', restSeconds: 45 },
        { name: 'Side Plank on Knees', sets: 3, reps: '20 secs per side', restSeconds: 45 },
      ],
    };

    routines['Friday'] = {
      title: 'Upper Body & Posture Alignment',
      focus: 'Back, shoulders & arm tone',
      level: 'Beginner',
      durationMinutes: 30,
      estimatedBurnCalories: 160,
      exercises: [
        { name: 'Doorframe Chest Stretch & Rows', sets: 3, reps: '12 reps', restSeconds: 45 },
        { name: 'Knee Push-ups / Elevated Push-ups', sets: 3, reps: '8-10 reps', restSeconds: 60 },
        { name: 'Superman Back Extensions', sets: 3, reps: '10 reps', restSeconds: 45 },
        { name: 'Shoulder Y-T-W Raises', sets: 3, reps: '10 reps each', restSeconds: 45 },
      ],
    };

    routines['Saturday'] = {
      title: 'Aerobic Walk & Recreational Movement',
      focus: 'Metabolic burn & fresh air',
      level: 'Beginner',
      durationMinutes: 40,
      estimatedBurnCalories: 200,
      exercises: [
        { name: 'Outdoor Nature Walk or Leisure Cycling', duration: '35 mins', notes: 'Enjoyable conversational pace' },
        { name: 'Full Body Gentle Stretches', duration: '5 mins' },
      ],
    };

    routines['Sunday'] = {
      title: 'Complete Rest & Rejuvenation',
      focus: 'Restoration & muscle recovery',
      level: 'Beginner',
      durationMinutes: 15,
      estimatedBurnCalories: 60,
      exercises: [
        { name: 'Diaphragmatic Deep Breathing', duration: '5 mins' },
        { name: 'Full Body Foam Rolling / Gentle Stretches', duration: '10 mins' },
      ],
    };
  } else if (level === 'Intermediate') {
    routines['Monday'] = {
      title: 'Upper Body Hypertrophy & Strength',
      focus: 'Chest, Back, Shoulders & Arms',
      level: 'Intermediate',
      durationMinutes: 45,
      estimatedBurnCalories: 280,
      exercises: [
        { name: 'Dumbbell / Flat Bench Press', sets: 4, reps: '8-10 reps', restSeconds: 75 },
        { name: 'Bent-Over Dumbbell Rows', sets: 4, reps: '10-12 reps', restSeconds: 75 },
        { name: 'Overhead Dumbbell Shoulder Press', sets: 3, reps: '10-12 reps', restSeconds: 60 },
        { name: 'Lat Pulldowns or Pull-up Negatives', sets: 3, reps: '8-10 reps', restSeconds: 60 },
        { name: 'Tricep Rope Pushdowns / Dips', sets: 3, reps: '12-15 reps', restSeconds: 45 },
        { name: 'Dumbbell Bicep Curls', sets: 3, reps: '12 reps', restSeconds: 45 },
      ],
    };

    routines['Tuesday'] = {
      title: 'Lower Body & Core Power',
      focus: 'Quads, Hamstrings, Glutes & Abs',
      level: 'Intermediate',
      durationMinutes: 50,
      estimatedBurnCalories: 340,
      exercises: [
        { name: 'Goblet / Barbell Squats', sets: 4, reps: '8-10 reps', restSeconds: 90 },
        { name: 'Romanian Deadlifts (Dumbbell/Barbell)', sets: 4, reps: '10-12 reps', restSeconds: 90 },
        { name: 'Walking Dumbbell Lunges', sets: 3, reps: '12 steps/leg', restSeconds: 60 },
        { name: 'Leg Press or Bulgarian Split Squats', sets: 3, reps: '10 reps/leg', restSeconds: 60 },
        { name: 'Hanging Leg Raises / Captains Chair', sets: 3, reps: '12-15 reps', restSeconds: 45 },
      ],
    };

    routines['Wednesday'] = {
      title: 'Zone 2 Cardio & Mobility Flow',
      focus: 'Aerobic base & joint health',
      level: 'Intermediate',
      durationMinutes: 40,
      estimatedBurnCalories: 260,
      exercises: [
        { name: 'Incline Treadmill Walk / Steady Row', duration: '30 mins', notes: 'Target heart rate 65-75% max' },
        { name: 'World Greatest Stretch & Hip Openers', duration: '10 mins' },
      ],
    };

    routines['Thursday'] = {
      title: 'Push Hypertrophy (Chest, Shoulders, Triceps)',
      focus: 'Upper body push endurance',
      level: 'Intermediate',
      durationMinutes: 45,
      estimatedBurnCalories: 290,
      exercises: [
        { name: 'Incline Dumbbell Press', sets: 4, reps: '10-12 reps', restSeconds: 75 },
        { name: 'Bodyweight / Weighted Dips', sets: 3, reps: '10-12 reps', restSeconds: 60 },
        { name: 'Dumbbell Lateral Raises', sets: 4, reps: '12-15 reps', restSeconds: 45 },
        { name: 'Cable Chest Flyes', sets: 3, reps: '12-15 reps', restSeconds: 60 },
        { name: 'Overhead Tricep Extension', sets: 3, reps: '12-15 reps', restSeconds: 45 },
      ],
    };

    routines['Friday'] = {
      title: 'Pull Hypertrophy & Posterior Chain',
      focus: 'Back, Rear Delts & Biceps',
      level: 'Intermediate',
      durationMinutes: 45,
      estimatedBurnCalories: 300,
      exercises: [
        { name: 'Seated Cable / Chest Supported Rows', sets: 4, reps: '10-12 reps', restSeconds: 75 },
        { name: 'Wide Grip Lat Pulldowns', sets: 4, reps: '10 reps', restSeconds: 75 },
        { name: 'Face Pulls for Posture', sets: 4, reps: '15 reps', restSeconds: 45 },
        { name: 'Incline Dumbbell Hammer Curls', sets: 3, reps: '12 reps', restSeconds: 45 },
        { name: 'Ab Wheel Rollouts / Weighted Plank', sets: 3, reps: '12 reps', restSeconds: 45 },
      ],
    };

    routines['Saturday'] = {
      title: 'Legs & HIIT Conditioning Finisher',
      focus: 'Lower body volume + metabolic spike',
      level: 'Intermediate',
      durationMinutes: 45,
      estimatedBurnCalories: 360,
      exercises: [
        { name: 'Front Squats or Leg Extensions', sets: 3, reps: '12 reps', restSeconds: 60 },
        { name: 'Lying Hamstring Curls', sets: 4, reps: '12 reps', restSeconds: 60 },
        { name: 'Calf Raises on Leg Press', sets: 4, reps: '15-20 reps', restSeconds: 45 },
        { name: 'HIIT Kettlebell Swings / Sprints', sets: 5, reps: '30s work / 30s rest', restSeconds: 60 },
      ],
    };

    routines['Sunday'] = {
      title: 'Rest & Deep Stretch Protocol',
      focus: 'Nervous system recovery',
      level: 'Intermediate',
      durationMinutes: 20,
      estimatedBurnCalories: 80,
      exercises: [
        { name: 'Pigeon Pose & Quad Stretches', duration: '10 mins' },
        { name: 'Thoracic Spine Foam Rolling', duration: '10 mins' },
      ],
    };
  } else {
    // Advanced
    routines['Monday'] = {
      title: 'Heavy Strength — Push & Core',
      focus: 'Maximal recruitment & power',
      level: 'Advanced',
      durationMinutes: 60,
      estimatedBurnCalories: 420,
      exercises: [
        { name: 'Barbell Bench Press', sets: 5, reps: '5 reps (RPE 8)', restSeconds: 120 },
        { name: 'Standing Overhead Barbell Press', sets: 4, reps: '6-8 reps', restSeconds: 90 },
        { name: 'Weighted Dips', sets: 4, reps: '8-10 reps', restSeconds: 75 },
        { name: 'Incline Dumbbell Fly-to-Press', sets: 3, reps: '10-12 reps', restSeconds: 60 },
        { name: 'Cable Lateral Raises', sets: 4, reps: '15 reps', restSeconds: 45 },
        { name: 'Dragon Flags / Hanging Leg Raises', sets: 4, reps: '12 reps', restSeconds: 60 },
      ],
    };

    routines['Tuesday'] = {
      title: 'Heavy Strength — Pull & Traps',
      focus: 'Posterior chain load & width',
      level: 'Advanced',
      durationMinutes: 60,
      estimatedBurnCalories: 440,
      exercises: [
        { name: 'Conventional / Trap Bar Deadlifts', sets: 4, reps: '5 reps', restSeconds: 150 },
        { name: 'Weighted Pull-ups', sets: 4, reps: '6-8 reps', restSeconds: 90 },
        { name: 'Barbell T-Bar Rows', sets: 4, reps: '8-10 reps', restSeconds: 90 },
        { name: 'Single Arm Dumbbell Rows', sets: 3, reps: '10 reps/side', restSeconds: 60 },
        { name: 'EZ-Bar Bicep 21s & Spider Curls', sets: 4, reps: '12 reps', restSeconds: 45 },
      ],
    };

    routines['Wednesday'] = {
      title: 'High-Performance Legs (Quad & Glute Dominant)',
      focus: 'Heavy lower power & hypertrophy',
      level: 'Advanced',
      durationMinutes: 60,
      estimatedBurnCalories: 480,
      exercises: [
        { name: 'Barbell Back Squats', sets: 5, reps: '5-6 reps', restSeconds: 120 },
        { name: 'Heavy Barbell Hip Thrusts', sets: 4, reps: '8-10 reps', restSeconds: 90 },
        { name: 'Bulgarian Split Squats (Dumbbells)', sets: 3, reps: '8 reps/leg', restSeconds: 75 },
        { name: 'Leg Press Calf Press', sets: 4, reps: '15 reps', restSeconds: 45 },
        { name: 'Nordic Hamstring Curls', sets: 3, reps: '6-8 reps', restSeconds: 90 },
      ],
    };

    routines['Thursday'] = {
      title: 'Zone 2 Aerobic Conditioning & Core',
      focus: 'Mitochondrial capacity & recovery',
      level: 'Advanced',
      durationMinutes: 45,
      estimatedBurnCalories: 350,
      exercises: [
        { name: 'Assault Bike / Rowing Ergometer Zone 2', duration: '35 mins', notes: 'Maintain steady nasal breathing' },
        { name: 'Hanging Windshield Wipers & Planks', sets: 4, reps: '10 per side', restSeconds: 45 },
      ],
    };

    routines['Friday'] = {
      title: 'Upper Body Pump & Volume',
      focus: 'Sarcoplasmic hypertrophy & detail',
      level: 'Advanced',
      durationMinutes: 55,
      estimatedBurnCalories: 390,
      exercises: [
        { name: 'Incline Barbell Bench Press', sets: 4, reps: '8-10 reps', restSeconds: 75 },
        { name: 'Seated Cable Row to Neck (Rear Delt)', sets: 4, reps: '12-15 reps', restSeconds: 60 },
        { name: 'Dumbbell Hammer Curls Superset w/ Skullcrushers', sets: 4, reps: '12 reps', restSeconds: 60 },
        { name: 'Cable Lateral Raise Drop Sets', sets: 3, reps: '10+10 reps', restSeconds: 60 },
        { name: 'Push-up Burnout to Failure', sets: 2, reps: 'Max reps', restSeconds: 60 },
      ],
    };

    routines['Saturday'] = {
      title: 'Posterior Chain & Sprint Intervals',
      focus: 'Hamstrings, Glutes & Anaerobic threshold',
      level: 'Advanced',
      durationMinutes: 50,
      estimatedBurnCalories: 430,
      exercises: [
        { name: 'Stiff-Legged Deadlifts', sets: 4, reps: '8-10 reps', restSeconds: 90 },
        { name: 'Seated Hamstring Curls (Slow eccentric)', sets: 4, reps: '10-12 reps', restSeconds: 60 },
        { name: 'Weighted Walking Lunges', sets: 3, reps: '16 steps', restSeconds: 60 },
        { name: 'Tabata Sprints (Incline Treadmill/Track)', sets: 8, reps: '20s max / 10s rest', restSeconds: 60 },
      ],
    };

    routines['Sunday'] = {
      title: 'Active Restoration & Sauna / Contrast Flow',
      focus: 'Parasympathetic reset & soft tissue care',
      level: 'Advanced',
      durationMinutes: 30,
      estimatedBurnCalories: 100,
      exercises: [
        { name: 'Full Body Foam Rolling & Trigger Point Release', duration: '15 mins' },
        { name: 'Deep Hip & Thoracic Yoga Flow', duration: '15 mins' },
      ],
    };
  }

  return routines;
}
