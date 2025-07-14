import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { summarizeText, generateMCQs, processFile, processURL } from '../services/api';
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
  
  const textInputRef = useRef(null);
  
  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
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
    const progressInterval = simulateProgress();
    
    try {
      let processedText = '';
      
      if (activeTab === 'text') {
        if (!textInput.trim()) {
          throw new Error('Please enter some text');
        }
        processedText = textInput;
      } else if (activeTab === 'file') {
        if (!fileInput) {
          throw new Error('Please select a file');
        }
        const fileResult = await processFile(fileInput);
        processedText = fileResult.text || textInput;
      } else if (activeTab === 'url') {
        if (!urlInput.trim()) {
          throw new Error('Please enter a URL');
        }
        const urlResult = await processURL(urlInput);
        processedText = urlResult.text || textInput;
      }
      
      // Process both summary and MCQs in parallel
      const [summaryResult, mcqsResult] = await Promise.all([
        summarizeText(processedText),
        generateMCQs(processedText)
      ]);
      
      setResults({
        summary: summaryResult.summary,
        mcqs: mcqsResult.mcqs
      });
      
    } catch (err) {
      setError(err.message || 'An error occurred while processing your request');
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
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };
  
  const handleViewHistory = () => {
    navigate('/history');
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-10 pt-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Smart Summary & Quiz</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Transform any text, document, or web article into concise summaries and interactive quizzes
        </p>
      </div>
      
      {isLoading && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Processing your content</h3>
            <p className="text-gray-600 mb-4">Generating summary and quiz questions...</p>
            <ProgressBar progress={progress} />
          </div>
        </div>
      )}
      
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  rows={8}
                />
                <div className="text-sm text-gray-500 mt-2">
                  {textInput.length > 0 ? `${textInput.split(/\s+/).length} words` : 'Enter text to summarize'}
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
              <div>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/article"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
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
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 flex-1 flex items-center justify-center"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Generate Summary & Quiz
            </button>
            
            <button
              onClick={handleViewHistory}
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2.5 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View History
            </button>
          </div>
        </div>
      )}
      
      {!isLoading && results && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Results</h2>
            <button
              onClick={handleReset}
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2.5 px-6 rounded-lg transition-all duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Process New Content
            </button>
          </div>
          
          <ResultCard title="Summary" content={results.summary} />
          
          <ResultCard title="Generated Quiz Questions">
            <div className="mt-4">
              {results.mcqs.length > 0 ? (
                results.mcqs.map((mcq, index) => (
                  <MCQItem key={index} mcq={mcq} index={index} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No questions generated. The content might be too short or complex.
                </div>
              )}
            </div>
          </ResultCard>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => alert('Export functionality would go here')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Export Results
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-10 text-center text-gray-500 text-sm pb-10">
        <p>Powered by HuggingFace Transformers and Google Search API</p>
        <p className="mt-1">100% free and open-source AI technology</p>
      </div>
    </div>
  );
};

export default MainPage;