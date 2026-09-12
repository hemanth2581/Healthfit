const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const desktopPath = path.join(process.env.USERPROFILE || 'C:\\Users\\G Hemanth', 'Desktop');
const pdfFileName = 'HealthFit_Complete_Project_Architecture_Guide.pdf';
const outputPdfPath = path.join(desktopPath, pdfFileName);
const tempHtmlPath = path.join(__dirname, 'temp_project_guide.html');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>HealthFit — Comprehensive Project Architecture, Engineering & Deployment Guide</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

  @page {
    size: A4;
    margin: 18mm 15mm 18mm 15mm;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #1e293b;
    background: #ffffff;
    line-height: 1.55;
    font-size: 13px;
  }

  .cover-page {
    page-break-after: always;
    min-height: 250mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 40px 24px;
    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
    color: #ffffff;
    border-radius: 12px;
  }

  .cover-badge {
    display: inline-block;
    padding: 6px 14px;
    background: rgba(99, 102, 241, 0.25);
    border: 1px solid rgba(129, 140, 248, 0.4);
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 600;
    color: #818cf8;
    text-transform: uppercase;
    letter-spacing: 1px;
    width: fit-content;
  }

  .cover-title {
    font-size: 34px;
    font-weight: 800;
    line-height: 1.15;
    margin-top: 20px;
    color: #ffffff;
  }

  .cover-subtitle {
    font-size: 16px;
    color: #94a3b8;
    margin-top: 12px;
    max-width: 95%;
    line-height: 1.5;
  }

  .cover-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin: 30px 0;
  }

  .cover-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 14px;
    border-radius: 8px;
  }

  .cover-card-title {
    font-size: 11px;
    text-transform: uppercase;
    color: #60a5fa;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .cover-card-value {
    font-size: 13px;
    color: #e2e8f0;
    margin-top: 4px;
    font-weight: 500;
  }

  .cover-footer {
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    padding-top: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #64748b;
    font-size: 11px;
  }

  .page-break {
    page-break-after: always;
  }

  .section {
    margin-bottom: 24px;
  }

  h1, h2, h3, h4 {
    color: #0f172a;
    font-weight: 700;
  }

  h1 {
    font-size: 21px;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 6px;
    margin-top: 24px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  h2 {
    font-size: 15px;
    margin-top: 18px;
    margin-bottom: 8px;
    color: #1e293b;
  }

  h3 {
    font-size: 13.5px;
    margin-top: 12px;
    margin-bottom: 6px;
    color: #334155;
  }

  p {
    margin-bottom: 10px;
    color: #334155;
  }

  ul, ol {
    margin-left: 20px;
    margin-bottom: 12px;
    color: #334155;
  }

  li {
    margin-bottom: 4px;
  }

  .pill {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    margin-right: 4px;
  }

  .pill-blue { background: #dbeafe; color: #1d4ed8; }
  .pill-green { background: #dcfce7; color: #15803d; }
  .pill-purple { background: #f3e8ff; color: #7e22ce; }
  .pill-amber { background: #fef3c7; color: #b45309; }

  .callout {
    background: #f8fafc;
    border-left: 4px solid #3b82f6;
    padding: 12px 14px;
    border-radius: 0 6px 6px 0;
    margin: 12px 0;
  }

  .callout-title {
    font-weight: 700;
    color: #1e40af;
    font-size: 12px;
    margin-bottom: 4px;
  }

  .callout-success {
    background: #f0fdf4;
    border-left-color: #22c55e;
  }
  .callout-success .callout-title { color: #15803d; }

  .callout-amber {
    background: #fffbeb;
    border-left-color: #f59e0b;
  }
  .callout-amber .callout-title { color: #b45309; }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0;
    font-size: 11.5px;
  }

  th, td {
    border: 1px solid #cbd5e1;
    padding: 7px 9px;
    text-align: left;
  }

  th {
    background: #f1f5f9;
    color: #0f172a;
    font-weight: 600;
  }

  tr:nth-child(even) {
    background: #f8fafc;
  }

  code {
    font-family: 'JetBrains Mono', monospace;
    background: #f1f5f9;
    padding: 2px 5px;
    border-radius: 4px;
    font-size: 11px;
    color: #0f172a;
  }

  pre {
    font-family: 'JetBrains Mono', monospace;
    background: #0f172a;
    color: #f8fafc;
    padding: 10px 12px;
    border-radius: 6px;
    font-size: 10.5px;
    line-height: 1.45;
    overflow-x: hidden;
    white-space: pre-wrap;
    word-break: break-word;
    margin: 8px 0 12px 0;
  }

  .diagram-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px;
    margin: 12px 0;
  }

  .diagram-flow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 6px;
    margin: 10px 0;
  }

  .flow-step {
    flex: 1;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 8px 4px;
    text-align: center;
    font-weight: 600;
    font-size: 10.5px;
    color: #1e293b;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }

  .flow-arrow {
    color: #64748b;
    font-weight: bold;
    font-size: 12px;
  }

  .two-column {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin: 10px 0;
  }

  .card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 11px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.03);
  }

  .card-title {
    font-size: 12.5px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover-page">
  <div>
    <div class="cover-badge">Engineering & Architecture Documentation</div>
    <div class="cover-title">HEALTHFIT</div>
    <div class="cover-subtitle">
      Personalized Health, Nutrition & Fitness Platform with Anonymous-First Tenancy, Precision Metabolic Calculations & Groq LLaMA 3.3 70B AI Integration.
    </div>
  </div>

  <div class="cover-grid">
    <div class="cover-card">
      <div class="cover-card-title">Core Technology</div>
      <div class="cover-card-value">Next.js 16 (App Router) • React 19 • TypeScript</div>
    </div>
    <div class="cover-card">
      <div class="cover-card-title">AI & Intelligence</div>
      <div class="cover-card-value">Groq Cloud • LLaMA 3.3 70B Versatile</div>
    </div>
    <div class="cover-card">
      <div class="cover-card-title">Database & Security</div>
      <div class="cover-card-value">Supabase PostgreSQL • Row Level Security (RLS)</div>
    </div>
    <div class="cover-card">
      <div class="cover-card-title">Styling & Analytics</div>
      <div class="cover-card-value">Tailwind CSS v4 • Recharts • Vitest (23 Tests)</div>
    </div>
  </div>

  <div class="cover-footer">
    <div><strong>Project:</strong> HealthFit Full-Stack Application</div>
    <div><strong>Deployment:</strong> Vercel Serverless Edge & Supabase Cloud</div>
    <div><strong>Version:</strong> 1.0.0 Production Ready</div>
  </div>
</div>

<!-- SECTION 1: EXECUTIVE SUMMARY & ARCHITECTURE -->
<div class="section">
  <h1>1. Executive Summary & Core Philosophy</h1>
  
  <p>
    <strong>HealthFit</strong> is a high-performance web platform engineered to eliminate the friction in digital wellness. While traditional fitness apps enforce sign-up walls, mandatory passwords, credit cards, or spam emails, HealthFit adopts an <strong>Anonymous-First Architecture</strong> that provides instant, personalized metabolic calculation, 7-day custom meal & workout planning, hydration tracking, sleep hygiene schedules, and AI health coaching within seconds.
  </p>

  <div class="diagram-box">
    <strong>The HealthFit End-to-End Operational Lifecycle</strong>
    <div class="diagram-flow">
      <div class="flow-step">1. Anonymous Wizard<br><span style="font-size:9.5px;font-weight:normal;color:#64748b;">UUID & Metrics</span></div>
      <span class="flow-arrow">&#10132;</span>
      <div class="flow-step">2. Metabolic Engine<br><span style="font-size:9.5px;font-weight:normal;color:#64748b;">BMR, TDEE, Macros</span></div>
      <span class="flow-arrow">&#10132;</span>
      <div class="flow-step">3. 7-Day Plan Gen<br><span style="font-size:9.5px;font-weight:normal;color:#64748b;">Meals (g/ml) & Workouts</span></div>
      <span class="flow-arrow">&#10132;</span>
      <div class="flow-step">4. Real-time Tracking<br><span style="font-size:9.5px;font-weight:normal;color:#64748b;">Water, Sleep, Meals</span></div>
      <span class="flow-arrow">&#10132;</span>
      <div class="flow-step">5. Groq LLaMA AI<br><span style="font-size:9.5px;font-weight:normal;color:#64748b;">Contextual Coaching</span></div>
    </div>
  </div>

  <h2>Key Highlights & Innovations</h2>
  <ul>
    <li><strong>Zero Mandatory Sign-Up:</strong> Generates a client-side RFC4122 UUID stored in cookies & localStorage, mapped seamlessly into Supabase PostgreSQL.</li>
    <li><strong>Scientific Grounding:</strong> Utilizes the Mifflin-St Jeor equation for BMR, dynamic activity multipliers for TDEE, and high-protein macro splitting with safe caloric adjustments.</li>
    <li><strong>Granular Nutrition Precision:</strong> Every meal includes exact gram (g) and milliliter (ml) portion sizes mapped across 5 daily meals for all 7 days of the week.</li>
    <li><strong>Cuisine & Allergen Matrix:</strong> Accommodates 4 diet types (Veg, Non-Veg, Vegan, Eggetarian), 5 Indian & International cuisines, and filters out 6 major allergens.</li>
    <li><strong>Groq AI Health Assistant:</strong> Ultra-low latency streaming AI assistant powered by Meta's LLaMA 3.3 70B, injected with the user's specific biometric context.</li>
  </ul>
</div>

<!-- SECTION 2: TECHNOLOGY STACK -->
<div class="section">
  <h1>2. Comprehensive Technology Stack</h1>

  <table>
    <thead>
      <tr>
        <th>Layer</th>
        <th>Technology</th>
        <th>Version</th>
        <th>Primary Responsibility / Rationale</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Frontend Framework</strong></td>
        <td>Next.js (App Router)</td>
        <td>16.3.4</td>
        <td>React Server Components (RSC), server-side rendering, API route handlers, optimized bundle size.</td>
      </tr>
      <tr>
        <td><strong>Core Library</strong></td>
        <td>React & React DOM</td>
        <td>19.2.8</td>
        <td>Modern reactive UI state, hooks (useMemo, useCallback, useEffect), transition primitives.</td>
      </tr>
      <tr>
        <td><strong>Language</strong></td>
        <td>TypeScript</td>
        <td>5.x (Strict)</td>
        <td>End-to-end type safety across API routes, nutritional models, database schemas, and client state.</td>
      </tr>
      <tr>
        <td><strong>Styling & CSS</strong></td>
        <td>Tailwind CSS</td>
        <td>v4.0</td>
        <td>Modern CSS theme tokens, glassmorphism, responsive grid/flexbox, safe area insets.</td>
      </tr>
      <tr>
        <td><strong>AI Engine</strong></td>
        <td>Groq Cloud SDK</td>
        <td>1.6.0</td>
        <td>Meta LLaMA 3.3 70B Versatile inference engine delivering ultra-fast responses for wellness coaching.</td>
      </tr>
      <tr>
        <td><strong>Database</strong></td>
        <td>Supabase PostgreSQL</td>
        <td>2.115.0</td>
        <td>PostgreSQL database with Row Level Security (RLS), automated indexing, and JSONB support.</td>
      </tr>
      <tr>
        <td><strong>Visualizations</strong></td>
        <td>Recharts</td>
        <td>3.10.1</td>
        <td>Responsive SVG charts for weight trends, water intake bar charts, sleep duration & habit adherence.</td>
      </tr>
      <tr>
        <td><strong>Schema Validation</strong></td>
        <td>Zod</td>
        <td>4.5.4</td>
        <td>Runtime schema validation for onboarding forms, API payloads, and health metric inputs.</td>
      </tr>
      <tr>
        <td><strong>Icons & Effects</strong></td>
        <td>Lucide React & Canvas Confetti</td>
        <td>Latest</td>
        <td>Clean modern iconography and celebratory confetti triggers on daily 100% adherence.</td>
      </tr>
      <tr>
        <td><strong>Unit Testing</strong></td>
        <td>Vitest</td>
        <td>5.0.0</td>
        <td>Lightning-fast test suite running 23 automated unit test cases for nutritional formulas and filters.</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="page-break"></div>

<!-- SECTION 3: SCIENTIFIC METABOLIC CALCULATION ENGINE -->
<div class="section">
  <h1>3. Scientific Metabolic Calculation Engine</h1>
  <p>HealthFit embeds validated sports medicine and clinical nutrition equations in <code>lib/nutrition/calculations.ts</code>:</p>

  <div class="two-column">
    <div class="card">
      <div class="card-title">1. Basal Metabolic Rate (BMR)</div>
      <p style="font-size:11.5px;">Calculated using the validated <strong>Mifflin-St Jeor Equation</strong>:</p>
      <pre>Men:
BMR = (10 × W_kg) + (6.25 × H_cm) - (5 × Age) + 5

Women:
BMR = (10 × W_kg) + (6.25 × H_cm) - (5 × Age) - 161</pre>
    </div>

    <div class="card">
      <div class="card-title">2. Total Daily Energy Expenditure (TDEE)</div>
      <p style="font-size:11.5px;">Activity Multipliers applied to BMR:</p>
      <pre>• Sedentary (desk job, no exercise): 1.20x
• Lightly Active (1-3 days/wk): 1.375x
• Moderately Active (3-5 days/wk): 1.55x
• Very Active (6-7 days/wk): 1.725x
• Extremely Active (athlete): 1.90x</pre>
    </div>
  </div>

  <div class="two-column">
    <div class="card">
      <div class="card-title">3. Goal-Adjusted Caloric Target</div>
      <ul style="font-size:11.5px; margin-left:14px;">
        <li><strong>Weight Loss:</strong> TDEE - 400 to -600 kcal (safe 0.5 kg/week deficit). Floor of 1200 kcal (women) / 1500 kcal (men).</li>
        <li><strong>Maintenance:</strong> Exact TDEE calories.</li>
        <li><strong>Weight / Muscle Gain:</strong> TDEE + 300 to +500 kcal lean surplus.</li>
      </ul>
    </div>

    <div class="card">
      <div class="card-title">4. Macro & Hydration Distribution</div>
      <ul style="font-size:11.5px; margin-left:14px;">
        <li><strong>Protein:</strong> 1.6g – 2.2g per kg body weight (muscle preservation).</li>
        <li><strong>Fat:</strong> 25% – 30% of total calories (hormonal health).</li>
        <li><strong>Carbohydrates:</strong> Remaining caloric balance.</li>
        <li><strong>Water:</strong> Weight(kg) × 35ml + Activity Bonus (500ml).</li>
      </ul>
    </div>
  </div>

  <div class="callout callout-success">
    <div class="callout-title">Circadian Sleep Optimization Equation</div>
    Sleep cycles are calculated in 90-minute ultradian blocks (4 to 6 cycles = 6.0h to 9.0h) plus 15 minutes of sleep latency. E.g., for a 6:30 AM wake-up, the recommended bedtimes are 10:45 PM (5 cycles = 7.5h) or 12:15 AM (4 cycles = 6.0h).
  </div>
</div>

<!-- SECTION 4: DATABASE SCHEMA & DATA MODEL -->
<div class="section">
  <h1>4. PostgreSQL Database Architecture (Supabase)</h1>
  <p>The system utilizes 8 normalized relational tables governed by Row Level Security (RLS):</p>

  <table>
    <thead>
      <tr>
        <th>Table Name</th>
        <th>Primary Key / Foreign Key</th>
        <th>Key Columns & Data Types</th>
        <th>Purpose</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>users_profiles</code></td>
        <td><code>id (UUID PK)</code></td>
        <td><code>anonymous_user_id (UUID UNIQUE)</code>, age, sex, height_cm, weight_kg, activity_level, goal, diet_preference, cuisine_preference, dietary_restrictions (JSONB)</td>
        <td>Stores persistent user biometrics, dietary preferences, and allergen restrictions.</td>
      </tr>
      <tr>
        <td><code>health_metrics</code></td>
        <td><code>id (UUID PK)</code></td>
        <td><code>anonymous_user_id</code>, bmi, bmi_category, bmr, tdee, target_calories, protein_target_g, carbs_target_g, fat_target_g, water_target_ml, sleep_target_minutes</td>
        <td>Historical snapshot of calculated metabolic targets.</td>
      </tr>
      <tr>
        <td><code>diet_plans</code></td>
        <td><code>id (UUID PK)</code></td>
        <td><code>anonymous_user_id</code>, plan_date, day_name (Mon-Sun), total_calories, protein_g, workout_plan (JSONB)</td>
        <td>Master record for each day's nutrition & fitness schedule.</td>
      </tr>
      <tr>
        <td><code>meals</code></td>
        <td><code>id (UUID PK)</code></td>
        <td><code>diet_plan_id (FK)</code>, meal_type (Breakfast, Lunch, etc.), meal_name, food_items (JSONB with exact g/ml), calories, protein_g, carbs_g, fat_g</td>
        <td>Granular individual meal items with portion sizes.</td>
      </tr>
      <tr>
        <td><code>daily_progress</code></td>
        <td><code>id (UUID PK)</code></td>
        <td><code>anonymous_user_id</code>, progress_date, breakfast_completed (BOOL), lunch_completed, dinner_completed, workout_completed, water_completed_ml, completion_percentage</td>
        <td>Real-time daily adherence tracker and completion scoring.</td>
      </tr>
      <tr>
        <td><code>weight_logs</code></td>
        <td><code>id (UUID PK)</code></td>
        <td><code>anonymous_user_id</code>, weight_kg, notes, logged_at</td>
        <td>Longitudinal weight change timeline.</td>
      </tr>
      <tr>
        <td><code>water_logs</code></td>
        <td><code>id (UUID PK)</code></td>
        <td><code>anonymous_user_id</code>, amount_ml, logged_at</td>
        <td>Time-stamped hydration logs throughout the day.</td>
      </tr>
      <tr>
        <td><code>sleep_logs</code></td>
        <td><code>id (UUID PK)</code></td>
        <td><code>anonymous_user_id</code>, sleep_start, sleep_end, duration_minutes, quality_rating (1-5), notes</td>
        <td>Sleep hygiene tracking & recovery quality logging.</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="page-break"></div>

<!-- SECTION 5: STEP-BY-STEP CREATION PROCESS -->
<div class="section">
  <h1>5. How the Project Was Created (Step-by-Step Build)</h1>
  <p>If someone asks how you engineered this application from scratch, walk through these 7 structured development phases:</p>

  <div class="card" style="margin-bottom:10px;">
    <div class="card-title">Phase 1: Mathematical & Metabolic Formula Modeling</div>
    <p style="font-size:12px;">
      Researched validated sports nutrition formulas (Mifflin-St Jeor, WHO BMI indices, macro split strategies). Built pure TypeScript functions in <code>lib/nutrition/calculations.ts</code> to calculate BMR, TDEE, water requirements, and sleep cycles. Built automated Vitest test suites to ensure 100% precision across edge cases.
    </p>
  </div>

  <div class="card" style="margin-bottom:10px;">
    <div class="card-title">Phase 2: Anonymous-First Tenancy & Database Schema</div>
    <p style="font-size:12px;">
      Architected a friction-free session system in <code>lib/storage/anonymousUser.ts</code> using RFC4122 UUIDs stored in browser cookies and localStorage. Created PostgreSQL migration scripts in <code>supabase/migrations/</code> creating 8 normalized tables with Row Level Security (RLS) policies and B-Tree indexes on <code>anonymous_user_id</code>.
    </p>
  </div>

  <div class="card" style="margin-bottom:10px;">
    <div class="card-title">Phase 3: Food Database, Portioning Engine & Workout Generator</div>
    <p style="font-size:12px;">
      Curated a structured food catalog (<code>lib/nutrition/foodDatabase.ts</code>) containing hundreds of items categorized by macronutrients, cuisine, and allergen tags. Built an intelligent algorithm (<code>lib/nutrition/dietGenerator.ts</code>) that rotates 5 meals/day across 7 distinct days, mathematically scaling gram/ml quantities to match the exact caloric and macro target.
    </p>
  </div>

  <div class="card" style="margin-bottom:10px;">
    <div class="card-title">Phase 4: Modern Next.js 16 UI/UX & Responsive Layouts</div>
    <p style="font-size:12px;">
      Built a sleek, high-contrast dark/light responsive design system using Tailwind CSS v4 and Lucide React icons. Implemented the 4-step interactive Onboarding Wizard (<code>/onboarding</code>), Live Dashboard (<code>/dashboard</code>), 7-Day Collapsible Plan (<code>/weekly</code>), Hydration Station (<code>/water</code>), Sleep Station (<code>/sleep</code>), and Settings (<code>/settings</code>).
    </p>
  </div>

  <div class="card" style="margin-bottom:10px;">
    <div class="card-title">Phase 5: Groq AI Streaming Assistant Integration</div>
    <p style="font-size:12px;">
      Connected Groq's high-speed inference API running <code>llama-3.3-70b-versatile</code>. Implemented a context injection layer in <code>app/api/chat/route.ts</code> that dynamically grounds the system prompt with the user's live profile, BMI, TDEE, calories, allergens, and daily adherence stats so the AI gives accurate, hyper-personalized advice.
    </p>
  </div>

  <div class="card" style="margin-bottom:10px;">
    <div class="card-title">Phase 6: Data Visualization & Dual-Sync Storage</div>
    <p style="font-size:12px;">
      Integrated Recharts for dynamic visual analytics (weight trends, water intake bar charts, sleep graphs). Built a hybrid synchronization bridge (<code>lib/storage/localStore.ts</code>) that keeps client state instantly responsive while background-syncing with Supabase REST APIs.
    </p>
  </div>

  <div class="card" style="margin-bottom:10px;">
    <div class="card-title">Phase 7: Comprehensive Unit Testing & Quality Assurance</div>
    <p style="font-size:12px;">
      Wrote 23 automated unit tests in Vitest validating standard weight maintenance, deficit/surplus boundaries, vegetarian/vegan filtering, and strict allergen exclusion (e.g., verifying that peanut/dairy allergens never appear in meals when restricted).
    </p>
  </div>
</div>

<div class="page-break"></div>

<!-- SECTION 6: HOW IT IS DEPLOYED -->
<div class="section">
  <h1>6. Step-by-Step Production Deployment Guide</h1>
  <p>Here is the exact procedure to deploy this application to production from scratch:</p>

  <div class="card" style="margin-bottom:10px;">
    <div class="card-title">Step 1: Supabase Database Provisioning</div>
    <ol style="font-size:12px; margin-left:16px;">
      <li>Log in to <a href="https://supabase.com">Supabase</a> and click <strong>New Project</strong>.</li>
      <li>Set project name (e.g., <code>healthfit-prod</code>), choose a strong database password, and select your preferred AWS/GCP region.</li>
      <li>Navigate to <strong>SQL Editor</strong> on the Supabase dashboard.</li>
      <li>Copy the contents of <code>supabase/migrations/001_initial_schema.sql</code> and <code>002_anonymous_users.sql</code>, paste into the editor, and click <strong>Run</strong>.</li>
      <li>Navigate to <strong>Project Settings > API</strong> and copy:
        <ul>
          <li><code>Project URL</code> (e.g., <code>https://abcdefgh.supabase.co</code>)</li>
          <li><code>anon public key</code> (e.g., <code>eyJhbGciOi...</code>)</li>
        </ul>
      </li>
    </ol>
  </div>

  <div class="card" style="margin-bottom:10px;">
    <div class="card-title">Step 2: Groq Cloud AI Provisioning</div>
    <ol style="font-size:12px; margin-left:16px;">
      <li>Log in to <a href="https://console.groq.com">Groq Cloud Console</a>.</li>
      <li>Navigate to <strong>API Keys</strong> and click <strong>Create API Key</strong>.</li>
      <li>Copy the generated key (starts with <code>gsk_...</code>).</li>
    </ol>
  </div>

  <div class="card" style="margin-bottom:10px;">
    <div class="card-title">Step 3: GitHub Repository Synchronization</div>
    <pre>git add .
git commit -m "Deploy: Production ready HealthFit platform"
git branch -M main
git push -u origin main</pre>
  </div>

  <div class="card" style="margin-bottom:10px;">
    <div class="card-title">Step 4: Vercel Edge Deployment</div>
    <ol style="font-size:12px; margin-left:16px;">
      <li>Log in to <a href="https://vercel.com">Vercel</a> and click <strong>Add New > Project</strong>.</li>
      <li>Import your <code>healthfit</code> GitHub repository.</li>
      <li>In the <strong>Environment Variables</strong> configuration panel, add the 4 required variables:
        <table>
          <tr><th>Variable Name</th><th>Value Example</th></tr>
          <tr><td><code>NEXT_PUBLIC_SUPABASE_URL</code></td><td><code>https://your-id.supabase.co</code></td></tr>
          <tr><td><code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code></td><td><code>eyJhbGciOi...</code></td></tr>
          <tr><td><code>GROQ_API_KEY</code></td><td><code>gsk_your_groq_api_key</code></td></tr>
          <tr><td><code>GROQ_MODEL</code></td><td><code>llama-3.3-70b-versatile</code></td></tr>
        </table>
      </li>
      <li>Click <strong>Deploy</strong>. Vercel compiles the Next.js 16 build and provisions global CDN routes within 60 seconds.</li>
    </ol>
  </div>
</div>

<div class="page-break"></div>

<!-- SECTION 7: INTERVIEW & VIVA PRESENTATION GUIDE -->
<div class="section">
  <h1>7. Presentation, Interview & Viva Guide</h1>
  <p>Use these structured answers when explaining HealthFit to professors, interviewers, or clients:</p>

  <div class="callout">
    <div class="callout-title">The 30-Second Elevator Pitch</div>
    <em>"HealthFit is a Next.js 16 and TypeScript full-stack health platform that generates personalized 7-day nutrition, workout, hydration, and sleep plans with exact gram/ml portioning. It solves the friction of traditional apps by operating on an anonymous-first session model—no passwords or sign-up walls required. It features real-time daily progress tracking, interactive Recharts analytics, and an integrated Groq AI assistant running LLaMA 3.3 70B that answers health queries grounded in the user's live metabolic data."</em>
  </div>

  <h2>Top 6 Technical Interview Questions & Answers</h2>

  <div class="card" style="margin-bottom:10px;">
    <div class="card-title">Q1: How does the anonymous session work without a traditional auth system?</div>
    <p style="font-size:11.5px;">
      <strong>Answer:</strong> On the first visit, the client generates a unique RFC4122 v4 UUID and persists it in both secure browser cookies and localStorage. When the user interacts with the app, this UUID is transmitted via HTTP headers or payload to Next.js API route handlers. The backend upserts records in Supabase PostgreSQL using <code>anonymous_user_id</code> as the tenant key. This gives users all the persistence of a logged-in account without any login barrier. If they click 'Reset Data', their UUID and associated DB rows are purged.
    </p>
  </div>

  <div class="card" style="margin-bottom:10px;">
    <div class="card-title">Q2: How does the meal generator ensure mathematical precision in portions?</div>
    <p style="font-size:11.5px;">
      <strong>Answer:</strong> We calculate target daily calories and macro grams (protein, carbs, fat) from BMR/TDEE. Then, we distribute these across 5 daily meals with strict calorie allocation percentages (Breakfast 25%, Snack 10%, Lunch 30%, Snack 10%, Dinner 25%). Our diet generator selects compatible base items filtered by cuisine and allergies, and solves for the scalar quantity multiplier S = Target Calories / Base Calories, ensuring the total calories and macros match within +/- 2% of target.
    </p>
  </div>

  <div class="card" style="margin-bottom:10px;">
    <div class="card-title">Q3: Why did you choose Groq Cloud with LLaMA 3.3 70B instead of standard OpenAI GPT-4?</div>
    <p style="font-size:11.5px;">
      <strong>Answer:</strong> Groq's custom LPU (Language Processing Unit) architecture delivers unmatched inference speeds (300+ tokens per second), enabling instantaneous conversational streaming. LLaMA 3.3 70B Versatile provides state-of-the-art reasoning on health and fitness at a fraction of the latency and cost of proprietary models.
    </p>
  </div>

  <div class="card" style="margin-bottom:10px;">
    <div class="card-title">Q4: How do you guarantee user safety regarding food allergies?</div>
    <p style="font-size:11.5px;">
      <strong>Answer:</strong> Every food item in our catalog carries an <code>allergens: string[]</code> metadata array (e.g. <code>['dairy', 'nuts', 'gluten']</code>). The diet generator runs a strict set-intersection filter: if <code>food.allergens.some(a => userRestrictions.includes(a))</code> is true, the item is immediately disqualified before meal assembly. We have automated Vitest unit tests verifying allergen exclusion.
    </p>
  </div>

  <div class="card" style="margin-bottom:10px;">
    <div class="card-title">Q5: What happens if the database is unreachable or offline?</div>
    <p style="font-size:11.5px;">
      <strong>Answer:</strong> HealthFit implements an optimistic local-first caching strategy via <code>localStore.ts</code>. All profiles, generated plans, and daily logs are mirrored in browser localStorage. The user can continue using the dashboard, checking off meals, and logging water seamlessly, and the app gracefully syncs with Supabase once network connectivity is restored.
    </p>
  </div>

  <div class="card" style="margin-bottom:10px;">
    <div class="card-title">Q6: How does the AI Assistant stay factually grounded and avoid hallucinations?</div>
    <p style="font-size:11.5px;">
      <strong>Answer:</strong> When the user opens the AI assistant (<code>/ai</code>), the client sends the chat message alongside the user's active profile and daily stats. The API route builds a structured system prompt injecting their exact age, weight, height, BMI, TDEE, caloric target, dietary restrictions, and today's meal completion status. The prompt explicitly instructs LLaMA 3.3 to reference these exact numbers, ground advice in science, and include health safety disclaimers.
    </p>
  </div>
</div>

<div class="page-break"></div>

<!-- SECTION 8: COMPLETE FILE TREE & DIRECTORY BREAKDOWN -->
<div class="section">
  <h1>8. Complete Codebase Architecture & File Tree</h1>

  <pre>healthfit/
├── app/
│   ├── layout.tsx                  # Global HTML wrapper, metadata, SiteBackground, Navbar & Footer
│   ├── globals.css                 # Tailwind CSS v4 design tokens, color variables & glassmorphism
│   ├── page.tsx                    # High-conversion Landing Page with Hero, Features & CTA
│   ├── onboarding/page.tsx         # 4-Step Interactive Onboarding Wizard (Body, Lifestyle, Goal, Diet)
│   ├── dashboard/page.tsx          # Main Hub: Macro Cards, Today's Meals, Daily Checklist & Quick Stats
│   ├── weekly/page.tsx             # 7-Day Collapsible Meal & Workout Rotation Schedule (Mon-Sun)
│   ├── progress/page.tsx           # Visual Analytics with Recharts (Weight, Water, Sleep, Adherence)
│   ├── water/page.tsx              # Hydration Station: 7-Stage Time Schedule & One-Click Logger
│   ├── sleep/page.tsx              # Sleep Hygiene Station: Circadian Bedtime Calculator & Log Hub
│   ├── diet/page.tsx               # Dedicated Diet View & Recipe Inspector
│   ├── fitness/page.tsx            # Dedicated Workout View with Exercise Sets, Reps & Timers
│   ├── ai/page.tsx                 # Groq AI Wellness Assistant with Real-Time Streaming Chat
│   ├── settings/page.tsx           # User Preferences, Target Adjustments & Data Reset Vault
│   └── api/
│       ├── chat/route.ts           # Groq LLaMA 3.3 70B context-injected AI streaming endpoint
│       ├── generate-plan/route.ts  # Server-side 7-day personalized plan generator
│       ├── profile/route.ts        # User profile CRUD & anonymous session sync
│       ├── health-metrics/route.ts # Metabolic calculation sync & storage
│       ├── progress/route.ts       # Daily task completion & adherence score handler
│       ├── weight/route.ts         # Weight tracking & historical log endpoint
│       ├── water/route.ts          # Hydration intake logger & target endpoint
│       ├── sleep/route.ts          # Sleep duration & quality logger endpoint
│       ├── workout/route.ts        # Workout completion & exercise logger
│       └── reset/route.ts          # Permanent user data purge & session reset
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              # Responsive top navigation with active route highlights
│   │   ├── Footer.tsx              # Application footer with disclaimers and navigation links
│   │   ├── MobileNav.tsx           # Mobile bottom navigation bar for quick smartphone access
│   │   └── SiteBackground.tsx      # Ambient animated background gradients
│   ├── onboarding/                 # Step1Body, Step2Lifestyle, Step3Goal, Step4Diet
│   ├── dashboard/                  # MacroOverviewCards, TodayMealList, DailyChecklist, QuickStats
│   ├── weekly/                     # WeeklyPlanView, MealCard, WorkoutCard
│   ├── progress/                   # WeightChart, WaterChart, SleepChart, AdherenceRing
│   ├── hydration/                  # WaterScheduleTimeline, QuickWaterAddModal
│   └── sleep/                      # SleepCycleCalculator, WindDownProtocolCard
├── lib/
│   ├── nutrition/
│   │   ├── calculations.ts         # Pure formulas for BMI, BMR (Mifflin-St Jeor), TDEE & Macros
│   │   ├── foodDatabase.ts         # Food items with caloric values, macros, cuisines & allergen tags
│   │   ├── dietGenerator.ts        # 7-Day 5-meal rotation engine with exact gram/ml portion scaling
│   │   ├── fitnessGenerator.ts     # Tiered workout routines (Beginner, Intermediate, Advanced)
│   │   ├── hydration.ts            # Hydration schedule calculations & intake recommendations
│   │   └── sleep.ts                # 90-min sleep cycle calculations & wind-down recommendations
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client (anon key only)
│   │   └── server.ts               # Server-side Supabase client for API handlers
│   ├── storage/
│   │   ├── anonymousUser.ts        # RFC4122 UUID generation & cookie/storage persistence
│   │   └── localStore.ts           # Client-side optimistic cache & offline sync bridge
│   ├── validation/
│   │   └── schemas.ts              # Zod validation schemas for forms, logs & API payloads
│   └── utils/                      # Formatting helpers, date formatters, and class merge utils
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql  # 8 PostgreSQL relational tables, RLS policies & B-tree indexes
│       └── 002_anonymous_users.sql # Extended anonymous user support & performance indexing
├── tests/
│   ├── ai/aiChat.test.ts           # Groq AI route tests
│   ├── nutrition/calculations.test.ts # Metabolic calculation test suite
│   ├── nutrition/dietGenerator.test.ts# Diet generator & allergen test suite
│   ├── nutrition/fitnessGenerator.test.ts # Workout generator test suite
│   └── progress/progress.test.ts   # Daily progress & completion tests
├── package.json                    # Project metadata, scripts, dependencies & devDependencies
├── tsconfig.json                   # TypeScript compiler configuration (strict mode enabled)
└── README.md                       # High-level project overview & quickstart guide
</pre>
</div>

</body>
</html>
`;

fs.writeFileSync(tempHtmlPath, htmlContent);
console.log('Temporary HTML written to:', tempHtmlPath);

try {
  console.log('Generating PDF via headless Microsoft Edge...');
  const cmd = `"${edgePath}" --headless --disable-gpu --print-to-pdf="${outputPdfPath}" --no-pdf-header-footer "${tempHtmlPath}"`;
  execSync(cmd);
  if (fs.existsSync(outputPdfPath)) {
    const stats = fs.statSync(outputPdfPath);
    console.log(`SUCCESS: PDF created at ${outputPdfPath} (${stats.size} bytes)`);
  } else {
    console.error('Failed to create PDF file.');
  }
} catch (error) {
  console.error('Error during PDF generation:', error);
} finally {
  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }
}
