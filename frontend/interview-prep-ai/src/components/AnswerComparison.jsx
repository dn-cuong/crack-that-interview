import React from 'react';
import { LuCheckCircle, LuXCircle, LuStar, LuLightbulb, LuAlertTriangle } from 'react-icons/lu';

const AnswerComparison = ({ comparisonResult, onClose }) => {
  if (!comparisonResult) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200 max-w-2xl mx-auto">
        <div className="text-center">
          <LuAlertTriangle className="text-red-500 text-4xl mx-auto mb-4" />
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

  // Safely extract data with fallbacks
  const score = comparisonResult.score || 0;
  const feedback = comparisonResult.feedback || "No feedback available";
  const strengths = Array.isArray(comparisonResult.strengths) ? comparisonResult.strengths : [];
  const weaknesses = Array.isArray(comparisonResult.weaknesses) ? comparisonResult.weaknesses : [];
  const suggestions = Array.isArray(comparisonResult.suggestions) ? comparisonResult.suggestions : [];
  const sampleAnswer = comparisonResult.sampleAnswer || "No sample answer available";

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreText = (score) => {
    if (score >= 80) return 'Excellent!';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Answer Analysis</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Score Section */}
      <div className="mb-6">
        <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-lg ${getScoreBg(score)}`}>
          <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score}/100
          </div>
          <div className="text-sm text-gray-600">
            {getScoreText(score)}
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <LuLightbulb className="text-yellow-500" />
          Overall Feedback
        </h3>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700 leading-relaxed">{feedback}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <LuCheckCircle className="text-green-500" />
            Strengths
          </h3>
          <div className="space-y-2">
            {strengths.length > 0 ? (
              strengths.map((strength, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                  <LuCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{strength}</span>
                </div>
              ))
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-500 text-sm">No specific strengths identified</span>
              </div>
            )}
          </div>
        </div>

        {/* Weaknesses Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <LuXCircle className="text-red-500" />
            Areas for Improvement
          </h3>
          <div className="space-y-2">
            {weaknesses.length > 0 ? (
              weaknesses.map((weakness, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                  <LuXCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{weakness}</span>
                </div>
              ))
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-500 text-sm">No specific areas for improvement identified</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Suggestions Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <LuStar className="text-blue-500" />
          Suggestions for Better Answers
        </h3>
        <div className="space-y-2">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <LuStar className="text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">{suggestion}</span>
              </div>
            ))
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-500 text-sm">No specific suggestions available</span>
            </div>
          )}
        </div>
      </div>

      {/* Sample Answer Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <LuLightbulb className="text-purple-500" />
          Sample Answer
        </h3>
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-gray-700 leading-relaxed">{sampleAnswer}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
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

export default AnswerComparison; 