import StarRating from './StarRating'
import { useState } from 'react'

export default function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false)
  const maxLength = 150
  const shouldTruncate = review.review.length > maxLength

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <StarRating rating={review.rating} interactive={false} />
            <span className="text-sm text-gray-500">
              {new Date(review.timestamp).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700">
          {expanded || !shouldTruncate
            ? review.review
            : `${review.review.substring(0, maxLength)}...`}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 hover:text-blue-800 text-sm mt-1"
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      <div className="border-t pt-4 space-y-3">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-1">AI Summary</h4>
          <p className="text-sm text-gray-600">{review.ai_summary}</p>
        </div>

        {review.recommended_actions && review.recommended_actions.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Recommended Actions</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {review.recommended_actions.map((action, idx) => (
                <li key={idx}>{action}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

