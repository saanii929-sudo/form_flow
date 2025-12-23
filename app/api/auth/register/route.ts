import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import clientPromise from '@/lib/mongodb';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('pdf-form-filler');
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Calculate trial end date (10 days from now)
    const trialEndDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);

    // Create user
    const result = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      emailVerified: false,
      verificationToken,
      verificationTokenExpiry,
      trialEndDate,
      plan: 'trial',
      planStatus: 'active',
      createdAt: new Date(),
    });

    // Send verification email
    let emailSent = false;
    try {
      const emailResult = await sendVerificationEmail(email, verificationToken);
      emailSent = !emailResult?.skipped;
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue even if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: emailSent 
          ? 'Account created! Please check your email to verify your account.'
          : 'Account created! Email verification is disabled. You can start using the app immediately.',
        userId: result.insertedId,
        emailSent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
