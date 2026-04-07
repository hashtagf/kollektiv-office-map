# Kollektiv Office Map

🏢 **2D Animated Office Map** showing 16 AI agents working collaboratively at Kollektiv

## 🚀 Live Demo

**Production URL**: https://kollektiv-office-map.vercel.app

## 📋 Overview

An interactive 2D office visualization that displays our AI team members in real-time:
- **16 AI agents** with unique avatars, roles, and animations
- **Real-time status updates** showing what each agent is currently working on
- **Smooth animations** using Framer Motion for agent movement and interactions
- **Live activity polling** that updates agent status every 5 seconds
- **SVG-based graphics** for crisp, scalable office layout and avatars

## 🎯 Features

### Office Layout
- **Top-down 2D view** of the Kollektiv office space
- **Team-based seating arrangement**: Engineering (left), Product (center), Business (right), Operations (bottom)
- **Meeting rooms** and common areas for collaboration
- **Interactive agent avatars** with smooth movement animations

### Agent System
- **16 unique AI agents** from our actual team directory
- **Role-based colors** and icons for easy identification
- **Real-time status**: working, idle, or in meetings
- **Dynamic task display** showing current activities
- **Movement animations** between different office locations

### Technical Features
- **Next.js 14** with App Router and TypeScript
- **Framer Motion** for smooth animations and transitions
- **Tailwind CSS** for responsive styling
- **Real-time polling** API for live status updates
- **Optimized for Vercel** deployment with serverless functions

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hashtagf/kollektiv-office-map.git
   cd kollektiv-office-map
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   ```
   http://localhost:3000
   ```

### Build & Deploy

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Deploy to Vercel** (automatic via GitHub integration):
   ```bash
   vercel --prod
   ```

## 📁 Project Structure

```
kollektiv-office-map/
├── app/                    # Next.js App Router
│   ├── api/               # API routes for agent data
│   │   ├── agents/        # Agent list and status
│   │   ├── activities/    # Recent activities
│   │   └── agent-status/  # Individual agent status
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Main office map page
├── components/            # React components
│   ├── Agent.tsx         # Individual agent avatar
│   ├── ActivityPanel.tsx # Live activity feed
│   └── OfficeMap.tsx     # Main office layout
├── hooks/                # Custom React hooks
│   └── usePolling.ts     # Real-time data polling
├── lib/                  # Utilities and types
│   └── types.ts         # TypeScript definitions
├── utils/               # Helper functions
├── vercel.json          # Vercel deployment config
└── README.md           # This file
```

## 🔧 API Endpoints

- **GET /api/agents** - Get all agent data with positions and status
- **GET /api/activities** - Get recent team activities
- **GET /api/agent-status/[id]** - Get specific agent details

All endpoints are optimized for Vercel serverless functions with 10s timeout limits.

## 🎨 Design Decisions

### Agent Avatars
- **SVG circles** with team-based colors (no image dependencies)
- **Lucide React icons** for role identification
- **Smooth animations** for movement and state changes

### Office Layout
- **800x600px** responsive canvas
- **Team clustering** for realistic office arrangement
- **Collision detection** for natural movement patterns

### Performance
- **5-second polling** interval for live updates
- **Optimized re-renders** using React.memo and useMemo
- **Lazy loading** of non-critical components

## 🚀 Deployment

Deployed on **Vercel** with the following optimizations:
- **Next.js framework** auto-detection
- **10-second timeout** for API functions
- **Edge caching** for static assets
- **Automatic builds** from main branch

## 👥 Team

Built by the Kollektiv AI engineering team:
- **Alex Park** - Backend API & Project Structure  
- **Sarah Kim** - Frontend Components & Animations
- **Riku Honda** - DevOps & Deployment
- **Priya Sharma** - QA & Testing

## 📄 License

Private project - Kollektiv AI © 2024