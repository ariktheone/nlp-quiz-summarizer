# Smart Summary Quiz

<div align="center">
  <img src="frontend/public/favicon_io/android-chrome-512x512.png" alt="Smart Summary Quiz" width="120" height="120">
  
  <h3>AI-Powered Content Summarization & Quiz Generation</h3>
  
  <p>
    <a href="#features">Features</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#api-reference">API</a> •
    <a href="#contributing">Contributing</a>
  </p>
  
  <p>
    <img src="https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge" alt="AI Powered">
    <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="MIT License">
    <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  </p>
</div>

---

## 🚀 Overview

**Smart Summary Quiz** is an AI-powered web app that transforms any text, document, or article into concise summaries and interactive quizzes. Upload files, paste text, or enter URLs—get instant summaries and test your knowledge with MCQs!

## Features

### Core Functionality
- **📝 Multi-Input Support** - Process text, files, and URLs
- **🤖 AI-Powered Summarization** - Advanced text summarization using HuggingFace Transformers
- **❓ Intelligent Quiz Generation** - MCQ creation with T5 and Gemini models
- **🔍 Answer Verification** - Google Search API integration for answer validation
- **📊 History Tracking** - Complete activity history with scores and analytics
- **🎨 Modern UI/UX** - Responsive design with smooth animations

### Technical Features
- RESTful API architecture
- File upload support (multiple formats)
- URL content extraction
- Real-time processing
- Mobile-responsive design
- Accessible interface (WCAG compliant)

## 🏗️ Architecture

```mermaid
flowchart TD
    subgraph Frontend [Frontend (React + Vite)]
        A1[MainPage.jsx]
        A2[HistoryPage.jsx]
        A3[ResultCard.jsx]
        A4[MCQItem.jsx]
        A5[api.js]
    end
    subgraph Backend [Backend (FastAPI)]
        B1[main.py]
        B2[summarizer.py]
        B3[mcq_generator.py]
        B4[history.py]
        B5[utils.py]
    end
    subgraph Storage [Storage]
        C1[history.json]
    end
    A5 <-->|REST API| B1
    B1 --> B2
    B1 --> B3
    B1 --> B4
    B4 --> C1
```

- **Frontend:** React + Vite + TailwindCSS, communicates with FastAPI via REST.
- **Backend:** FastAPI serves summarization, MCQ generation, and history endpoints.
- **Storage:** History is stored in a JSON file (`history.json`).

## 🛠️ Setup & Run

### Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
smart-summary-quiz/
│
├── backend/
│   ├── main.py
│   ├── summarizer.py
│   ├── mcq_generator.py
│   ├── history.py
│   ├── utils.py
│   ├── history.json
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── MainPage.jsx
│   │   │   └── HistoryPage.jsx
│   │   ├── components/
│   │   │   ├── ResultCard.jsx
│   │   │   ├── MCQItem.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   ├── InputTabs.jsx
│   │   │   └── ProgressBar.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── App.css
│   └── vite.config.js
│
├── README.md
└── LICENSE
```

## 🌐 API Endpoints

### Summarization
- `POST /api/summarize`
  - Request: `{ "text": "..." }`
  - Response: `{ "summary": "..." }`

### MCQ Generation
- `POST /api/mcqs`
  - Request: `{ "text": "..." }`
  - Response: `{ "mcqs": [ ... ] }`

### History
- `GET /api/history/`
  - Response: `[ { summary, mcqs, userAnswers, score, ... } ]`
- `POST /api/history/`
  - Request: `{ summary, mcqs, ... }`
- `POST /api/history/response/{idx}`
  - Request: `[userAnswers]`
  - Response: `{ success, score }`

## 🎨 UI/UX Highlights

- **Modern, animated 3D gradient backgrounds**
- **Brand colors:** #209CEE (primary), #176bb3 (hover), #E6F4FB (light)
- **Responsive design:** Works on desktop and mobile
- **Interactive quizzes:** Submit answers, see instant feedback and score
- **History:** View all past summaries and quizzes, review your answers

## 🧰 Tech Stack

- **Frontend:** React, Vite, TailwindCSS
- **Backend:** FastAPI, Transformers, NLTK, spaCy, PyPDF2, python-docx, BeautifulSoup
- **Storage:** JSON file (can be upgraded to a database)
- **APIs:** HuggingFace Transformers, Google Search API

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See [`LICENSE`](LICENSE) for details.

## 👤 Author

**Arijit Mondal**  
[GitHub](https://github.com/arijitmondal)  
Email: arijitmondal@example.com

---

> *Smart Summary Quiz: AI-powered learning for everyone!*