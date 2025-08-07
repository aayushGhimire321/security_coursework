const axios = require('axios');
require('dotenv').config();

async function testKhaltiEndpoint() {
  console.log('🧪 Testing Khalti API endpoint...');
  console.log('Environment check:');
  console.log('- KHALTI_SECRET_KEY:', process.env.KHALTI_SECRET_KEY ? 'Present ✅' : 'Missing ❌');
  console.log('- KHALTI_GATEWAY_URL:', process.env.KHALTI_GATEWAY_URL || 'Missing ❌');
  console.log('- MongoDB:', process.env.MONGODB_CLOUD ? 'Present ✅' : 'Missing ❌');
  
  console.log('\n🔍 Testing local backend connection...');
  
  try {
    // Test basic backend connection
    const healthCheck = await axios.get('http://localhost:5000/health');
    console.log('✅ Backend health check:', healthCheck.status);
  } catch (error) {
    console.log('❌ Backend health check failed:', error.message);
    console.log('⚠️ Make sure the backend server is running on port 5000');
    return;
  }

  try {
    // Test Khalti initialization endpoint (without auth for testing)
    const testData = {
      itemId: '507f1f77bcf86cd799439011', // Dummy booking ID
      totalPrice: 50000, // 500 Rs in paisa
      website_url: 'http://localhost:3000'
    };
    
    console.log('\n📡 Testing Khalti initialization...');
    console.log('Test data:', testData);
    
    const response = await axios.post('http://localhost:5000/api/payment/test_initialize_khalti', testData);
    console.log('✅ Khalti API test successful:', response.data);
    
  } catch (error) {
    console.log('❌ Khalti API test failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testKhaltiEndpoint();
