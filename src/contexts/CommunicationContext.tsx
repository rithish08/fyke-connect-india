
import React, { createContext, useContext, useState } from 'react';

interface CommunicationState {
  appliedJobs: Set<string>;
  hireRequests: Set<string>;
  sentRequests: Set<string>;
}

interface CommunicationContextType {
  canCommunicate: (jobId: string, workerId: string, currentUserRole: 'jobseeker' | 'employer') => boolean;
  addJobApplication: (jobId: string) => void;
  addHireRequest: (workerId: string) => void;
  addSentRequest: (targetId: string) => void;
  communicationState: CommunicationState;
}

const CommunicationContext = createContext<CommunicationContextType | undefined>(undefined);

export const useCommunication = () => {
  const context = useContext(CommunicationContext);
  if (context === undefined) {
    throw new Error('useCommunication must be used within a CommunicationProvider');
  }
  return context;
};

export const CommunicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [communicationState, setCommunicationState] = useState<CommunicationState>({
    appliedJobs: new Set(),
    hireRequests: new Set(),
    sentRequests: new Set()
  });

  const canCommunicate = (jobId: string, workerId: string, currentUserRole: 'jobseeker' | 'employer'): boolean => {
    if (currentUserRole === 'jobseeker') {
      // Job seekers can communicate if they've applied to the job
      return communicationState.appliedJobs.has(jobId);
    } else {
      // Employers can communicate if they've sent a hire request
      return communicationState.hireRequests.has(workerId) || communicationState.sentRequests.has(workerId);
    }
  };

  const addJobApplication = (jobId: string) => {
    setCommunicationState(prev => ({
      ...prev,
      appliedJobs: new Set([...prev.appliedJobs, jobId])
    }));
  };

  const addHireRequest = (workerId: string) => {
    setCommunicationState(prev => ({
      ...prev,
      hireRequests: new Set([...prev.hireRequests, workerId])
    }));
  };

  const addSentRequest = (targetId: string) => {
    setCommunicationState(prev => ({
      ...prev,
      sentRequests: new Set([...prev.sentRequests, targetId])
    }));
  };

  return (
    <CommunicationContext.Provider value={{
      canCommunicate,
      addJobApplication,
      addHireRequest,
      addSentRequest,
      communicationState
    }}>
      {children}
    </CommunicationContext.Provider>
  );
};
