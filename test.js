// test.js
require('dotenv').config();
const BrainService = require('./services/brainService');

async function test() {
  try {
    console.log("🎬 Testing AI Image Generation for 'sports day'");
    console.log("📸 Using Free Lorem Picsum API (No Auth Required!)");
    console.log("---");
    console.log("Search Query:", BrainService.buildSearchQuery("sports day"));
    
    const result = await BrainService.generateMemeFromText("sports day", null, null);
    console.log("✅ Generated Caption:", result.caption);
    console.log("✅ Image Generated Successfully!");
    console.log("Image URL Preview:", result.imageUrl.substring(0, 80) + "...");
    console.log("---");
    console.log("The image has been fetched and converted to base64!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

test();