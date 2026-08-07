import React from 'react';
import { useWorkspace } from './WorkspaceContext';

export const ProfileProvider = ({ children }) => {
  return children;
};

export const useProfile = () => {
  const { profile, updateProfile, resetWorkspace } = useWorkspace();
  return {
    profile,
    updateProfile,
    resetProfile: resetWorkspace
  };
};

export default ProfileProvider;
