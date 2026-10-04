const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { username, password } = JSON.parse(event.body);
    console.log('Received credentials:', username, '********'); // Log without actual password
    
    const token = process.env.GITHUB_TOKEN;
    console.log('Token exists:', !!token); // Check if token is set
    
    // IMPORTANT: Replace 'sgwelsh' below with your actual GitHub username
    const response = await fetch('https://api.github.com/repos/sgwelsh/firemarshal-credentials/contents/credentials.json', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3.raw'
      }
    });
    
    console.log('GitHub response status:', response.status); // Log response status
    
    if (!response.ok) {
      console.log('GitHub error body:', await response.text());
      return { statusCode: 401, body: 'Failed to fetch credentials' };
    }
    
    const credentials = await response.json();
    console.log('Fetched credentials:', credentials);
    
    const userExists = credentials.users.find(u => 
      u.username === username && u.password === password
    );
    
    console.log('User exists:', !!userExists);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: !!userExists })
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
