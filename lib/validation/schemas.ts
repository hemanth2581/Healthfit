import { z } from 'zod';

export const bodyInfoSchema = z.object({
  weight_kg: z
    .number()
    .min(20, 'Weight must be at least 20 kg')
    .max(300, 'Weight cannot exceed 300 kg'),
  height_cm: z
    .number()
    .min(100, 'Height must be at least 100 cm')
    .max(250, 'Height cannot exceed 250 cm'),
  age: z
    .number()
    .int('Age must be a whole number')
    .min(10, 'Age must be at least 10 years')
    .max(120, 'Age cannot exceed 120 years'),
  sex: z.enum(['male', 'female', 'other']),
});

export const lifestyleSchema = z.object({
  activity_level: z.enum([
    'sedentary',
    'lightly_active',
    'moderately_active',
    'very_active',
    'extremely_active',
  ]),
  average_steps: z
    .number()
    .min(0, 'Steps cannot be negative')
    .max(100000, 'Unrealistic step count')
    .optional(),
  workout_frequency: z
    .number()
    .min(0, 'Days cannot be negative')
    .max(7, 'Days cannot exceed 7 days per week')
    .optional(),
  workout_preference: z.enum(['home', 'gym', 'outdoor', 'bodyweight', 'mixed']).default('mixed'),
});

export const goalSchema = z.object({
  goal: z.enum(['lose_weight', 'maintain_weight', 'gain_weight', 'improve_fitness', 'fat_loss', 'muscle_gain', 'maintenance']),
  goal_pace: z.enum(['conservative', 'moderate', 'aggressive']).default('moderate'),
  target_weight_kg: z.number().min(20).max(300).optional(),
});

export const nutritionPreferencesSchema = z.object({
  diet_preference: z.enum(['vegetarian', 'non_vegetarian', 'vegan', 'eggetarian', 'keto', 'mediterranean', 'balanced']),
  cuisine_preference: z.enum([
    'south_indian',
    'north_indian',
    'indian',
    'continental',
    'mediterranean',
    'asian',
    'international',
    'mixed',
    'any',
  ]),
  dietary_restrictions: z
    .array(z.string())
    .default([]),
});

export const fullOnboardingSchema = bodyInfoSchema
  .merge(lifestyleSchema)
  .merge(goalSchema)
  .merge(nutritionPreferencesSchema);

export const weightLogSchema = z.object({
  weight_kg: z
    .number()
    .min(20, 'Weight must be at least 20 kg')
    .max(300, 'Weight cannot exceed 300 kg'),
  notes: z.string().max(200).optional(),
});

export const waterLogSchema = z.object({
  amount_ml: z
    .number()
    .min(50, 'Minimum log is 50 ml')
    .max(5000, 'Maximum single log is 5,000 ml'),
});

export const sleepLogSchema = z.object({
  sleep_start: z.string().min(1, 'Please select bedtime'),
  sleep_end: z.string().min(1, 'Please select wake-up time'),
  duration_minutes: z
    .number()
    .min(30, 'Duration must be at least 30 mins')
    .max(1440, 'Max 24 hours'),
  quality_rating: z.number().min(1).max(5).optional(),
  notes: z.string().max(200).optional(),
});

export const workoutLogSchema = z.object({
  workout_title: z.string().min(1),
  duration_minutes: z.number().min(1).max(300),
  calories_burned: z.number().min(0).max(3000),
  exercises_completed: z.array(z.string()).default([]),
  notes: z.string().max(300).optional(),
});

export type BodyInfoInput = z.infer<typeof bodyInfoSchema>;
export type LifestyleInput = z.infer<typeof lifestyleSchema>;
export type GoalInput = z.infer<typeof goalSchema>;
export type NutritionPreferencesInput = z.infer<typeof nutritionPreferencesSchema>;
export type FullOnboardingInput = z.infer<typeof fullOnboardingSchema>;
