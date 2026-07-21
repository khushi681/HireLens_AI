
# 🚀 HireLens AI

> AI-powered resume analysis platform that helps job seekers optimize their resumes using Generative AI, ATS scoring, and actionable recommendations.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)
![Gemini](https://img.shields.io/badge/Google-Gemini-orange)
![Stripe](https://img.shields.io/badge/Stripe-Payments-purple)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## 📌 Overview

Applying for jobs has become increasingly competitive. Many candidates submit resumes without knowing whether they are ATS-friendly or aligned with the job description.

HireLens AI simplifies this process by allowing users to upload their resume, compare it against a job description, and receive AI-powered feedback, ATS insights, and improvement suggestions within seconds.

The platform also provides resume history, subscription management, and a modern dashboard to help users continuously improve their resumes.

---

# ✨ Features

### 🤖 AI Resume Analysis

- Upload PDF resumes
- Paste any Job Description
- AI-generated resume feedback
- ATS compatibility score
- Personalized improvement suggestions

---

### 📊 Dashboard

- Resume analysis statistics
- Recent analyses
- Usage tracking
- Clean analytics cards

---

### 📁 Resume History

- View previous analyses
- Revisit AI feedback
- Track improvements over time

---

### 💳 Subscription System

- Free Plan
- Pro Plan
- Stripe Checkout integration
- Billing page
- Subscription management

---

### 🔐 Authentication

- Secure login using Clerk
- Protected routes
- User-specific analysis history

---

### 🎨 Modern User Experience

- Responsive UI
- Dark/Light compatible components
- Framer Motion animations
- Clean SaaS dashboard

---

# 🛠 Tech Stack

## Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

## Backend

- Next.js API Routes
- Supabase
- Clerk Authentication

## AI

- Google Gemini API

## Payments

- Stripe Checkout
- Stripe Webhooks

## Deployment

- Vercel

---

# 🏗 Architecture

```
                 User
                   │
                   ▼
            Next.js Frontend
                   │
      ┌────────────┼────────────┐
      ▼            ▼            ▼
  Clerk Auth   Gemini API   Stripe
      │            │            │
      └──────┬─────┘            │
             ▼                  │
          API Routes            │
             │                  │
             ▼                  ▼
          Supabase         Webhooks
```

---

# 📂 Project Structure

```
app/
components/
lib/
services/
types/
public/
```

---

# ⚙ Installation

Clone the repository

```bash
git clone https://github.com/khushi681/HireLens_AI.git
```

Move into the project

```bash
cd HireLens_AI
```

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

---

# 🔑 Environment Variables

Create a `.env.local` file and add:

```env
GEMINI_API_KEY=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=

NEXT_PUBLIC_APP_URL=
```

---

# 🚀 How It Works

1. User signs in securely using Clerk.
2. Resume PDF is uploaded.
3. Text is extracted from the PDF.
4. User provides the target job description.
5. Gemini analyzes the resume against the job description.
6. ATS score and improvement suggestions are generated.
7. Analysis is stored in Supabase.
8. Users can revisit previous analyses anytime.
9. Pro users unlock unlimited resume analyses and premium features.

---

# 📈 Future Improvements

- Resume version comparison
- AI-powered resume rewriting
- Cover letter generation
- LinkedIn profile optimization
- Interview preparation assistant
- Multi-language resume analysis
- Enhanced account settings

---

# 🙌 Acknowledgements

This project was built as part of a hackathon to explore how Generative AI can simplify and improve the job application process for students and professionals.

---

## 👩‍💻 Author

**Khushi Jha**

GitHub: https://github.com/khushi681

---

## ⭐ If you found this project useful, consider giving it a star.
