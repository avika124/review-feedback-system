"""FastAPI backend for review feedback system"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import os
from dotenv import load_dotenv

from llm_service import generate_user_response, generate_summary, generate_recommended_actions
from database import create_review, get_reviews, get_analytics

# Load environment variables
load_dotenv()

app = FastAPI(title="Review Feedback System API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response models
class ReviewSubmission(BaseModel):
    rating: int = Field(..., ge=1, le=5, description="Star rating from 1 to 5")
    review: str = Field(..., min_length=1, description="Review text")


class ReviewResponse(BaseModel):
    success: bool
    ai_response: str
    id: str


class Review(BaseModel):
    id: str
    timestamp: str
    rating: int
    review: str
    ai_response: str
    ai_summary: str
    recommended_actions: List[str]


class ReviewsListResponse(BaseModel):
    reviews: List[Review]
    total: int


class AnalyticsResponse(BaseModel):
    avg_rating: float
    total: int
    distribution: dict
    recent_trends: dict


@app.get("/")
def root():
    return {"message": "Review Feedback System API", "status": "running"}


@app.post("/api/submit-review", response_model=ReviewResponse)
async def submit_review(submission: ReviewSubmission):
    """Submit a new review and get AI-generated response"""
    try:
        # Generate AI responses
        ai_response = generate_user_response(submission.rating, submission.review)
        ai_summary = generate_summary(submission.rating, submission.review)
        recommended_actions = generate_recommended_actions(submission.rating, submission.review)
        
        # Save to database
        review_data = create_review(
            rating=submission.rating,
            review=submission.review,
            ai_response=ai_response,
            ai_summary=ai_summary,
            recommended_actions=recommended_actions
        )
        
        return ReviewResponse(
            success=True,
            ai_response=ai_response,
            id=review_data["id"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing review: {str(e)}")


@app.get("/api/reviews", response_model=ReviewsListResponse)
async def get_reviews_endpoint(
    limit: Optional[int] = 50,
    offset: int = 0,
    rating: Optional[int] = None,
    search: Optional[str] = None
):
    """Get reviews with optional filtering and pagination"""
    try:
        result = get_reviews(limit=limit, offset=offset, rating=rating, search=search)
        return ReviewsListResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching reviews: {str(e)}")


@app.get("/api/analytics", response_model=AnalyticsResponse)
async def get_analytics_endpoint():
    """Get analytics data"""
    try:
        analytics = get_analytics()
        return AnalyticsResponse(**analytics)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching analytics: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

