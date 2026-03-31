const BrainService = require('./services/brainService');

async function test() {
  console.log('Testing Image Generation...\n');
  
  try {
    const result = await BrainService.generateMemeFromText('birthday party', 'motivational', null);
    
    console.log('✅ Caption:', result.caption);
    console.log('✅ Image URL:', result.imageUrl);
    console.log('✅ Image URL Type:', typeof result.imageUrl);
    console.log('✅ Image URL Length:', result.imageUrl.length);
    console.log('\nTesting Image URL accessibility...');
    
    const axios = require('axios');
    try {
      const response = await axios.head(result.imageUrl, { timeout: 5000 });
      console.log('✅ Image URL is accessible! Status:', response.status);
      console.log('✅ Content-Type:', response.headers['content-type']);
      console.log('✅ Content-Length:', response.headers['content-length']);
    } catch (error) {
      console.log('❌ Image URL Error:', error.message);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();
