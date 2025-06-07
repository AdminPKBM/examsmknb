
import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { useCapacitor } from '../hooks/useCapacitor';
import LoginForm from '../components/LoginForm';
import Dashboard from '../components/Dashboard';
import ExamBrowser from '../components/ExamBrowser';

const Index = () => {
  const { isLoggedIn, isInExamMode } = useAppStore();
  const { isNative } = useCapacitor();

  // Show exam browser if in exam mode
  if (isInExamMode) {
    return <ExamBrowser />;
  }

  // Show dashboard if logged in
  if (isLoggedIn) {
    return <Dashboard />;
  }

  // Show login form by default
  return <LoginForm />;
};

export default Index;
