# Email Configuration Troubleshooting

## Issue: ETIMEDOUT on Gmail SMTP

The error `connect ETIMEDOUT 192.178.211.109:465` indicates your network is blocking Gmail's SMTP server.

## What I Fixed

1. **Changed from port 465 to port 587** in `config/email.js`
   - Port 587 uses STARTTLS and is more firewall-friendly
   - Added TLS configuration to handle certificate issues

## Solutions (Try in Order)

### Solution 1: Test from Different Network ⭐ RECOMMENDED
Your institutional network (kongu.edu) likely blocks SMTP. Try:
- **Mobile hotspot** - Most reliable for testing
- **Home network** - If available
- **VPN** - May bypass restrictions

### Solution 2: Use Alternative Email Service
If Gmail remains blocked, switch to services designed for applications:

#### Option A: SendGrid (FREE tier: 100 emails/day)
```javascript
// In config/email.js
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY
    }
  });
};
```
Sign up: https://sendgrid.com/free/

#### Option B: Mailtrap (Testing only)
```javascript
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
    }
  });
};
```
Sign up: https://mailtrap.io/ (Catches emails without sending)

#### Option C: Outlook/Hotmail
```javascript
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};
```

### Solution 3: Verify Gmail App Password
1. Go to https://myaccount.google.com/apppasswords
2. Delete old app password
3. Generate new 16-character password
4. Update `.env` file: `EMAIL_PASSWORD=xxxx xxxx xxxx xxxx`
5. **Important**: Remove spaces from the password in .env

### Solution 4: Alternative Ports
Try these Gmail ports in order:

```javascript
// Try port 25 (least secure, but may work)
port: 25,
secure: false,

// Or try port 465 with secure: true
port: 465,
secure: true,
```

## Test Email After Changes

```bash
cd backend
node testEmail.js
```

## Current Configuration Status

✅ Updated to port 587 with STARTTLS
✅ Added TLS certificate handling
✅ Debug logging enabled
⚠️ Network may still block SMTP - try mobile hotspot

## Quick Fix for Development

If you just need to test the forgot-password flow without actually sending emails:

```javascript
// In config/email.js - add at the top of sendPasswordResetEmail
export const sendPasswordResetEmail = async (userEmail, resetToken, userName) => {
  // FOR DEVELOPMENT ONLY - Skip actual email sending
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 [DEV MODE] Password reset email');
    console.log('To:', userEmail);
    console.log('Reset URL:', `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`);
    return { success: true };
  }
  
  // Rest of the actual email sending code...
```

Add to `.env`:
```
NODE_ENV=development
```

This will log the reset link to console instead of sending email.

## Recommended Next Steps

1. **Short term**: Use mobile hotspot to test if email works
2. **Development**: Use Mailtrap for testing (catches emails)
3. **Production**: Use SendGrid or AWS SES (more reliable)
4. **Quick test**: Enable development mode to skip email sending
