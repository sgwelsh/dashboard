const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Parse the request body
    const { username, password } = JSON.parse(event.body);
    
    // Get your GitHub token from environment variables
    const token = process.env.GITHUB_TOKEN;
    
    // Fetch credentials from your private repository
    const response = await fetch('https://api.github.com/repos/sgwelsh/firemarshal-credentials/contents/credentials.json', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3.raw'
      }
    });
    
    if (!response.ok) {
      return { statusCode: 500, body: 'Failed to fetch credentials' };
    }
    
    const credentials = await response.json();
    
    // Check if credentials match
    const userExists = credentials.users.find(u => 
      u.username === username && u.password === password
    );
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: !!userExists })
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { statusCode: 500, body: 'Authentication error' };
  }
};
