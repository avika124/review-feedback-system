"""Simple JSON-based database for storing reviews"""
import json
import os
from typing import List, Dict, Optional
from datetime import datetime
import uuid

DATA_FILE = os.path.join(os.path.dirname(__file__), '..', 'data', 'reviews.json')


def ensure_data_file():
    """Ensure the data file and directory exist"""
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w') as f:
            json.dump([], f)


def load_reviews() -> List[Dict]:
    """Load all reviews from JSON file"""
    ensure_data_file()
    try:
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []


def save_reviews(reviews: List[Dict]):
    """Save reviews to JSON file"""
    ensure_data_file()
    with open(DATA_FILE, 'w') as f:
        json.dump(reviews, f, indent=2)


def create_review(rating: int, review: str, ai_response: str, 
                  ai_summary: str, recommended_actions: List[str]) -> Dict:
    """Create a new review entry"""
    review_data = {
        "id": str(uuid.uuid4()),
        "timestamp": datetime.utcnow().isoformat(),
        "rating": rating,
        "review": review,
        "ai_response": ai_response,
        "ai_summary": ai_summary,
        "recommended_actions": recommended_actions
    }
    
    reviews = load_reviews()
    reviews.append(review_data)
    save_reviews(reviews)
    
    return review_data


def get_reviews(limit: Optional[int] = None, offset: int = 0, 
                rating: Optional[int] = None, search: Optional[str] = None) -> Dict:
    """Get reviews with optional filtering"""
    reviews = load_reviews()
    
    # Filter by rating if provided
    if rating is not None:
        reviews = [r for r in reviews if r['rating'] == rating]
    
    # Filter by search term if provided
    if search:
        search_lower = search.lower()
        reviews = [r for r in reviews if search_lower in r['review'].lower()]
    
    # Sort by timestamp (newest first)
    reviews.sort(key=lambda x: x['timestamp'], reverse=True)
    
    total = len(reviews)
    
    # Apply pagination
    if offset > 0:
        reviews = reviews[offset:]
    if limit:
        reviews = reviews[:limit]
    
    return {
        "reviews": reviews,
        "total": total
    }


def get_analytics() -> Dict:
    """Calculate analytics from reviews"""
    reviews = load_reviews()
    
    if not reviews:
        return {
            "avg_rating": 0,
            "total": 0,
            "distribution": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
            "recent_trends": {
                "last_7_days": {"count": 0, "avg_rating": 0},
                "previous_7_days": {"count": 0, "avg_rating": 0}
            }
        }
    
    # Calculate average rating
    ratings = [r['rating'] for r in reviews]
    avg_rating = sum(ratings) / len(ratings) if ratings else 0
    
    # Calculate distribution
    distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    for rating in ratings:
        distribution[rating] = distribution.get(rating, 0) + 1
    
    # Calculate recent trends (last 7 days vs previous 7 days)
    from datetime import datetime, timedelta
    now = datetime.utcnow()
    last_7_days = now - timedelta(days=7)
    previous_7_days_start = last_7_days - timedelta(days=7)
    
    def parse_timestamp(ts_str):
        """Parse ISO timestamp string to datetime"""
        try:
            # Handle various ISO formats
            ts_str = ts_str.replace('Z', '+00:00')
            if '+' not in ts_str and ts_str.count(':') == 2:
                # No timezone info, assume UTC
                ts_str += '+00:00'
            return datetime.fromisoformat(ts_str)
        except (ValueError, AttributeError):
            # Fallback: try parsing without timezone
            try:
                return datetime.fromisoformat(ts_str.split('+')[0].split('Z')[0])
            except:
                return datetime.min
    
    last_7_reviews = [
        r for r in reviews 
        if parse_timestamp(r['timestamp']) >= last_7_days
    ]
    
    previous_7_reviews = [
        r for r in reviews 
        if previous_7_days_start <= parse_timestamp(r['timestamp']) < last_7_days
    ]
    
    last_7_avg = sum(r['rating'] for r in last_7_reviews) / len(last_7_reviews) if last_7_reviews else 0
    previous_7_avg = sum(r['rating'] for r in previous_7_reviews) / len(previous_7_reviews) if previous_7_reviews else 0
    
    return {
        "avg_rating": round(avg_rating, 2),
        "total": len(reviews),
        "distribution": distribution,
        "recent_trends": {
            "last_7_days": {
                "count": len(last_7_reviews),
                "avg_rating": round(last_7_avg, 2)
            },
            "previous_7_days": {
                "count": len(previous_7_reviews),
                "avg_rating": round(previous_7_avg, 2)
            }
        }
    }

