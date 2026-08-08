import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWorkspace } from '../context/WorkspaceContext';
import { PageContainer, PageHeader } from '../components/layout/PageContainer';
import { updateProfile as updateFirebaseProfile } from 'firebase/auth';
import { auth } from '../config/firebase';
import { 
  User, 
  Mail, 
  Edit2, 
  Check, 
  CheckCircle2, 
  Loader2
} from 'lucide-react';

export const ProfilePage = () => {
  const { user } = useAuth();
  const { workspace, updateProfile: updateWorkspaceProfile } = useWorkspace();
  const workspaceProfile = workspace?.profile || {};

  const displayName = user?.displayName || workspaceProfile?.name || 'Candidate';
  const userEmail = user?.email || 'No email associated';
  const avatarUrl = user?.photoURL || workspaceProfile?.photoURL || null;

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(displayName);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    setSaving(true);
    try {
      if (auth.currentUser) {
        await updateFirebaseProfile(auth.currentUser, {
          displayName: nameInput.trim()
        });
      }
      updateWorkspaceProfile({ name: nameInput.trim() });
      setSuccessMsg('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const initialLetter = displayName.charAt(0).toUpperCase() || 'C';

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader
        title="Profile"
        subtitle="Manage your personal account details."
        backTo="/app/dashboard"
        backLabel="Back to Dashboard"
      />

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between gap-3 text-emerald-400 text-xs font-semibold shadow-md animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg(null)}
            className="text-xs text-emerald-300 hover:text-white cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Hero Profile Header Card */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          
          {/* Avatar Photo / Fallback Initials */}
          <div className="flex-shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-blue-500/40 object-cover shadow-md"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-600/20 text-blue-400 border-2 border-blue-500/30 flex items-center justify-center font-extrabold text-3xl shadow-md">
                {initialLetter}
              </div>
            )}
          </div>

          {/* Header Info & Edit Action */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {displayName}
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 font-mono mt-0.5">
                  {userEmail}
                </p>
              </div>

              {!isEditing && (
                <button
                  onClick={() => {
                    setNameInput(displayName);
                    setIsEditing(true);
                  }}
                  className="px-4 py-2.5 bg-[#0D1117] hover:bg-[#21262d] text-gray-300 hover:text-white border border-[#30363D] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer self-center sm:self-start shadow-sm"
                >
                  <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Inline Edit Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="pt-6 border-t border-[#30363D] space-y-4 animate-fadeIn">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-blue-400" />
              <span>Edit Full Name</span>
            </h3>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter your full name"
                className="w-full sm:max-w-md px-4 py-2.5 bg-[#0D1117] border border-[#30363D] focus:border-blue-500 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
                required
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Save</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-full sm:w-auto px-3.5 py-2.5 bg-[#0D1117] hover:bg-[#21262d] text-gray-400 hover:text-white border border-[#30363D] text-xs font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Single Clean Card: Personal Information */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-3 pb-3 border-b border-[#30363D]">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Personal Information</h3>
            <p className="text-xs text-gray-400">Your basic account details</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Full Name</span>
              <span className="text-sm font-semibold text-white mt-0.5 block">{displayName}</span>
            </div>
            <User className="w-4 h-4 text-gray-500" />
          </div>

          <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Email Address</span>
              <span className="text-sm font-semibold text-white mt-0.5 block">{userEmail}</span>
            </div>
            <Mail className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
