import { useState } from 'react'
import axios from 'axios'
import StarRating from './StarRating'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function UserDashboard() {
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (rating === 0) {
      setError('Please select a rating')
      return
    }
    
    if (!review.trim()) {
      setError('Please write a review')
      return
    }

    setLoading(true)
    setError('')
    setAiResponse('')

    try {
      const response = await axios.post(`${API_BASE_URL}/api/submit-review`, {
        rating,
        review: review.trim()
      })

      if (response.data.success) {
        setAiResponse(response.data.ai_response)
        setSubmitted(true)
        // Reset form after a delay
        setTimeout(() => {
          setRating(0)
          setReview('')
          setSubmitted(false)
        }, 5000)
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit review. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Share Your Feedback</h1>
        <p className="text-gray-600 mb-8">
          We'd love to hear about your experience. Your feedback helps us improve!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              interactive={true}
            />
          </div>

          <div>
            <label
              htmlFor="review"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Review
            </label>
            <textarea
              id="review"
              rows={6}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us about your experience..."
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>

        {submitted && aiResponse && (
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Response from Our Team
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {aiResponse}
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Thank you for your feedback! Your review has been submitted.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

