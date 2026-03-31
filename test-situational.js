const BrainService = require('./services/brainService');

async function test() {
  console.log('Testing situational image generation...\n');
  
  const situations = ['sports day', 'birthday party', 'beach vacation'];
  
  for (const situation of situations) {
    try {
      const result = await BrainService.generateMemeFromText(situation, null, null);
      console.log(`✅ ${situation}:`);
      console.log(`   Caption: ${result.caption}`);
      console.log(`   Image starts with: ${result.imageUrl.substring(0, 100)}...`);
      console.log();
    } catch (error) {
      console.log(`❌ Error for ${situation}: ${error.message}`);
    }
  }
}

test();
