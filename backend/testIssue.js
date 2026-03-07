import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Issue from './models/Issue.js';

dotenv.config();

const testIssue = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n=== Testing Issue Model ===');
    
    const testData = {
      type: 'issue',
      subject: 'Test Issue',
      description: 'This is a test issue',
      priority: 'medium',
      category: 'general',
      submittedBy: {
        name: 'Test User',
        email: 'test@example.com'
      },
      status: 'open'
    };

    console.log('Creating test issue with data:', testData);
    
    const newIssue = new Issue(testData);
    await newIssue.save();
    
    console.log('✅ Issue created successfully:', newIssue);

    // Clean up - delete the test issue
    await Issue.findByIdAndDelete(newIssue._id);
    console.log('✅ Test issue deleted');

    await mongoose.connection.close();
    console.log('✅ Test completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

testIssue();
