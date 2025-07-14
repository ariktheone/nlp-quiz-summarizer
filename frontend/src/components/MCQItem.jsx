import React from 'react';

const MCQItem = ({ mcq, index, userAnswer, showResult, onSelectAnswer }) => {
  const isCorrect = showResult && userAnswer === mcq.answer;
  const isWrong = showResult && userAnswer && userAnswer !== mcq.answer;

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-start">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
          <span className="text-blue-700 font-medium">{index + 1}</span>
        </div>
        <h3 className="font-medium text-gray-900">{mcq.question}</h3>
      </div>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 ml-11">
        {mcq.options.map((option, optIndex) => {
          let optionStyle = 'border-gray-200 bg-gray-50 hover:bg-gray-100';
          if (showResult) {
            if (option === mcq.answer) optionStyle = 'border-green-500 bg-green-50';
            else if (userAnswer === option && userAnswer !== mcq.answer) optionStyle = 'border-red-500 bg-red-50';
          } else if (userAnswer === option) {
            optionStyle = 'border-blue-500 bg-blue-50';
          }
          return (
            <label
              key={optIndex}
              className={`p-3 rounded-lg border flex items-center cursor-pointer transition-all duration-150 ${optionStyle}`}
            >
              <input
                type="radio"
                name={`mcq-${index}`}
                value={option}
                checked={userAnswer === option}
                disabled={showResult}
                onChange={() => onSelectAnswer(option)}
                className="mr-3 accent-blue-600"
              />
              <span>{option}</span>
              {showResult && option === mcq.answer && (
                <span className="ml-2 text-green-600 font-semibold">(Correct)</span>
              )}
              {showResult && userAnswer === option && userAnswer !== mcq.answer && (
                <span className="ml-2 text-red-600 font-semibold">(Your answer)</span>
              )}
            </label>
          );
        })}
      </div>
      {showResult && (
        <div className="ml-11 mt-2 text-sm">
          {isCorrect && <span className="text-green-600 font-medium">Correct!</span>}
          {isWrong && <span className="text-red-600 font-medium">Incorrect. Correct answer: <span className="underline">{mcq.answer}</span></span>}
        </div>
      )}
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