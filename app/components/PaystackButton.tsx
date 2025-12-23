'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface PaystackButtonProps {
  plan: string;
  amount: number;
  popular?: boolean;
}

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function PaystackButton({ plan, amount, popular = false }: PaystackButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handlePayment = () => {
    if (!session) {
      router.push('/auth/signin?redirect=/pricing');
      return;
    }

    if (!window.PaystackPop) {
      toast.error('Payment system is loading. Please refresh and try again.');
      return;
    }

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      toast.error('Payment configuration error. Please contact support.');
      console.error('Paystack public key not configured');
      return;
    }

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: session.user.email,
      amount: amount * 100, // Convert to pesewas (GHS to pesewas)
      currency: 'GHS',
      ref: `${plan.toLowerCase()}_${Date.now()}`,
      metadata: {
        custom_fields: [
          {
            display_name: 'Plan',
            variable_name: 'plan',
            value: plan,
          },
          {
            display_name: 'User ID',
            variable_name: 'user_id',
            value: session.user.id,
          },
        ],
      },
      callback: function (response: any) {
        console.log('Payment successful, verifying...', response);
        
        // Show loading toast
        const loadingToast = toast.loading('Verifying payment...');
        
        // Verify payment on backend (non-blocking)
        fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reference: response.reference,
            plan: plan.toLowerCase(),
          }),
        })
          .then(res => res.json())
          .then(data => {
            console.log('Verification response:', data);
            toast.dismiss(loadingToast);

            if (data.success) {
              toast.success('🎉 Payment successful! Your subscription is now active.', {
                duration: 5000,
              });
              setTimeout(() => {
                router.push('/pdf-form');
                router.refresh();
              }, 1000);
            } else {
              toast.error(`Payment verification failed. Reference: ${response.reference}`, {
                duration: 6000,
              });
            }
          })
          .catch(error => {
            console.error('Payment verification error:', error);
            toast.dismiss(loadingToast);
            toast.error(`An error occurred. Reference: ${response.reference}`, {
              duration: 6000,
            });
          });
      },
      onClose: function () {
        console.log('Payment window closed');
      },
    });

    handler.openIframe();
  };

  return (
    <button
      onClick={handlePayment}
      className={`w-full px-6 py-3.5 rounded-xl font-semibold transition-all transform hover:scale-105 ${
        popular
          ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white shadow-lg hover:shadow-2xl'
          : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg'
      }`}
    >
      Choose {plan}
    </button>
  );
}
