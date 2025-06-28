import React from 'react';

const SimpleAnswerComparison = ({ comparisonResult, onClose }) => {
  if (!comparisonResult) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200 max-w-2xl mx-auto">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Analysis Data</h2>
          <p className="text-gray-600 mb-4">Unable to load analysis results.</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Answer Analysis</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Debug Info */}
      <div className="mb-4 p-3 bg-gray-100 rounded text-xs">
        <strong>Debug Info:</strong>
        <pre>{JSON.stringify(comparisonResult, null, 2)}</pre>
      </div>

      {/* Score */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Score</h3>
        <div className="text-2xl font-bold text-blue-600">
          {comparisonResult.score || 0}/100
        </div>
      </div>

      {/* Feedback */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Feedback</h3>
        <div className="p-3 bg-gray-50 rounded">
          {comparisonResult.feedback || "No feedback available"}
        </div>
      </div>

      {/* Sample Answer */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Sample Answer</h3>
        <div className="p-3 bg-blue-50 rounded">
          {comparisonResult.sampleAnswer || "No sample answer available"}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SimpleAnswerComparison; 