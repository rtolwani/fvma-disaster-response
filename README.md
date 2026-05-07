# FVMA Disaster Response Platform

Emergency coordination and member communication platform for the Florida Veterinary Medical Association.

## 🎯 Purpose

Automates veterinary clinic check-ins during disasters (hurricanes, floods, etc.) and manages ongoing member communications (CE courses, announcements).

## 🚀 Quick Start

### 1. Clone & Install
```bash
cd fvma-disaster-response
npm install
```

### 2. Environment Variables
Copy `.env.local.example` to `.env.local` and fill in:
- Supabase credentials
- Twilio (SMS)
- Bland.ai (Voice)
- SendGrid (Email)

### 3. Database Setup
Run `supabase-schema.sql` in Supabase SQL Editor

### 4. Run Locally
```bash
npm run dev
```

Open http://localhost:3000

## 📊 Features

### Emergency Mode
- Real-time clinic status dashboard
- SMS/Voice/Email outreach
- Interactive Florida map (1,000+ clinics)
- Resource request tracking
- CSV export for coordinators

### CE/Announcements
- Course management & registration
- Email/SMS campaigns
- Opt-in tracking (TCPA compliant)
- Attendance verification

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Supabase
- **Database:** PostgreSQL (Supabase)
- **SMS:** Twilio
- **Voice:** Bland.ai
- **Email:** SendGrid
- **Maps:** Leaflet/React-Leaflet
- **Hosting:** Vercel

## 📅 Development Status

**Phase 1: Core Dashboard** - In Progress
- [x] Project setup
- [x] Database schema
- [x] Basic dashboard UI
- [ ] Supabase integration
- [ ] Map integration
- [ ] SMS outreach

**Phase 2: Voice + AI** - Upcoming
- [ ] Bland.ai integration
- [ ] AI triage agent
- [ ] Response tracking

**Phase 3: CE/Announcements** - Upcoming
- [ ] Course management
- [ ] Email campaigns
- [ ] Registration pages

## 💰 Costs

- **Setup:** $0 (free tiers)
- **Per Disaster (1K clinics):** ~$270
- **Monthly (non-emergency):** ~$50-100

## 📄 License

Private - FVMA Internal Use

---

Built for FVMA by Ravi Tolwani (DVM)
Technology Partner: dvmSuccess / DVM.com
