import { describe, it, expect } from 'vitest';
import { buildSanitizedAiContext, formatContextForPrompt } from '../../lib/ai/context';
import { UserProfile } from '../../types/user';
import { HealthCalculations } from '../../types/health';

describe('AI Context & Guardrail Sanitization', () => {
  it('Scenario 10: Sanitizes sensitive PII while preserving essential biometric context', () => {
    const mockProfile: UserProfile = {
      full_name: 'John Doe',
      age: 28,
      sex: 'male',
      height_cm: 180,
      weight_kg: 75,
      goal: 'lose_weight',
      activity_level: 'moderately_active',
      diet_preference: 'vegetarian',
      dietary_restrictions: ['peanuts'],
    };

    const mockMetrics: HealthCalculations = {
      bmi: 23.1,
      bmiCategory: 'Normal weight',
      bmr: 1750,
      tdee: 2400,
      targetCalories: 1900,
      proteinTarget: 130,
      carbohydrateTarget: 200,
      fatTarget: 60,
      fiberTarget: 30,
      waterTarget: 2800,
      waterTargetLitres: 2.8,
      sleepTargetMinutes: 480,
    };

    const context = buildSanitizedAiContext(mockProfile, mockMetrics, null, null, null);

    // Verify context structure
    expect(context.metrics?.targetCalories).toBe(1900);
    expect(context.metrics?.proteinTarget).toBe(130);
    expect(context.metrics?.waterTarget).toBe(2800);
    expect(context.profile?.diet_preference).toBe('vegetarian');
    expect(context.profile?.dietary_restrictions).toContain('peanuts');
    expect(context.profile?.age).toBe(28);
    expect(context.profile?.sex).toBe('male');

    // Verify formatted prompt string
    const promptContext = formatContextForPrompt(context);
    expect(promptContext).toContain('28 yrs old');
    expect(promptContext).toContain('1900 kcal/day');
    expect(promptContext).not.toContain('John Doe'); // PII removed
  });
});
