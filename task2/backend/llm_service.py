"""LLM service for generating AI responses, summaries, and recommendations"""
import os
from dotenv import load_dotenv
load_dotenv()
import google.generativeai as genai
from typing import Dict, List

# Configure Gemini API
api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    raise ValueError("GEMINI_API_KEY environment variable not set")

genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-pro')


def generate_user_response(rating: int, review_text: str) -> str:
    """Generate a personalized response to a user review"""
    prompt = f"""Given this customer review with {rating} stars:
"{review_text}"

Generate a warm, professional response that:
1. Thanks them for their feedback
2. Acknowledges their specific points
3. If rating < 4, apologize and mention commitment to improvement
4. If rating >= 4, express gratitude for positive experience

Keep response under 100 words. Be genuine and empathetic."""
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error generating user response: {e}")
        return "Thank you for your feedback. We appreciate you taking the time to share your experience with us."


def generate_summary(rating: int, review_text: str) -> str:
    """Generate a concise summary for admin dashboard"""
    prompt = f"""Summarize this customer review in 1-2 sentences, capturing the key sentiment and main points:
Rating: {rating} stars
Review: "{review_text}"

Be concise and focus on the most important aspects."""
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error generating summary: {e}")
        return f"Customer rated {rating} stars. Review: {review_text[:100]}..."


def generate_recommended_actions(rating: int, review_text: str) -> List[str]:
    """Generate actionable recommendations based on review"""
    prompt = f"""Based on this customer feedback, suggest 2-3 specific actionable recommendations for the business:
Rating: {rating} stars
Review: "{review_text}"

Format as bullet points. Be specific and actionable. Return only the recommendations, one per line, without numbering or bullet symbols."""
    
    try:
        response = model.generate_content(prompt)
        # Parse response into list of actions
        actions = [line.strip() for line in response.text.strip().split('\n') if line.strip()]
        # Remove common prefixes like "-", "•", numbers, etc.
        cleaned_actions = []
        for action in actions:
            # Remove leading dashes, bullets, numbers
            action = action.lstrip('-•*0123456789. ').strip()
            if action:
                cleaned_actions.append(action)
        return cleaned_actions[:3]  # Return max 3 actions
    except Exception as e:
        print(f"Error generating recommendations: {e}")
        return [
            "Review customer feedback patterns",
            "Consider follow-up with customer if rating < 4"
        ]

