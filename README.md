# HEALTHFIT — Personalized Health, Nutrition & Fitness Platform

HealthFit is a high-performance, fully responsive Next.js 16 web application for personalized wellness planning. It calculates metabolic baselines (BMI, BMR, TDEE), generates tailored 7-day nutrition, hydration, sleep, and workout plans with exact gram/ml portioning, tracks daily completion, visualizes longitudinal health progress, and offers AI wellness guidance powered by Groq LLaMA 3.3 70B—all with zero mandatory account creation or sign-up wall.

---

## 🌟 Core Principle

$$\text{Input} \longrightarrow \text{Calculate} \longrightarrow \text{Personalize} \longrightarrow \text{Generate Plan} \longrightarrow \text{Track Progress} \longrightarrow \text{AI Insights}$$

---

## 🚀 Key Features

* **Anonymous-First Architecture**: No email, no password, no OTP, no sign-up wall. A persistent UUID (`healthfit_user_id`) is stored locally and mapped to Supabase database records.
* **Health Calculation Engine**:
  * **BMI**: Body Mass Index with healthy weight window and screening categorization.
  * **BMR**: Mifflin-St Jeor equation.
  * **TDEE**: Dynamic physical activity multipliers (1.20x – 1.90x).
  * **Caloric & Macro Targets**: Conservative, safe deficit or surplus with high protein allocation and fiber targets.
* **Structured Food Database & Diet Generator**:
  * Rich database of whole carbohydrates, lean proteins, vegetables, fruits, healthy fats, and nuts.
  * Diet preferences: Vegetarian, Non-Vegetarian, Vegan, Eggetarian.
  * Cuisines: South Indian, North Indian, Regional Indian, Continental/International, Mixed.
  * Strict allergen filtering (Dairy, Eggs, Nuts, Gluten, Seafood, Soy).
  * Exact gram (g) and milliliter (ml) portion quantities.
* **7-Day Meal & Workout Rotation**:
  * 5 balanced daily meals (Breakfast, Morning Snack, Lunch, Evening Snack, Dinner).
  * Distinct recipes rotated Monday through Sunday.
  * Tiered workout routines (Beginner, Intermediate, Advanced) with exercises, sets, reps, and warm-up/cool-down.
* **Hydration System**:
  * Weight and activity-based daily target (in L and ml).
  * 7-stage scheduled intake throughout the day with quick +250ml / +500ml / +750ml logging.
* **Circadian Sleep System**:
  * Recommended bedtime and wake time based on 90-minute sleep cycles.
  * 4-stage nighttime wind-down protocol and sleep logger.
* **Groq AI Wellness Assistant**:
  * Fast streaming AI coaching powered by `llama-3.3-70b-versatile`.
  * Context-aware answers based on the user's metabolic stats and goals.
* **Interactive Dashboard & Daily Progress**:
  * Today's meal list with checkboxes and instant adherence scoring.
  * Progress analytics with Recharts (Weight trend, Water intake, Sleep duration, Habit adherence).
* **Reset Functionality**:
  * Permanent data erase with modal confirmation, server purging, and UUID regeneration.
* **Fully Responsive**:
  * Tailored layouts across mobile phones (iOS & Android safe areas), tablets, laptops, and large desktop screens.

---

## 🛠️ Technology Stack

* **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions & Route Handlers)
* **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **AI Provider**: [Groq Cloud](https://groq.com/) (`llama-3.3-70b-versatile`)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Charts**: [Recharts](https://recharts.org/)
* **Validation**: [Zod](https://zod.dev/)
* **Database**: [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security)
* **Testing**: [Vitest](https://vitest.dev/)

---

## 📂 Architecture & Project Structure

```text
healthfit/
├── app/
│   ├── page.tsx                  # High-conversion Landing Page
│   ├── onboarding/page.tsx       # 4-Step Interactive Onboarding Wizard
│   ├── dashboard/page.tsx        # Daily Overview, Today's Meals & Checklist
│   ├── weekly/page.tsx           # 7-Day Collapsible Plan (Mon-Sun)
│   ├── progress/page.tsx         # Recharts Analytics (Weight, Water, Sleep, Habits)
│   ├── water/page.tsx            # Dedicated Hydration Station & Schedule
│   ├── sleep/page.tsx            # Dedicated Sleep Hygiene & Log Hub
│   ├── settings/page.tsx         # Preferences, Unit/Macro Adjustments & Reset Data
│   ├── ai/page.tsx               # Groq AI Wellness Assistant
│   ├── api/
│   │   ├── ai/route.ts           # Groq AI route handler
│   │   ├── profile/route.ts      # Profile CRUD
│   │   ├── health-metrics/route.ts# Health metrics sync
│   │   ├── generate-plan/route.ts# Server-side 7-day plan generator
│   │   ├── progress/route.ts     # Daily task completion & stats
│   │   ├── weight/route.ts       # Weight logging
│   │   ├── water/route.ts        # Water intake logging
│   │   ├── sleep/route.ts        # Sleep logging
│   │   └── reset/route.ts        # Clear user data
│   ├── layout.tsx                # App shell, Navbar, Footer, MobileNav
│   └── globals.css               # Design tokens, themes & safe area styles
├── components/
│   ├── layout/                   # Navbar, Footer, MobileNav, Sidebar
│   ├── onboarding/               # Step1Body, Step2Lifestyle, Step3Goal, Step4Diet
│   ├── dashboard/                # MacroOverviewCards, TodayMealList, DailyChecklist
│   ├── weekly/                   # WeeklyPlanView
│   ├── progress/                 # ProgressAnalyticsView
│   ├── hydration/                # HydrationScheduleView
│   └── sleep/                    # SleepScheduleView
├── lib/
│   ├── nutrition/
│   │   ├── calculations.ts       # BMI, BMR, TDEE, Macros, Water formulas
│   │   ├── hydration.ts          # Hydration schedules & target calculations
│   │   ├── sleep.ts              # Circadian bedtime & recovery calculations
│   │   ├── foodDatabase.ts       # Food catalogue with macros, diets & allergens
│   │   ├── dietGenerator.ts      # 7-day meal rotation & portion scaling
│   │   └── fitnessGenerator.ts   # Beginner/Intermediate/Advanced routine builder
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client (anon key only)
│   │   └── server.ts             # Server-side Supabase client
│   ├── storage/
│   │   ├── anonymousUser.ts      # UUID generation & cookie/storage persistence
│   │   └── localStore.ts         # Client persistence & offline synchronization
│   ├── validation/
│   │   └── schemas.ts            # Zod schemas for Onboarding & Logging
│   └── utils/                    # Formatting, helper, and date utilities
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql
│       └── 002_anonymous_users.sql# 8 PostgreSQL tables, RLS policies, indexes
└── tests/
    ├── ai/aiChat.test.ts
    ├── nutrition/calculations.test.ts
    ├── nutrition/dietGenerator.test.ts
    ├── nutrition/fitnessGenerator.test.ts
    └── progress/progress.test.ts
```

---

## ⚡ Local Development

```bash
# 1. Clone repository & install dependencies
git clone https://github.com/hemanth2581/healthfit.git
cd healthfit
npm install

# 2. Configure environment variables
cp .env.example .env.local
# Fill in your Supabase & Groq API keys in .env.local

# 3. Run automated tests
npm run test

# 4. Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Testing

Run the Vitest test suite:

```bash
npm run test
```

All 23 unit tests verify:
* **Scenario 1**: 70 kg / 175 cm / age 22 / moderate activity / maintenance
* **Scenario 2**: 90 kg / 175 cm / age 25 / moderate activity / weight loss
* **Scenario 3**: 60 kg / 170 cm / age 23 / moderate activity / weight gain
* **Scenario 4**: Vegetarian diet filtering
* **Scenario 5**: Vegan diet filtering
* **Scenario 6**: Nut allergy filtering (Verify restricted foods never appear)

---

## 🚀 Production Deployment (Vercel)

1. Push your repository to GitHub:
   ```bash
   git push -u origin main
   ```
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New > Project**.
3. Import your `healthfit` repository.
4. Add the following **Environment Variables**:
   * `NEXT_PUBLIC_SUPABASE_URL`: `https://your-project.supabase.co`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `your-anon-key`
   * `GROQ_API_KEY`: `gsk_your_groq_api_key`
   * `GROQ_MODEL`: `llama-3.3-70b-versatile`
5. Click **Deploy**.

---

## ⚠️ Health & Medical Disclaimer

HealthFit provides general wellness and nutrition guidance and is not a medical diagnosis or substitute for professional medical advice. If you have a medical condition, are pregnant or breastfeeding, take medication affected by diet, or have specific nutritional needs, consult a qualified healthcare professional.
