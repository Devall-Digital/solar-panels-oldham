const http = require('http');

// Simple test to check if the website loads without errors
const options = {
  hostname: 'localhost',
  port: 8000,
  path: '/',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Website loaded successfully');
    console.log('Content length:', data.length);
    
    // Check for common issues
    if (data.includes('error') || data.includes('Error')) {
      console.log('⚠️  Found potential error references in HTML');
    }
    
    if (data.includes('console.error')) {
      console.log('⚠️  Found console.error calls in HTML');
    }
    
    if (data.includes('undefined')) {
      console.log('⚠️  Found undefined references in HTML');
    }
    
    console.log('✅ Basic website test completed');
  });
});

req.on('error', (e) => {
  console.error(`❌ Error loading website: ${e.message}`);
});

req.end();