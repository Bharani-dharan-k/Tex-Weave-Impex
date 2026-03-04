# Email Configuration Setup Guide

## Gmail App Password Setup

To send password reset emails via Gmail, you need to create an App Password:

### Step 1: Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/security
2. Click on "2-Step Verification"
3. Follow the steps to enable it

### Step 2: Create App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select app: "Mail"
3. Select device: "Other (Custom name)"
4. Enter name: "Password Reset App"
5. Click "Generate"
6. Copy the 16-character password (no spaces)

### Step 3: Update .env File

Add these variables to your `backend/.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
APP_NAME=Your App Name
```

### Step 4: Example Configuration

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/your-database
JWT_SECRET=mysupersecretkey12345
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
EMAIL_USER=myapp@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
APP_NAME=My Awesome App
```

## Alternative Email Services

### Using SendGrid
```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
```

### Using AWS SES
```env
EMAIL_SERVICE=ses
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
EMAIL_FROM=noreply@yourdomain.com
```

## Testing

1. Start your backend server:
```bash
cd backend
npm start
```

2. Start your frontend:
```bash
cd frontend
npm run dev
```

3. Test the password reset flow:
   - Go to Login page
   - Click "Customer Login"
   - Click "Forgot Password?"
   - Enter your email
   - Check your inbox for reset link
   - Click the link and set new password

## Troubleshooting

### Email not sending
- Check if EMAIL_USER and EMAIL_PASSWORD are correct
- Make sure you're using an App Password, not your regular Gmail password
- Check if 2FA is enabled on your Gmail account
- Check server logs for error messages

### "Invalid credentials" error
- Verify Gmail App Password is correct (16 characters)
- Make sure EMAIL_USER is your full Gmail address

### Email goes to spam
- Add your email to Gmail's safe senders
- Consider using a custom domain with SPF/DKIM records

### Reset link expired
- Reset tokens expire after 1 hour
- Request a new reset link if expired

## Security Notes

1. **Never commit .env file** - Add it to .gitignore
2. **Use environment variables** - Don't hardcode credentials
3. **App Passwords** - Use Gmail App Passwords, never regular passwords
4. **HTTPS in production** - Always use HTTPS for reset links in production
5. **Token expiry** - Current setup: tokens expire in 1 hour

## Production Deployment

For production, update FRONTEND_URL in .env:
```env
FRONTEND_URL=https://yourdomain.com
```

Consider using:
- AWS SES for better deliverability
- SendGrid for advanced email features
- Custom domain with proper email authentication (SPF, DKIM, DMARC)
