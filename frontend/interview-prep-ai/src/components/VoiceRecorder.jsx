import React, { useState, useRef, useEffect } from 'react';
import { LuMic, LuMicOff, LuPlay, LuPause, LuX, LuCode } from 'react-icons/lu';
import SpinnerLoader from './Loader/SpinnerLoader';
import InterviewAnswerDisplay from './InterviewAnswerDisplay';

// Helper function to format text with code blocks
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
            <LuCode className="text-blue-500" />
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

const VoiceRecorder = ({ onRecordingComplete, isProcessing = false, question, comparisonResult, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopRecording();
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setTranscript('');
      
      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      // Stop speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  };

  const playRecording = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSubmit = () => {
    if (transcript.trim()) {
      onRecordingComplete(transcript, audioBlob);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const resetRecording = () => {
    setTranscript('');
    setAudioBlob(null);
    setAudioUrl(null);
  };

  // Show comparison result if available
  if (comparisonResult) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-4xl mx-auto overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Answer Analysis</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors cursor-pointer p-2 rounded-lg hover:bg-white/10"
            >
              <LuX className="text-2xl" />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Score */}
          <div className="mb-8 text-center">
            <div className={`inline-flex items-center gap-4 px-6 py-3 rounded-full shadow-lg ${
              comparisonResult.score >= 80 ? 'bg-green-100 border-2 border-green-200' : 
              comparisonResult.score >= 60 ? 'bg-yellow-100 border-2 border-yellow-200' : 'bg-red-100 border-2 border-red-200'
            }`}>
              <div className={`text-3xl font-bold ${
                comparisonResult.score >= 80 ? 'text-green-600' : 
                comparisonResult.score >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {comparisonResult.score || 0}
              </div>
              <div className="text-sm text-gray-600">
                <div className="font-semibold">Score</div>
                <div>{comparisonResult.score >= 80 ? 'Excellent!' : 
                     comparisonResult.score >= 60 ? 'Good' : 'Needs Improvement'}</div>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Overall Feedback
            </h3>
            <div className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 rounded-xl border border-purple-200 shadow-sm">
              <div className="prose prose-sm max-w-none">
                <div className="text-gray-800 leading-relaxed">
                  {formatTextWithCode(comparisonResult.feedback || "No feedback available")}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-purple-200">
                <div className="flex items-center gap-2 text-purple-600 text-sm">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span className="font-medium">AI's detailed analysis of your response</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sample Answer */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Sample Interview Answer
            </h3>
            <InterviewAnswerDisplay 
              answer={comparisonResult.sampleAnswer} 
              question={question}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              onClick={resetRecording}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer transform hover:scale-105 active:scale-95"
            >
              Try Again
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isProcessing) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-2xl mx-auto overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
          <h3 className="text-xl font-bold text-white">Analyzing Your Answer</h3>
        </div>
        <div className="p-8 text-center">
          <div className="mb-6">
            <SpinnerLoader />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Processing...</h3>
          <p className="text-gray-600">Please wait while AI evaluates your response.</p>
        </div>
      </div>
    );
  }

  // Show recording interface
  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-2xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Voice Your Answer</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors cursor-pointer p-2 rounded-lg hover:bg-white/10"
          >
            <LuX className="text-2xl" />
          </button>
        </div>
      </div>

      <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
        {/* Question */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Question</h4>
          <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
            <p className="text-gray-800 leading-relaxed">{question}</p>
          </div>
        </div>

        {/* Recording Controls */}
        <div className="mb-6">
          <div className="flex items-center justify-center">
            {!isRecording ? (
              <button
                onClick={startRecording}
                disabled={isProcessing}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer transform hover:scale-105 active:scale-95"
              >
                <LuMic className="text-2xl" />
                <span className="font-semibold">Start Recording</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer transform hover:scale-105 active:scale-95"
              >
                <LuMicOff className="text-2xl" />
                <span className="font-semibold">Stop Recording</span>
              </button>
            )}
          </div>
        </div>

        {/* Recording Status */}
        {isRecording && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Recording... Speak now</span>
            </div>
          </div>
        )}

        {/* Transcript */}
        {transcript && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Transcript</h4>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <p className="text-gray-800 leading-relaxed">{transcript}</p>
            </div>
          </div>
        )}

        {/* Audio Player */}
        {audioUrl && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Audio Recording</h4>
            <div className="flex items-center gap-3">
              <button
                onClick={isPlaying ? pauseRecording : playRecording}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer transform hover:scale-105 active:scale-95"
              >
                {isPlaying ? <LuPause className="text-lg" /> : <LuPlay className="text-lg" />}
                <span className="font-medium">{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={handleAudioEnded}
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {transcript && !isRecording && (
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              onClick={resetRecording}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95"
            >
              Clear
            </button>
            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer transform hover:scale-105 active:scale-95"
            >
              Submit Answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder; 