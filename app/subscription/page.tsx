'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SubscriptionData {
  plan: string;
  planStatus: string;
  trialEndDate: string;
  subscriptionEndDate?: string;
  daysLeft: number;
  isTrialExpired: boolean;
  needsUpgrade: boolean;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
}

export default function SubscriptionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin?redirect=/subscription');
      return;
    }

    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/check-trial');
        if (response.ok) {
          const data = await response.json();
          setSubscriptionData(data);
        }
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [session, status, router]);

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping"></div>
            <div className="absolute inset-0 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-lg font-medium text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  const getPlanColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'basic':
        return 'from-blue-500 to-cyan-500';
      case 'professional':
        return 'from-purple-600 via-pink-600 to-red-600';
      case 'enterprise':
        return 'from-emerald-500 to-teal-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getPlanPrice = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'basic':
        return 50;
      case 'professional':
        return 120;
      case 'enterprise':
        return 300;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all transform group-hover:scale-105">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  FormFlow
                </h1>
                <p className="text-xs text-gray-500">Subscription Management</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/pdf-form"
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-105"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to sign out?')) {
                    signOut({ callbackUrl: '/' });
                  }
                }}
                className="px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-semibold transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Your Subscription
          </h1>
          <p className="text-gray-600">
            Manage your plan and billing information
          </p>
        </div>

        {subscriptionData && (
          <>
            {/* Current Plan Card */}
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900 capitalize">
                      {subscriptionData.plan} Plan
                    </h2>
                    {subscriptionData.planStatus === 'active' && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        Active
                      </span>
                    )}
                    {subscriptionData.plan === 'trial' && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        Trial
                      </span>
                    )}
                  </div>
                  {subscriptionData.plan !== 'trial' && (
                    <p className="text-3xl font-bold bg-gradient-to-r {getPlanColor(subscriptionData.plan)} bg-clip-text text-transparent">
                      GH₵{getPlanPrice(subscriptionData.plan)}/month
                    </p>
                  )}
                </div>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getPlanColor(subscriptionData.plan)} flex items-center justify-center`}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              {/* Trial Information */}
              {subscriptionData.plan === 'trial' && (
                <div className={`p-6 rounded-2xl mb-6 ${
                  subscriptionData.isTrialExpired
                    ? 'bg-red-50 border-2 border-red-200'
                    : subscriptionData.daysLeft <= 3
                    ? 'bg-yellow-50 border-2 border-yellow-200'
                    : 'bg-blue-50 border-2 border-blue-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <svg className={`w-6 h-6 mt-0.5 ${
                      subscriptionData.isTrialExpired
                        ? 'text-red-600'
                        : subscriptionData.daysLeft <= 3
                        ? 'text-yellow-600'
                        : 'text-blue-600'
                    }`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <h3 className={`font-bold mb-1 ${
                        subscriptionData.isTrialExpired
                          ? 'text-red-900'
                          : subscriptionData.daysLeft <= 3
                          ? 'text-yellow-900'
                          : 'text-blue-900'
                      }`}>
                        {subscriptionData.isTrialExpired
                          ? 'Trial Expired'
                          : `${subscriptionData.daysLeft} Day${subscriptionData.daysLeft !== 1 ? 's' : ''} Remaining`
                        }
                      </h3>
                      <p className={`text-sm ${
                        subscriptionData.isTrialExpired
                          ? 'text-red-700'
                          : subscriptionData.daysLeft <= 3
                          ? 'text-yellow-700'
                          : 'text-blue-700'
                      }`}>
                        {subscriptionData.isTrialExpired
                          ? 'Your free trial has ended. Upgrade to continue using FormFlow.'
                          : `Your free trial ends on ${new Date(subscriptionData.trialEndDate).toLocaleDateString()}`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Paid Plan Information */}
              {subscriptionData.plan !== 'trial' && subscriptionData.subscriptionEndDate && (
                <div className="p-6 bg-green-50 border-2 border-green-200 rounded-2xl mb-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <h3 className="font-bold text-green-900 mb-1">
                        Subscription Active
                      </h3>
                      <p className="text-sm text-green-700">
                        Your subscription renews on {new Date(subscriptionData.subscriptionEndDate).toLocaleDateString()}
                      </p>
                      {subscriptionData.lastPaymentDate && (
                        <p className="text-xs text-green-600 mt-1">
                          Last payment: GH₵{subscriptionData.lastPaymentAmount} on {new Date(subscriptionData.lastPaymentDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {(subscriptionData.plan === 'trial' || subscriptionData.needsUpgrade) && (
                  <Link
                    href="/pricing"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-red-700 font-semibold text-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    Upgrade Now
                  </Link>
                )}
                {subscriptionData.plan !== 'trial' && subscriptionData.plan !== 'enterprise' && (
                  <Link
                    href="/pricing"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 font-semibold text-center shadow-md hover:shadow-lg transition-all"
                  >
                    Change Plan
                  </Link>
                )}
              </div>
            </div>

            {/* Features Card */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                What's Included
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {subscriptionData.plan === 'trial' ? (
                  <>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Limited PDF forms</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Basic editing tools</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Digital signatures</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">10-day access</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Unlimited PDF forms</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">All editing tools</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Priority support</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Advanced features</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
