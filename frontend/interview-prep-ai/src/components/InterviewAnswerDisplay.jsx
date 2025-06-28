import React from 'react';
import { LuMic, LuUser, LuLightbulb } from 'react-icons/lu';

const InterviewAnswerDisplay = ({ answer, question }) => {
  if (!answer) return null;

  // Helper function to format text with code blocks (reuse from VoiceRecorder)
  const formatTextWithCode = (text) => {
    if (!text) return text;
    
    // Split text by code blocks (```code```)
    const parts = text.split(/(```[\s\S]*?```)/);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // Extract language and code
        const codeContent = part.slice(3, -3);
        const lines = codeContent.split('\n');
        const language = lines[0].trim() || 'javascript';
        const code = lines.slice(1).join('\n');
        
        return (
          <div key={index} className="my-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                {language}
              </span>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-gray-100 text-sm leading-relaxed font-mono">
                <code>{code}</code>
              </pre>
            </div>
          </div>
        );
      }
      
      // Regular text
      return (
        <p key={index} className="text-gray-800 leading-relaxed mb-3">
          {part}
        </p>
      );
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Interview Context Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <LuMic className="text-white text-sm" />
          </div>
          <div>
            <h4 className="text-white font-medium text-sm">Interview Question</h4>
            <p className="text-white/90 text-xs">Sample response format</p>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">Q</span>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">{question}</p>
        </div>
      </div>

      {/* Answer */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <LuUser className="text-white text-xs" />
          </div>
          <div className="flex-1">
            <div className="mb-2">
              <span className="text-green-600 text-xs font-medium uppercase tracking-wide">Your Answer</span>
            </div>
            <div className="prose prose-sm max-w-none">
              {formatTextWithCode(answer)}
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-200">
        <div className="flex items-center gap-2 text-blue-600 text-xs">
          <LuLightbulb className="text-blue-500" />
          <span className="font-medium">Interview Tips:</span>
        </div>
        <div className="mt-1 text-xs text-gray-600 space-y-1">
          <div>• Practice this answer out loud to improve delivery</div>
          <div>• Use the STAR method for behavioral questions</div>
          <div>• Keep it conversational and confident</div>
        </div>
      </div>
    </div>
  );
};

export default InterviewAnswerDisplay; 