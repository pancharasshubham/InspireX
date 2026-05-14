# InspireX

A focused motivational reel app designed to interrupt doomscrolling and reduce friction toward action.

Instead of infinite algorithmic distraction, InspireX delivers a curated feed of short motivational videos with psychological prompts aimed at pushing users back into intentional work.

Built as a mobile-first Progressive Web App (PWA) using Next.js.

---

## Core Idea

Most short-form platforms optimize for:

- Endless scrolling
- Retention loops
- Dopamine spikes
- Passive consumption

InspireX attempts the opposite:

- Curated intentional content
- Reduced choice overload
- Faster access to productive mindset
- Psychological interruption prompts
- Minimal friction launch experience

---

# Features

## Motivational Reel Feed

- Vertical reel-style scrolling
- Mobile-first UI
- Fast swipe navigation
- Lightweight experience

---

## Psychological Awareness Prompt

On app open:

```text
What are you avoiding?
```

Users see rotating prompts designed to create momentary self-awareness before consuming content.

Example prompts:

- Starting the hard task
- Your unfinished work
- Wasted time
- Phone addiction
- Your future self

---

## Progressive Web App (PWA)

Install InspireX directly on your phone like a native app.

- Standalone app experience
- Home screen installation
- Full-screen launch
- Faster reopen experience

---

## Local Thumbnail System

- Lightweight local thumbnail rendering
- Reduced external dependency usage
- Faster library loading

---

## Reel Library

- Dedicated reel library screen
- Grid-based browsing
- Quick jump into feed

---

## Upload System

- Upload motivational reels
- Upload custom thumbnails
- Categorize content

---

# Tech Stack

## Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS

## Backend

- Next.js Route Handlers
- MongoDB

## Media

- ImageKit (legacy uploads)
- Local storage thumbnails
- PWA caching

## Deployment

- Vercel

---

# Project Structure

```bash
app/
 ├── feed/
 ├── library/
 ├── upload/
 ├── api/
components/
lib/
models/
public/
```

---

# Getting Started

## 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/inspirex.git
```

```bash
cd inspirex
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Create Environment Variables

Create:

```bash
.env.local
```

Add:

```env
MONGODB_URI=your_mongodb_uri

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

---

## 4. Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Production Build

```bash
npm run build
```

```bash
npm start
```

---

# PWA Installation

## Android Chrome

1. Open deployed app
2. Use app for a few seconds
3. Tap Chrome menu
4. Select:

```text
Install app
```

The app should now launch in standalone mode.

---

# Routes

| Route | Purpose |
|---|---|
| `/feed` | Main reel feed |
| `/library` | Reel library grid |
| `/upload` | Upload new reels |
| `/api/videos` | Fetch/store reel data |
| `/api/upload` | Upload media |

---

# Product Philosophy

InspireX is intentionally designed to avoid becoming another infinite entertainment feed.

The goal is:

```text
Reduce doomscrolling friction.
Increase action-start probability.
```

---

# Future Ideas

- Smart feed refresh
- Offline reel packs
- Personalized categories
- Cached preview playback
- Daily mindset packs
- Usage analytics
- Consistency tracking

---

# Disclaimer

This project is experimental and built primarily as a behavioral tool and learning project.

It is not affiliated with Instagram or Meta.

---

# License

MIT License
