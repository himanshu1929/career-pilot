import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  getPersonaObj,
  generateNextAdaptiveQuestion,
  processInterviewTurn
} from '../../utils/interviewGenerator';
import { 
  Mic, 
  Send, 
  ChevronRight, 
  UserCheck, 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  Compass,
  CheckCircle2
} from 'lucide-react';

export const InterviewSimulator = ({ setupData, onFinish }) => {
  const handleFinishInterview = onFinish;
  const { profile } = useWorkspace();
  const candidateName = profile?.name || 'Candidate';
  const persona = getPersonaObj(setupData?.personaId);

  const [hasStartedIntro, setHasStartedIntro] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interviewerResponse, setInterviewerResponse] = useState(null);

  // Hidden evaluation history accumulated throughout the interview
  const [history, setHistory] = useState([]);

  const totalCount = parseInt(setupData?.questionCount || 5, 10);
  const progressPercent = Math.round(((questionIndex + 1) / totalCount) * 100);
  const wordCount = userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0;

  const handleBeginInterview = async () => {
    setHasStartedIntro(true);
    setIsSubmitting(true);
  
    try {
      const q1 = await generateNextAdaptiveQuestion({
        setupData,
        questionIndex: 0,
        previousHistory: [],
        persona
      });
  
      setCurrentQuestion(q1);
    } catch (error) {
      console.error('Failed to start interview:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

 const handleSubmitAnswer = async () => {
  if (!userAnswer.trim() || !currentQuestion || isSubmitting) {
    return;
  }

  setIsSubmitting(true);

  try {
    const result = await processInterviewTurn({
      setupData,
      currentQuestion,
      answer: userAnswer,
      previousHistory: history,
      questionIndex,
      persona
    });

    const historyItem = {
      question: currentQuestion,
      answer: userAnswer.trim(),
      feedback: result.evaluation
    };

    const updatedHistory = [...history, historyItem];

    setHistory(updatedHistory);

    setInterviewerResponse(
      result.transition ||
      'Thanks for explaining that. Let’s continue with the next question.'
    );

    setCurrentQuestion({
      ...result.nextQuestion,
      questionText: result.nextQuestion.question,
      question: result.nextQuestion.question
    });

  } catch (error) {
    console.error('Failed to process interview answer:', error);

    setInterviewerResponse(
      'I had trouble processing that response. Please try again.'
    );
  } finally {
    setIsSubmitting(false);
  }
};

const handleProceedToNext = () => {
  const nextIdx = questionIndex + 1;

  if (nextIdx < totalCount) {
    setQuestionIndex(nextIdx);
    setUserAnswer('');
    setInterviewerResponse(null);
  } else {
    if (handleFinishInterview) {
      handleFinishInterview(history);
    }
  }
};

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      
      {/* 1. Human Introduction Screen */}
      {!hasStartedIntro && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8 sm:p-10 space-y-8 shadow-2xl animate-fadeIn">
          
          <div className="flex items-center gap-4 pb-6 border-b border-[#30363D]">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-blue-500/40 shadow-lg shadow-blue-500/20 flex-shrink-0">
              <img src={persona.avatarImg} alt={persona.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">{persona.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300 font-bold">
                  {setupData?.difficulty || 'Medium'} Difficulty
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Hi {candidateName}! I'm {persona.name}.
              </h2>
            </div>
          </div>

          <div className="space-y-4 text-sm text-gray-300 leading-relaxed font-medium">
            <p>
              Welcome to your <strong className="text-white">{setupData?.targetRole || 'Software Engineer'}</strong> mock interview! I'll be guiding you through {totalCount} technical & conversational scenarios today.
            </p>
            <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-2 text-xs">
              <div className="flex items-center gap-2 text-blue-400 font-bold">
                <Compass className="w-4 h-4" /> Interview Guidance:
              </div>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>Take your time to organize your thoughts before answering.</li>
                <li>Use real project examples and concrete technical details where possible.</li>
                <li>If you're unsure about a specific topic, explain your reasoning process naturally.</li>
              </ul>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleBeginInterview}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 text-sm transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Let's Begin the Interview</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* 2. Interactive Simulator Workspace */}
      {hasStartedIntro && currentQuestion && (
        <div className="space-y-6">
          
          {/* Interview Progress Header */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-blue-500/40 shadow-sm flex-shrink-0">
                <img src={persona.avatarImg} alt={persona.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  Interviewer: {persona.name}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  Role: {setupData?.targetRole}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-300 font-mono">
                Question <strong className="text-blue-400">{questionIndex + 1}</strong> of <strong className="text-white">{totalCount}</strong>
              </span>
              <div className="w-32 bg-[#0D1117] h-2 rounded-full overflow-hidden border border-[#30363D]">
                <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Question Card */}
          {currentQuestion ? (
            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-blue-400">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" /> Technical & Behavioral Question
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300">
                  {currentQuestion.category || currentQuestion.topic || 'Domain Knowledge'}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                "{currentQuestion.questionText || currentQuestion.question || 'Can you explain your core technical approach to solving complex engineering challenges for this role?'}"
              </h3>

              {currentQuestion.contextNote && (
                <p className="text-xs text-gray-400 italic bg-[#0D1117] p-3 rounded-lg border border-[#30363D]">
                  💡 Context Tip: {currentQuestion.contextNote}
                </p>
              )}
            </div>
          ) : (
            <div className="bg-[#161B22] border border-amber-500/30 rounded-2xl p-6 text-center space-y-3">
              <p className="text-sm text-amber-400 font-semibold">Unable to load question. Click retry below.</p>
              <button
                onClick={handleBeginInterview}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs"
              >
                Retry Question Generation
              </button>
            </div>
          )}

          {/* Response Box vs Interviewer Transition */}
          {!interviewerResponse ? (
            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                <span>Your Answer:</span>
                <span className="text-gray-400 font-mono text-[11px]">{wordCount} Words</span>
              </div>

              <textarea
                rows={5}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your response naturally here. Explain your technical approach, trade-offs, and examples..."
                className="w-full px-4 py-3 rounded-xl bg-[#0D1117] border border-[#30363D] text-white text-xs focus:outline-none focus:border-blue-500 transition-colors leading-relaxed"
              />

              <button
                onClick={handleSubmitAnswer}
                disabled={!userAnswer.trim() || isSubmitting}
                className={`w-full py-3.5 rounded-xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  !userAnswer.trim() || isSubmitting
                    ? 'bg-blue-600/40 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 hover:scale-[1.01] active:scale-[0.99]'
                }`}
              >
                <span>Submit Answer to {persona.name}</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Interviewer Conversational Feedback Transition */
            <div className="bg-[#161B22] border-2 border-blue-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn">
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500/40 shadow-lg shadow-blue-500/20 flex-shrink-0">
                  <img src={persona.avatarImg} alt={persona.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
                    {persona.name} (Interviewer)
                  </span>
                  <p className="text-sm text-gray-200 leading-relaxed font-medium">
                    "{interviewerResponse}"
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#30363D] flex justify-end">
                <button
                  onClick={handleProceedToNext}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl shadow-lg shadow-blue-600/20 text-xs flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>{questionIndex + 1 < totalCount ? 'Proceed to Next Question' : 'View Final Interview Report'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
