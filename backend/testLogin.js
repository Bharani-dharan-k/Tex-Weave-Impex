// Quick test to verify login endpoint
import axios from 'axios';

const testLogin = async () => {
  try {
    console.log('Testing login endpoint...');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    console.log('✅ Login successful!');
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.user) {
      console.log('✅ User object exists');
      console.log('User role:', response.data.user.role);
    } else {
      console.log('❌ User object missing!');
    }
    
    if (response.data.token) {
      console.log('✅ Token exists');
    } else {
      console.log('❌ Token missing!');
    }
    
  } catch (error) {
    console.error('❌ Login failed!');
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error('No response - server may not be running');
    }
  }
};

testLogin();
