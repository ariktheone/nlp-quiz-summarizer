import React from 'react';

const InputTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'text', label: 'Text Input', icon: '✏️' },
    { id: 'file', label: 'File Upload', icon: '📄' },
    { id: 'url', label: 'Web URL', icon: '🔗' },
  ];

  return (
    <div className="flex border-b border-gray-200 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`py-3 px-4 font-medium text-sm flex items-center focus:outline-none ${
            activeTab === tab.id
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="mr-2 text-lg">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default InputTabs;