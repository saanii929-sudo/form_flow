'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface TrialStatus {
  daysLeft: number;
  isTrialExpired: boolean;
  needsUpgrade: boolean;
  plan: string;
}

export default function TrialBanner() {
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTrial = async () => {
      try {
        const response = await fetch('/api/check-trial');
        if (response.ok) {
          const data = await response.json();
          setTrialStatus(data);
        }
      } catch (error) {
        console.error('Failed to check trial status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkTrial();
  }, []);

  if (loading || !trialStatus) return null;

  // Don't show banner if user has a paid plan
  if (trialStatus.plan !== 'trial') return null;

  // Trial expired
  if (trialStatus.isTrialExpired) {
    return (
      <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold">Your free trial has expired</p>
                <p className="text-sm text-white/90">Choose a plan to continue using FormFlow</p>
              </div>
            </div>
            <Link
              href="/pricing"
              className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 font-semibold transition-all whitespace-nowrap"
            >
              View Plans
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Trial ending soon (3 days or less)
  if (trialStatus.daysLeft <= 3) {
    return (
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold">
                  {trialStatus.daysLeft} day{trialStatus.daysLeft !== 1 ? 's' : ''} left in your free trial
                </p>
                <p className="text-sm text-white/90">Upgrade now to continue after your trial ends</p>
              </div>
            </div>
            <Link
              href="/pricing"
              className="px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-orange-50 font-semibold transition-all whitespace-nowrap"
            >
              View Plans
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Trial active (more than 3 days left)
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm">
            <span className="font-semibold">{trialStatus.daysLeft} days</span> left in your free trial
          </p>
          <Link
            href="/pricing"
            className="text-sm text-white/90 hover:text-white underline"
          >
            View pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
