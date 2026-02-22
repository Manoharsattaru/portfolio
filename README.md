# 🚀 Sattaru Manohar — Portfolio Website

[![Live Site](https://img.shields.io/badge/Live-manoharsattaru.github.io/portfolio-blue?style=for-the-badge&logo=github)](https://manoharsattaru.github.io/portfolio/)

A premium, dark-themed personal portfolio showcasing 6+ years of experience in Technology Consulting, AI/ML, Data Analytics, and Public Sector Advisory.

## ✨ Features

- **Interactive Portfolio** — Hero, About, Experience timeline, Skills, Education, Projects, Certifications
- **AI Chatbot** — Hybrid RAG engine (Keyword → Fuzzy FAQ → TF-IDF → Ollama LLM) for answering visitor questions
- **Google Sheets Contact Form** — All contact submissions captured directly in a Google Sheet
- **Admin Dashboard** — Gmail-authenticated dashboard with contact stats, searchable submissions table
- **Toast Notifications** — Slide-in success/error feedback on form submission
- **Responsive Design** — Mobile-first, works across all devices
- **Scroll Animations** — Reveal effects, typing animation, counter animations

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Design | Custom CSS Design System (Inter + Outfit fonts, glassmorphism) |
| Chatbot | Client-side Hybrid RAG (TF-IDF, fuzzy matching) |
| Backend | Google Apps Script (serverless) |
| Database | Google Sheets |
| Auth | Google Identity Services (OAuth 2.0) |
| Hosting | GitHub Pages |

## 📁 File Structure

```
├── index.html          # Main portfolio page
├── index.css           # Design system & styles (1900+ lines)
├── index.js            # Animations, form handler, interactivity
├── chatbot.js          # Hybrid RAG chatbot engine
├── admin.html          # Admin dashboard (protected)
├── admin.css           # Admin dashboard styles
├── admin.js            # Google Sign-In + data fetching
├── profile.jpg         # Profile photo
└── .gitignore          # Excludes reference/source files
```

## 🔧 Setup

### Contact Form (Google Sheets)
1. Create a Google Apps Script project at [script.google.com](https://script.google.com)
2. Deploy as Web App → paste URL into `index.js` (`GOOGLE_SCRIPT_URL`)

### Admin Dashboard
1. Create OAuth Client ID at [Google Cloud Console](https://console.cloud.google.com)
2. Paste Client ID into `admin.js` (`GOOGLE_CLIENT_ID`)
3. Access at `/admin.html` — restricted to authorized Gmail

## 📊 Update Log

| Date | Update |
|------|--------|
| 2026-02-22 | 🚀 Initial launch — full portfolio + chatbot + Google Sheets contact + admin dashboard |

## 📬 Contact

- **Email**: Manoharansiddarth@gmail.com
- **LinkedIn**: [sattarumanohar](https://www.linkedin.com/in/sattarumanohar)
- **GitHub**: [Manoharsattaru](https://github.com/Manoharsattaru)

---

*Built with passion. Powered by pure HTML, CSS & JavaScript — no frameworks needed.* ⚡
