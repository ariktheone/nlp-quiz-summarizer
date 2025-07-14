import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory } from '../services/api';
import ResultCard from '../components/ResultCard';

const HistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory(); // Replace with real API logic
        setHistory(data);
      } catch (error) {
        console.error('Failed to fetch history', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  const handleViewItem = (item) => {
    // Optionally store item in localStorage or context
    navigate('/', { state: { summary: item.summary, mcqs: item.mcqs } });
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBack}
          className="border border-[#209CEE] text-[#209CEE] hover:bg-blue-50 font-medium py-2.5 px-6 rounded-lg transition-all duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Generator
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Your History</h1>
        <div></div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading your history...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No history yet</h3>
          <p className="text-gray-600 mb-6">
            Your processed content will appear here once generated
          </p>
          <button
            onClick={handleBack}
            className="bg-[#209CEE] hover:bg-blue-500 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200"
          >
            Generate Now
          </button>
        </div>
      ) : (
        <div>
          {history.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {item.type === 'text'
                      ? 'Text Input'
                      : item.type === 'file'
                      ? `File: ${item.input}`
                      : `URL: ${item.input.slice(0, 40)}${item.input.length > 40 ? '...' : ''}`}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
                <button
                  className="text-blue-600 hover:text-blue-800 text-sm"
                  onClick={() => handleViewItem(item)}
                >
                  View Details
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-3">
                <p className="text-gray-700 text-sm line-clamp-2">
                  {item.summary}
                </p>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.mcqs.length} questions generated
                </span>
                <span className="text-blue-600">
                  {item.mcqs.filter((q) => q.source_verified).length} verified
                </span>
              </div>
            </div>
          ))}

          <div className="mt-6 flex justify-center">
            <button
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2.5 px-6 rounded-lg transition-all duration-200"
              onClick={() => alert('Load more functionality coming soon')}
            >
              Load More
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
