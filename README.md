# PDF Form Filler - Professional Online PDF Editor

A modern, full-featured Next.js application for filling out PDF forms online with authentication, subscriptions, and payment processing.

![PDF Form Filler](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green) ![Paystack](https://img.shields.io/badge/Paystack-Integrated-orange)

## 🌟 Features

### Core Functionality
- **📄 Multiple PDF Sources**: Load from URL, upload from computer, or use sample PDFs
- **✍️ Interactive Form Filling**: Click-to-place text fields, checkmarks, and signatures
- **🎨 Full Editing Suite**: Drag, resize, copy/paste, font customization, and color selection
- **✒️ Digital Signatures**: Draw and insert signatures anywhere on your PDF
- **👁️ Live Preview**: Preview your completed form before downloading
- **💾 Export**: Download filled PDFs with all your changes embedded

### User Management
- **🔐 Secure Authentication**: NextAuth.js with MongoDB session management
- **📧 Email Verification**: Automated email verification with beautiful HTML templates
- **🆓 10-Day Free Trial**: All new users get 10 days of free access
- **👤 User Dashboard**: Manage profile and subscription

### Subscription & Payments
- **💳 Paystack Integration**: Secure payment processing for Ghana (GHS)
- **📊 Three Pricing Tiers**:
  - **Basic**: GH₵50/month - Perfect for individuals
  - **Professional**: GH₵120/month - Best for professionals (Most Popular)
  - **Enterprise**: GH₵300/month - For large teams
- **🔄 Subscription Management**: View plan details, upgrade/downgrade, payment history
- **⏰ Trial Tracking**: Real-time trial status with countdown banners
- **🚫 Access Control**: Automatic blocking after trial expiration

### UI/UX
- **🎨 Modern Design**: Gradient backgrounds, glassmorphism, smooth animations
- **📱 Fully Responsive**: Works perfectly on desktop, tablet, and mobile
- **🌈 Professional Typography**: Clean, readable, human-like interface
- **⚡ Fast & Intuitive**: No learning curve, instant productivity

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB running (local or Atlas)
- Email service credentials (Gmail, SendGrid, etc.)
- Paystack account (test keys provided)

### Installation

1. **Clone and Install**
```bash
git clone <repository-url>
cd pdf-form-filler
npm install
```

2. **Set Up Environment Variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=PDF Form Filler <your-email@gmail.com>

# Paystack (Test keys included)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_a14e60a1493c7f848279d1435433cd7d5fc52e51
PAYSTACK_SECRET_KEY=sk_test_2a432881a8e6901c4f94089adeafa043b6bad1c5
```

3. **Generate NextAuth Secret**
```bash
openssl rand -base64 32
```

4. **Start Development Server**
```bash
npm run dev
```

5. **Access the Application**
- Homepage: http://localhost:3000
- Sign Up: http://localhost:3000/auth/signup
- PDF Editor: http://localhost:3000/pdf-form
- Pricing: http://localhost:3000/pricing
- Subscription: http://localhost:3000/subscription

## 📖 User Guide

### Getting Started

1. **Create Account**
   - Visit the homepage and click "Get Started"
   - Fill in your details (name, email, password)
   - Verify your email address
   - Your 10-day free trial starts automatically

2. **Fill Your First PDF**
   - Navigate to the PDF Form page
   - Choose how to load your PDF:
     - **From URL**: Paste any PDF link
     - **Upload**: Select a PDF from your computer
     - **Sample**: Try with our demo PDF
   - Click toolbar buttons to add elements
   - Click on the PDF to place them

3. **Add Text Fields**
   - Click "Text" button in toolbar
   - Click anywhere on the PDF
   - Type your text
   - Drag to reposition, resize with corners
   - Change font size and color in toolbar

4. **Add Checkmarks**
   - Click "Check" button
   - Click on checkboxes in the PDF
   - Drag to reposition if needed

5. **Add Signatures**
   - Scroll to Signature Pad section
   - Draw your signature
   - Click "Save Signature"
   - Click "Sign" button in toolbar
   - Click on PDF to place signature

6. **Preview & Download**
   - Click "Preview & Download"
   - Review your completed form
   - Click "Download PDF" to save
   - Or click "Submit PDF" to send

### Subscription Management

- **Trial Status**: Banner shows remaining days
- **Upgrade**: Click "View Plans" to see pricing
- **Payment**: Secure Paystack checkout (Mobile Money, Cards, Bank Transfer)
- **Manage**: Visit `/subscription` to view plan details

## 🏗️ Tech Stack

### Frontend
- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Fabric.js v6**: Canvas manipulation
- **react-pdf**: PDF rendering
- **react-signature-canvas**: Signature capture

### Backend
- **Next.js API Routes**: Serverless functions
- **NextAuth.js**: Authentication
- **MongoDB**: Database
- **Nodemailer**: Email sending
- **pdf-lib**: PDF manipulation

### Payment & Services
- **Paystack**: Payment processing
- **JWT**: Session management
- **bcrypt**: Password hashing

## 📁 Project Structure

```
pdf-form-filler/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts    # NextAuth handler
│   │   │   ├── register/route.ts         # User registration
│   │   │   └── verify-email/route.ts     # Email verification
│   │   ├── check-trial/route.ts          # Trial status check
│   │   ├── submit/route.ts               # PDF submission
│   │   └── verify-payment/route.ts       # Payment verification
│   ├── auth/
│   │   ├── signin/page.tsx               # Sign in page
│   │   ├── signup/page.tsx               # Sign up page
│   │   └── verify/page.tsx               # Email verification page
│   ├── components/
│   │   ├── FormOverlay.tsx               # Fabric.js canvas
│   │   ├── PaystackButton.tsx            # Payment button
│   │   ├── PdfViewer.tsx                 # PDF renderer
│   │   ├── SignaturePad.tsx              # Signature drawing
│   │   └── TrialBanner.tsx               # Trial status banner
│   ├── pdf-form/page.tsx                 # Main PDF editor
│   ├── pricing/page.tsx                  # Pricing plans
│   ├── subscription/page.tsx             # Subscription management
│   ├── utils/
│   │   └── pdfExport.ts                  # PDF export logic
│   ├── layout.tsx                        # Root layout
│   ├── page.tsx                          # Homepage
│   └── providers.tsx                     # Session provider
├── lib/
│   ├── auth.ts                           # NextAuth configuration
│   ├── email.ts                          # Email service
│   └── mongodb.ts                        # MongoDB connection
├── middleware.ts                         # Route protection
├── .env.example                          # Environment template
├── DEPLOYMENT.md                         # Deployment guide
├── EMAIL_SETUP.md                        # Email configuration
└── SETUP.md                              # Setup instructions
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Sessions**: Secure token-based authentication
- **Email Verification**: Required before full access
- **Protected Routes**: Middleware-based route protection
- **Payment Security**: Paystack PCI-compliant processing
- **Environment Variables**: Sensitive data never committed

## 🎨 Design Philosophy

- **Human-Centered**: Designed to feel natural, not AI-generated
- **Professional**: Clean, modern, business-ready interface
- **Accessible**: WCAG compliant, keyboard navigation
- **Responsive**: Mobile-first, works on all devices
- **Fast**: Optimized performance, instant feedback
- **Intuitive**: No manual needed, self-explanatory UI

## 📊 Database Schema

### Users Collection
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  password: string (hashed),
  emailVerified: boolean,
  verificationToken: string,
  plan: 'trial' | 'basic' | 'professional' | 'enterprise',
  planStatus: 'active' | 'expired' | 'cancelled',
  trialEndDate: Date,
  subscriptionEndDate: Date,
  lastPaymentDate: Date,
  lastPaymentAmount: number,
  lastPaymentReference: string,
  createdAt: Date
}
```

### Payments Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  reference: string,
  amount: number,
  currency: string,
  plan: string,
  status: string,
  paystackData: object,
  createdAt: Date
}
```

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 📧 Email Setup

See [EMAIL_SETUP.md](./EMAIL_SETUP.md) for email configuration details.

Supported providers:
- Gmail (with App Password)
- SendGrid
- Mailgun
- AWS SES
- Any SMTP service

## 💳 Payment Testing

Use Paystack test cards:
- **Success**: 4084084084084081
- **Insufficient Funds**: 4084080000000408
- **Invalid CVV**: Use any card with CVV 000

Test credentials are already in `.env.example`

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Failed**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env.local`
- For Atlas: Whitelist your IP

**Emails Not Sending**
- Verify EMAIL_* variables
- For Gmail: Enable 2FA and use App Password
- Check spam folder

**Payment Not Working**
- Verify Paystack keys
- Check browser console for errors
- Ensure NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is set

**Session Issues**
- Clear browser cookies
- Regenerate NEXTAUTH_SECRET
- Check NEXTAUTH_URL matches your domain

## 📝 License

Proprietary - All rights reserved

## 🤝 Support

For issues or questions:
- Email: support@pdfformfiller.com
- Documentation: Check `/docs` folder
- Issues: Create a GitHub issue

## 🎯 Roadmap

- [ ] Batch PDF processing
- [ ] Form templates library
- [ ] Team collaboration features
- [ ] API access for Enterprise
- [ ] Mobile apps (iOS/Android)
- [ ] Advanced analytics dashboard
- [ ] Custom branding options
- [ ] Webhook integrations

## 👏 Acknowledgments

- Next.js team for the amazing framework
- Fabric.js for canvas manipulation
- Paystack for payment infrastructure
- MongoDB for database solution

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**
