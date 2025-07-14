import React, { useEffect, useState } from 'react';
import { getHistory, saveHistoryResponse } from '../services/api';
import ResultCard from '../components/ResultCard';
import MCQItem from '../components/MCQItem';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    getHistory().then(setHistory);
  }, []);

  // When viewing a report, load stored answers and score
  const handleViewReport = (idx) => {
    setSelectedIdx(idx);
    const item = history[idx];
    setUserAnswers(item.userAnswers && item.userAnswers.length === item.mcqs.length
      ? item.userAnswers
      : Array(item.mcqs.length).fill(null));
    setScore(item.score ?? null);
    setShowResult(item.userAnswers && item.userAnswers.length === item.mcqs.length && item.userAnswers.some(a => a !== null));
  };

  const handleSelectAnswer = (mcqIdx, answer) => {
    const updated = [...userAnswers];
    updated[mcqIdx] = answer;
    setUserAnswers(updated);
  };

  const handleSubmit = async () => {
    const res = await saveHistoryResponse(selectedIdx, userAnswers);
    setShowResult(true);
    setScore(res.score);
    // Update local history state so the next time you view, it shows your answers
    setHistory(prev => {
      const updated = [...prev];
      updated[selectedIdx].userAnswers = [...userAnswers];
      updated[selectedIdx].score = res.score;
      return updated;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-[#209CEE]">History</h1>
      {selectedIdx === null ? (
        <div>
          {history.map((item, idx) => (
            <div key={idx} className="mb-4 p-4 bg-white rounded shadow flex justify-between items-center">
              <span>
                {new Date(item.createdAt).toLocaleString()} - {item.summary.slice(0, 40)}...
              </span>
              <button
                className="bg-[#209CEE] text-white px-4 py-2 rounded hover:bg-[#176bb3]"
                onClick={() => handleViewReport(idx)}
              >
                View Report
              </button>
            </div>
          ))}
        </div>
      ) : (
        <ResultCard
          title={`Summary (${new Date(history[selectedIdx].createdAt).toLocaleString()})`}
          content={history[selectedIdx].summary}
        >
          <div className="mt-4">
            <h3 className="font-semibold text-[#209CEE] mb-2">Quiz Questions</h3>
            {history[selectedIdx].mcqs.map((mcq, i) => (
              <MCQItem
                key={i}
                mcq={mcq}
                index={i}
                userAnswer={userAnswers[i]}
                showResult={showResult}
                onSelectAnswer={(answer) => handleSelectAnswer(i, answer)}
              />
            ))}
            {/* Show score after submit */}
            {showResult && (
              <div className="mt-4 text-green-700 font-semibold">
                You got {score ?? userAnswers.filter((ans, i) => ans === history[selectedIdx].mcqs[i].answer).length} out of {history[selectedIdx].mcqs.length} correct.
              </div>
            )}
            {/* Add the answer review table here */}
            {showResult && (
              <div className="mt-6">
                <h4 className="font-semibold text-[#209CEE] mb-2">Answer Review</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left">Q#</th>
                      <th className="text-left">Your Answer</th>
                      <th className="text-left">Correct Answer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history[selectedIdx].mcqs.map((mcq, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td className={userAnswers[i] === mcq.answer ? "text-green-600" : "text-red-600"}>
                          {userAnswers[i] ?? <span className="text-gray-400">No answer</span>}
                        </td>
                        <td>{mcq.answer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {!showResult && (
              <button
                className="mt-4 bg-[#209CEE] text-white px-4 py-2 rounded hover:bg-[#176bb3]"
                onClick={handleSubmit}
                disabled={userAnswers.some(a => a === null)}
              >
                Submit Answers
              </button>
            )}
            <button
              className="mt-4 ml-4 border border-[#209CEE] text-[#209CEE] px-4 py-2 rounded hover:bg-[#E6F4FB]"
              onClick={() => setSelectedIdx(null)}
            >
              Back to History List
            </button>
          </div>
        </ResultCard>
      )}
    </div>
  );
};

export default HistoryPage;
