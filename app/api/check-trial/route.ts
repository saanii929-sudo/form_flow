import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '@/lib/mongodb';
import { authOptions } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('pdf-form-filler');
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({
      _id: new ObjectId(session.user.id),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const now = new Date();
    const trialEndDate = new Date(user.trialEndDate);
    const daysLeft = Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    const isTrialExpired = now > trialEndDate && user.plan === 'trial';
    const needsUpgrade = isTrialExpired || (user.plan === 'trial' && daysLeft <= 0);

    return NextResponse.json({
      plan: user.plan,
      planStatus: user.planStatus,
      trialEndDate: user.trialEndDate,
      daysLeft: Math.max(0, daysLeft),
      isTrialExpired,
      needsUpgrade,
      emailVerified: user.emailVerified,
    });
  } catch (error) {
    console.error('Trial check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
