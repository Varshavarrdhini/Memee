// simple-server.js - Standalone server without problematic npm dependencies
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const url = require('url');
const querystring = require('querystring');
const BrainService = require('./services/brainService');

const PORT = process.env.PORT || 5000;
const USE_HTTPS = process.env.USE_HTTPS === 'true';
const SSL_KEY_PATH = process.env.SSL_KEY_PATH || path.join(__dirname, 'cert-key.pem');
const SSL_CERT_PATH = process.env.SSL_CERT_PATH || path.join(__dirname, 'cert.pem');

// Simple GraphQL Query Handler
async function handleGraphQL(query) {
  // Check if it's a generateMeme mutation
  if (query.includes('generateMeme')) {
    // Extract text from input
    const textMatch = query.match(/text:\s*"([^"]+)"/);
    const subjectMatch = query.match(/subject:\s*"([^"]+)"/);
    
    const text = textMatch ? textMatch[1] : 'random';
    const subject = subjectMatch ? subjectMatch[1] : null;

    try {
      const result = await BrainService.generateMemeFromText(text, subject, null);
      
      console.log(`Generated meme for "${text}":`, {
        caption: result.caption,
        imageUrl: result.imageUrl
      });
      
      return {
        data: {
          generateMeme: {
            caption: result.caption,
            imageUrl: result.imageUrl // Return full URL - don't truncate!
          }
        }
      };
    } catch (error) {
      return {
        errors: [{ message: error.message }]
      };
    }
  }

  // Check if it's a getAllMemes query
  if (query.includes('getAllMemes')) {
    return {
      data: {
        getAllMemes: [
          {
            id: '1',
            caption: 'Sample meme 1',
            imageUrl: 'data:image/png;base64,iVBORw0KG...',
            subject: 'general',
            feedbackRating: 5
          }
        ]
      }
    };
  }

  return {
    errors: [{ message: 'Unknown query' }]
  };
}

// Request handler for both HTTP and HTTPS
const requestHandler = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Handle OPTIONS
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // GraphQL endpoint
  if (pathname === '/graphql') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const query = data.query;
          const result = await handleGraphQL(query);
          res.writeHead(200);
          res.end(JSON.stringify(result));
        } catch (error) {
          res.writeHead(400);
          res.end(JSON.stringify({ errors: [{ message: error.message }] }));
        }
      });
    } else if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(graphqlPlaygroundHtml);
    }
    return;
  }

  // Default endpoint - serve the meme display
  if (pathname === '/' || pathname === '/meme') {
    const filepath = path.join(__dirname, 'meme-display.html');
    try {
      const html = fs.readFileSync(filepath, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
      return;
    } catch (error) {
      res.writeHead(200);
      res.end(JSON.stringify({
        message: '🎨 Meme Knowledge Generator API',
        meme: 'http://localhost:' + PORT + '/meme',
        graphql: 'http://localhost:' + PORT + '/graphql'
      }));
      return;
    }
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
};

let server;
if (USE_HTTPS) {
  let sslOptions;
  try {
    sslOptions = {
      key: fs.readFileSync(SSL_KEY_PATH),
      cert: fs.readFileSync(SSL_CERT_PATH)
    };
  } catch (error) {
    console.error('Failed to load SSL certs:', error.message);
    process.exit(1);
  }

  server = https.createServer(sslOptions, requestHandler);
} else {
  server = http.createServer(requestHandler);
}

server.listen(PORT, () => {
  const protocol = USE_HTTPS ? 'https' : 'http';
  console.log(`Server is running successfully at ${protocol}://localhost:${PORT}`);
});
