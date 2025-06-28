import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { LuCircleAlert, LuListCollapse } from "react-icons/lu";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import RoleInfoHeader from "./components/RoleInfoHeader";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import QuestionCard from "../../components/Cards/QuestionCard";
import Drawer from "../../components/Drawer";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";
import AIResponsePreview from "./components/AIResponsePreview";
import VoiceRecorder from "../../components/VoiceRecorder";
import SimpleAnswerComparison from "../../components/SimpleAnswerComparison";

const InterviewPrep = () => {
  const { sessionId } = useParams();

  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [openLeanMoreDrawer, setOpenLeanMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);

  // Voice recording states
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

  // Answer comparison states
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);

  // Fetch session data by session id
  const fetchSessionDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.SESSION.GET_ONE(sessionId)
      );

      if (response.data && response.data.session) {
        setSessionData(response.data.session);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Generate Concept Explanation
  const generateConceptExplanation = async (question) => {
    try {
      setErrorMsg("");
      setExplanation(null);

      setIsLoading(true);
      setOpenLeanMoreDrawer(true);

      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_EXPLANATION,
        {
          question,
        }
      );

      if (response.data) {
        setExplanation(response.data);
      }
    } catch (error) {
      setExplanation(null);
      setErrorMsg("Failed to generate explanation, Try again later");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Pin Question
  const toggleQuestionPinStatus = async (questionId) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.QUESTION.PIN(questionId)
      );

      console.log(response);

      if (response.data && response.data.question) {
        // toast.success('Question Pinned Successfully')
        fetchSessionDetailsById();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Add more questions to a session
  const uploadMoreQuestions = async () => {
    try {
      setIsUpdateLoader(true);

      // Call AI API to generate questions
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role: sessionData?.role,
          experience: sessionData?.experience,
          topicsToFocus: sessionData?.topicsToFocus,
          numberOfQuestions: 10,
        }
      );

      // Should be array like [{question, answer}, ...]
      const generatedQuestions = aiResponse.data;

      const response = await axiosInstance.post(
        API_PATHS.QUESTION.ADD_TO_SESSION,
        {
          sessionId,
          questions: generatedQuestions,
        }
      );

      if (response.data) {
        toast.success("Added More Q&A!!");
        fetchSessionDetailsById();
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsUpdateLoader(false);
    }
  };

  // Handle voice answer
  const handleVoiceAnswer = (question, answer) => {
    setCurrentQuestion(question);
    setCurrentAnswer(answer);
    setShowVoiceRecorder(true);
  };

  const handleVoiceRecordingComplete = async (transcript, audioBlob) => {
    try {
      setIsProcessingVoice(true);
      // Don't close modal immediately - keep it open to show loading and results

      console.log('Sending voice analysis request:', {
        question: currentQuestion,
        userAnswer: transcript,
        correctAnswer: currentAnswer
      });

      // Call API to compare answers
      const response = await axiosInstance.post(API_PATHS.AI.COMPARE_ANSWER, {
        question: currentQuestion,
        userAnswer: transcript,
        correctAnswer: currentAnswer,
      });

      console.log('API Response:', response.data);

      if (response.data) {
        setComparisonResult(response.data);
        toast.success("Answer analyzed successfully!");
      } else {
        throw new Error('No data received from API');
      }
      
    } catch (error) {
      console.error("Error processing voice recording:", error);
      
      // Show more detailed error message
      let errorMessage = "Failed to analyze answer. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      
      // Show fallback modal with basic info
      setComparisonResult({
        score: 0,
        feedback: "Unable to analyze your answer due to a technical error. Please try again.",
        strengths: [],
        weaknesses: [],
        suggestions: [],
        sampleAnswer: "Please try recording your answer again."
      });
    } finally {
      setIsProcessingVoice(false);
    }
  };

  const closeVoiceRecorder = () => {
    setShowVoiceRecorder(false);
    setCurrentQuestion(null);
    setCurrentAnswer(null);
    setComparisonResult(null); // Reset comparison result when closing
  };

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailsById();
    }

    return () => {};
  }, []);
  return (
    <DashboardLayout>
      <RoleInfoHeader
        role={sessionData?.role || ""}
        topicsToFocus={sessionData?.topicsToFocus || ""}
        experience={sessionData?.experience || "-"}
        questions={sessionData?.questions?.length || "-"}
        description={sessionData?.description || ""}
        lastUpdated={
          sessionData?.updatedAt
            ? moment(sessionData.updatedAt).format("Do MMM YYYY")
            : ""
        }
      />

      <div className="container mx-auto pt-4 pb-4 px-4 md:px-0">
        <h2 className="text-lg font-semibold color-black">Interview Q & A</h2>

        <div className="grid grid-cols-12 gap-4 mt-5 mb-10">
          <div
            className={`col-span-12 ${
              openLeanMoreDrawer ? "md:col-span-7" : "md:col-span-8"
            } `}
          >
            <AnimatePresence>
              {sessionData?.questions?.map((data, index) => {
                return (
                  <motion.div
                    key={data._id || index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.4,
                      type: "spring",
                      stiffness: 100,
                      delay: index * 0.1,
                      damping: 15,
                    }}
                    layout // This is the key prop that animates position changes
                    layoutId={`question-${data._id || index}`} // Helps framer track specific items
                  >
                    <>
                      <QuestionCard
                        question={data?.question}
                        answer={data?.answer}
                        onLearnMore={() =>
                          generateConceptExplanation(data.question)
                        }
                        isPinned={data?.isPinned}
                        onTogglePin={() => toggleQuestionPinStatus(data._id)}
                        onVoiceAnswer={handleVoiceAnswer}
                      />

                      {!isLoading &&
                        sessionData?.questions?.length == index + 1 && (
                          <div className="flex items-center justify-center mt-5">
                            <button
                              className="flex items-center gap-3 text-sm text-white font-medium bg-black px-5 py-2 mr-2 rounded text-nowrap cursor-pointer"
                              disabled={isLoading || isUpdateLoader}
                              onClick={uploadMoreQuestions}
                            >
                              {isUpdateLoader ? (
                                <SpinnerLoader />
                              ) : (
                                <LuListCollapse className="text-lg" />
                              )}{" "}
                              Load More
                            </button>
                          </div>
                        )}
                    </>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <Drawer
            isOpen={openLeanMoreDrawer}
            onClose={() => setOpenLeanMoreDrawer(false)}
            title={!isLoading && explanation?.title}
          >
            {errorMsg && (
              <p className="flex gap-2 text-sm text-amber-600 font-medium">
                <LuCircleAlert className="mt-1" /> {errorMsg}
              </p>
            )}
            {isLoading && <SkeletonLoader />}
            {!isLoading && explanation && (
              <AIResponsePreview content={explanation?.explanation} />
            )}
          </Drawer>
        </div>

        {/* Voice Recorder Modal */}
        {showVoiceRecorder && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
              <VoiceRecorder
                onRecordingComplete={handleVoiceRecordingComplete}
                isProcessing={isProcessingVoice}
                question={currentQuestion}
                comparisonResult={comparisonResult}
                onClose={closeVoiceRecorder}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InterviewPrep;
