import React from 'react';
import { Redirect } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function Index() {
  const hasCompletedOnboarding = useAppStore(state => state.hasCompletedOnboarding);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  if (!hasCompletedOnboarding) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
