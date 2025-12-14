import { useState, useEffect } from 'react'
import axios from 'axios'
import ReviewCard from './ReviewCard'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export default function AdminDashboard() {
  const [reviews, setReviews] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filterRating, setFilterRating] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const reviewsPerPage = 10

  const fetchReviews = async () => {
    try {
      const params = new URLSearchParams()
      if (filterRating) params.append('rating', filterRating)
      if (searchTerm) params.append('search', searchTerm)
      params.append('limit', reviewsPerPage.toString())
      params.append('offset', ((currentPage - 1) * reviewsPerPage).toString())

      const response = await axios.get(`${API_BASE_URL}/api/reviews?${params}`)
      setReviews(response.data.reviews)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/analytics`)
      setAnalytics(response.data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchReviews(), fetchAnalytics()])
      setLoading(false)
    }
    loadData()

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchReviews()
      fetchAnalytics()
    }, 30000)

    return () => clearInterval(interval)
  }, [filterRating, searchTerm, currentPage])

  const handleFilterChange = (e) => {
    setFilterRating(e.target.value)
    setCurrentPage(1)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const distributionData = analytics
    ? Object.entries(analytics.distribution).map(([rating, count]) => ({
        rating: `${rating} Star${rating !== '1' ? 's' : ''}`,
        count
      }))
    : []

  const trendData = analytics
    ? [
        {
          period: 'Previous 7 Days',
          avgRating: analytics.recent_trends.previous_7_days.avg_rating,
          count: analytics.recent_trends.previous_7_days.count
        },
        {
          period: 'Last 7 Days',
          avgRating: analytics.recent_trends.last_7_days.avg_rating,
          count: analytics.recent_trends.last_7_days.count
        }
      ]
    : []

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor and analyze customer feedback</p>
      </div>

      {loading && !analytics ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Analytics Section */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Average Rating</h3>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics.avg_rating.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-1">out of 5.0</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Reviews</h3>
                <p className="text-3xl font-bold text-gray-900">{analytics.total}</p>
                <p className="text-sm text-gray-500 mt-1">submissions</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Trend</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {analytics.recent_trends.last_7_days.avg_rating >=
                  analytics.recent_trends.previous_7_days.avg_rating
                    ? '↑ Improving'
                    : '↓ Declining'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  vs previous 7 days
                </p>
              </div>
            </div>
          )}

          {/* Charts */}
          {analytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Rating Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={distributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Trends
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="avgRating"
                      stroke="#3B82F6"
                      name="Avg Rating"
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#10B981"
                      name="Count"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Rating
                </label>
                <select
                  value={filterRating}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Reviews
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search by keyword..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg">No reviews found</p>
                <p className="text-gray-400 text-sm mt-2">
                  {filterRating || searchTerm
                    ? 'Try adjusting your filters'
                    : 'Reviews will appear here once submitted'}
                </p>
              </div>
            ) : (
              reviews.map((review) => <ReviewCard key={review.id} review={review} />)
            )}
          </div>

          {/* Pagination */}
          {reviews.length > 0 && (
            <div className="mt-6 flex justify-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">Page {currentPage}</span>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={reviews.length < reviewsPerPage}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

