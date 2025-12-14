# Setup Instructions

## Prerequisites

- Python 3.8+
- Node.js 16+ and npm
- Gemini API key (get from https://makersuite.google.com/app/apikey)

## Task 1: Rating Prediction Notebook

### Setup

1. Install Python dependencies:
```bash
pip install jupyter google-generativeai pandas numpy matplotlib seaborn scikit-learn
```

2. Set up API key:
```bash
export GEMINI_API_KEY=your_api_key_here
```

3. Download Yelp Reviews dataset:
   - Visit: https://www.kaggle.com/datasets/omkarsabnis/yelp-reviews-dataset
   - Download the dataset
   - Place the CSV file in `task1/` directory as `yelp_reviews.csv`
   - Note: If the file is not found, the notebook will create a sample dataset

4. Run Jupyter:
```bash
jupyter notebook task1/rating_prediction.ipynb
```

## Task 2: Web Application

### Backend Setup

1. Navigate to backend directory:
```bash
cd task2/backend
```

2. Create virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
   - Create a `.env` file in the project root or backend directory:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```

5. Run the server:
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd task2/frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create `.env` file for API URL:
```bash
VITE_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Access Dashboards

- **User Dashboard**: http://localhost:5173/
- **Admin Dashboard**: http://localhost:5173/admin

## Testing the Application

1. Start the backend server (port 8000)
2. Start the frontend server (port 5173)
3. Open the User Dashboard and submit a review
4. Check the Admin Dashboard to see the review and analytics

## Troubleshooting

### Backend Issues

- **API Key Error**: Make sure `GEMINI_API_KEY` is set in environment variables
- **Port Already in Use**: Change the port in the uvicorn command: `--port 8001`
- **Import Errors**: Make sure all dependencies are installed: `pip install -r requirements.txt`

### Frontend Issues

- **API Connection Error**: Check that backend is running on port 8000, or update `VITE_API_URL` in `.env`
- **Build Errors**: Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- **CORS Errors**: Backend CORS is configured to allow all origins in development

### Notebook Issues

- **Dataset Not Found**: The notebook will create a sample dataset if the CSV file is not found
- **API Rate Limits**: If you hit rate limits, add delays between API calls in the notebook
- **JSON Parsing Errors**: The notebook includes robust JSON parsing that handles various response formats

## Deployment

### Backend Deployment (Render/Railway)

1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variable: `GEMINI_API_KEY`
4. Deploy

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Set environment variable: `VITE_API_URL` to your backend URL
4. Deploy

## Notes

- The data is stored in `task2/data/reviews.json` (JSON file for simplicity)
- For production, consider upgrading to a proper database (PostgreSQL, MongoDB, etc.)
- API rate limits may apply depending on your Gemini API tier
- The application auto-refreshes data every 30 seconds in the Admin Dashboard

