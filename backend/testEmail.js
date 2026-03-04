import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const testEmail = async () => {
  console.log('Testing email configuration...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***configured***' : 'NOT SET');
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    },
    debug: true, // Show debug output
    logger: true // Log information
  });

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'Test Email from Your App',
      text: 'If you receive this, your email configuration is working!',
      html: '<p>If you receive this, your email configuration is working!</p>'
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Check your inbox:', process.env.EMAIL_USER);
  } catch (error) {
    console.error('❌ Email sending failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.error('\n⚠️  Invalid Gmail credentials!');
      console.error('Make sure you are using a Gmail App Password, not your regular password.');
      console.error('Create one at: https://myaccount.google.com/apppasswords');
    }
  }
};

testEmail();
