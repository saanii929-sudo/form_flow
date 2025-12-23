import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reference, plan } = await request.json();

    if (!reference || !plan) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paystackData = await paystackResponse.json();

    if (!paystackData.status || paystackData.data.status !== 'success') {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Update user subscription in database
    const client = await clientPromise;
    const db = client.db('pdf-form-filler');
    const usersCollection = db.collection('users');

    // Calculate subscription end date (30 days from now)
    const subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await usersCollection.updateOne(
      { _id: new ObjectId(session.user.id) },
      {
        $set: {
          plan: plan,
          planStatus: 'active',
          subscriptionEndDate: subscriptionEndDate,
          lastPaymentDate: new Date(),
          lastPaymentReference: reference,
          lastPaymentAmount: paystackData.data.amount / 100, // Convert from pesewas
        },
      }
    );

    // Store payment record
    const paymentsCollection = db.collection('payments');
    await paymentsCollection.insertOne({
      userId: new ObjectId(session.user.id),
      reference: reference,
      amount: paystackData.data.amount / 100,
      currency: paystackData.data.currency,
      plan: plan,
      status: 'success',
      paystackData: paystackData.data,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription activated successfully',
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
