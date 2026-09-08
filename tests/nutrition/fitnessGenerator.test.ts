import { describe, it, expect } from 'vitest';
import { generateDailyWorkout, generateWeeklyWorkouts } from '../../lib/nutrition/fitnessGenerator';

describe('Fitness Routine Generation', () => {
  it('generates a 3-phase workout with warm-up, main exercises, and cool-down', () => {
    const workout = generateDailyWorkout('fat_loss', 'moderate', 0);
    expect(workout).toBeDefined();
    expect(workout.title).toBeTruthy();
    expect(workout.estimatedMinutes).toBeGreaterThan(15);
    expect(workout.warmup.length).toBeGreaterThanOrEqual(2);
    expect(workout.main.length).toBeGreaterThanOrEqual(3);
    expect(workout.cooldown.length).toBeGreaterThanOrEqual(2);
  });

  it('scales weekly routines across days', () => {
    const weekly = generateWeeklyWorkouts('moderately_active');
    expect(weekly['Monday']).toBeDefined();
    expect(weekly['Friday']).toBeDefined();
    expect(weekly['Sunday']).toBeDefined();
  });
});
