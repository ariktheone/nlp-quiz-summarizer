import React from 'react';

const MCQItem = ({ mcq, index }) => {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-start">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
          <span className="text-blue-700 font-medium">{index + 1}</span>
        </div>
        <h3 className="font-medium text-gray-900">{mcq.question}</h3>
      </div>
      
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 ml-11">
        {mcq.options.map((option, optIndex) => (
          <div 
            key={optIndex}
            className={`p-3 rounded-lg border ${
              option === mcq.answer
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 flex-shrink-0 ${
                option === mcq.answer
                  ? 'border-green-500 bg-green-500 text-white'
                  : 'border-gray-400'
              }`}>
                {option === mcq.answer && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span>{option}</span>
            </div>
          </div>
        ))}
      </div>
      
      {mcq.source_verified && (
        <div className="mt-2 flex items-center text-xs text-green-600 ml-11">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Verified with Google Search
        </div>
      )}
    </div>
  );
};

export default MCQItem;