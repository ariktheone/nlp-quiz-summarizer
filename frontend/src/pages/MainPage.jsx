import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  summarizeText,
  generateMCQs,
  processFile,
  processURL,
  saveHistory,
} from '../services/api';
import InputTabs from '../components/InputTabs';
import FileUpload from '../components/FileUpload';
import ProgressBar from '../components/ProgressBar';
import ResultCard from '../components/ResultCard';
import MCQItem from '../components/MCQItem';

const MainPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('text');
  const [textInput, setTextInput] = useState('');
  const [fileInput, setFileInput] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const textInputRef = useRef(null);

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 300);
    return interval;
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    setError('');
    setIsLoading(true);
    setShowResult(false);
    setUserAnswers([]);
    const progressInterval = simulateProgress();

    try {
      let processedText = '';

      if (activeTab === 'text') {
        if (!textInput.trim()) throw new Error('Please enter some text');
        processedText = textInput;
      } else if (activeTab === 'file') {
        if (!fileInput) throw new Error('Please select a file');
        const fileResult = await processFile(fileInput);
        processedText = fileResult.text || textInput;
      } else if (activeTab === 'url') {
        if (!urlInput.trim()) throw new Error('Please enter a URL');
        const urlResult = await processURL(urlInput);
        processedText = urlResult.text || textInput;
      }

      const [summaryResult, mcqsResult] = await Promise.all([
        summarizeText(processedText),
        generateMCQs(processedText),
      ]);

      const generatedResults = {
        summary: summaryResult.summary,
        mcqs: mcqsResult.mcqs,
      };

      setResults(generatedResults);

      // Save to history
      await saveHistory({
        summary: generatedResults.summary,
        mcqs: generatedResults.mcqs,
        createdAt: new Date().toISOString(),
        type: activeTab, // 'text', 'file', or 'url'
        input:
          activeTab === 'text'
            ? textInput
            : activeTab === 'file'
            ? fileInput?.name
            : urlInput,
        timestamp: new Date().toISOString(),
      });

      setUserAnswers(Array(mcqsResult.mcqs.length).fill(null));
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error(err);
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 500);
    }
  };

  const handleReset = () => {
    setTextInput('');
    setFileInput(null);
    setUrlInput('');
    setResults(null);
    setError('');
    if (textInputRef.current) textInputRef.current.focus();
  };

  const handleViewHistory = () => {
    navigate('/history');
  };

  const handleSelectAnswer = (mcqIdx, option) => {
    setUserAnswers((prev) => {
      const updated = [...prev];
      updated[mcqIdx] = option;
      return updated;
    });
  };

  const handleQuizSubmit = () => {
    setShowResult(true);
  };

  const correctCount =
    showResult && results?.mcqs
      ? results.mcqs.filter((mcq, idx) => userAnswers[idx] === mcq.answer)
          .length
      : 0;

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      {/* ✨ Animated Blob Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="w-full h-full relative">
          <div className="absolute top-[-10%] left-[10%] w-[300px] h-[300px] bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
          <div className="absolute top-[30%] left-[60%] w-[400px] h-[400px] bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" />
          <div className="absolute top-[60%] left-[20%] w-[300px] h-[300px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
        </div>
      </div>

      {/* ✏️ Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <div className="text-center mb-10 pt-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Smart Summary & Quiz
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Transform any text, document, or article into concise summaries and
            quizzes
          </p>
        </div>

        {/* 🔄 Loading */}
        {isLoading && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E6F4FB] rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#209CEE] animate-pulse"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Processing your content
              </h3>
              <p className="text-gray-600 mb-4">
                Generating summary and quiz questions...
              </p>
              <ProgressBar progress={progress} />
            </div>
          </div>
        )}

        {/* 📝 Input Form */}
        {!isLoading && !results && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <InputTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="mb-6">
              {activeTab === 'text' && (
                <div>
                  <textarea
                    ref={textInputRef}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Paste your text here..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#209CEE] focus:border-transparent outline-none transition-all"
                    rows={8}
                  />
                  <div className="text-sm text-gray-500 mt-2">
                    {textInput.length > 0
                      ? `${textInput.split(/\s+/).length} words`
                      : 'Enter text to summarize'}
                  </div>
                </div>
              )}
              {activeTab === 'file' && (
                <FileUpload
                  onFileSelect={setFileInput}
                  file={fileInput}
                  isLoading={isLoading}
                />
              )}
              {activeTab === 'url' && (
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/article"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#209CEE] focus:border-transparent outline-none transition-all"
                />
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
              <button
                onClick={handleSubmit}
                className="bg-[#209CEE] hover:bg-[#176bb3] text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 flex-1 flex items-center justify-center"
                disabled={isLoading}
              >
                Generate Summary & Quiz
              </button>

              <button
                onClick={handleViewHistory}
                className="border border-[#209CEE] text-[#209CEE] hover:bg-[#E6F4FB] font-medium py-2.5 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                View History
              </button>
            </div>
          </div>
        )}

        {/* ✅ Result Section */}
        {!isLoading && results && (
          <div className="mt-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Your Results</h2>
              <button
                onClick={handleReset}
                className="border border-[#209CEE] text-[#209CEE] hover:bg-[#E6F4FB] font-medium py-2.5 px-6 rounded-lg transition-all duration-200 flex items-center"
              >
                Process New Content
              </button>
            </div>

            <ResultCard title="Summary" content={results.summary} />

            <ResultCard title="Generated Quiz Questions">
              <div className="mt-4">
                {results.mcqs.length > 0 ? (
                  <>
                    {showResult && (
                      <div className="mb-4 text-green-700 font-semibold">
                        You got {correctCount} out of {results.mcqs.length}{' '}
                        correct.
                      </div>
                    )}
                    {results.mcqs.map((mcq, index) => (
                      <MCQItem
                        key={index}
                        mcq={mcq}
                        index={index}
                        userAnswer={userAnswers[index]}
                        showResult={showResult}
                        onSelectAnswer={(option) =>
                          handleSelectAnswer(index, option)
                        }
                      />
                    ))}
                    {!showResult && (
                      <div className="flex justify-end mt-6">
                        <button
                          onClick={handleQuizSubmit}
                          className="bg-[#209CEE] hover:bg-[#176bb3] text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200"
                          disabled={userAnswers.some((a) => a === null)}
                        >
                          Submit Quiz
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No questions generated. The content might be too short or
                    complex.
                  </div>
                )}
              </div>
            </ResultCard>
          </div>
        )}

        <div className="mt-10 text-center text-gray-500 text-sm pb-10">
          <p>Powered by HuggingFace Transformers and Google Search API</p>
          <p className="mt-1">100% free and open-source AI technology</p>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
