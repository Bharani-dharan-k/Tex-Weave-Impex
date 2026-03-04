# Password Reset with Email - Quick Start Guide

## ✅ What's Been Implemented

1. **Nodemailer Integration** - Email sending via Gmail
2. **Secure Token Generation** - Crypto-based tokens with 1-hour expiry
3. **Password Reset Endpoint** - Complete backend API
4. **Reset Password Page** - Frontend UI for password reset
5. **Email Template** - Beautiful HTML email with your brand gradient

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies (Already Done)
```bash
cd backend
npm install nodemailer
```

### 2. Configure Gmail App Password

**Important:** You MUST use a Gmail App Password, not your regular password!

1. Enable 2FA: https://myaccount.google.com/security
2. Create App Password: https://myaccount.google.com/apppasswords
   - App: Mail
   - Device: Other (Custom name)
   - Name: "Password Reset"
3. Copy the 16-character password

### 3. Update backend/.env File

Add these lines (replace with your values):

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
FRONTEND_URL=http://localhost:5173
APP_NAME=Your App Name
```

### 4. Start Servers

Terminal 1 - Backend:
```bash
cd backend
npm start
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### 5. Test It!

1. Go to http://localhost:5173/login
2. Click "Customer Login"
3. Click "Forgot Password?"
4. Enter your email
5. Check your inbox 📧
6. Click the reset link
7. Set new password ✨

## 📧 Email Features

The password reset email includes:
- ✅ Beautiful gradient design matching your app
- ✅ Clickable "Reset Password" button
- ✅ Copy-paste link as backup
- ✅ 1-hour expiry warning
- ✅ Security notice
- ✅ Professional footer

## 🔐 Security Features

1. **Token Hashing** - Tokens are hashed before storing in database
2. **Time Expiry** - Links expire after 1 hour
3. **One-time Use** - Tokens are deleted after use
4. **Secure Randomness** - Using crypto.randomBytes(32)
5. **Privacy** - Always returns success even if email doesn't exist

## 🎯 API Endpoints

### Request Password Reset
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "abc123...",
  "password": "newpassword123"
}
```

## 🔧 Files Changed/Created

### Backend
- ✅ `backend/config/email.js` - Nodemailer configuration
- ✅ `backend/models/User.js` - Added resetPasswordToken fields
- ✅ `backend/routes/authRoutes.js` - Added reset endpoints
- ✅ `backend/.env.example` - Environment template

### Frontend
- ✅ `frontend/src/Pages/ResetPassword.jsx` - Reset password UI
- ✅ `frontend/src/Pages/Login.jsx` - Updated forgot password flow
- ✅ `frontend/src/App.jsx` - Added reset password route

## 📝 Environment Variables Required

```env
EMAIL_USER=your-email@gmail.com           # Your Gmail address
EMAIL_PASSWORD=your-app-password          # 16-char Gmail App Password
FRONTEND_URL=http://localhost:5173        # Your frontend URL
APP_NAME=Your App Name                    # App name for emails
```

## ⚠️ Common Issues & Solutions

### Issue: "Invalid login credentials" when sending email
**Solution:** You're using your Gmail password instead of App Password
- Must use Gmail App Password (16 characters)
- Enable 2FA first

### Issue: Email not received
**Solution:** Check these:
- Verify EMAIL_USER and EMAIL_PASSWORD in .env
- Check spam folder
- Look at backend console for errors
- Test with Gmail (most reliable)

### Issue: "Invalid or expired reset token"
**Solution:**
- Token expires after 1 hour
- Each token can only be used once
- Request a new reset link

### Issue: Reset link goes to wrong URL
**Solution:** Update FRONTEND_URL in backend/.env
```env
FRONTEND_URL=http://localhost:5173  # Development
FRONTEND_URL=https://yourdomain.com # Production
```

## 🎨 Customizing the Email

Edit `backend/config/email.js` to customize:
- Email subject
- HTML template design
- Colors and styling
- Email content and text

## 🚀 Production Checklist

Before deploying:
- [ ] Update FRONTEND_URL to production domain
- [ ] Use environment variables (never commit .env)
- [ ] Consider using SendGrid/AWS SES for better deliverability
- [ ] Add proper DNS records (SPF, DKIM, DMARC)
- [ ] Use HTTPS for all reset links
- [ ] Test email delivery in production
- [ ] Monitor email sending logs

## 📚 Additional Resources

- Gmail App Passwords: https://myaccount.google.com/apppasswords
- Nodemailer Docs: https://nodemailer.com/
- Full Setup Guide: See EMAIL_SETUP_GUIDE.md

## ✨ Features Working

- ✅ Admin login with role validation
- ✅ Customer login with role validation
- ✅ Customer signup with validation
- ✅ **Password reset via email (NEW!)**
- ✅ Token expiry and security
- ✅ Beautiful email templates
- ✅ Complete error handling

## 🎉 You're All Set!

The password reset system is fully functional. Just configure your Gmail App Password in the .env file and you're ready to go!

Need help? Check the EMAIL_SETUP_GUIDE.md for detailed setup instructions.
