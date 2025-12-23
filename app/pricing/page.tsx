'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import PaystackButton from '../components/PaystackButton';

const plans = [
  {
    name: 'Basic',
    price: 50,
    period: 'month',
    description: 'Perfect for individuals getting started',
    color: 'from-blue-500 to-indigo-600',
    features: [
      { text: 'Up to 50 PDF forms per month', included: true },
      { text: 'Basic text and checkmark tools', included: true },
      { text: 'Digital signature support', included: true },
      { text: 'Download completed forms', included: true },
      { text: 'Email support', included: true },
      { text: 'Form templates', included: false },
      { text: 'Priority support', included: false },
    ],
    popular: false,
  },
  {
    name: 'Professional',
    price: 120,
    period: 'month',
    description: 'Best for professionals and small teams',
    color: 'from-indigo-600 to-blue-600',
    features: [
      { text: 'Unlimited PDF forms', included: true },
      { text: 'All form filling tools', included: true },
      { text: 'Advanced signature features', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Form templates library', included: true },
      { text: 'Batch processing', included: true },
      { text: 'Custom branding', included: false },
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 300,
    period: 'month',
    description: 'For large teams and organizations',
    color: 'from-blue-600 to-cyan-600',
    features: [
      { text: 'Everything in Professional', included: true },
      { text: 'Team collaboration tools', included: true },
      { text: 'API access', included: true },
      { text: 'Custom branding', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'SLA guarantee (99.9% uptime)', included: true },
      { text: 'Advanced analytics dashboard', included: true },
    ],
    popular: false,
  },
];

export default function PricingPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all transform group-hover:scale-105">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  FormFlow
                </h1>
                <p className="text-xs text-gray-500">Professional PDF Solutions</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              {session ? (
                <>
                  <Link
                    href="/pdf-form"
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to sign out?')) {
                        signOut({ callbackUrl: '/' });
                      }
                    }}
                    className="px-4 py-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-6">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold text-blue-900">10-Day Free Trial • No Credit Card Required</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Simple Pricing,
            </span>
            <br />
            <span className="text-gray-900">Powerful Features</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose the perfect plan for your needs. All prices in <span className="font-semibold text-blue-600">Ghana Cedis (GHS)</span>.
            <br />Start with a free trial and upgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-3xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 ${
                plan.popular
                  ? 'border-blue-500 lg:scale-105'
                  : 'border-gray-200'
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                  <span className={`bg-gradient-to-r ${plan.color} text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg`}>
                    ⭐ MOST POPULAR
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="mb-6">
                  <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${plan.color} mb-4`}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-5xl font-extrabold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                      GH₵{plan.price}
                    </span>
                    <span className="text-gray-500 font-medium">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Billed monthly • Cancel anytime</p>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-gray-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className={feature.included ? 'text-gray-700 font-medium' : 'text-gray-400'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <PaystackButton plan={plan.name} amount={plan.price} popular={plan.popular} />
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-20">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                10 Days
              </div>
              <p className="text-gray-600 font-medium">Free Trial</p>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
                99.9%
              </div>
              <p className="text-gray-600 font-medium">Uptime SLA</p>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <p className="text-gray-600 font-medium">Support</p>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Secure
              </div>
              <p className="text-gray-600 font-medium">Payments</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'What happens after my 10-day free trial?',
                a: 'After 10 days, you\'ll need to choose a paid plan to continue using the service. You\'ll receive email reminders before your trial expires, so you won\'t be caught off guard.',
              },
              {
                q: 'Can I cancel my subscription anytime?',
                a: 'Absolutely! You can cancel your subscription at any time with no questions asked. You\'ll continue to have access until the end of your current billing period.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major payment methods through Paystack including Mobile Money (MTN, Vodafone, AirtelTigo), Visa, Mastercard, and bank transfers.',
              },
              {
                q: 'Can I upgrade or downgrade my plan?',
                a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate the charges accordingly.',
              },
              {
                q: 'Is my data secure?',
                a: 'Yes, we take security seriously. All data is encrypted in transit and at rest. We never store your PDFs permanently and comply with international data protection standards.',
              },
              {
                q: 'Do you offer refunds?',
                a: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with our service, contact us within 30 days for a full refund.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-100"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  {faq.q}
                </h3>
                <p className="text-gray-600 leading-relaxed pl-10">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-20 text-center bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-12 shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust FormFlow for their document needs.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Start Your Free Trial →
          </Link>
        </div>
      </div>
    </div>
  );
}
