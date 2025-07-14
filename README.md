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

---

## 🏗️ Architecture

### 🟦 System Flow (Colorful Mermaid Table)

```mermaid
flowchart TD
    subgraph F[Frontend]
        F1[MainPage.jsx]
        F2[HistoryPage.jsx]
        F3[ResultCard.jsx]
        F4[MCQItem.jsx]
        F5[api.js]
    end
    subgraph B[Backend]
        B1[main.py]
        B2[summarizer.py]
        B3[mcq_generator.py]
        B4[history.py]
        B5[utils.py]
    end
    subgraph S[Storage]
        S1[(history.json)]
    end

    F1 -- User Input --> F5
    F2 -- History Request --> F5
    F5 -- Summarize/MCQ/History API --> B1
    B1 -- Summarize --> B2
    B1 -- MCQ Gen --> B3
    B1 -- History --> B4
    B4 -- Read/Write --> S1
    F3 -- Show Results --> F1
    F4 -- Show MCQs --> F1
    F2 -- Show History --> F3
    style F fill:#209CEE,stroke:#176bb3,stroke-width:2px
    style B fill:#38B2AC,stroke:#005571,stroke-width:2px
    style S fill:#FFD700,stroke:#FFA500,stroke-width:2px
```

---

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

---

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

---

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

---

## 🎨 UI/UX Highlights

- **Modern, animated 3D gradient backgrounds**
- **Brand colors:** #209CEE (primary), #176bb3 (hover), #E6F4FB (light)
- **Responsive design:** Works on desktop and mobile
- **Interactive quizzes:** Submit answers, see instant feedback and score
- **History:** View all past summaries and quizzes, review your answers

---

## 🧰 Tech Stack

- **Frontend:** React, Vite, TailwindCSS
- **Backend:** FastAPI, Transformers, NLTK, spaCy, PyPDF2, python-docx, BeautifulSoup
- **Storage:** JSON file (can be upgraded to a database)
- **APIs:** HuggingFace Transformers, Google Search API

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See [`LICENSE`](LICENSE) for details.

---

## 👤 Author

**Arijit Mondal**  
[GitHub](https://github.com/arijitmondal)  
Email: arijitmondal@example.com

---

> *Smart Summary Quiz: AI-powered learning for everyone!*