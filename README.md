# Fynd AI Intern Take-Home Assessment

A complete AI-powered review feedback system with rating prediction and two-dashboard web application.

## Project Structure

```
fynd-ai-assessment/
├── task1/
│   └── rating_prediction.ipynb
├── task2/
│   ├── frontend/
│   ├── backend/
│   └── data/
├── report/
└── README.md
```

## Quick Start

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## Task 1: Rating Prediction via Prompting

Jupyter notebook that classifies Yelp reviews into 1-5 stars using three different LLM prompting approaches:
- Zero-Shot Classification
- Few-Shot Classification
- Chain-of-Thought (CoT) with Structured Analysis

### Quick Setup

1. Install dependencies:
```bash
pip install jupyter google-generativeai pandas numpy matplotlib seaborn scikit-learn
```

2. Download Yelp Reviews dataset from Kaggle:
   - https://www.kaggle.com/datasets/omkarsabnis/yelp-reviews-dataset
   - Place the dataset file in the `task1/` directory

3. Set up API key:
   - Create a `.env` file or set environment variable:
   ```bash
   export GEMINI_API_KEY=your_api_key_here
   ```

4. Run the notebook:
```bash
jupyter notebook task1/rating_prediction.ipynb
```

## Task 2: Two-Dashboard Web Application

### Backend Setup

1. Navigate to backend directory:
```bash
cd task2/backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
export GEMINI_API_KEY=your_api_key_here
```

4. Run the server:
```bash
uvicorn main:app --reload
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd task2/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

### Access Dashboards

- **User Dashboard**: http://localhost:5173/ (or your frontend port)
- **Admin Dashboard**: http://localhost:5173/admin

## Environment Variables

Create a `.env` file in the root directory or set:

```env
GEMINI_API_KEY=your_api_key_here
```

## Deployment

### Backend (FastAPI)
- Deploy to Render, Railway, or similar service
- Set environment variables in deployment platform

### Frontend (React + Vite)
- Deploy to Vercel, Netlify, or similar service
- Update API endpoint URLs in frontend config

## Features

### Task 1
- Kaggle Yelp Reviews dataset via kagglehub
- Three prompting approaches for rating prediction (Zero-Shot, Few-Shot, CoT)
- Latest metrics (sampled ~200 reviews, 1s throttle): Few-Shot 57% exact / 94% within ±1 / JSON 100% (~6.16s avg); Zero-Shot 51% exact / 93.5% within ±1 / JSON 100% (~5.19s avg, fastest); CoT 51.5% exact / 93% within ±1 / JSON 100% (~7.99s avg). Metrics indicative due to sample size/quota.
- Comparison analysis and visualizations

### Task 2
- **User Dashboard**: Submit reviews and receive AI-generated responses
- **Admin Dashboard**: View submissions, analytics, and AI-generated summaries/actions
- Real-time data persistence
- LLM-powered insights

## Tech Stack

- **Task 1**: Python, Jupyter, Google Gemini API
- **Task 2**: 
  - Frontend: React, Vite, Tailwind CSS
  - Backend: FastAPI, Python
  - LLM: Google Gemini API
  - Storage: JSON file (can be upgraded to database)

## License

MIT

