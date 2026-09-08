import { describe, it, expect } from 'vitest';
import { generate7DayPlan } from '../../lib/nutrition/dietGenerator';

describe('Daily Progress & Task Points System', () => {
  it('Scenario 7: Daily tasks sum up to exactly 100 points per day', () => {
    const days = generate7DayPlan({
      targetCalories: 2000,
      proteinTarget: 120,
      dietType: 'vegetarian',
    });

    for (const day of days) {
      const totalPoints = day.tasks.reduce((sum, t) => sum + t.points, 0);
      expect(totalPoints).toBe(100);

      const mealTasks = day.tasks.filter((t) => t.task_type === 'meal');
      const habitTasks = day.tasks.filter((t) => t.task_type === 'habit');

      expect(mealTasks.length).toBe(5);
      expect(habitTasks.length).toBe(3);
    }
  });

  it('Scenario 8: Points calculate accurately on check and subtract on uncheck without duplication', () => {
    const days = generate7DayPlan({
      targetCalories: 2000,
      proteinTarget: 120,
      dietType: 'vegetarian',
    });

    const tasks = days[0].tasks.map((t, idx) => ({ ...t, id: `task-${idx}`, completed: false }));

    // Check breakfast (+15)
    tasks[0].completed = true;
    let points = tasks.filter((t) => t.completed).reduce((s, t) => s + t.points, 0);
    expect(points).toBe(15);

    // Check morning snack (+10)
    tasks[1].completed = true;
    points = tasks.filter((t) => t.completed).reduce((s, t) => s + t.points, 0);
    expect(points).toBe(25);

    // Uncheck breakfast (-15)
    tasks[0].completed = false;
    points = tasks.filter((t) => t.completed).reduce((s, t) => s + t.points, 0);
    expect(points).toBe(10);
  });

  it('Scenario 9: Day completion requires all required daily tasks to be completed', () => {
    const days = generate7DayPlan({
      targetCalories: 2000,
      proteinTarget: 120,
      dietType: 'vegetarian',
    });

    const tasks = days[0].tasks.map((t, idx) => ({ ...t, id: `task-${idx}`, completed: false }));

    // Complete 6 out of 8
    for (let i = 0; i < 6; i++) {
      tasks[i].completed = true;
    }

    const totalRequired = tasks.filter((t) => t.required).length;
    const completedRequired = tasks.filter((t) => t.required && t.completed).length;

    expect(completedRequired < totalRequired).toBe(true);

    // Complete remaining
    tasks[6].completed = true;
    tasks[7].completed = true;
    const allCompleted = tasks.filter((t) => t.required && t.completed).length === totalRequired;
    expect(allCompleted).toBe(true);
  });
});
