import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  ArrowRight, 
  ArrowLeft, 
  Briefcase, 
  FileText, 
  Mic, 
  Map, 
  GraduationCap, 
  UserCheck, 
  Building2, 
  Compass as SwitcherIcon,
  Check
} from 'lucide-react';

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();
  const { user } = useAuth();

  // If already completed onboarding, redirect straight to dashboard
  if (profile?.completedOnboarding) {
    navigate('/app/dashboard', { replace: true });
  }

  const googleName = user?.displayName || user?.email?.split('@')[0] || '';

  const [step, setStep] = useState(1);
  const [name, setName] = useState(profile?.name || googleName);
  const [goal, setGoal] = useState(profile?.goal || 'Get a Job');
  const [experience, setExperience] = useState(profile?.experience || 'Student');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (!name && googleName) {
      setName(googleName);
    }
  }, [googleName, name]);

  const goalsList = [
    { id: 'Get a Job', title: 'Get a Job', desc: 'Find relevant target roles and optimize applications', icon: Briefcase },
    { id: 'Improve My Resume', title: 'Improve My Resume', desc: 'Scan for ATS keywords and structural formatting', icon: FileText },
    { id: 'Prepare for Interviews', title: 'Prepare for Interviews', desc: 'Practice domain-specific technical & behavioral questions', icon: Mic },
    { id: 'Learn New Skills', title: 'Learn New Skills', desc: 'Follow step-by-step personalized learning roadmaps', icon: Map }
  ];

  const experienceList = [
    { id: 'Student', title: 'Student', desc: 'Currently studying in university or college', icon: GraduationCap },
    { id: 'Fresher', title: 'Fresher / Recent Grad', desc: '0-1 years experience looking for entry-level roles', icon: UserCheck },
    { id: 'Working Professional', title: 'Working Professional', desc: 'Currently employed and aiming for career growth', icon: Building2 },
    { id: 'Career Switcher', title: 'Career Switcher', desc: 'Transitioning from another field into software', icon: SwitcherIcon }
  ];

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!name || name.trim().length < 2) {
      setNameError('Please enter at least 2 characters.');
      return;
    }
    setNameError('');
    setStep(2);
  };

  const handleStep2Submit = () => {
    setStep(3);
  };

  const handleFinishOnboarding = () => {
    const finalName = name.trim() || user?.displayName || 'CareerPilot User';
    updateProfile({
      name: finalName,
      email: user?.email || '',
      photoURL: user?.photoURL || '',
      uid: user?.uid || '',
      goal,
      experience,
      completedOnboarding: true
    });
    navigate('/app/dashboard', { replace: true });
  };

  const currentDisplayName = user?.displayName || name || 'there';

  return (
    <div className="min-h-screen bg-[#0D1117] text-gray-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 selection:bg-blue-600 selection:text-white relative overflow-hidden">
      
      {/* Top Header Brand */}
      <div className="max-w-xl mx-auto w-full flex items-center justify-between pt-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#161B22] border border-[#30363D] flex items-center justify-center shadow-md">
            <Compass className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            Career<span className="text-blue-500 font-bold">Pilot</span>
          </span>
        </div>

        {/* Step Progress Pills */}
        <div className="flex items-center gap-1.5 font-mono text-xs text-gray-400">
          <span className={`px-2 py-0.5 rounded ${step === 1 ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold' : 'text-gray-500'}`}>1</span>
          <span className="text-gray-600">/</span>
          <span className={`px-2 py-0.5 rounded ${step === 2 ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold' : 'text-gray-500'}`}>2</span>
          <span className="text-gray-600">/</span>
          <span className={`px-2 py-0.5 rounded ${step === 3 ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold' : 'text-gray-500'}`}>3</span>
        </div>
      </div>

      {/* Main Form Box */}
      <div className="max-w-xl mx-auto w-full my-auto py-12">
        <AnimatePresence mode="wait">
          
          {/* STEP 1 — DISPLAY NAME */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8 sm:p-10 space-y-8 shadow-2xl"
            >
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Welcome, {currentDisplayName} 👋
                </h1>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Let's personalize your workspace. This only takes a few seconds.
                </p>
              </div>

              <form onSubmit={handleStep1Submit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="user-name-input" className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                    You can change your display name if you'd like.
                  </label>
                  <input
                    id="user-name-input"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (nameError) setNameError('');
                    }}
                    placeholder="e.g. Himanshu"
                    autoFocus
                    className={`w-full px-4 py-3.5 rounded-xl bg-[#0D1117] border text-white text-sm placeholder-gray-500 focus:outline-none transition-all ${
                      nameError 
                        ? 'border-red-500/60 focus:border-red-500' 
                        : 'border-[#30363D] focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                  />
                  {nameError && (
                    <p className="text-xs text-red-400 font-medium pt-1">
                      {nameError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/20"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 2 — CAREER GOAL */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8 sm:p-10 space-y-8 shadow-2xl"
            >
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  What's your primary goal?
                </h1>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Select the main objective you want to achieve with CareerPilot.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {goalsList.map((item) => {
                  const Icon = item.icon;
                  const isSelected = goal === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setGoal(item.id)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'bg-blue-600/10 border-blue-500 text-white shadow-md'
                          : 'bg-[#0D1117] border-[#30363D] text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isSelected ? 'bg-blue-600/20 text-blue-400' : 'bg-[#161B22] text-gray-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{item.title}</div>
                        <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 bg-[#0D1117] hover:bg-[#161B22] text-gray-400 hover:text-white border border-[#30363D] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <button
                  type="button"
                  onClick={handleStep2Submit}
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/20"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 — EXPERIENCE LEVEL */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8 sm:p-10 space-y-8 shadow-2xl"
            >
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  What's your current experience level?
                </h1>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Helps us calibrate tailored AI feedback and recommended next steps.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {experienceList.map((item) => {
                  const Icon = item.icon;
                  const isSelected = experience === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setExperience(item.id)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'bg-blue-600/10 border-blue-500 text-white shadow-md'
                          : 'bg-[#0D1117] border-[#30363D] text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isSelected ? 'bg-blue-600/20 text-blue-400' : 'bg-[#161B22] text-gray-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{item.title}</div>
                        <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-3 bg-[#0D1117] hover:bg-[#161B22] text-gray-400 hover:text-white border border-[#30363D] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/20"
                >
                  <span>Finish Workspace Setup</span>
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Minimal Footer */}
      <div className="max-w-xl mx-auto w-full text-center text-xs text-gray-400 pb-4">
        Privacy First • Stored locally in your browser
      </div>

    </div>
  );
};
