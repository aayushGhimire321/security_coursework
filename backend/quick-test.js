const axios = require('axios');

async function quickTest() {
  console.log('🔍 Quick backend connection test...');
  
  const testUrls = [
    'http://localhost:5000/health',
    'http://localhost:5000/api/movie/get_all_movies',
    'https://localhost:5000/health',
    'https://localhost:5000/api/movie/get_all_movies'
  ];
  
  for (const url of testUrls) {
    try {
      console.log(`\n📡 Testing: ${url}`);
      const response = await axios.get(url, { timeout: 5000 });
      console.log(`✅ Success: ${response.status} - ${response.statusText}`);
      if (url.includes('movies')) {
        console.log(`📦 Movies found: ${response.data.movies?.length || 0}`);
        if (response.data.movies?.length > 0) {
          console.log(`🎬 Sample movie ID: ${response.data.movies[0]._id}`);
        }
      }
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
    }
  }
}

quickTest();
