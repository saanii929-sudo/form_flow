import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('pdf-form-filler');
    const usersCollection = db.collection('users');

    // Find user with this token
    const user = await usersCollection.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Update user as verified
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          emailVerified: true,
          verificationToken: null,
          verificationTokenExpiry: null,
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully!',
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
